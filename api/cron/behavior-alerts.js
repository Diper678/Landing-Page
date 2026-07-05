// api/cron/behavior-alerts.js
// Cron horario (Vercel) — detecta señales de comportamiento en PostHog y alerta por Discord.
//
// Señales:
//   1. pricing_repeat  — visitante con ≥2 vistas a /precios en los últimos 7 días.
//   2. long_session    — sesión de más de 3 minutos en una página de solución (últimas 24 h).
//
// Dedupe: convex alertsSent.claimAlert (event + dedupKey) — nunca se alerta dos veces lo mismo.
// Requiere: POSTHOG_API_KEY (personal, read-only), POSTHOG_PROJECT_ID, CRON_SECRET.

import { convex } from '../_lib/convex.js';
import { api } from '../../convex/_generated/api.js';
import { notifyDiscord } from '../_lib/notify.js';

const POSTHOG_HOST = 'https://eu.posthog.com';

export default async function handler(req, res) {
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const apiKey = process.env.POSTHOG_API_KEY;
  const projectId = process.env.POSTHOG_PROJECT_ID;
  if (!apiKey || !projectId) {
    return res.status(200).json({ message: 'PostHog no configurado (POSTHOG_API_KEY / POSTHOG_PROJECT_ID)', alerts: 0 });
  }

  let alerts = 0;
  const errors = [];

  // ── Señal 1: visitas repetidas a precios (últimos 7 días) ────────────────
  try {
    const rows = await hogql(apiKey, projectId, `
      SELECT distinct_id, count() AS views
      FROM events
      WHERE event = '$pageview'
        AND properties.$pathname LIKE '%precios%'
        AND timestamp > now() - INTERVAL 7 DAY
      GROUP BY distinct_id
      HAVING views >= 2
      LIMIT 50
    `);
    for (const [distinctId, views] of rows) {
      // dedupe por visitante+semana: si sigue volviendo la semana siguiente, se alerta de nuevo
      const week = isoWeek();
      const { isNew } = await convex.mutation(api.alertsSent.claimAlert, {
        event: 'pricing_repeat',
        dedupKey: `${distinctId}:${week}`,
      });
      if (isNew) {
        await notifyDiscord(`\u{1F440} **Visitante caliente** — vio /precios ${views} veces en 7 días (id ${String(distinctId).slice(0, 12)}…)`);
        alerts++;
      }
    }
  } catch (err) {
    errors.push(`pricing_repeat: ${err.message}`);
  }

  // ── Señal 2: sesiones largas en páginas de solución (últimas 24 h) ──────
  try {
    const rows = await hogql(apiKey, projectId, `
      SELECT properties.$session_id AS session, any(properties.$pathname) AS path,
             dateDiff('second', min(timestamp), max(timestamp)) AS duration
      FROM events
      WHERE properties.$pathname LIKE '%soluciones%'
        AND timestamp > now() - INTERVAL 1 DAY
      GROUP BY session
      HAVING duration > 180
      LIMIT 50
    `);
    for (const [sessionId, path, duration] of rows) {
      const { isNew } = await convex.mutation(api.alertsSent.claimAlert, {
        event: 'long_session',
        dedupKey: String(sessionId),
      });
      if (isNew) {
        await notifyDiscord(`\u{23F1}\u{FE0F} **Sesión larga** — ${Math.round(duration / 60)} min en ${path}`);
        alerts++;
      }
    }
  } catch (err) {
    errors.push(`long_session: ${err.message}`);
  }

  return res.status(200).json({ alerts, errors });
}

async function hogql(apiKey, projectId, query) {
  const resp = await fetch(`${POSTHOG_HOST}/api/projects/${projectId}/query/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ query: { kind: 'HogQLQuery', query } }),
  });
  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new Error(`PostHog query HTTP ${resp.status}: ${text.slice(0, 200)}`);
  }
  const data = await resp.json();
  return data.results || [];
}

function isoWeek() {
  const d = new Date();
  const jan1 = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${week}`;
}
