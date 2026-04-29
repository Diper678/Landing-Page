# Sisteco — Variables de Entorno y Setup

> Guia completa para configurar un nuevo entorno de desarrollo o produccion de Sisteco.

---

## Archivo .env completo

```env
# ── Convex (Base de Datos Reactiva) ──────────────────────────────────────────
# Obtener ejecutando: npx convex dev
CONVEX_URL=https://your-project.convex.cloud

# ── Clerk (Autenticacion) ─────────────────────────────────────────────────────
# Obtener desde: https://dashboard.clerk.com → API Keys / Integrations → Convex
CLERK_JWT_ISSUER_DOMAIN=https://your-clerk-instance.clerk.accounts.dev

# ── App ───────────────────────────────────────────────────────────────────────
SITE_URL=http://localhost:3000   # Cambiar a https://sisteco.cl en produccion

# ── Resend (Email) ────────────────────────────────────────────────────────────
RESEND_API_KEY=re_...
FROM_EMAIL=Sisteco <hola@sisteco.cl>

# ── Upstash Redis (Rate Limiting — opcional) ──────────────────────────────────
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# ── n8n (Automatizacion) ──────────────────────────────────────────────────────
N8N_WEBHOOK_URL=https://tu-instancia.n8n.cloud/webhook/sisteco-orchestration
N8N_AUTH_KEY=your_key

# ── Vercel Cron ───────────────────────────────────────────────────────────────
CRON_SECRET=your_cron_secret

# ── dLocal Go (Procesador de Pagos — Opcion B API) ────────────────────────────
# Dashboard sandbox: https://dashboard-sbx.dlocalgo.com
# Dashboard produccion: https://dashboard.dlocalgo.com
DLOCALGO_API_KEY=your_api_key_here
DLOCALGO_SECRET_KEY=your_secret_key_here
DLOCALGO_WEBHOOK_SECRET=your_webhook_secret_here
DLOCALGO_BASE_URL=https://api-sbx.dlocalgo.com/v1   # Cambiar a produccion

# Plan IDs (obtener desde dLocal Go Dashboard despues de crear planes)
DLOCALGO_PLAN_BASE_MONTHLY=plan_xxxxx
DLOCALGO_PLAN_BASE_ANNUAL=plan_xxxxx
DLOCALGO_PLAN_GROWTH_MONTHLY=plan_xxxxx
DLOCALGO_PLAN_GROWTH_ANNUAL=plan_xxxxx
DLOCALGO_PLAN_ENTERPRISE_MONTHLY=plan_xxxxx

# ── Reveniu (Procesador de Pagos — Opcion A Quick-Start) ─────────────────────
# Links de pago directos desde dashboard.reveniu.com
REVENIU_LINK_BASE_MONTHLY=https://app.reveniu.com/checkout/xxxxx
REVENIU_LINK_BASE_ANNUAL=https://app.reveniu.com/checkout/xxxxx
REVENIU_LINK_GROWTH_MONTHLY=https://app.reveniu.com/checkout/xxxxx
REVENIU_LINK_GROWTH_ANNUAL=https://app.reveniu.com/checkout/xxxxx
REVENIU_LINK_ENTERPRISE_MONTHLY=https://app.reveniu.com/checkout/xxxxx
```

---

## Setup desde cero (nuevo proyecto)

### Paso 1: Instalar dependencias
```bash
npm install
```

Dependencias principales del proyecto:
- `convex` — cliente de base de datos
- `resend` — envio de emails
- `express-rate-limit` — rate limiting
- `express` (dev) — servidor local
- `dotenv` (dev) — carga .env en local

### Paso 2: Configurar Convex

```bash
npx convex dev
```

1. Autentica en el navegador
2. Crea nuevo proyecto → nombre: `sisteco`
3. El CLI genera `convex/_generated/` con tipos TypeScript
4. Copia la URL generada (`https://xxx.convex.cloud`) a `.env` como `CONVEX_URL`

**Deploy de funciones Convex:**
```bash
npx convex deploy
```

### Paso 3: Configurar Clerk

1. Ir a clerk.com → crear cuenta → nueva aplicacion "Sisteco"
2. Habilitar: Email + Google OAuth
3. En Configure → Integrations → Convex: activar integracion
4. Copiar **Frontend API URL** → pegar en `.env` como `CLERK_JWT_ISSUER_DOMAIN`

**Webhook de Clerk → Convex:**
1. Clerk Dashboard → Webhooks → Add Endpoint
2. URL: `https://TU-PROYECTO.convex.site/clerk-webhook`
3. Eventos: `user.created`, `user.updated`, `user.deleted`

### Paso 4: Configurar Resend

1. Ir a resend.com → crear cuenta
2. Verificar dominio `sisteco.cl` (DNS records)
3. Obtener API Key → pegar en `.env`

### Paso 5: Variables en Vercel (produccion)

En Vercel Dashboard → Proyecto → Settings → Environment Variables:

| Variable | Sensible |
|---|---|
| `CONVEX_URL` | No |
| `CLERK_JWT_ISSUER_DOMAIN` | No |
| `CONVEX_DEPLOY_KEY` | Si |
| `RESEND_API_KEY` | Si |
| `DLOCALGO_SECRET_KEY` | Si |
| `DLOCALGO_WEBHOOK_SECRET` | Si |
| `CRON_SECRET` | Si |
| `SITE_URL=https://sisteco.cl` | No |

**Para produccion, cambiar:**
- `DLOCALGO_BASE_URL` → `https://api.dlocalgo.com/v1`
- `SITE_URL` → `https://sisteco.cl`

### Paso 6: Deploy

```bash
npx vercel --prod
```

*Nota: No hay git remote configurado en el proyecto de landing. El deploy es directo via Vercel CLI.*

---

## Verificacion rapida (checklist)

```bash
# Dev local
npm start                                    # → http://localhost:3000
# Llenar formulario de lead en el hero
# Verificar en dashboard.convex.dev que el lead aparece

# Convex
npx convex dev                               # Deberia conectar sin errores

# Verify API routes
curl http://localhost:3000/api/leads         # Debe aceptar POST

# Check Clerk dashboard
# → https://dashboard.clerk.com
# → Ver usuarios registrados
```

---

## Troubleshooting comun

| Problema | Causa probable | Solucion |
|---|---|---|
| `CONVEX_URL not set` | Falta variable en .env | Copiar URL de `npx convex dev` |
| `JWT verification failed` | Clerk mal configurado | Verificar `CLERK_JWT_ISSUER_DOMAIN` |
| Emails no llegan | Resend domain no verificado | Verificar DNS en resend.com |
| `Cannot find module convex` | npm install no ejecutado | `npm install` |
| Build falla en Vercel | Convex no deployado | `npx convex deploy` primero |

---

*Referencia: `MIGRATION_SUPABASE_TO_CONVEX.md` en la raiz del proyecto de landing para historial de la migracion.*
