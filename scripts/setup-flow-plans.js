#!/usr/bin/env node
/**
 * setup-flow-plans.js
 * --------------------------------------------------------------------------
 * Crea automáticamente los 6 planes de suscripción en Flow.cl vía API.
 *
 * Plan estructura (Sisteco 2026-04-23 — pricing autoritativo en UF):
 *   - Junior:  20 UF/mes  → trimestral (60 UF) + anual (240 UF, -10%)
 *   - Senior:  50 UF/mes  → trimestral (150 UF) + anual (600 UF, -10%)
 *   - Manager: 100 UF/mes → trimestral (300 UF) + anual (1200 UF, -10%)
 *
 * Total: 6 planes recurrentes (3 planes × 2 cadencias).
 *
 * El descuento de captación (15% Trim 1) NO se crea como plan separado:
 * se aplica a la primera factura del plan trimestral vía Flow Discount API
 * o vía nota manual. Esta separación evita duplicar planes y simplifica
 * la conciliación con la mutación `upsertByPayment` en Convex.
 *
 * Auth Flow.cl:
 *   - Todas las requests POST llevan los params en form-urlencoded
 *   - Se firma con HMAC-SHA256(secret, sortedQueryString) → param `s`
 *   - apiKey va en plano dentro del payload
 *
 * Uso:
 *   1. Rellenar FLOW_API_KEY + FLOW_SECRET_KEY en Landing Page/.env
 *   2. node scripts/setup-flow-plans.js
 *   3. El script imprime las líneas FLOW_PLAN_*=... listas para pegar en .env
 *
 * Refs:
 *   - Docs Flow API: https://www.flow.cl/docs/api.html#section/Suscripciones-y-Planes
 *   - Pricing: docs/research/2026-04-23-pricing-final-formalizado.md
 *   - Mapeo Convex: convex/subscriptions.ts (upsertByPayment)
 * --------------------------------------------------------------------------
 */

'use strict';

const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

// ── Configuración ────────────────────────────────────────────────────────
const FLOW_API_KEY = process.env.FLOW_API_KEY;
const FLOW_SECRET_KEY = process.env.FLOW_SECRET_KEY;
const FLOW_BASE_URL = process.env.FLOW_BASE_URL || 'https://www.flow.cl/api';

if (!FLOW_API_KEY || !FLOW_SECRET_KEY) {
  console.error('❌ Faltan FLOW_API_KEY o FLOW_SECRET_KEY en .env');
  console.error('   Ver: Landing Page/.env (línea ~37 — sección Flow.cl)');
  process.exit(1);
}

// ── Pricing UF → CLP (referencia abril 2026, recalcular antes de prod) ──
const UF_VALUE_CLP = 38500;
const ANNUAL_DISCOUNT = 0.10; // 10% off anual (no acumulable con Trim 1)

const calc = (ufPerMonth, months, withDiscount) => {
  const totalUF = ufPerMonth * months;
  const discount = withDiscount ? ANNUAL_DISCOUNT : 0;
  return Math.round(totalUF * UF_VALUE_CLP * (1 - discount));
};

