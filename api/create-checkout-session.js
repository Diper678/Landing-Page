// api/create-checkout-session.js
// Crea una sesión de pago dLocal Go y retorna la URL de checkout
// Deploy: Vercel Serverless Function
// Docs: https://docs.dlocalgo.com/integration-api

const DLOCALGO_BASE_URL = process.env.DLOCALGO_BASE_URL || 'https://api.dlocalgo.com/v1';

// ── Plan key → env var mapping ──────────────────────────────────────
// Frontend sends planKey (e.g. "junior_monthly"), we resolve to the actual
// dLocal Go plan ID stored in environment variables.
//
// Pricing autoritativo: docs/research/2026-04-23-pricing-final-formalizado.md
// Junior:  20 UF/mes (~USD 770) — trimestral 60 UF (~USD 2,310)
// Senior:  50 UF/mes (~USD 1,925) — trimestral 150 UF (~USD 5,775)
// Manager: ~100 UF/mes ("Hablemos") — trimestral 300 UF (~USD 11,550)
//
// Sisteco no ofrece cobro mensual operativo (compromiso mínimo 1 trimestre).
// Las claves _monthly se mantienen por compatibilidad con dLocal (recurring monthly engine).
const PLAN_KEY_TO_ENV = {
  junior_monthly:  'DLOCALGO_PLAN_JUNIOR_MONTHLY',
  junior_annual:   'DLOCALGO_PLAN_JUNIOR_ANNUAL',
  senior_monthly:  'DLOCALGO_PLAN_SENIOR_MONTHLY',
  senior_annual:   'DLOCALGO_PLAN_SENIOR_ANNUAL',
  manager_monthly: 'DLOCALGO_PLAN_MANAGER_MONTHLY',
};

function resolvePlanId(planKey) {
  const envKey = PLAN_KEY_TO_ENV[planKey];
  return envKey ? process.env[envKey] : null;
}

// Plan IDs válidos (del Dashboard dLocal Go → Subscriptions)
const ALLOWED_PLANS = new Set([
  process.env.DLOCALGO_PLAN_JUNIOR_MONTHLY,
  process.env.DLOCALGO_PLAN_JUNIOR_ANNUAL,
  process.env.DLOCALGO_PLAN_SENIOR_MONTHLY,
  process.env.DLOCALGO_PLAN_SENIOR_ANNUAL,
  process.env.DLOCALGO_PLAN_MANAGER_MONTHLY,
]);

// Precios de los planes (para cobro único inicial o cuando la API
// de suscripciones usa amount directo en vez de plan_id).
// USD aprox del día — el cobro real se ajusta con la UF del día en pasarela CLP.
// IVA 19% incluido. Junior 20 UF × 1.19 ≈ USD 916; Senior 50 UF × 1.19 ≈ USD 2,290; Manager ≈ USD 4,581.
const PLAN_AMOUNTS = {
  junior_monthly:  { amount: 916.30,   currency: 'USD', label: 'Sisteco Junior - Mensual (IVA incl.)' },
  junior_annual:   { amount: 9897.00,  currency: 'USD', label: 'Sisteco Junior - Anual con 10% desc (IVA incl.)' },
  senior_monthly:  { amount: 2290.75,  currency: 'USD', label: 'Sisteco Senior - Mensual (IVA incl.)' },
  senior_annual:   { amount: 24740.10, currency: 'USD', label: 'Sisteco Senior - Anual con 10% desc (IVA incl.)' },
  manager_monthly: { amount: 4581.50,  currency: 'USD', label: 'Sisteco Manager - Mensual (IVA incl.)' },
};

const CHECKOUT_ALLOWED_ORIGINS = ['https://sisteco.com', 'https://sisteco-landing.vercel.app', 'https://landing-page-felipe-s-projects-cf2ac967.vercel.app', 'http://localhost:3000'];

export default async function handler(req, res) {
  // CORS
  const origin = req.headers.origin;
  if (CHECKOUT_ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Metodo no permitido' });

  const body = req.body || {};
  const email = typeof body.email === 'string' ? body.email.slice(0, 255).toLowerCase().trim() : '';
  const companyName = typeof body.companyName === 'string' ? body.companyName.slice(0, 100) : '';

  // Accept planKey (from frontend, e.g. "base_monthly") or legacy planId (dLocal Go ID)
  const planKey = typeof body.planKey === 'string' ? body.planKey.slice(0, 50) : '';
  const rawPlanId = typeof body.planId === 'string' ? body.planId.slice(0, 100) : '';

  let planId;
  let plan;

  if (planKey && PLAN_AMOUNTS[planKey]) {
    // New flow: frontend sends planKey → resolve to dLocal Go plan ID from env
    planId = resolvePlanId(planKey);
    plan = PLAN_AMOUNTS[planKey];
    if (!planId) {
      console.error('create-checkout-session: env var not set for planKey:', planKey);
      return res.status(500).json({ error: 'Configuración de plan incompleta en el servidor. Contacta soporte.' });
    }
  } else if (rawPlanId && ALLOWED_PLANS.has(rawPlanId)) {
    // Legacy flow: direct planId (dLocal Go ID)
    planId = rawPlanId;
    // Find matching plan by checking env vars
    const legacyKey = Object.entries(PLAN_KEY_TO_ENV).find(
      ([, envKey]) => process.env[envKey] === rawPlanId
    );
    plan = legacyKey ? PLAN_AMOUNTS[legacyKey[0]] : null;
  }

  // Validar plan
  if (!planId || !plan) {
    return res.status(400).json({ error: 'Plan no valido' });
  }

  // Validar email si se proporciona
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Email invalido' });
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
        plan_key: planKey || '',
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
}
