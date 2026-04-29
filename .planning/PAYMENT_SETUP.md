> ⚠️ **DEPRECADO 2026-04-23** — Setup con planes Base/Crecimiento/Enterprise. Reemplazado por Junior/Senior/Manager + Flow.cl como pasarela principal.
> Para setup actual: ver `Landing Page/.env.example` (Flow + dLocal + Reveniu actualizado) y `Landing Page/scripts/setup-dlocalgo-plans.js`.
> Solo valor histórico.

# Guía: Configurar Pagos — dLocal Go + Reveniu
**Reemplaza:** ~~STRIPE_SETUP.md~~ (eliminado — Stripe requiere entidad legal chilena)
**Procesador principal:** dLocal Go API | **Quick-start:** Reveniu (sin código)

---

## OPCIÓN A — Quick Start: Reveniu (sin código, funciona hoy)

> Usa esto para cobrar a tus primeros clientes (Plan Fundadores) mientras formalizas la empresa.

### Paso 1: Crear cuenta Reveniu
1. Ir a https://reveniu.com → "Crea gratis tu cuenta"
2. Registrarte con email (sin RUT empresa requerido para Starter)
3. Configurar tu perfil de negocio y logo

### Paso 2: Crear los planes de suscripción
En el dashboard de Reveniu → "Crear plan":

**Plan Prospección Base**
- Nombre: `Sisteco Prospección Base`
- Precio: CLP 369,000/mes (≈ USD 397 a tasa ~930)
- Frecuencia: Mensual
- O crear versión anual: CLP 3,528,000/año (≈ USD 297×12 = $3,564)

**Plan Crecimiento**
- Nombre: `Sisteco Crecimiento`
- Precio: CLP 741,000/mes (≈ USD 797)
- Frecuencia: Mensual

> ℹ️ Reveniu cobra en CLP/UF solamente. Para cobrar en USD, necesitas dLocal Go (Opción B).

### Paso 3: Compartir links de pago
Cada plan genera un link de pago. Copia los links y:
- Envíalos directamente a clientes por email/WhatsApp
- O incrústalo como botón en la página de precios (mientras no tienes la API integrada)

### Paso 4: Activar Plan Pro (cuando tengas RUT empresa)
1. Contratar Reveniu Pro → CLP 40,000/mes
2. Reveniu gestiona el contrato con Transbank por ti (cero trámites)
3. El dinero llega a tu cuenta bancaria en 1-2 días hábiles

**Fees totales Reveniu Starter:** ~4.5-5% por transacción (Reveniu 3% + Transbank ~1.5-2%)

---

## OPCIÓN B — Integración API: dLocal Go (recomendado largo plazo)

> Usa esto una vez que tengas entidad legal. Permite cobrar en USD, expansión LATAM, y checkout integrado en la web.

### Paso 1: Crear entidad legal en Chile (si no tienes)
1. Ir a https://www.registrodeempresasysociedades.cl
2. Crear **SpA** (Sociedad por Acciones) o **EIRL** — online, en ~24h, costo ~CLP 0-3K
3. El sistema genera RUT empresa automáticamente
4. Iniciar actividades en SII: https://www.sii.cl → "Inicio de Actividades"
   - Giro: "Desarrollo de software y actividades de tecnología de la información" (cod. 620100)

### Paso 2: Crear cuenta dLocal Go
1. Ir a https://dashboard.dlocalgo.com/signup
2. Registrarte con email empresarial
3. Para **Sandbox (testing):** https://dashboard-sbx.dlocalgo.com/signup — sin KYC
4. Para **Live:** completar verificación con RUT empresa + banco

### Paso 3: Obtener API Keys
1. Dashboard → Integrations → API Integration
2. Copiar:
   - `API Key` (equivalente al publishable key — va en frontend)
   - `Secret Key` (solo en backend/serverless)

### Paso 4: Crear Planes de Suscripción en dLocal Go Dashboard
En Dashboard → Subscriptions → Create Plan:

**Plan 1: Prospección Base Mensual**
- Amount: USD 397.00 · Currency: USD · Frequency: Monthly
- Plan ID: copiar para env vars

**Plan 2: Prospección Base Anual**
- Amount: USD 3,564.00 · Currency: USD · Frequency: Yearly
- (equivalente a USD 297/mes × 12)

**Plan 3: Crecimiento Mensual**
- Amount: USD 797.00 · Currency: USD · Frequency: Monthly

