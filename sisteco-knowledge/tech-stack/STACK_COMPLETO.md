# Sisteco — Tech Stack Completo

> Esta es la lista exhaustiva de todas las tecnologias que usamos en Sisteco, como se conectan entre si, y por que elegimos cada una.

---

## Stack de Produccion

### Frontend
| Tecnologia | Version | Rol |
|---|---|---|
| HTML5 | — | Estructura de todas las paginas |
| CSS3 | — | Estilos (style.css ~2970 lineas, css/pages.css ~1700 lineas) |
| JavaScript (vanilla) | ES2022+ | Logica frontend, form handling, animaciones |
| GSAP | 3.12.7 | Animaciones: ScrollTrigger, stagger, fadeInUp |
| Lucide Icons | 0.468.0 | Sistema de iconos (via CDN) |

**Fuentes:**
- Sharp Grotesk — headings (via @font-face)
- Source Sans 3 — body (via Google Fonts)
- Nasalization — logo "Sisteco" (via @font-face)
- JetBrains Mono — labels tecnicos

### Backend / API
| Tecnologia | Uso |
|---|---|
| **Vercel** | Hosting + Serverless Functions (API Routes) |
| **Express.js 5** | Servidor local de desarrollo |
| **Convex** v1.32+ | Base de datos reactiva en la nube (reemplaza Supabase) |
| **Clerk** | Autenticacion (Email + Google OAuth, gratis hasta 50K usuarios) |
| **Resend** | Envio de emails transaccionales y secuencias drip |

### Automatizacion / Workflows
| Tecnologia | Uso |
|---|---|
| **n8n Self-Hosted** | Motor de automatizacion (VPS dedicado, sin limites, ~$10/mes) |
| **PhantomBuster** | LinkedIn scraping, auto-connect |
| **ScrapingBee** | Web scraping B2B |
| **Firecrawl** | Web crawling avanzado |

### AI / Scoring
| Tecnologia | Modelo | Uso |
|---|---|---|
| **Anthropic Claude** | claude-sonnet-4-6 | Sistemas, arquitectura, codigo (Claude Code) |
| **Google Gemini** | Gemini Pro/Flash | Lead scoring, personalizacion de emails |

### Pagos
| Tecnologia | Uso |
|---|---|
| **dLocal Go** | Procesador de pagos LATAM con API completa |
| **Reveniu** | Quick-start Chile-only (sin codigo, links de pago) |

### Rate Limiting (opcional)
| Tecnologia | Uso |
|---|---|
| **Upstash Redis** | Rate limiting en API routes |

---

## Diagrama de Arquitectura

```
[Usuario] → [Landing Page HTML/CSS/JS] → [Vercel Serverless API]
                                                    ↓
                                            [Convex DB Cloud]
                                                    ↓
                          ┌─────────────────────────┘
                          ↓                ↓              ↓
                     [api/leads.js]  [api/demo.js]  [api/track.js]
                          ↓
                    [Resend Email]
                          ↓
                   [n8n Self-Hosted]
                    /      |      \
              [PhantomBuster] [ScrapingBee] [Gemini AI]
                              ↓
                    [Output: Slack, CRM, Notion]
```

---

## Convex — Base de Datos

**Tablas en `convex/schema.ts`:**

| Tabla | Proposito |
|---|---|
| `leads` | Emails capturados, UTM, source, user agent |
| `ctaClicks` | Tracking de clicks por boton |
| `demoRequests` | Solicitudes de demo (empresa, tamano, status) |
| `emailSequence` | Queue de emails drip (scheduled, sent, failed) |
| `subscriptions` | Suscripciones de pago (dLocal Go) |
| `users` | Usuarios Clerk (clerkId, email, nombre) |

**Indices clave:**
- `leads.by_email` — upsert sin duplicados
- `ctaClicks.by_button_id` — analytics por boton
- `emailSequence.by_lead_status` — cron de drip emails
- `subscriptions.by_payment_id` — webhook de pagos

**Patrón de upsert (no nativo en Convex):**
```typescript
const existing = await ctx.db
  .query("leads")
  .withIndex("by_email", (q) => q.eq("email", args.email))
  .unique();

if (existing) {
  await ctx.db.patch(existing._id, { ...updates });
} else {
  await ctx.db.insert("leads", { ...data });
}
```

