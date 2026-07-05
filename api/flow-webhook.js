// api/flow-webhook.js
// Procesa eventos de Flow.cl (urlConfirmation) y sincroniza con Convex.
// Deploy: Vercel Serverless Function
//
// Flow.cl docs: https://www.flow.cl/docs/api.html
//
// Flujo de pago Flow:
//   1. Cliente clickea link de pago en Flow.cl → Flow procesa → cobra.
//   2. Flow envía POST a este endpoint (urlConfirmation) con `token` en form-urlencoded.
//   3. Endpoint llama a Flow API `/payment/getStatus` con el token + auth firmada para obtener detalle.
//   4. Si el pago está confirmado (status=2), upsert en Convex + email confirmación + Discord ping.
//   5. Endpoint DEBE responder 200 OK plain text para que Flow no reintente.
//
// IMPORTANT — Seguridad:
//   - Flow NO firma el body. La validación es: pedirle a Flow el estado real con tu API key.
//   - Si el token no existe o status != 2, ignorar (puede ser un intento, expiración, etc).
//   - FLOW_SECRET_KEY se usa para firmar la consulta `getStatus` (HMAC-SHA256 sobre params ordenados).
//   - NUNCA loguear FLOW_SECRET_KEY ni la firma calculada.

import crypto from 'crypto';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api.js';
import { resend } from './_lib/resend.js';
import { paymentConfirmationEmail } from './_lib/email-templates.js';
import { notifyDiscord } from './_lib/notify.js';

const convex = new ConvexHttpClient(process.env.CONVEX_URL);
const FLOW_BASE_URL = process.env.FLOW_BASE_URL || 'https://www.flow.cl/api';
const FLOW_API_KEY = process.env.FLOW_API_KEY;
const FLOW_SECRET_KEY = process.env.FLOW_SECRET_KEY;

const FROM_PAYMENT_EMAIL = 'Sisteco <contacto@sisteco.cl>';

// Vercel default body parser ya maneja x-www-form-urlencoded.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  if (!FLOW_API_KEY || !FLOW_SECRET_KEY) {
    console.error('Flow webhook: FLOW_API_KEY o FLOW_SECRET_KEY no configurado');
    return res.status(500).send('Webhook no configurado');
  }

  const token = (req.body && req.body.token) || '';
  if (!token || typeof token !== 'string' || token.length > 256) {
    console.warn('Flow webhook: token ausente o invalido');
    return res.status(200).send('OK'); // 200 para que Flow no reintente con basura
  }

  try {
    const payment = await fetchFlowPaymentStatus(token);

    // Status Flow:
    //   1 = pendiente, 2 = pagado, 3 = rechazado, 4 = anulado
    const status = payment?.status;
    if (status !== 2) {
      console.log('Flow webhook: payment no pagado (status=%s, commerceOrder=%s)', status, payment?.commerceOrder);
      return res.status(200).send('OK');
    }

    const email = payment?.payer || '';
    const amount = payment?.amount || '';
    const commerceOrder = payment?.commerceOrder || '';

    // optional[String]: viene con la metadata que Sisteco envió al crear el pago
    let optional = {};
    try {
      optional = typeof payment?.optional === 'string' ? JSON.parse(payment.optional) : (payment?.optional || {});
    } catch {
      optional = {};
    }

    const plan = resolvePlan(optional.plan, payment?.subject);
    const billingCycle = resolveCycle(optional.billingCycle, payment?.subject);
    const companyName = optional.companyName || optional.company || '';

    await convex.mutation(api.subscriptions.upsertByPayment, {
      email,
      companyName: companyName || undefined,
      flowPaymentId: String(payment.flowOrder || commerceOrder),
      plan,
      billingCycle,
      status: 'active',
    });

    // Email confirmación + Discord ping (fire-and-forget)
    if (email) {
      sendPaymentConfirmation(email, { name: companyName || email, plan, billingCycle, amount }).catch(err =>
        console.error('Payment confirmation email error (non-blocking):', err)
      );
    }
    sendDiscordPaymentNotification(email, plan, amount).catch(err =>
      console.error('Discord notification error (non-blocking):', err)
    );

    console.log('Flow webhook: PAID procesado — commerceOrder=%s plan=%s', commerceOrder, plan);
    return res.status(200).send('OK');
  } catch (err) {
    console.error('Flow webhook: error procesando token:', err?.message || err);
    // 200 igual: si respondemos !=200 Flow reintenta con backoff y duplica trabajo.
    // Si falló nuestra parte (Convex/email), preferimos loguear y reconciliar offline.
    return res.status(200).send('OK');
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────

async function fetchFlowPaymentStatus(token) {
  // Flow exige firma HMAC-SHA256 sobre los parámetros ordenados alfabéticamente
  // concatenados como key=value (sin separador) — luego se manda como param `s`.
  const params = {
    apiKey: FLOW_API_KEY,
    token,
  };
  const sortedKeys = Object.keys(params).sort();
  const toSign = sortedKeys.map(k => `${k}${params[k]}`).join('');
  const signature = crypto.createHmac('sha256', FLOW_SECRET_KEY).update(toSign).digest('hex');

  const qs = new URLSearchParams({ ...params, s: signature }).toString();
  const url = `${FLOW_BASE_URL}/payment/getStatus?${qs}`;

  const res = await fetch(url, { method: 'GET', headers: { 'Accept': 'application/json' } });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Flow getStatus HTTP ${res.status}: ${text.slice(0, 200)}`);
  }
  return await res.json();
}

function resolvePlan(optionalPlan, subject) {
  const v = (optionalPlan || subject || '').toString().toLowerCase();
  if (v.includes('manager')) return 'manager';
  if (v.includes('senior')) return 'senior';
  if (v.includes('junior')) return 'junior';
  // Compatibilidad con planes legacy si algún link viejo sigue activo:
  if (v.includes('enterprise')) return 'manager';
  if (v.includes('crecimiento') || v.includes('growth')) return 'senior';
  if (v.includes('base')) return 'junior';
  return 'unknown';
}

function resolveCycle(optionalCycle, subject) {
  const v = (optionalCycle || subject || '').toString().toLowerCase();
  if (v.includes('anual') || v.includes('annual') || v.includes('year')) return 'annual';
  if (v.includes('trim')) return 'quarterly';
  return 'quarterly'; // default Sisteco — no se ofrece mensual operativo
}

async function sendPaymentConfirmation(to, { name, plan, billingCycle, amount }) {
  if (!process.env.RESEND_API_KEY) return;
  const tpl = paymentConfirmationEmail(to, { name, plan, billingCycle, amount });
  await resend.emails.send({
    from: FROM_PAYMENT_EMAIL,
    to: tpl.to,
    subject: tpl.subject,
    html: tpl.html,
  });
}

async function sendDiscordPaymentNotification(email, plan, amount) {
  const planNames = { junior: 'Junior', senior: 'Senior', manager: 'Manager' };
  const displayPlan = planNames[plan] || plan || 'Desconocido';
  const displayAmount = amount ? ` (CLP ${amount})` : '';
  await notifyDiscord(`\u{1F4B0} **NUEVO PAGO Flow.cl** — ${email} suscrito a **${displayPlan}**${displayAmount}`);
}
