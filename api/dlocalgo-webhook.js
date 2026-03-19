// api/dlocalgo-webhook.js
// Procesa eventos de dLocal Go y sincroniza con Convex
// Deploy: Vercel Serverless Function

import crypto from 'crypto';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api.js';
import { resend } from './_lib/resend.js';
import { paymentConfirmationEmail } from './_lib/email-templates.js';

const convex = new ConvexHttpClient(process.env.CONVEX_URL);

const FROM_PAYMENT_EMAIL = 'Sisteco <contacto@sisteco.cl>';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  // ── Verificar firma del webhook (OBLIGATORIO) ──────────────────────
  const signature = req.headers['x-dlocal-signature'];
  if (!process.env.DLOCALGO_WEBHOOK_SECRET) {
    console.error('dLocal Go webhook: DLOCALGO_WEBHOOK_SECRET no configurado');
    return res.status(500).json({ error: 'Webhook no configurado' });
  }

  if (!signature) {
    console.error('dLocal Go webhook: firma ausente');
    return res.status(401).json({ error: 'Firma requerida' });
  }

  const bodyString = JSON.stringify(req.body);
  const expected = crypto
    .createHmac('sha256', process.env.DLOCALGO_WEBHOOK_SECRET)
    .update(bodyString)
    .digest('hex');

  if (signature !== expected) {
    console.error('dLocal Go webhook: firma invalida');
    return res.status(401).json({ error: 'Firma invalida' });
  }

  const event = req.body;
  const eventType = event?.type || event?.event_type || '';

  console.log('dLocal Go webhook:', eventType, event?.id || '');

  try {
    switch (eventType) {

      // ── Pago completado (primer cobro o cobro manual) ──────────────
      case 'PAYMENT_STATUS_CHANGE':
      case 'payment.status_change': {
        const payment = event.data || event;
        const status = payment.status?.toUpperCase();

        if (status === 'PAID' || status === 'COMPLETED') {
          const planId = payment.metadata?.plan_id || '';
          const plan = resolvePlan(planId);
          const billingCycle = resolveCycle(planId);
          const email = payment.payer?.email || '';
          const name = payment.payer?.name || payment.metadata?.company_name || '';
          const amount = payment.amount || payment.total_amount || '';

          await convex.mutation(api.subscriptions.upsertByPayment, {
            email,
            companyName: payment.metadata?.company_name || name || undefined,
            dlocalgoPaymentId: payment.id,
            plan,
            billingCycle,
            status: 'active',
          });

          // Send payment confirmation email (fire-and-forget)
          if (email) {
            sendPaymentConfirmation(email, { name, plan, billingCycle, amount }).catch(err =>
              console.error('Payment confirmation email error (non-blocking):', err)
            );
          }

          // Send Discord notification (fire-and-forget)
          sendDiscordPaymentNotification(email, plan, amount).catch(err =>
            console.error('Discord notification error (non-blocking):', err)
          );

          // Schedule onboarding drip sequence in Convex (fire-and-forget)
          if (email) {
            scheduleOnboardingDrip(email).catch(err =>
              console.error('Onboarding drip scheduling error (non-blocking):', err)
            );
          }
        } else if (status === 'REJECTED' || status === 'FAILED') {
          await convex.mutation(api.subscriptions.updateStatusByPayment, {
            dlocalgoPaymentId: payment.id,
            status: 'past_due',
          });
        }
        break;
      }

      // ── Suscripcion creada ────────────────────────────────────────
      case 'SUBSCRIPTION_STATUS_CHANGE':
      case 'subscription.status_change':
      case 'subscription.created': {
        const sub = event.data || event;
        const subStatus = sub.status?.toUpperCase();
        const planId = sub.plan_id || sub.metadata?.plan_id || '';

        await convex.mutation(api.subscriptions.upsertBySubscription, {
          email: sub.payer?.email || sub.email || undefined,
          companyName: sub.metadata?.company_name || sub.payer?.name || undefined,
          dlocalgoSubscriptionId: sub.id,
          plan: resolvePlan(planId),
          billingCycle: resolveCycle(planId),
          status: mapSubStatus(subStatus),
          currentPeriodEnd: sub.next_payment_date
            ? new Date(sub.next_payment_date).getTime()
            : undefined,
        });
        break;
      }

      // ── Suscripcion cancelada ─────────────────────────────────────
      case 'subscription.canceled':
      case 'SUBSCRIPTION_CANCELED': {
        const sub = event.data || event;
        await convex.mutation(api.subscriptions.updateStatusBySubscription, {
          dlocalgoSubscriptionId: sub.id,
          status: 'canceled',
        });
        break;
      }

      default:
        console.log('Evento no manejado:', eventType);
        break;
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('Webhook processing error:', err.message);
    return res.status(200).json({ received: true, warning: 'Processing error logged' });
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────

function resolvePlan(planId) {
  const basePlans = [
    process.env.DLOCALGO_PLAN_BASE_MONTHLY,
    process.env.DLOCALGO_PLAN_BASE_ANNUAL,
  ];
  const growthPlans = [
    process.env.DLOCALGO_PLAN_GROWTH_MONTHLY,
    process.env.DLOCALGO_PLAN_GROWTH_ANNUAL,
  ];
  const enterprisePlans = [
    process.env.DLOCALGO_PLAN_ENTERPRISE_MONTHLY,
  ];
  if (basePlans.includes(planId)) return 'base';
  if (growthPlans.includes(planId)) return 'growth';
  if (enterprisePlans.includes(planId)) return 'enterprise';
  return 'enterprise';
}

function resolveCycle(planId) {
  const annualPlans = [
    process.env.DLOCALGO_PLAN_BASE_ANNUAL,
    process.env.DLOCALGO_PLAN_GROWTH_ANNUAL,
  ];
  return annualPlans.includes(planId) ? 'annual' : 'monthly';
}

function mapSubStatus(dlocalStatus) {
  const map = {
    'ACTIVE': 'active',
    'PENDING': 'pending',
    'CANCELED': 'canceled',
    'PAST_DUE': 'past_due',
    'TRIALING': 'trialing',
  };
  return map[dlocalStatus] || 'pending';
}

// ── Payment confirmation email ───────────────────────────────────────────────

async function sendPaymentConfirmation(email, { name, plan, billingCycle, amount }) {
  const template = paymentConfirmationEmail(email, { name, plan, billingCycle, amount });

  const { data: emailResult, error: emailError } = await resend.emails.send({
    from: FROM_PAYMENT_EMAIL,
    to: template.to,
    subject: template.subject,
    html: template.html,
  });

  if (emailError) {
    console.error('Payment confirmation email error:', emailError);
  } else {
    console.log('Payment confirmation email sent:', emailResult?.id);
  }
}

// ── Discord payment notification ─────────────────────────────────────────────

async function sendDiscordPaymentNotification(email, plan, amount) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn('DISCORD_WEBHOOK_URL not configured — skipping notification');
    return;
  }

  const planNames = { base: 'Base', growth: 'Crecimiento', enterprise: 'Enterprise' };
  const displayPlan = planNames[plan] || plan || 'Desconocido';
  const displayAmount = amount ? ` ($${amount})` : '';

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: `\u{1F4B0} **NUEVO PAGO** — ${email} suscrito a **${displayPlan}**${displayAmount}`,
    }),
  });
}

// ── Schedule onboarding drip sequence ────────────────────────────────────────

async function scheduleOnboardingDrip(email) {
  const now = Date.now();
  const day1 = now + 1 * 24 * 60 * 60 * 1000;
  const day3 = now + 3 * 24 * 60 * 60 * 1000;
  const day7 = now + 7 * 24 * 60 * 60 * 1000;

  await convex.mutation(api.emailSequence.scheduleDrip, {
    email,
    items: [
      { templateKey: 'onboarding_session_reminder', scheduledAt: day1 },
      { templateKey: 'onboarding_pipeline_active', scheduledAt: day3 },
      { templateKey: 'onboarding_week_review', scheduledAt: day7 },
    ],
  });

  console.log('Onboarding drip scheduled for:', email);
}
