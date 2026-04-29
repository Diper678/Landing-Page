> ⚠️ **DEPRECADO 2026-04-23** — Setup Stripe abandonado (requería entidad legal chilena que no se constituyó). Pasarelas activas: Flow.cl (principal), dLocal Go, Reveniu.
> Solo valor histórico.

# Guía: Configurar Stripe para Sisteco
**Tiempo estimado: 45-90 minutos**

---

## Paso 1: Crear cuenta Stripe

1. Ve a https://stripe.com → "Crear cuenta"
2. **País: Chile** (importante para liquidación en cuenta bancaria chilena)
3. Completa el KYC: RUT empresa, nombre representante legal, tipo de empresa (SPA/EIRL/Ltda)
4. Agrega tu cuenta bancaria corriente en CLP para recibir transferencias

---

## Paso 2: Crear los productos en Stripe Dashboard

En https://dashboard.stripe.com/products → **"Add product"**

### Producto 1: Prospección Base
- **Name:** Sisteco - Prospección Base
- **Description:** Lead scraping + AI Scoring + Email sequences. 50,000 URLs/mes, 2 usuarios.
- Agrega 2 precios:
  - Price 1: **USD 397.00** · Recurring · Monthly → copia el **Price ID** (precio_xxxx)
  - Price 2: **USD 297.00** · Recurring · Every year (Annual) → copia el **Price ID**

### Producto 2: Crecimiento
- **Name:** Sisteco - Crecimiento
- **Description:** Prospección Base + LinkedIn PhantomBuster + Multicanal. 5 usuarios.
- Agrega 2 precios:
  - Price 1: **USD 797.00** · Monthly → copia el **Price ID**
  - Price 2: **USD 597.00** · Annual → copia el **Price ID**

### Producto 3: Add-on WhatsApp
- **Name:** Add-on WhatsApp Business API
- Price: **USD 150.00** · Monthly

### Producto 4: Add-on Usuarios Extra
- **Name:** Add-on Usuarios Adicionales
- Price: **USD 49.00** · Monthly · Per unit (metered)

---

## Paso 3: Configurar el Webhook

1. Dashboard → Developers → **Webhooks** → "Add endpoint"
2. **Endpoint URL:** `https://tu-dominio.vercel.app/api/stripe-webhook`
3. **Seleccionar eventos:**
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Haz clic en **"Reveal signing secret"** → copia el `whsec_...`

---

## Paso 4: Variables de entorno en Vercel

En https://vercel.com → tu proyecto → **Settings → Environment Variables**

```env
# Stripe
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Price IDs (copia de los productos creados en Paso 2)
STRIPE_PRICE_BASE_MONTHLY=price_xxxxx
STRIPE_PRICE_BASE_ANNUAL=price_xxxxx
STRIPE_PRICE_GROWTH_MONTHLY=price_xxxxx
STRIPE_PRICE_GROWTH_ANNUAL=price_xxxxx

# App
SITE_URL=https://tu-dominio.vercel.app

# Supabase (ya configurado)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJxxxxx  # service_role key (no la anon key)
```

---

## Paso 5: Crear tabla en Supabase

En el SQL Editor de Supabase (https://app.supabase.com → SQL Editor):

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  company_name TEXT,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  plan TEXT CHECK (plan IN ('base', 'growth', 'enterprise')),
  billing_cycle TEXT CHECK (billing_cycle IN ('monthly', 'annual')),
  status TEXT CHECK (status IN ('trialing', 'active', 'canceled', 'past_due', 'incomplete')),
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index para búsquedas por email
CREATE INDEX idx_subscriptions_email ON subscriptions(email);

-- Habilitar RLS (Row Level Security)
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
-- Solo el service_role puede leer/escribir (webhook usa service_role)
```

---

## Paso 6: Instalar dependencia Stripe

```bash
npm install stripe
```

Verifica que `package.json` incluya:
```json
"dependencies": {
  "stripe": "^17.x.x",
  "@supabase/supabase-js": "^2.x.x"
}
```

---

## Paso 7: Actualizar Price IDs en precios.html

Una vez que tengas los Price IDs del Paso 2, actualiza en `pages/precios.html`:

Busca `price_BASE_MONTHLY_ID` y reemplaza con el Price ID real.
Busca `price_BASE_ANNUAL_ID`, `price_GROWTH_MONTHLY_ID`, `price_GROWTH_ANNUAL_ID` y haz lo mismo.

---

## Paso 8: Probar en modo test

Stripe ofrece modo TEST. Usa estas tarjetas para probar:
- **Pago exitoso:** 4242 4242 4242 4242 · Fecha: cualquiera futura · CVC: 123
- **Pago fallido:** 4000 0000 0000 9995
- **Requiere autenticación:** 4000 0025 0000 3155

En modo test usa `pk_test_...` y `sk_test_...`.

---

## Paso 9: Deploy y activación live

```bash
npm run deploy  # o git push si Vercel está conectado a GitHub
```

En Stripe Dashboard → activa **"Live mode"** (toggle en la esquina superior izquierda).

---

## Checklist final

- [ ] Cuenta Stripe creada con RUT chileno
- [ ] 2 productos + 4 precios creados (Base mensual/anual + Growth mensual/anual)
- [ ] Webhook configurado con 5 eventos
- [ ] Variables de entorno en Vercel (7 variables)
- [ ] Tabla `subscriptions` creada en Supabase
- [ ] `npm install stripe` ejecutado
- [ ] Price IDs actualizados en precios.html
- [ ] Prueba con tarjeta test exitosa
- [ ] Primer pago real procesado
