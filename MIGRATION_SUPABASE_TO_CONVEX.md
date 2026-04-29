# Migración: Supabase → Convex + Clerk

> Fecha: 2026-03-04
> Autor: Claude Code (asistido)
> Proyecto: Sisteco Landing Page

---

## Resumen

Se migró toda la capa de base de datos de **Supabase (PostgreSQL)** a **Convex** (base de datos reactiva en la nube), y se integró **Clerk** como proveedor de autenticación.

### ¿Por qué este cambio?

| Antes (Supabase) | Después (Convex + Clerk) |
|---|---|
| PostgreSQL relacional | Base de datos de documentos reactiva |
| SQL manual + RLS policies | Schema TypeScript + funciones tipadas |
| Service key en cada API route | Cliente HTTP centralizado |
| Auth manual (no implementada) | Clerk: auth lista con Google, Email, etc. |
| Cron para drip emails via SQL queries | Queries con índices optimizados |

---

## Archivos Modificados

### Nuevos (Convex backend)

| Archivo | Propósito |
|---|---|
| `convex/schema.ts` | Schema completo: 6 tablas con índices |
| `convex/leads.ts` | Mutations: upsertLead, upsertLeadSoft, getByEmail |
| `convex/ctaClicks.ts` | Mutation: track |
| `convex/demoRequests.ts` | Mutation: create |
| `convex/emailSequence.ts` | Mutations: scheduleDrip, markSent, markFailed; Query: getPending |
| `convex/subscriptions.ts` | Mutations: upsertByPayment, upsertBySubscription, updateStatus* |
| `convex/users.ts` | Mutations: upsertUser, deleteUser; Query: getCurrentUser |
| `convex/auth.config.ts` | Configuración de Clerk como auth provider |
| `convex/http.ts` | HTTP router: webhook de Clerk para sync de usuarios |
| `api/lib/convex.js` | Cliente ConvexHttpClient compartido |

### Modificados (migración Supabase → Convex)

| Archivo | Cambio |
|---|---|
| `api/leads.js` | `createClient` Supabase → `ConvexHttpClient` + mutations |
| `api/demo.js` | Idem |
| `api/track.js` | Idem |
| `api/cron/send-drip.js` | Idem (queries + mutations Convex) |
| `api/dlocalgo-webhook.js` | Idem (dynamic import para CommonJS) |
| `server.js` | Idem (Express dev server) |
| `package.json` | `@supabase/supabase-js` → `convex` v1.17+ |
| `.env` | `SUPABASE_URL/KEY` → `CONVEX_URL` + `CLERK_JWT_ISSUER_DOMAIN` |
| `.env.example` | Actualizado con nuevas variables |
| `vercel.json` | buildCommand: `npx convex deploy` |
| `api/stripe-webhook.js` | Marcado como DEPRECATED (ya no usa Supabase) |

### Sin cambios

- `api/lib/resend.js` — No usa Supabase
- `api/lib/email-templates.js` — No usa Supabase
- `api/create-checkout-session.js` — Solo usa dLocal Go API
- Todos los HTML/CSS/JS del frontend — No tocan la base de datos directamente

---

## Mapeo de Tablas: Supabase → Convex

### leads → leads
| Supabase (SQL) | Convex (TypeScript) | Notas |
|---|---|---|
| `id UUID` | `_id` (auto) | ID de documento Convex |
| `email VARCHAR(255)` | `email: v.string()` | Índice: `by_email` |
| `source VARCHAR(50)` | `source: v.optional(v.string())` | |
| `utm_source` | `utmSource` | camelCase |
| `utm_medium` | `utmMedium` | camelCase |
| `utm_campaign` | `utmCampaign` | camelCase |
| `referrer TEXT` | `referrer: v.optional(v.string())` | |
| `user_agent TEXT` | `userAgent` | camelCase |
| `ip_address INET` | `ipAddress: v.optional(v.string())` | String en vez de INET |
| `created_at TIMESTAMPTZ` | `_creationTime` (auto) | Timestamp automático |
| `updated_at TIMESTAMPTZ` | `updatedAt: v.optional(v.number())` | Epoch ms |

### cta_clicks → ctaClicks
| Supabase | Convex | Notas |
|---|---|---|
| `lead_id UUID REFERENCES` | `leadId: v.optional(v.id("leads"))` | Referencia tipada |
| `button_id VARCHAR(50)` | `buttonId: v.string()` | Índice: `by_button_id` |
| `button_text` | `buttonText` | |
| `page_url` | `pageUrl` | |

### demo_requests → demoRequests
| Supabase | Convex | Notas |
|---|---|---|
| `lead_id UUID REFERENCES` | `leadId: v.optional(v.id("leads"))` | |
| `company_name` | `companyName` | camelCase |
| `company_size` | `companySize` | |
| `status VARCHAR(20)` | `status: v.string()` | Índice: `by_status` |

### email_sequence → emailSequence
| Supabase | Convex | Notas |
|---|---|---|
| `template_key` | `templateKey` | |
| `scheduled_at TIMESTAMPTZ` | `scheduledAt: v.number()` | Epoch ms, índice compuesto |
| `sent_at TIMESTAMPTZ` | `sentAt: v.optional(v.number())` | |
| `resend_id` | `resendId` | |

