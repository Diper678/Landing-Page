/**
 * api/flow-checkout.js
 * --------------------------------------------------------------------------
 * Endpoint dinámico de checkout Flow.cl para suscripciones recurrentes.
 *
 * Flujo:
 *  1. Cliente click "Suscribirme" en /precios → POST { plan, cadence, email, name, rut }
 *  2. Este endpoint:
 *      a. Resuelve plan + cadencia → planExternalId Flow
 *      b. Crea/recupera customer en Flow (POST /customer/register)
 *      c. Crea suscripción (POST /subscription/create)
 *      d. Aplica descuento Trim 1 (15%) si cadence=trim1 vía coupon
 *      e. Retorna { redirectUrl } al frontend
 *  3. Frontend window.location = redirectUrl → cliente paga en Flow
 *  4. Flow envía webhook a /api/flow-webhook → upsertea en Convex
 *  5. Flow redirige a SITE_URL/gracias
 *
 * Auth Flow.cl: HMAC-SHA256 sobre params ordenados alfabéticamente.
 *
 * Refs:
 *   - Pricing: docs/research/2026-04-23-pricing-final-formalizado.md
 *   - Plan IDs: scripts/setup-flow-plans.js (correr 1ra vez)
 *   - Webhook: api/flow-webhook.js
 * --------------------------------------------------------------------------
 */

'use strict';

const crypto = require('crypto');

const FLOW_BASE_URL = process.env.FLOW_BASE_URL || 'https://www.flow.cl/api';
const SITE_URL = process.env.SITE_URL || 'https://sisteco.cl';

// ── Mapa plan + cadencia → variable de entorno con planExternalId ──
const PLAN_ENV_MAP = {
  'junior:trim1':   'FLOW_PLAN_JUNIOR_TRIM',   // mismo plan trimestral, Trim 1 aplica como coupon
  'junior:trim':    'FLOW_PLAN_JUNIOR_TRIM',
  'junior:anual':   'FLOW_PLAN_JUNIOR_ANUAL',
  'senior:trim1':   'FLOW_PLAN_SENIOR_TRIM',
  'senior:trim':    'FLOW_PLAN_SENIOR_TRIM',
  'senior:anual':   'FLOW_PLAN_SENIOR_ANUAL',
  'manager:trim1':  'FLOW_PLAN_MANAGER_TRIM',
  'manager:trim':   'FLOW_PLAN_MANAGER_TRIM',
  'manager:anual':  'FLOW_PLAN_MANAGER_ANUAL',
};

// Coupon code Trim 1 (15% off primer ciclo) — crear en Flow Dashboard manualmente
// o via /coupon/create en script aparte. Si no existe, se ignora silenciosamente.
const TRIM1_COUPON = 'SISTECO-TRIM1-15';

function signParams(params, secret) {
  const sorted = Object.keys(params)
    .sort()
    .map((k) => `${k}${params[k]}`)
    .join('');
  return crypto.createHmac('sha256', secret).update(sorted).digest('hex');
}

async function flowRequest(endpoint, payload, method = 'POST') {
  const apiKey = process.env.FLOW_API_KEY;
  const secret = process.env.FLOW_SECRET_KEY;
  if (!apiKey || !secret) {
    throw new Error('FLOW_API_KEY / FLOW_SECRET_KEY no configuradas');
  }

  const params = { ...payload, apiKey };
  const signature = signParams(params, secret);
  const body = new URLSearchParams({ ...params, s: signature }).toString();

  const url =
    method === 'GET'
      ? `${FLOW_BASE_URL}${endpoint}?${body}`
      : `${FLOW_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    method,
    headers:
      method === 'POST'
        ? { 'Content-Type': 'application/x-www-form-urlencoded' }
        : undefined,
    body: method === 'POST' ? body : undefined,
  });

  const text = await response.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Flow no retornó JSON (${response.status}): ${text}`);
  }
  if (!response.ok) {
    throw new Error(`Flow API ${response.status}: ${json.message || text}`);
  }
  return json;
}

async function findOrCreateCustomer({ email, name }) {
  // Flow soporta /customer/register (idempotente por email)
  const result = await flowRequest('/customer/create', {
    email,
    name,
    externalId: `sisteco-${Buffer.from(email).toString('base64url').slice(0, 24)}`,
  });
  return result.customerId;
}

async function createSubscription({ customerId, planId, couponId }) {
  const payload = { customerId, planId };
  if (couponId) payload.couponId = couponId;
  return flowRequest('/subscription/create', payload);
}

module.exports = async (req, res) => {
  // CORS básico — landing y /precios consumen este endpoint
  res.setHeader('Access-Control-Allow-Origin', SITE_URL);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { plan, cadence, email, name, rut } = req.body || {};

    if (!plan || !cadence || !email || !name) {
      return res
        .status(400)
        .json({ error: 'Faltan campos: plan, cadence, email, name' });
    }

    if (!['junior', 'senior', 'manager'].includes(plan)) {
      return res.status(400).json({ error: `Plan inválido: ${plan}` });
    }
    if (!['trim1', 'trim', 'anual'].includes(cadence)) {
      return res.status(400).json({ error: `Cadencia inválida: ${cadence}` });
    }

    const envKey = PLAN_ENV_MAP[`${plan}:${cadence}`];
    const planExternalId = process.env[envKey];
    if (!planExternalId) {
      return res.status(500).json({
        error: `Plan no configurado en env: ${envKey}. Correr scripts/setup-flow-plans.js`,
      });
    }

    // 1. Customer
    const customerId = await findOrCreateCustomer({ email, name });

    // 2. Subscription (con coupon Trim 1 si aplica)
    const couponId = cadence === 'trim1' ? TRIM1_COUPON : null;
    const subscription = await createSubscription({
      customerId,
      planId: planExternalId,
      couponId,
    });

    // Flow retorna { subscriptionId, status, paymentLink? }
    // Si Flow no genera paymentLink directo, redirigir al portal de cliente:
    const redirectUrl =
      subscription.paymentLink ||
      `${FLOW_BASE_URL.replace('/api', '')}/app/web/pagar.php?subscriptionId=${subscription.subscriptionId}`;

    return res.status(200).json({
      ok: true,
      subscriptionId: subscription.subscriptionId,
      customerId,
      plan,
      cadence,
      redirectUrl,
    });
  } catch (err) {
    console.error('[flow-checkout] Error:', err);
    return res.status(500).json({ error: err.message });
  }
};
