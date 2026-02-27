# Milestone v1.0 — Pricing & Payments

## Goal
Publicar precios reales basados en análisis financiero de mercado, integrar Stripe para cobros recurrentes, y preparar el backend para gestión de suscripciones B2B en Chile con proyección LATAM.

## Phases

### Phase 1 — Estrategia Financiera y Precios
**Goal:** Documentar la estrategia de precios validada con benchmarks de mercado.
**Status:** complete
**Output:** `.planning/research/FINANCIAL_STRATEGY.md`

- [x] Benchmark competitivo (Apollo, PhantomBuster, ScrapingBee, n8n, Lemlist)
- [x] Estructura de costos variables por plan
- [x] Márgenes brutos calculados (~79% promedio)
- [x] Proyección MRR Año 1
- [x] Estrategia introducción: plan de founders + referidos
- [x] Definición de 3 planes + add-ons
- [x] Guía pasos Stripe para el usuario

---

### Phase 2 — Actualización Frontend: precios.html
**Goal:** Reemplazar precios mockup por precios reales; agregar sección add-ons; corregir footer.
**Status:** planned

**Planes a implementar:**
- Plan PROSPECCIÓN BASE: USD $397/mes · $297/mes anual
- Plan CRECIMIENTO: USD $797/mes · $597/mes anual
- Plan ENTERPRISE: USD $1,800+/mes · cotización anual
- Add-ons: WhatsApp +$150 · Usuarios extra +$49 · Leads extra +$97

**Tasks:**
- [ ] Actualizar 3 pricing cards con precios reales
- [ ] Cambiar features por las soluciones reales de la página de soluciones
- [ ] Agregar toggle mensual/anual funcional con JS
- [ ] Agregar sección de add-ons (4 módulos)
- [ ] Actualizar tabla comparativa de features
- [ ] Actualizar FAQ (métodos de pago Stripe, garantía 30 días, plan fundadores)
- [ ] Corregir footer: Santiago Chile + contacto@sisteco.cl + +56 9 40065566
- [ ] Remover referencias a "Claude + Gemini + Kimi" del plan Growth
- [ ] Agregar badge "Plan Fundadores" con CTA especial

---

### Phase 3 — Backend: API Stripe + Webhooks
**Goal:** Crear endpoints serverless para checkout Stripe y procesar webhooks de suscripción.
**Status:** planned

**Files a crear/modificar:**
- `api/create-checkout-session.js` — crea sesión de pago Stripe
- `api/stripe-webhook.js` — procesa eventos de suscripción
- `api/get-subscription.js` — consulta estado de suscripción
- `.env.example` — agregar vars Stripe

**Supabase tables a crear:**
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  company_name TEXT,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  plan TEXT, -- 'base', 'growth', 'enterprise'
  billing_cycle TEXT, -- 'monthly', 'annual'
  status TEXT, -- 'active', 'canceled', 'past_due', 'trialing'
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Tasks:**
- [ ] Crear `api/create-checkout-session.js`
- [ ] Crear `api/stripe-webhook.js`
- [ ] Crear tabla `subscriptions` en Supabase
- [ ] Agregar Stripe env vars a `.env.example`
- [ ] Documentar pasos para el usuario en `.planning/STRIPE_SETUP.md`

---

### Phase 4 — Frontend: Checkout Flow + Portal
**Goal:** Conectar botones de pricing con Stripe Checkout; página de éxito y portal del cliente.
**Status:** planned

**Files a crear/modificar:**
- `pages/precios.html` — conectar botones a API checkout
- `pages/success.html` — página post-pago
- `pages/cancel.html` — página cancelación pago
- `js/checkout.js` — lógica de checkout con Stripe.js
- `js/pages.js` — agregar lógica toggle anual/mensual

**Tasks:**
- [ ] Agregar Stripe.js al head de precios.html
- [ ] Crear `js/checkout.js` con `redirectToCheckout`
- [ ] Crear `pages/success.html` (confirmación + onboarding next steps)
- [ ] Crear `pages/cancel.html` (recuperación abandono)
- [ ] Agregar data attributes a botones (`data-price-monthly`, `data-price-annual`)
- [ ] Toggle mensual/anual actualiza precio mostrado Y Price ID del checkout

---

### Phase 5 — Testing y Go-Live
**Goal:** Validar flujo completo de pago en modo test Stripe; configurar producción.
**Status:** planned

**Tasks:**
- [ ] Probar checkout con tarjeta test Stripe (4242 4242 4242 4242)
- [ ] Verificar webhook procesa eventos `customer.subscription.created`
- [ ] Verificar registro en tabla Supabase subscriptions
- [ ] Probar página de éxito y cancelación
- [ ] Validar toggle mensual/anual en precios.html
- [ ] Deploy a Vercel con env vars de producción
- [ ] Activar cuenta Stripe en modo live
- [ ] Monitorear primeros cobros reales

---

## Implementation Notes

### Stripe en Chile (2026)
- Stripe Chile soporta CLP pero recomienda USD para SaaS internacional
- Taxa: 3.5% + $0.30 para tarjetas nacionales
- Tiempo de liquidación: 7 días hábiles para CLP, 2 días para USD
- Requiere RUT empresa y cuenta bancaria chilena para activar

### Arquitectura de Suscripciones
```
User clicks "Suscribirse"
  → js/checkout.js llama POST /api/create-checkout-session
    → Stripe crea Checkout Session
      → User redirigido a Stripe Checkout
        → User completa pago
          → Stripe envía webhook a /api/stripe-webhook
            → Webhook actualiza tabla subscriptions en Supabase
              → User redirigido a /pages/success.html
```

### Seguridad
- Webhook secret verificado en cada request (HMAC-SHA256)
- Secret key NUNCA en frontend — solo en serverless functions
- Publishable key OK en frontend (solo para UI)