### subscriptions → subscriptions
| Supabase | Convex | Notas |
|---|---|---|
| `dlocalgo_subscription_id` | `dlocalgoSubscriptionId` | Índice: `by_subscription_id` |
| `dlocalgo_payment_id` | `dlocalgoPaymentId` | Índice: `by_payment_id` |
| `current_period_end TIMESTAMPTZ` | `currentPeriodEnd: v.number()` | Epoch ms |

### Nueva: users (para Clerk)
| Campo | Tipo | Notas |
|---|---|---|
| `clerkId` | `v.string()` | Índice: `by_clerk_id` |
| `email` | `v.string()` | |
| `name` | `v.optional(v.string())` | |
| `imageUrl` | `v.optional(v.string())` | |

---

## Patrón de Upsert

Supabase tenía `.upsert()` nativo con `onConflict`. En Convex, implementamos upsert manualmente:

```typescript
// Convex: query por índice → patch o insert
const existing = await ctx.db
  .query("leads")
  .withIndex("by_email", (q) => q.eq("email", args.email))
  .unique();

if (existing) {
  await ctx.db.patch(existing._id, { ...updates });
  return { _id: existing._id, isExisting: true };
}
const id = await ctx.db.insert("leads", { ...data });
return { _id: id, isExisting: false };
```

---

## Pasos Manuales para Completar la Migración

### Paso 1: Instalar dependencias

```bash
npm install
```

Esto instalará `convex` y eliminará `@supabase/supabase-js` del node_modules.

### Paso 2: Crear cuenta en Convex

1. Ir a [convex.dev](https://convex.dev) y crear cuenta (gratis)
2. Desde la terminal, en la raíz del proyecto:

```bash
npx convex dev
```

3. Esto te pedirá autenticarte en el navegador
4. Seleccionar "Create a new project" → nombre: `sisteco`
5. El CLI generará:
   - `convex/_generated/` — tipos TypeScript auto-generados
   - URL de Convex (ej: `https://gentle-hound-123.convex.cloud`)
6. Copiar la URL y pegarla en `.env`:

```env
CONVEX_URL=https://gentle-hound-123.convex.cloud
```

### Paso 3: Crear cuenta en Clerk

1. Ir a [clerk.com](https://clerk.com) y crear cuenta (gratis hasta 50K usuarios)
2. Crear nueva aplicación → nombre: `Sisteco`
3. Elegir métodos de login: **Email** + **Google** (recomendado)
4. En **Configure → Integrations → Convex**:
   - Clic en "Activate Convex integration"
   - Copiar el **Frontend API URL** (formato: `https://verb-noun-00.clerk.accounts.dev`)
5. Pegar en `.env`:

```env
CLERK_JWT_ISSUER_DOMAIN=https://verb-noun-00.clerk.accounts.dev
```

### Paso 4: Configurar Webhook de Clerk en Convex

1. En **Clerk Dashboard → Webhooks → Add Endpoint**
2. URL: `https://TU-PROYECTO.convex.site/clerk-webhook`
   (reemplazar TU-PROYECTO con el subdominio de tu Convex)
3. Eventos a suscribir: `user.created`, `user.updated`, `user.deleted`

### Paso 5: Configurar variables en Vercel

En **Vercel Dashboard → Tu Proyecto → Settings → Environment Variables**, agregar:

| Variable | Valor |
|---|---|
| `CONVEX_URL` | `https://tu-proyecto.convex.cloud` |
| `CLERK_JWT_ISSUER_DOMAIN` | `https://tu-clerk.clerk.accounts.dev` |
| `CONVEX_DEPLOY_KEY` | Obtener de Convex Dashboard → Settings → Deploy key |

### Paso 6: Deploy de funciones Convex

```bash
npx convex deploy
```

Esto sube el schema y todas las mutations/queries a Convex Cloud.

### Paso 7: Verificar

```bash
npm start
```

Probar el formulario de captura de leads en `http://localhost:3000`.
Verificar que el lead aparece en el [Dashboard de Convex](https://dashboard.convex.dev).

### Paso 8 (Opcional): Migrar datos existentes de Supabase

Si tienes leads en Supabase que quieres conservar, puedes exportarlos como CSV desde el Supabase Dashboard y luego importarlos a Convex usando un script:

```javascript
// scripts/migrate-data.js (ejecutar una vez)
const { ConvexHttpClient } = require('convex/browser');
const client = new ConvexHttpClient(process.env.CONVEX_URL);
// ... leer CSV y llamar mutations para cada registro
```

---

## Costos Estimados

| Servicio | Free Tier | Costo si crece |
|---|---|---|
| **Convex** | Generoso (DB, functions, bandwidth) | ~$25/mes Pro |
| **Clerk** | Hasta 50,000 usuarios | $0.02/usuario después |
| **Vercel** | Serverless functions incluidas | Ya lo tienes |
| **Total MVP** | **$0/mes** | |

---

## Archivos que ya NO se necesitan

| Archivo | Razón |
|---|---|
| `supabase/schema.sql` | Reemplazado por `convex/schema.ts` |
| `api/stripe-webhook.js` | Legacy, marcado DEPRECATED |

No se eliminaron para mantener referencia histórica.

---

## Referencias

- [Convex Docs](https://docs.convex.dev/)
- [Convex + Vercel](https://docs.convex.dev/production/hosting/vercel)
- [Convex + Clerk Auth](https://docs.convex.dev/auth/clerk)
- [Clerk Dashboard](https://dashboard.clerk.com)
- [Convex Dashboard](https://dashboard.convex.dev)
