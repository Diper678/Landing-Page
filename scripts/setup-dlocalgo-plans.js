// api/setup-dlocalgo-plans.js
// Script para crear planes de suscripción en dLocal Go y actualizar todo automáticamente
//
// USO:
//   node -r dotenv/config api/setup-dlocalgo-plans.js
//
// Qué hace:
//   1. Crea 5 planes de suscripción via API
//   2. Actualiza .env con las nuevas URLs de checkout
//   3. Actualiza pages/precios.html con los nuevos links
//
// Para cambiar de sandbox a producción:
//   1. Cambia DLOCALGO_BASE_URL en .env a https://api.dlocalgo.com/v1
//   2. Pon las API keys de producción en .env
//   3. Ejecuta este script de nuevo

const fs = require('fs');
const path = require('path');

const API_KEY = process.env.DLOCALGO_API_KEY;
const SECRET_KEY = process.env.DLOCALGO_SECRET_KEY;
const BASE_URL = process.env.DLOCALGO_BASE_URL || 'https://api-sbx.dlocalgo.com/v1';
const SITE_URL = process.env.SITE_URL || 'https://sisteco.cl';

const IS_SANDBOX = BASE_URL.includes('-sbx');
const CHECKOUT_BASE = IS_SANDBOX
  ? 'https://checkout-sbx.dlocalgo.com/validate/subscription'
  : 'https://checkout.dlocalgo.com/validate/subscription';

const AUTH_HEADER = `Bearer ${API_KEY}:${SECRET_KEY}`;

const ROOT = path.resolve(__dirname, '..');
const ENV_PATH = path.join(ROOT, '.env');
const PRECIOS_PATH = path.join(ROOT, 'pages', 'precios.html');

// Precios USD con IVA incluido (UF × ~38,500 / ~970 USD × 1.19).
// Pricing autoritativo: docs/research/2026-04-23-pricing-final-formalizado.md
// Junior 20 UF, Senior 50 UF, Manager ~100 UF (caso a caso).
// Anual con 10% descuento. Recalcular si UF/USD se mueven significativamente.
const PLANS = [
  {
    envKey: 'DLOCALGO_PLAN_JUNIOR_MONTHLY',
    htmlPlan: 'junior',
    htmlPeriod: 'monthly',
    name: 'Sisteco Junior - Mensual',
    description: 'Prospección B2B operada como servicio: LinkedIn + SII + Señal Sisteco + planilla semanal. Cumple Ley 21.719.',
    amount: 916.30,
    currency: 'USD',
    country: 'CL',
    frequency_type: 'MONTHLY',
    frequency_value: 1,
  },
  {
    envKey: 'DLOCALGO_PLAN_JUNIOR_ANNUAL',
    htmlPlan: 'junior',
    htmlPeriod: 'annual',
    name: 'Sisteco Junior - Anual (10% desc)',
    description: 'Junior anual con 10% de descuento. Ley 21.719 incluida.',
    amount: 824.67,
    currency: 'USD',
    country: 'CL',
    frequency_type: 'MONTHLY',
    frequency_value: 1,
  },
  {
    envKey: 'DLOCALGO_PLAN_SENIOR_MONTHLY',
    htmlPlan: 'senior',
    htmlPeriod: 'monthly',
    name: 'Sisteco Senior - Mensual',
    description: 'Junior + Sales Navigator + sync directo CRM (HubSpot/Pipedrive/Salesforce) + reentrega del batch (Mes 1).',
    amount: 2290.75,
    currency: 'USD',
    country: 'CL',
    frequency_type: 'MONTHLY',
    frequency_value: 1,
  },
  {
    envKey: 'DLOCALGO_PLAN_SENIOR_ANNUAL',
    htmlPlan: 'senior',
    htmlPeriod: 'annual',
    name: 'Sisteco Senior - Anual (10% desc)',
    description: 'Senior anual con 10% de descuento.',
    amount: 2061.68,
    currency: 'USD',
    country: 'CL',
    frequency_type: 'MONTHLY',
    frequency_value: 1,
  },
  {
    envKey: 'DLOCALGO_PLAN_MANAGER_MONTHLY',
    htmlPlan: 'manager',
    htmlPeriod: 'monthly',
    name: 'Sisteco Manager - Mensual',
    description: 'Senior + omnicanal LinkedIn+email + Firecrawl enrichment + reporte ejecutivo PDF + Felipe consultor 1:1.',
    amount: 4581.50,
    currency: 'USD',
    country: 'CL',
    frequency_type: 'MONTHLY',
    frequency_value: 1,
  },
];