---

## Clerk — Autenticacion

**Configuracion:**
- Metodos: Email + Google OAuth
- Integracion: `convex/auth.config.ts` configura Clerk como provider
- Webhook: `convex/http.ts` → `/clerk-webhook` sincroniza usuarios
- Eventos: `user.created`, `user.updated`, `user.deleted`

**Flujo de auth:**
```
[Usuario hace login con Clerk]
    ↓
[Clerk emite JWT]
    ↓
[JWT validado en Convex via CLERK_JWT_ISSUER_DOMAIN]
    ↓
[Webhook sincroniza usuario a tabla users en Convex]
```

---

## Vercel — Hosting y Deploy

**Configuracion (`vercel.json`):**
- `buildCommand: "npx convex deploy"` — despliega schema y funciones Convex antes de build
- API routes en `/api/` son serverless functions
- Cron job: `api/cron/send-drip.js` para secuencias de email

**Deploy:**
```bash
npx vercel --prod
```

**Variables de entorno en Vercel Dashboard:**
- `CONVEX_URL`
- `CLERK_JWT_ISSUER_DOMAIN`
- `CONVEX_DEPLOY_KEY`
- `RESEND_API_KEY`
- `DLOCALGO_API_KEY`, `DLOCALGO_SECRET_KEY`, `DLOCALGO_WEBHOOK_SECRET`
- `CRON_SECRET`
- `SITE_URL=https://sisteco.cl`

---

## n8n Self-Hosted — Motor de Automatizacion

**Por que self-hosted (no n8n Cloud):**
- Sin limites de ejecuciones mensuales
- Control total de datos (importante para Ley 21.719)
- Costo fijo: ~$10/mes en VPS dedicado
- Integraciones ilimitadas

**Workflows activos:**
1. LinkedIn Lead Scoring (PhantomBuster → ScrapingBee → Gemini → HOT/WARM/NURTURE/SKIP)
2. B2B Email Sequences (5 emails, 9AM, 7 dias, deteccion de respuestas)
3. Facturacion Automatica (Notion → sistema de facturas)

**Autenticacion webhook n8n:**
```env
N8N_WEBHOOK_URL=https://tu-instancia.n8n.cloud/webhook/sisteco-orchestration
N8N_AUTH_KEY=your_key
```

---

## Resend — Email

**Uso:**
- Emails transaccionales (confirmacion de lead, demo)
- Secuencias drip (5 emails, 7 dias de intervalo)
- Templates en `api/lib/email-templates.js`

**Configuracion:**
```env
RESEND_API_KEY=re_...
FROM_EMAIL=Sisteco <hola@sisteco.cl>
```

---

## Herramientas de Desarrollo

| Herramienta | Rol |
|---|---|
| **Claude Code** | Sistema de inteligencia — logica, APIs, CSS, HTML, content strategy, arquitectura de workflows |
| **GSD (Get Shit Done)** | Metodologia de planificacion y ejecucion de fases |
| **Gemini 3 en Antigravity IDE** | Diseno visual, SVG, layout polish |
| **Git** | Control de versiones |
| **Vercel CLI** | Deploy directo sin git remote |

---

## Comandos utiles

```bash
# Desarrollo local
npm start                # Express server → http://localhost:3000
npm run dev              # Convex dev + Express juntos

# Convex
npx convex dev           # Modo desarrollo con hot reload
npx convex deploy        # Deploy de schema y funciones a Convex Cloud

# Deploy a produccion
npx vercel --prod

# Setup de planes de pago
node -r dotenv/config api/setup-dlocalgo-plans.js
```

---

## Costos de Infraestructura (mensuales)

| Servicio | Costo | Notas |
|---|---|---|
| Vercel Pro | $20 | Hosting + serverless functions |
| Convex | $0-25 | Free tier generoso, Pro ~$25 |
| Clerk | $0 | Gratis hasta 50K usuarios |
| n8n VPS | $10 | Self-hosted, sin limites |
| Dominio + correo | $10 | sisteco.cl |
| Resend | $0-20 | Free tier: 100 emails/dia |
| **Total** | **~$65/mes** | Break-even con 3 clientes |

---

*Ultima actualizacion: 2026-03-04 (post-migracion Supabase → Convex)*
