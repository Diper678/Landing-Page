// api/reveniu-webhook.js
// Procesa eventos de Reveniu y sincroniza con Convex
// Deploy: Vercel Serverless Function
//
// Reveniu envía el header "Reveniu-Secret-Key" en cada webhook.
// Lo verificamos contra REVENIU_SECRET_KEY para autenticar la solicitud.
// Docs: https://docs.reveniu.com → Webhooks

import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api.js';
import { resend } from './_lib/resend.js';
import { paymentConfirmationEmail } from './_lib/email-templates.js';

const convex = new ConvexHttpClient(process.env.CONVEX_URL);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  // ── Verificar autenticidad del webhook ─────────────────────────────
  const receivedKey = req.headers['reveniu-secret-key'];
  const expectedKey = process.env.REVENIU_SECRET_KEY;

  if (!expectedKey) {
    console.error('Reveniu webhook: REVENIU_SECRET_KEY no configurado');
    return res.status(500).json({ error: 'Webhook no configurado' });
  }

  if (!receivedKey || receivedKey !== expectedKey) {
    console.error('Reveniu webhook: clave inválida o ausente');
    return res.status(401).json({ error: 'No autorizado' });
  }

  const event = req.body;
  const eventType = event?.event || '';
  const data = event?.data || {};

  console.log('Reveniu webhook:', eventType, data?.id || '');

  try {
    switch (eventType) {

      // ── Suscripción activada (primer pago exitoso) ─────────────────
      case 'subscription_activated':
      case 'subscription_payment_succeeded': {
        const email = data.customer?.email || data.email || '';
        const companyName = data.customer?.name || data.company_name || '';
        const reveniumId = String(data.id || '');
        const planTitle = data.plan?.title || data.plan_title || '';
        const plan = resolvePlan(planTitle, data.plan?.slug || data.plan_slug || '');
        const billingCycle = resolveCycle(planTitle);
        const amount = data.amount || data.total || '';

        if (!email || !reveniumId) {
          console.warn('Reveniu webhook: email o ID ausente en evento', eventType);
          break;
        }

        await convex.mutation(api.subscriptions.upsertByReveniu, {
          email,
          companyName: companyName || undefined,
          reveniumSubscriptionId: reveniumId,
          plan,
          billingCycle,
          status: 'active',
          currentPeriodEnd: data.next_payment_date
            ? new Date(data.next_payment_date).getTime()
            : undefined,
        });

        // Email de confirmación de pago (fire-and-forget)
        if (email) {
          sendPaymentConfirmation(email, { name: companyName, plan, billingCycle, amount })
            .catch(err => console.error('Reveniu email error (non-blocking):', err));
        }

        // Notificación Discord (fire-and-forget)
        sendDiscordNotification(email, plan, amount, 'PAGO')
          .catch(err => console.error('Reveniu Discord error (non-blocking):', err));

        // Drip sequence (fire-and-forget)
        if (email) {
          scheduleOnboardingDrip(email)
            .catch(err => console.error('Reveniu drip error (non-blocking):', err));
        }
        break;
      }

      // ── Suscripción cancelada ──────────────────────────────────────
      case 'subscription_renewal_cancelled':
      case 'subscription_deactivated': {
        const reveniumId = String(data.id || '');
        if (!reveniumId) break;

        await convex.mutation(api.subscriptions.updateStatusByReveniu, {
          reveniumSubscriptionId: reveniumId,
          status: eventType === 'subscription_deactivated' ? 'canceled' : 'past_due',
        });

        const email = data.customer?.email || data.email || '';
        if (email) {
          sendDiscordNotification(email, '', '', eventType === 'subscription_deactivated' ? 'CANCELACION' : 'CANCELACION_RENOVACION')
            .catch(() => {});
        }
        break;
      }

      default:
        console.log('Reveniu: evento no manejado:', eventType);
        break;
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('Reveniu webhook error:', err.message);
    // Siempre retornar 200 para que Reveniu no reintente
    return res.status(200).json({ received: true, warning: 'Error procesado internamente' });
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────

// Mapea el título/slug del plan de Reveniu al nombre interno
function resolvePlan(title = '', slug = '') {
  const lower = (title + slug).toLowerCase();
  if (lower.includes('enterprise')) return 'enterprise';
  if (lower.includes('crecimiento') || lower.includes('growth')) return 'growth';
  if (lower.includes('base')) return 'base';
  return 'base';
}

function resolveCycle(title = '') {
  const lower = title.toLowerCase();
  if (lower.includes('anual') || lower.includes('annual')) return 'annual';
  return 'monthly';
}

// ── Email de confirmación ─────────────────────────────────────────────────

async function sendPaymentConfirmation(email, { name, plan, billingCycle, amount }) {
  const template = paymentConfirmationEmail(email, { name, plan, billingCycle, amount });
  const { error } = await resend.emails.send({
    from: process.env.FROM_EMAIL || 'Sisteco <hola@sisteco.cl>',
    to: template.to,
    subject: template.subject,
    html: template.html,
  });
  if (error) console.error('Reveniu payment email error:', error);
  else console.log('Reveniu payment email sent to:', email);
}

// ── Notificación Discord ──────────────────────────────────────────────────

async function sendDiscordNotification(email, plan, amount, tipo) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;

  const planNames = {
    junior: 'Junior',
    senior: 'Senior',
    manager: 'Manager',
    // Compatibilidad con suscripciones legacy (clientes pre-2026-04-23):
    base: 'Junior (legacy Base)',
    growth: 'Senior (legacy Crecimiento)',
    enterprise: 'Manager (legacy Enterprise)',
  };
  const displayPlan = planNames[plan] || plan || '';
  const displayAmount = amount ? ` ($${amount})` : '';
  const emojis = { PAGO: '💰', CANCELACION: '❌', CANCELACION_RENOVACION: '⚠️' };
  const emoji = emojis[tipo] || '📋';

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: `${emoji} **REVENIU ${tipo}** — ${email}${displayPlan ? ` · Plan ${displayPlan}` : ''}${displayAmount}`,
    }),
  });
}

// ── Drip de onboarding ────────────────────────────────────────────────────

async function scheduleOnboardingDrip(email) {
  const now = Date.now();
  await convex.mutation(api.emailSequence.scheduleDrip, {
    email,
    items: [
      { templateKey: 'onboarding_session_reminder', scheduledAt: now + 1 * 24 * 60 * 60 * 1000 },
      { templateKey: 'onboarding_pipeline_active',  scheduledAt: now + 3 * 24 * 60 * 60 * 1000 },
      { templateKey: 'onboarding_week_review',      scheduledAt: now + 7 * 24 * 60 * 60 * 1000 },
    ],
  });
  console.log('Reveniu drip scheduled for:', email);
}
