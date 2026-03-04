# Milestone v1.0 — Pricing & Payments

## Goal
Publicar precios reales basados en análisis financiero de mercado, integrar procesadores de pago para cobros recurrentes, y preparar el backend para gestión de suscripciones B2B en Chile con proyección LATAM.

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
- [x] Guía pasos procesador de pagos

---

### Phase 2 — Landing Page Improvements
**Goal:** Mejorar UX/UI del landing page con bento grid para "Cómo Funciona", navbar flotante, animaciones, comparativa comercial, calculadora ROI, y sección visión de agentes autónomos. Basado en análisis competitivo de Apollo, AmpleMarket, Firecrawl, Base10, HumbleOps.
**Status:** planned
**Requirements:** [NAV-01, NAV-02, NAV-03, BENTO-01, ANIM-01, ANIM-02, ANIM-03, ANIM-04, COMP-01, COMP-02, ROI-01, ROI-02, VIS-01, VIS-02]
**Plans:** 4 plans

Plans:
- [x] 02-01-PLAN.md — Floating navbar pill (all 20 pages) [Wave 1] -- DONE 2026-03-04
- [ ] 02-02-PLAN.md — Bento grid + animations (orbs, scroll reveals, card glow, cursor glow) [Wave 2]
- [ ] 02-03-PLAN.md — Comparison table + ROI calculator [Wave 3]
- [ ] 02-04-PLAN.md — Vision teaser + vision.html expansion [Wave 4]

---

### Phase 3 — Backend: API Pagos + Webhooks (PAUSED)
**Goal:** Crear endpoints serverless para checkout dLocal Go y procesar webhooks de suscripción.
**Status:** paused
**Note:** Depende de resolución de blockers (dLocal Go API suscripciones, IVA/DTE, contrato Transbank)

---

### Phase 4 — Frontend: Checkout Flow + Portal (PAUSED)
**Goal:** Conectar botones de pricing con checkout; página de éxito y portal del cliente.
**Status:** paused

---

### Phase 5 — Testing y Go-Live (PAUSED)
**Goal:** Validar flujo completo de pago; configurar producción.
**Status:** paused

---

## Implementation Notes

### Referencia análisis competitivo
- `.planning/LANDING_PAGE_IMPROVEMENTS.md` — 8 mejoras priorizadas con referencias por competidor

### Procesador de pagos (decisión actualizada)
- ~~Stripe~~ → dLocal Go (API) + Reveniu (fallback Chile)
- Checkout links ya implementados en precios.html (sandbox)
- Phases 3-5 pausados hasta resolver blockers de API suscripciones y IVA
