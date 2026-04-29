# Sisteco — Estado Actual del Proyecto

> Ultima actualizacion: 2026-03-04
> Esta es una snapshot del estado en esa fecha. Actualizar al inicio de cada nuevo proyecto.

---

## Milestone Actual: v1.0 — Pricing & Payments

### Resumen de progreso

| Fase | Status | Descripcion |
|---|---|---|
| Phase 1: Estrategia Financiera | COMPLETE | Benchmark, precios, margenes, proyecciones |
| Phase 2: Landing Page Improvements | COMPLETE | Navbar, bento, animaciones, comparativa, ROI, vision |
| Phase 3: Backend Pagos + Webhooks | PAUSED | Bloqueado por entidad legal / dLocal Go API |
| Phase 4: Frontend Checkout + Portal | PAUSED | Depende de Phase 3 |
| Phase 5: Testing y Go-Live | PAUSED | Depende de Phase 3 y 4 |

---

## Lo que esta LISTO y en produccion (sisteco.cl)

### Landing Page (index.html)
- [x] **Hero: "Somos Sisteco, la empresa agéntica de ventas"** ← NUEVO 2026-03-04
- [x] **Badge del hero enlaza a pagina de vision** ← NUEVO 2026-03-04
- [x] Navbar flotante pill (todas las 20 paginas)
- [x] Bento grid "Como Funciona" (dark, 5 cards)
- [x] Animaciones: orbs de fondo, ScrollTrigger GSAP, card glow, cursor glow
- [x] Tabla comparativa 4 columnas (Sisteco vs DIY vs SDR vs Nada)
- [x] Calculadora ROI interactiva (inputs: vendedores, ticket → output: ROI en CLP)
- [x] Seccion vision agentes autonomos (timeline 2026-2030) — *actualizado post-pivote a workflows-first (2026-03-15)*
- [x] CTA section limpia (stats reales, no inventados)
- [x] Footer compact horizontal (layout consistente en todas las paginas)

### Sub-paginas
- [x] `pages/soluciones.html` — 5 secciones con navegacion por pills
- [x] `pages/como-funciona.html` — Infra de 5 capas (workflows reales)
- [x] `pages/dashboard.html` — Mockup de dashboard consistente
- [x] `pages/vision.html` — Manifiesto + vision workflows-first + data layer Chile — *actualizado post-pivote (2026-03-15)* ← NUEVO 2026-03-04
- [x] `pages/sobre-nosotros.html` — 3 fundadores reales, metricas reales
- [x] `pages/contacto.html` — Info Chile (no Espana)
- [x] `pages/precios.html` — 3 planes con precios reales (USD 397/797/1,800)

### Backend
- [x] Migracion Supabase → Convex completada
- [x] Clerk configurado como auth provider
- [x] API routes: leads, demo, track, cron/send-drip
- [x] dLocal Go webhook handler
- [x] Convex schema: 6 tablas con indices

### Contenido / Datos
- [x] Marca limpia (sin referencias a Claude/Gemini/Kimi en el frontend)
- [x] Testimonios fake eliminados
- [x] Stats fake eliminadas (reemplazadas por capacidades reales)
- [x] Footer con contacto real de Chile en todas las paginas
- [x] Estrategia financiera documentada (FINANCIAL_STRATEGY.md)
- [x] Capacidades del sistema documentadas (CAPACIDADES_SISTECO.md)

---

## Lo que esta PENDIENTE (proximas sesiones)

### Bloqueado — Requiere accion externa

| Pendiente | Bloqueante | Como resolver |
|---|---|---|
| dLocal Go live mode | Entidad legal (SpA/EIRL) | Crear en portal.sii.cl — 24-48h |
| Facturacion DTE | Bsale account + entidad legal | Crear cuenta en bsale.cl |
| Stripe (alternativa) | KYC + entidad legal | Mismo que dLocal Go |

### Quick-start disponible (sin entidad legal)
- [ ] Crear cuenta Reveniu Starter — pago inmediato en CLP
- [ ] Crear 3 planes de pago en Reveniu dashboard
- [ ] Agregar links de Reveniu a precios.html (reemplaza botones sandbox)

### Phase 3 (pausada hasta resolver bloqueantes)
- [ ] `api/create-subscription.js` para dLocal Go
- [ ] `api/dlocalgo-webhook.js` completo con logica de subscripcion
- [ ] Actualizar `pages/precios.html` con checkout links reales

### P3 — Mejoras landing (siguiente milestone)
- [ ] Social proof / resultados reales (sin testimonios falsos)
- [ ] Hero animation (dashboard que se "actualiza en vivo")
- [ ] CTA con form inline (Apollo-style)
- [ ] Limpiar SVGs de brand no usados (claude.svg, gemini.svg, kimi.svg)

### Setup tecnico pendiente
- [ ] Crear cuenta Convex (npx convex dev en el proyecto)
- [ ] Verificar dominio sisteco.cl en Resend
- [ ] Configurar variables de entorno en Vercel (CONVEX_URL, CLERK_JWT_ISSUER_DOMAIN)

---

## Tech Debt conocido

| Deuda | Impacto | Prioridad |
|---|---|---|
| `api/stripe-webhook.js` es DEPRECATED | Bajo (no se usa) | Baja |
| Brand SVGs en assets/icons/ (claude.svg, etc.) no usados | Bajo | Baja |
| Phases 3-5 del milestone pausadas | Alto si se quiere monetizar | Alta cuando se resuelva legal |

---

## Variables de entorno pendientes de configurar

Estas variables estan en `.env.example` pero aun no tienen valores reales:

```
CONVEX_URL=??? (correr npx convex dev)
CLERK_JWT_ISSUER_DOMAIN=??? (crear app en clerk.com)
RESEND_API_KEY=??? (crear cuenta en resend.com + verificar dominio)
DLOCALGO_API_KEY=??? (crear cuenta en dlocalgo.com — necesita entidad legal)
REVENIU_LINK_*=??? (crear cuenta en reveniu.com — sin entidad legal)
```

**Lo que SÍ esta configurado (en Vercel produccion):**
- `SITE_URL=https://sisteco.cl`
- `CRON_SECRET` (para drip emails)
- `N8N_WEBHOOK_URL` y `N8N_AUTH_KEY` (si hay instancia n8n activa)

---

## Deploy

```bash
npx vercel --prod   # Deploy directo, sin git remote configurado
```

El proyecto NO tiene git remote configurado — se deploya via Vercel CLI directamente.

---

## Proximo milestone sugerido

Una vez resuelto el bloqueante de entidad legal:
- **Milestone v1.1:** Monetizacion real — Pagos con Reveniu o dLocal Go + DTE

Mientras tanto, el siguiente foco puede ser:
- **Milestone v1.1-alt:** Captacion de clientes — Leads piloto con Plan Fundadores + CRM setup

---

*Estado capturado: 2026-03-04*