// ── Definición de los 6 planes ──────────────────────────────────────────
// interval=3 → mensual; interval_count → cuántos meses entre cobros
const PLANS = [
  // Junior
  {
    envVar: 'FLOW_PLAN_JUNIOR_TRIM',
    planId: 'sisteco-junior-trim',
    name: 'Sisteco Junior — Trimestral (60 UF)',
    amount: calc(20, 3, false), // CLP 2.310.000
    interval: 3,
    interval_count: 3,
    currency: 'CLP',
  },
  {
    envVar: 'FLOW_PLAN_JUNIOR_ANUAL',
    planId: 'sisteco-junior-anual',
    name: 'Sisteco Junior — Anual -10% (240 UF)',
    amount: calc(20, 12, true), // CLP 8.316.000
    interval: 3,
    interval_count: 12,
    currency: 'CLP',
  },
  // Senior
  {
    envVar: 'FLOW_PLAN_SENIOR_TRIM',
    planId: 'sisteco-senior-trim',
    name: 'Sisteco Senior — Trimestral (150 UF)',
    amount: calc(50, 3, false), // CLP 5.775.000
    interval: 3,
    interval_count: 3,
    currency: 'CLP',
  },
  {
    envVar: 'FLOW_PLAN_SENIOR_ANUAL',
    planId: 'sisteco-senior-anual',
    name: 'Sisteco Senior — Anual -10% (600 UF)',
    amount: calc(50, 12, true), // CLP 20.790.000
    interval: 3,
    interval_count: 12,
    currency: 'CLP',
  },
  // Manager
  {
    envVar: 'FLOW_PLAN_MANAGER_TRIM',
    planId: 'sisteco-manager-trim',
    name: 'Sisteco Manager — Trimestral (300 UF)',
    amount: calc(100, 3, false), // CLP 11.550.000
    interval: 3,
    interval_count: 3,
    currency: 'CLP',
  },
  {
    envVar: 'FLOW_PLAN_MANAGER_ANUAL',
    planId: 'sisteco-manager-anual',
    name: 'Sisteco Manager — Anual -10% (1200 UF)',
    amount: calc(100, 12, true), // CLP 41.580.000
    interval: 3,
    interval_count: 12,
    currency: 'CLP',
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────

/**
 * Firma HMAC-SHA256 al estilo Flow.cl:
 *  1. Ordenar parámetros alfabéticamente por nombre
 *  2. Concatenar como `name1value1name2value2...`
 *  3. HMAC-SHA256 con FLOW_SECRET_KEY → hex lowercase
 */
function signParams(params, secret) {
  const sorted = Object.keys(params)
    .sort()
    .map((k) => `${k}${params[k]}`)
    .join('');
  return crypto.createHmac('sha256', secret).update(sorted).digest('hex');
}

async function flowRequest(endpoint, payload) {
  const params = { ...payload, apiKey: FLOW_API_KEY };
  const signature = signParams(params, FLOW_SECRET_KEY);
  const body = new URLSearchParams({ ...params, s: signature }).toString();

  const response = await fetch(`${FLOW_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  const text = await response.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Flow no retornó JSON válido (${response.status}): ${text}`);
  }

  if (!response.ok) {
    throw new Error(
      `Flow API ${response.status}: ${json.message || JSON.stringify(json)}`
    );
  }
  return json;
}

// ── Ejecución ────────────────────────────────────────────────────────────

async function planExists(planId) {
  try {
    const result = await flowRequest('/plans/get', { planExternalId: planId });
    return !!result && !!result.planExternalId;
  } catch (err) {
    if (String(err.message).includes('404')) return false;
    return false; // tolerar 4xx en check inicial
  }
}

async function createOrSkipPlan(plan) {
  console.log(`\n→ ${plan.envVar}`);
  console.log(`  ${plan.name}`);
  console.log(`  CLP $${plan.amount.toLocaleString('es-CL')} cada ${plan.interval_count} mes(es)`);

  const exists = await planExists(plan.planId);
  if (exists) {
    console.log(`  ⏭  Plan ya existe (planExternalId=${plan.planId}). Skip.`);
    return plan.planId;
  }

  const created = await flowRequest('/plans/create', {
    planExternalId: plan.planId,
    name: plan.name,
    currency: plan.currency,
    amount: plan.amount,
    interval: plan.interval,
    interval_count: plan.interval_count,
    trial_period_days: 0,
  });

  console.log(`  ✓ Creado: ${created.planExternalId}`);
  return created.planExternalId;
}

async function main() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Setup Flow.cl — Sisteco (2026-04-23)');
  console.log(`Base URL: ${FLOW_BASE_URL}`);
  console.log(`Total planes a crear: ${PLANS.length}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const results = [];
  for (const plan of PLANS) {
    try {
      const id = await createOrSkipPlan(plan);
      results.push({ envVar: plan.envVar, value: id });
    } catch (err) {
      console.error(`  ❌ Error: ${err.message}`);
      results.push({ envVar: plan.envVar, value: null, error: err.message });
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Pegar en Landing Page/.env  (y en Vercel Env Vars):');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  for (const r of results) {
    if (r.value) {
      console.log(`${r.envVar}=${r.value}`);
    } else {
      console.log(`# ${r.envVar}=  (FALLO: ${r.error})`);
    }
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Persistir resultado para auditoría
  const outPath = path.resolve(__dirname, '..', '.flow-plans-setup.json');
  fs.writeFileSync(
    outPath,
    JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2)
  );
  console.log(`📝 Resultado completo: ${outPath}`);
}

main().catch((err) => {
  console.error('\n❌ Setup falló:', err.message);
  process.exit(1);
});
