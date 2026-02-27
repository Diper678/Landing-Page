// api/stripe-webhook.js
// Procesa eventos de Stripe y actualiza la tabla 'subscriptions' en Supabase
// Deploy: Vercel Serverless Function

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // service_role key (nunca la anon key aquí)
);

// Necesario para verificar firma del webhook — desactivar body parser de Vercel
export const config = { api: { bodyParser: false } };

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    const rawBody = await getRawBody(req);
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Manejo de eventos relevantes
  switch (event.type) {

    case 'checkout.session.completed': {
      const session = event.data.object;
      // Solo procesar si es suscripción
      if (session.mode !== 'subscription') break;

      await supabase.from('subscriptions').upsert({
        stripe_customer_id: session.customer,
        stripe_subscription_id: session.subscription,
        email: session.customer_email,
        company_name: session.metadata?.company_name || null,
        status: 'trialing',
      }, { onConflict: 'stripe_customer_id' });
      break;
    }

    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = event.data.object;
      const priceId = sub.items?.data?.[0]?.price?.id;

      await supabase.from('subscriptions').upsert({
        stripe_customer_id: sub.customer,
        stripe_subscription_id: sub.id,
        plan: resolvePlan(priceId),
        billing_cycle: resolveCycle(priceId),
        status: sub.status,
        current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
      }, { onConflict: 'stripe_subscription_id' });
      break;
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object;
      await supabase
        .from('subscriptions')
        .update({ status: 'canceled' })
        .eq('stripe_subscription_id', sub.id);
      break;
    }

    case 'invoice.payment_failed': {
      const inv = event.data.object;
      await supabase
        .from('subscriptions')
        .update({ status: 'past_due' })
        .eq('stripe_customer_id', inv.customer);
      break;
    }

    default:
      // Ignorar eventos no manejados
      break;
  }

  return res.status(200).json({ received: true });
};

function resolvePlan(priceId) {
  const base = [
    process.env.STRIPE_PRICE_BASE_MONTHLY,
    process.env.STRIPE_PRICE_BASE_ANNUAL,
  ];
  const growth = [
    process.env.STRIPE_PRICE_GROWTH_MONTHLY,
    process.env.STRIPE_PRICE_GROWTH_ANNUAL,
  ];
  if (base.includes(priceId)) return 'base';
  if (growth.includes(priceId)) return 'growth';
  return 'enterprise';
}

function resolveCycle(priceId) {
  const annual = [
    process.env.STRIPE_PRICE_BASE_ANNUAL,
    process.env.STRIPE_PRICE_GROWTH_ANNUAL,
  ];
  return annual.includes(priceId) ? 'annual' : 'monthly';
}
