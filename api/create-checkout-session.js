// api/create-checkout-session.js
// Crea una sesión de pago dLocal Go y retorna la URL de checkout
// Deploy: Vercel Serverless Function
// Docs: https://docs.dlocalgo.com/integration-api
//
// TODO Felipe: post-2026-05-24 Flow.cl es la pasarela principal para clientes Chile.
//   dLocal Go queda como fallback LATAM (Colombia, Perú, Argentina).
//   - Crear `api/create-flow-checkout.js` para el flujo Chile (Flow.cl Webpay/transferencia)
//   - Mantener este archivo solo para flujo LATAM en USD
//   - O agregar branch `country === 'CL'` que redirige a Flow.cl
//   Aquí solo se actualizó pricing y comentarios; el cambio de proveedor lo manejas tú.

const DLOCALGO_BASE_URL = process.env.DLOCALGO_BASE_URL || 'https://api.dlocalgo.com/v1';

// ── Plan key → env var mapping ──────────────────────────────────────
// Frontend sends planKey (e.g. "base_monthly"), we resolve to the actual
// dLocal Go plan ID stored in environment variables.
//
// PRECIO PÚBLICO DE LYD (2026-06-15): Plan Fundadores = USD 500/mes.
//   Es el sistema de leads autoservicio para los primeros clientes y el ancla de entrada
//   que muestra la web (precios.html, soluciones.html, llms.txt, mirrors/precios.md).
//   Alcances mayores → planes a medida (no precio público fijo).
//   NOTA (NO hardcodear): se está conversando subir a ~USD 700/mes tras la primera llamada.
//   Eso queda SOLO documentado en docs/handoffs/2026-06-15-pricing-lyd-fundadores.md,
//   NO en precio público ni en este checkout, hasta que Felipe lo confirme.
//
// Tiers internos "a medida" (operado, NO son el precio público de entrada de LYD):
//   Base 20 UF/mes (~USD 770) · Crecimiento CLP 1.200.000/mes (~USD 1.290) · Hablemos (a medida)
// Aliases legacy (junior_*, senior_*, manager_*) se mantienen como compat hasta migrar
// clientes activos. TODO Felipe: remover aliases tras migrar todas las suscripciones.
// LYD Plan Fundadores (USD 500/mes) NO se cobra por dLocal.
// TODO Felipe: pegar el LINK DE PAGO NUEVO de LYD (Flow.cl u otra pasarela) en
//   LYD_PAYMENT_LINK (.env). El checkout de LYD redirige a ese link, no a dLocal.
//   dLocal queda solo para los tiers legacy/a-medida de abajo.
const PLAN_KEY_TO_ENV = {
  // Keys nuevas (post-rename 2026-05-24)
  base_monthly:        'DLOCALGO_PLAN_BASE_MONTHLY',
  base_annual:         'DLOCALGO_PLAN_BASE_ANNUAL',
  crecimiento_monthly: 'DLOCALGO_PLAN_CRECIMIENTO_MONTHLY',
  crecimiento_annual:  'DLOCALGO_PLAN_CRECIMIENTO_ANNUAL',
  hablemos_monthly:    'DLOCALGO_PLAN_HABLEMOS_MONTHLY',
  // Aliases legacy (compat con env vars existentes en Vercel — apuntan a los mismos plan IDs)
  // TODO Felipe: crear env vars nuevas con nombres post-rename y eliminar estas líneas
  junior_monthly:      'DLOCALGO_PLAN_JUNIOR_MONTHLY',
  junior_annual:       'DLOCALGO_PLAN_JUNIOR_ANNUAL',
  senior_monthly:      'DLOCALGO_PLAN_SENIOR_MONTHLY',
  senior_annual:       'DLOCALGO_PLAN_SENIOR_ANNUAL',
  manager_monthly:     'DLOCALGO_PLAN_MANAGER_MONTHLY',
};

function resolvePlanId(planKey) {
  const envKey = PLAN_KEY_TO_ENV[planKey];
  return envKey ? process.env[envKey] : null;
}

