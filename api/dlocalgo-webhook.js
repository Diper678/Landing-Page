// api/dlocalgo-webhook.js
// Procesa eventos de dLocal Go y sincroniza con tabla 'subscriptions' en Supabase
// Deploy: Vercel Serverless Function
// Docs: https://docs.dlocalgo.com/integration-api/webhooks

const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY  // service_role key — NUNCA la anon key aquí
);

// dLocal Go no usa raw body parsing extra — el body llega como JSON normal
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  // ── Verificar firma del webhook ──────────────────────────────────────
  // dLocal Go incluye el header 'x-dlocal-signature' con HMAC-SHA256
  const signature = req.headers['x-dlocal-signature'];
  if (signature && process.env.DLOCALGO_WEBHOOK_SECRET) {
    const bodyString = JSON.stringify(req.body);
    const expected = crypto
      .createHmac('sha256', process.env.DLOCALGO_WEBHOOK_SECRET)
      .update(bodyString)
      .digest('hex');

    if (signature !== expected) {
      console.error('dLocal Go webhook: firma inválida');
      return res.status(401).json({ error: 'Firma inválida' });
    }
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
          await upsertSubscription({
            email: payment.payer?.email,
            companyName: payment.metadata?.company_name || payment.payer?.name,
            dlocalgoPaymentId: payment.id,
            plan: resolvePlan(planId),
            billingCycle: resolveCycle(planId),
            status: 'active',
          });
        } else if (status === 'REJECTED' || status === 'FAILED') {
          await supabase
            .from('subscriptions')
            .update({ status: 'past_due', updated_at: new Date().toISOString() })
            .eq('dlocalgo_payment_id', payment.id);
        }
        break;
      }

      // ── Suscripción creada ────────────────────────────────────────
      case 'SUBSCRIPTION_STATUS_CHANGE':
      case 'subscription.status_change':
      case 'subscription.created': {
        const sub = event.data || event;
        const subStatus = sub.status?.toUpperCase();
        const planId = sub.plan_id || sub.metadata?.plan_id || '';

        const mappedStatus = mapSubStatus(subStatus);

        await supabase.from('subscriptions').upsert({
          email: sub.payer?.email || sub.email,
          company_name: sub.metadata?.company_name || sub.payer?.name || null,
          dlocalgo_subscription_id: sub.id,
          plan: resolvePlan(planId),
          billing_cycle: resolveCycle(planId),
          status: mappedStatus,
          current_period_end: sub.next_payment_date
            ? new Date(sub.next_payment_date).toISOString()
            : null,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'dlocalgo_subscription_id' });
        break;
      }

      // ── Suscripción cancelada ─────────────────────────────────────
      case 'subscription.canceled':
      case 'SUBSCRIPTION_CANCELED': {
        const sub = event.data || event;
        await supabase
          .from('subscriptions')
          .update({ status: 'canceled', updated_at: new Date().toISOString() })
          .eq('dlocalgo_subscription_id', sub.id);
        break;
      }

      default:
        // Ignorar eventos no manejados — responder 200 de todas formas
        console.log('Evento no manejado:', eventType);
        break;
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('Webhook processing error:', err.message);
    // Retornar 200 de todas formas — dLocal Go no reintentará si recibe 5xx frecuentes
    return res.status(200).json({ received: true, warning: 'Processing error logged' });
  }
};

// ── Helpers ──────────────────────────────────────────────────────────────

async function upsertSubscription({ email, companyName, dlocalgoPaymentId, plan, billingCycle, status }) {
  await supabase.from('subscriptions').upsert({
    email,
    company_name: companyName || null,
    dlocalgo_payment_id: dlocalgoPaymentId,
    plan,
    billing_cycle: billingCycle,
    status,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'dlocalgo_payment_id' });
}

function resolvePlan(planId) {
  const basePlans = [
    process.env.DLOCALGO_PLAN_BASE_MONTHLY,
    process.env.DLOCALGO_PLAN_BASE_ANNUAL,
  ];
  const growthPlans = [
    process.env.DLOCALGO_PLAN_GROWTH_MONTHLY,
    process.env.DLOCALGO_PLAN_GROWTH_ANNUAL,
  ];
  if (basePlans.includes(planId)) return 'base';
  if (growthPlans.includes(planId)) return 'growth';
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
