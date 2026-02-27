// api/create-checkout-session.js
// Crea una sesión de pago Stripe y retorna la URL de checkout
// Deploy: Vercel Serverless Function

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const ALLOWED_PRICE_IDS = new Set([
  process.env.STRIPE_PRICE_BASE_MONTHLY,
  process.env.STRIPE_PRICE_BASE_ANNUAL,
  process.env.STRIPE_PRICE_GROWTH_MONTHLY,
  process.env.STRIPE_PRICE_GROWTH_ANNUAL,
]);

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', process.env.SITE_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { priceId, email, companyName } = req.body || {};

  // Validar que el priceId es uno de los permitidos (evitar price injection)
  if (!priceId || !ALLOWED_PRICE_IDS.has(priceId)) {
    return res.status(400).json({ error: 'Plan no válido' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email || undefined,
      metadata: {
        company_name: companyName || '',
      },
      subscription_data: {
        trial_period_days: 14,
        metadata: {
          company_name: companyName || '',
        },
      },
      success_url: `${process.env.SITE_URL}/pages/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.SITE_URL}/pages/precios.html?canceled=true`,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      locale: 'es-419',
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err.message);
    return res.status(500).json({ error: 'Error al crear la sesión de pago. Intenta nuevamente.' });
  }
};