// Plan IDs válidos (del Dashboard dLocal Go → Subscriptions)
// TODO Felipe: si renombrás env vars en Vercel (DLOCALGO_PLAN_BASE_*, _CRECIMIENTO_*, _HABLEMOS_*),
// actualizar este set también. Por ahora apunta a los env vars legacy (Junior/Senior/Manager) ya configurados.
const ALLOWED_PLANS = new Set([
  process.env.DLOCALGO_PLAN_JUNIOR_MONTHLY,
  process.env.DLOCALGO_PLAN_JUNIOR_ANNUAL,
  process.env.DLOCALGO_PLAN_SENIOR_MONTHLY,
  process.env.DLOCALGO_PLAN_SENIOR_ANNUAL,
  process.env.DLOCALGO_PLAN_MANAGER_MONTHLY,
  process.env.DLOCALGO_PLAN_BASE_MONTHLY,
  process.env.DLOCALGO_PLAN_BASE_ANNUAL,
  process.env.DLOCALGO_PLAN_CRECIMIENTO_MONTHLY,
  process.env.DLOCALGO_PLAN_CRECIMIENTO_ANNUAL,
  process.env.DLOCALGO_PLAN_HABLEMOS_MONTHLY,
]);

// Precios de los planes (para cobro único inicial o cuando la API
// de suscripciones usa amount directo en vez de plan_id).
// USD aprox del día — el cobro real se ajusta con la UF del día en pasarela CLP.
// IVA 19% adicional. Cálculo:
//   Base 20 UF/mes × USD 38,5 = USD 770 net → × 1.19 IVA ≈ USD 916
//   Crecimiento CLP 1.200.000 neto → × 1.19 IVA = CLP 1.428.000 ≈ USD 1.534 (al USD-CLP ~931)
//   Hablemos: cotización a medida — el amount aquí es referencial.
const PLAN_AMOUNTS = {
  // LYD Plan Fundadores = USD 500/mes (precio público). NO va por dLocal:
  // el cobro se hace con un LINK DE PAGO NUEVO (LYD_PAYMENT_LINK) que Felipe debe pegar.
  // Se deja el monto acá solo como referencia; este archivo no enruta LYD.
  // Keys nuevas (post-rename 2026-05-24)
  base_monthly:        { amount: 916.30,   currency: 'USD', label: 'Sisteco Base - Mensual (IVA incl.)' },
  base_annual:         { amount: 9897.00,  currency: 'USD', label: 'Sisteco Base - Anual con 10% desc (IVA incl.)' },
  crecimiento_monthly: { amount: 1534.00,  currency: 'USD', label: 'Sisteco Crecimiento - Mensual (IVA incl.)' },
  crecimiento_annual:  { amount: 16567.20, currency: 'USD', label: 'Sisteco Crecimiento - Anual con 10% desc (IVA incl.)' },
  hablemos_monthly:    { amount: 4581.50,  currency: 'USD', label: 'Sisteco Hablemos - Mensual (cotización referencial, IVA incl.)' },
  // Aliases legacy — apuntan al pricing nuevo de Crecimiento (no al viejo USD 1.925 de Senior 50 UF)
  // TODO Felipe: clientes activos en planes _senior_* deben migrar a CLP 1.200.000 (no a USD 1.925)
  junior_monthly:      { amount: 916.30,   currency: 'USD', label: 'Sisteco Base - Mensual (IVA incl.)' },
  junior_annual:       { amount: 9897.00,  currency: 'USD', label: 'Sisteco Base - Anual con 10% desc (IVA incl.)' },
  senior_monthly:      { amount: 1534.00,  currency: 'USD', label: 'Sisteco Crecimiento - Mensual (IVA incl.)' },
  senior_annual:       { amount: 16567.20, currency: 'USD', label: 'Sisteco Crecimiento - Anual con 10% desc (IVA incl.)' },
  manager_monthly:     { amount: 4581.50,  currency: 'USD', label: 'Sisteco Hablemos - Mensual (cotización referencial, IVA incl.)' },
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