**Plan 4: Crecimiento Anual**
- Amount: USD 7,164.00 · Currency: USD · Frequency: Yearly

**Plan 5: Enterprise Mensual**
- Amount: USD 1,800.00 · Currency: USD · Frequency: Monthly
- Plan ID: copiar para env vars

### Paso 5: Configurar Webhook
1. Dashboard → Integrations → Webhooks → Add Endpoint
2. URL: `https://tu-dominio.vercel.app/api/dlocalgo-webhook`
3. Eventos a escuchar:
   - `PAYMENT_STATUS_CHANGE` — cobro procesado/fallido
   - `SUBSCRIPTION_STATUS_CHANGE` — suscripción activa/cancelada
4. Copiar el **Webhook Secret** generado

### Paso 6: Variables de entorno en Vercel
En https://vercel.com → tu proyecto → Settings → Environment Variables:

```env
# dLocal Go
DLOCALGO_API_KEY=your_api_key_here
DLOCALGO_SECRET_KEY=your_secret_key_here
DLOCALGO_WEBHOOK_SECRET=your_webhook_secret_here
DLOCALGO_BASE_URL=https://api.dlocalgo.com/v1

# Supabase (ya configurado)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJxxxxx

# App
SITE_URL=https://tu-dominio.vercel.app

# dLocal Go Plan IDs (del Paso 4)
DLOCALGO_PLAN_BASE_MONTHLY=plan_xxxxx
DLOCALGO_PLAN_BASE_ANNUAL=plan_xxxxx
DLOCALGO_PLAN_GROWTH_MONTHLY=plan_xxxxx
DLOCALGO_PLAN_GROWTH_ANNUAL=plan_xxxxx
DLOCALGO_PLAN_ENTERPRISE_MONTHLY=plan_xxxxx
```

### Paso 7: Crear tabla en Supabase
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  company_name TEXT,
  dlocalgo_customer_id TEXT,
  dlocalgo_subscription_id TEXT UNIQUE,
  dlocalgo_payment_id TEXT,
  plan TEXT CHECK (plan IN ('base', 'growth', 'enterprise')),
  billing_cycle TEXT CHECK (billing_cycle IN ('monthly', 'annual')),
  status TEXT CHECK (status IN ('active', 'canceled', 'past_due', 'trialing', 'pending')),
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_email ON subscriptions(email);
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
```

### Paso 8: Probar con sandbox
1. Usar URL sandbox: `DLOCALGO_BASE_URL=https://api-sbx.dlocalgo.com/v1`
2. Tarjeta de test exitosa: `4111 1111 1111 1111` + fecha futura + cualquier CVV
3. Tarjeta de test fallida: `5555 5555 5555 4444`
4. Verificar que el webhook registra la suscripción en Supabase

### Paso 9: Activar cuenta live
1. Dashboard dLocal Go → completar verificación KYC
2. Cambiar `DLOCALGO_BASE_URL` a `https://api.dlocalgo.com/v1`
3. Cambiar API Keys por las de producción

---

## PASO ADICIONAL: Facturación DTE (obligatorio para cobros en Chile)

dLocal Go deposita el dinero en tu cuenta pero NO emite boletas/facturas a tus clientes.
Sisteco debe emitir DTE (Documento Tributario Electrónico) a cada cliente.

**Solución recomendada: Bsale**
- URL: https://bsale.cl
- Costo: desde CLP 29,900/mes
- Integración: API REST o webhook desde tu sistema
- Uso: cada vez que dLocal Go confirma un pago → crear boleta electrónica automáticamente vía API Bsale

**Flujo:**
```
dLocal Go webhook → api/dlocalgo-webhook.js
  → actualiza Supabase (subscriptions)
  → llama api Bsale → emite DTE al cliente
    → cliente recibe boleta/factura por email
```

---

## Checklist final antes de ir a producción

- [ ] Entidad legal creada (SpA/EIRL) con RUT activo
- [ ] Cuenta corriente empresarial abierta
- [ ] Cuenta dLocal Go verificada (KYC aprobado)
- [ ] 5 planes de suscripción creados en dLocal Go Dashboard
- [ ] Webhook configurado con URL de producción
- [ ] 8 variables de entorno en Vercel
- [ ] Tabla `subscriptions` creada en Supabase
- [ ] Prueba exitosa en sandbox (cobro + webhook + DB)
- [ ] DTE/Bsale configurado para emisión automática
- [ ] Plan IDs actualizados en precios.html (data-plan-id attributes)
