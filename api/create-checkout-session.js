// api/create-checkout-session.js
// Crea una sesión de pago dLocal Go y retorna la URL de checkout
// Deploy: Vercel Serverless Function
// Docs: https://docs.dlocalgo.com/integration-api

const DLOCALGO_BASE_URL = process.env.DLOCALGO_BASE_URL || 'https://api.dlocalgo.com/v1';

// Plan IDs válidos (del Dashboard dLocal Go → Subscriptions)
const ALLOWED_PLANS = new Set([
  process.env.DLOCALGO_PLAN_BASE_MONTHLY,
  process.env.DLOCALGO_PLAN_BASE_ANNUAL,
  process.env.DLOCALGO_PLAN_GROWTH_MONTHLY,
  process.env.DLOCALGO_PLAN_GROWTH_ANNUAL,
]);

// Precios de los planes (para cobro único inicial o cuando la API
// de suscripciones usa amount directo en vez de plan_id)
const PLAN_AMOUNTS = {
  [process.env.DLOCALGO_PLAN_BASE_MONTHLY]:  { amount: 397.00,  currency: 'USD', label: 'Sisteco Prospección Base - Mensual' },
  [process.env.DLOCALGO_PLAN_BASE_ANNUAL]:   { amount: 3564.00, currency: 'USD', label: 'Sisteco Prospección Base - Anual' },
  [process.env.DLOCALGO_PLAN_GROWTH_MONTHLY]:{ amount: 797.00,  currency: 'USD', label: 'Sisteco Crecimiento - Mensual' },
  [process.env.DLOCALGO_PLAN_GROWTH_ANNUAL]: { amount: 7164.00, currency: 'USD', label: 'Sisteco Crecimiento - Anual' },
};

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', process.env.SITE_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  const { planId, email, companyName } = req.body || {};

  // Validar plan
  if (!planId || !ALLOWED_PLANS.has(planId)) {
    return res.status(400).json({ error: 'Plan no válido' });
  }

  const plan = PLAN_AMOUNTS[planId];
  if (!plan) {
    return res.status(400).json({ error: 'Configuración de plan incompleta' });
  }

  // Cabecera de autenticación dLocal Go: "Bearer API_KEY:SECRET_KEY"
  const authHeader = `Bearer ${process.env.DLOCALGO_API_KEY}:${process.env.DLOCALGO_SECRET_KEY}`;

  try {
    const orderId = `sisteco-${planId.slice(-8)}-${Date.now()}`;

    const payload = {
      amount: plan.amount,
      currency: plan.currency,
      country: 'CL',                         // Chile — cambiar dinámicamente para LATAM
      payment_method_id: 'CARD',              // Tarjeta crédito/débito
      payment_method_flow: 'REDIRECT',        // Hosted checkout (redirect)
      payer: {
        name: companyName || 'Cliente',
        email: email || '',
      },
      order_id: orderId,
      description: plan.label,
      callback_url: `${process.env.SITE_URL}/api/dlocalgo-webhook`,
      success_url: `${process.env.SITE_URL}/pages/success.html?order=${orderId}`,
      failed_url: `${process.env.SITE_URL}/pages/precios.html?canceled=true`,
      metadata: {
        plan_id: planId,
        company_name: companyName || '',
        sisteco_env: 'production',
      },
    };

    const response = await fetch(`${DLOCALGO_BASE_URL}/payments`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('dLocal Go API error:', data);
      return res.status(500).json({
        error: 'Error al crear la sesión de pago. Por favor intenta nuevamente.',
      });
    }

    // dLocal Go retorna redirect_url para el hosted checkout
    if (!data.redirect_url) {
      console.error('dLocal Go: no redirect_url en respuesta', data);
      return res.status(500).json({ error: 'Error inesperado en la respuesta del procesador.' });
    }

    return res.status(200).json({ url: data.redirect_url, payment_id: data.id });

  } catch (err) {
    console.error('create-checkout-session error:', err.message);
    return res.status(500).json({ error: 'Error interno. Intenta nuevamente.' });
  }
};