// ── API ─────────────────────────────────────────────────────────────────

async function createPlan(planDef) {
  const { envKey, htmlPlan, htmlPeriod, ...payload } = planDef;

  const body = {
    ...payload,
    notification_url: `${SITE_URL}/api/dlocalgo-webhook`,
    success_url: `${SITE_URL}/pages/precios.html?subscribed=true`,
    error_url: `${SITE_URL}/pages/precios.html?canceled=true`,
    back_url: `${SITE_URL}/pages/precios.html`,
  };

  const res = await fetch(`${BASE_URL}/subscription/plan`, {
    method: 'POST',
    headers: {
      'Authorization': AUTH_HEADER,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error(`  [FAIL] ${res.status}`, data);
    return null;
  }

  const checkoutUrl = data.plan_token
    ? `${CHECKOUT_BASE}/${data.plan_token}`
    : null;

  return { envKey, htmlPlan, htmlPeriod, checkoutUrl, planId: data.id };
}

// ── Actualizar .env ─────────────────────────────────────────────────────

function updateEnvFile(results) {
  let env = fs.readFileSync(ENV_PATH, 'utf-8');

  for (const r of results) {
    if (!r.checkoutUrl) continue;
    // Reemplazar la línea completa del env key
    const regex = new RegExp(`^${r.envKey}=.*$`, 'm');
    if (regex.test(env)) {
      env = env.replace(regex, `${r.envKey}=${r.checkoutUrl}`);
    } else {
      // Si no existe, agregar después del último DLOCALGO_PLAN
      env = env.replace(
        /(DLOCALGO_PLAN_\w+=.*)$/m,
        `$1\n${r.envKey}=${r.checkoutUrl}`
      );
    }
  }

  fs.writeFileSync(ENV_PATH, env, 'utf-8');
  console.log('  [OK] .env actualizado');
}

// ── Actualizar precios.html ─────────────────────────────────────────────

function updatePreciosHtml(results) {
  let html = fs.readFileSync(PRECIOS_PATH, 'utf-8');

  // Construir mapa: { base: { monthly: url, annual: url }, growth: {...}, enterprise: {...} }
  const urlMap = {};
  for (const r of results) {
    if (!r.checkoutUrl) continue;
    if (!urlMap[r.htmlPlan]) urlMap[r.htmlPlan] = {};
    urlMap[r.htmlPlan][r.htmlPeriod] = r.checkoutUrl;
  }

  // Reemplazar todas las URLs de dLocal Go checkout (subscription o recurring)
  // El patrón busca los data-link-monthly/annual y href en los .checkout-btn que NO son de Reveniu
  const dlocalUrlRegex = /https:\/\/checkout(?:-sbx)?\.dlocalgo\.com\/validate\/(?:subscription|recurring)\/[A-Za-z0-9]+/g;

  // Estrategia: recorrer el HTML buscando bloques de checkout-btn con data-plan="X"
  // y reemplazar las URLs de dLocal Go según plan + period

  for (const [plan, periods] of Object.entries(urlMap)) {
    // Para cada plan, encontrar los bloques de checkout-btn de dLocal Go
    // Patrón: data-plan="base" con data-link-monthly="..." data-link-annual="..."
    // Puede aparecer múltiples veces (ej: growth aparece en las cards y en el CTA final)

    if (periods.monthly) {
      // Reemplazar data-link-monthly para este plan (solo en bloques dLocal Go, no Reveniu)
      const monthlyPattern = new RegExp(
        `(data-plan="${plan}"[^>]*data-link-monthly=")https://checkout(?:-sbx)?\\.dlocalgo\\.com/validate/(?:subscription|recurring)/[A-Za-z0-9]+(")`,
        'g'
      );
      html = html.replace(monthlyPattern, `$1${periods.monthly}$2`);

      // También reemplazar el href principal en el mismo <a> (el href viene antes de data-plan)
      // Buscar: href="https://checkout...dlocalgo..." seguido de data-plan="X" en la misma etiqueta
      const hrefPattern = new RegExp(
        `(href=")https://checkout(?:-sbx)?\\.dlocalgo\\.com/validate/(?:subscription|recurring)/[A-Za-z0-9]+("[^>]*data-plan="${plan}")`,
        'g'
      );
      html = html.replace(hrefPattern, `$1${periods.monthly}$2`);
    }

    if (periods.annual) {
      const annualPattern = new RegExp(
        `(data-plan="${plan}"[^>]*data-link-annual=")https://checkout(?:-sbx)?\\.dlocalgo\\.com/validate/(?:subscription|recurring)/[A-Za-z0-9]+(")`,
        'g'
      );
      html = html.replace(annualPattern, `$1${periods.annual}$2`);
    }
  }

  fs.writeFileSync(PRECIOS_PATH, html, 'utf-8');
  console.log('  [OK] pages/precios.html actualizado');
}

// ── Main ────────────────────────────────────────────────────────────────

async function main() {
  if (!API_KEY || !SECRET_KEY) {
    console.error('Error: DLOCALGO_API_KEY y DLOCALGO_SECRET_KEY deben estar en .env');
    process.exit(1);
  }

  const mode = IS_SANDBOX ? 'SANDBOX' : 'PRODUCCION';
  console.log('');
  console.log(`╔══════════════════════════════════════════════════╗`);
  console.log(`║  dLocal Go — Setup de planes (${mode.padEnd(10)})     ║`);
  console.log(`╚══════════════════════════════════════════════════╝`);
  console.log(`  API: ${BASE_URL}`);
  console.log(`  Webhook: ${SITE_URL}/api/dlocalgo-webhook`);
  console.log('');

  // Listar planes existentes
  console.log('Verificando planes existentes...');
  try {
    const listRes = await fetch(`${BASE_URL}/subscription/plan/all`, {
      headers: { 'Authorization': AUTH_HEADER },
    });
    if (listRes.ok) {
      const existing = await listRes.json();
      const plans = existing.data || existing.plans || existing;
      if (Array.isArray(plans) && plans.length > 0) {
        console.log(`  Encontrados ${plans.length} planes existentes`);
        plans.forEach(p => {
          const status = p.active ? 'activo' : 'inactivo';
          console.log(`    ${p.name || p.id}: $${p.amount} ${p.currency} [${status}]`);
        });
        console.log('');
      }
    }
  } catch (e) {
    console.log('  No se pudo verificar planes existentes');
  }

  // Crear planes
  console.log('Creando planes...');
  const results = [];
  let failures = 0;

  for (const plan of PLANS) {
    process.stdout.write(`  ${plan.name} ($${plan.amount})... `);
    const result = await createPlan(plan);
    if (result) {
      console.log(`OK [ID: ${result.planId}]`);
      results.push(result);
    } else {
      failures++;
    }
  }

  if (results.length === 0) {
    console.error('\nNingún plan se creó. Revisa tus API keys en .env');
    process.exit(1);
  }

  // Actualizar archivos
  console.log('');
  console.log('Actualizando archivos...');
  updateEnvFile(results);
  updatePreciosHtml(results);

  // Resumen final
  console.log('');
  console.log('════════════════════════════════════════════════════');
  console.log('  CHECKOUT URLs generadas');
  console.log('════════════════════════════════════════════════════');
  for (const r of results) {
    console.log(`  ${r.envKey}`);
    console.log(`    ${r.checkoutUrl}`);
  }

  console.log('');
  if (failures > 0) {
    console.log(`⚠  ${failures} planes fallaron — revisa errores arriba`);
  } else {
    console.log(`✓  ${results.length} planes creados, .env y precios.html actualizados`);
  }

  if (IS_SANDBOX) {
    console.log('');
    console.log('Para ir a producción:');
    console.log('  1. En .env, cambia DLOCALGO_BASE_URL a https://api.dlocalgo.com/v1');
    console.log('  2. En .env, pon las API keys de producción');
    console.log('  3. Ejecuta: node -r dotenv/config api/setup-dlocalgo-plans.js');
    console.log('  4. Ejecuta: npx vercel --prod');
  }

  console.log('');
}

main().catch(err => {
  console.error('Error fatal:', err.message);
  process.exit(1);
});
