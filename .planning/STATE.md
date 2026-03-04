# STATE

milestone_version: v1.0
current_phase: 2
current_plan: 4
total_plans_in_phase: 4
paused_at: null
last_session: 2026-03-04T23:17:21Z
stopped_at: Completed 02-03-PLAN.md

## decisions
- decision: Cobrar en USD (no CLP) para posicionamiento premium y facilitar expansión LATAM
- decision: ~~Stripe~~ → PROCESADOR: dLocal Go (API) como principal; Reveniu como opción fallback/quick-start Chile
- decision: dLocal Go elegido por: sin entidad legal obligatoria para sandbox, cobertura 13+ países LATAM, API robusta, 2.99% por transacción tarjeta, sin costo mensual fijo
- decision: Reveniu disponible como opción "quick start" sin código (Plan Starter gratuito, 3%+Transbank) para arrancar antes de integración API
- decision: Precios: Base $397, Growth $797, Enterprise $1,800+ (margen bruto ~79%)
- decision: Descuento anual del 25% — más atractivo que el 20% del mockup original
- decision: Plan Fundadores: 40% off para primeros 10 clientes a cambio de caso de estudio
- decision: Add-ons como módulos separados para maximizar ARPU
- decision: Phase 2 pivotada a Landing Page Improvements (navbar, animaciones, comparativa, ROI calculator, visión agentes)
- decision: Phases 3-5 (pagos backend) pausadas hasta resolver blockers
- decision: Navbar floating aplica a TODAS las 20 páginas
- decision: Animaciones FULL: gradient orbs + GSAP scroll + card glow + cursor glow
- decision: Tabla comparativa 4 columnas (Sisteco vs DIY vs SDR vs Nada) en index.html, mantener DIY en precios.html
- decision: ROI calculator interactiva en index.html
- decision: Visión agentes autónomos: teaser index.html + versión completa vision.html
- decision: Animate .container not .navbar for pill effect to preserve position:sticky context
- decision: 50px border-radius + 900px max-width for pill shape; mobile override at 768px removes pill
- decision: Bento hero card mini flow diagram with animated dot connectors (flowPulse keyframe)
- decision: Cursor glow at z-index:1 coexists with custom cursor ring at z-index:10000
- decision: All bento/orb animations guard prefers-reduced-motion with opacity:1 fallback
- decision: CSS grid-based comparison table (not HTML table) for responsive control
- decision: ROI calculator uses conservative 3% conversion rate and USD/CLP rate of 900
- decision: CLP formatting via toLocaleString es-CL for Chilean market

## blockers
- blocker: Confirmar con dLocal Go soporte si API de suscripciones es accesible en plan self-service (vs solo dashboard)
- blocker: IVA Chile — dLocal Go NO gestiona IVA de Sisteco ante SII; Sisteco debe emitir DTE (boleta/factura electrónica) por separado con Bsale u otro emisor
- blocker: Para cobros en CLP vía Reveniu Pro se necesita contrato Transbank (requiere RUT empresa)

## clarifications
- ACLARACIÓN IVA: dLocal Go "no incluye impuestos locales en su comisión" significa que ellos pagan el IVA sobre su propia comisión (2.99% × 19% IVA = 0.57% adicional que paga dLocal a SII). Sisteco SIGUE siendo responsable de sus propias obligaciones tributarias (IVA de ventas) ante SII.
- Si se quiere que el procesador actúe como Merchant of Record (MoR) y gestione el IVA de Sisteco, la alternativa real sería Paddle.com (MoR global para SaaS) — analizado en FINANCIAL_STRATEGY.md sección 8b.

## context
- Análisis financiero v2 con comparativa de procesadores en .planning/research/FINANCIAL_STRATEGY.md
- Nueva guía de implementación en .planning/PAYMENT_SETUP.md
- Margen bruto promedio: 79% (superior al benchmark SaaS de 60-80%)
- Break-even operacional: ~4 clientes activos en cualquier plan
- Proyección MRR Q4 Año 1: USD 15,000-25,000 (escenario conservador)
- Análisis competitivo landing page en .planning/LANDING_PAGE_IMPROVEMENTS.md
- precios.html ya tiene precios reales, toggle, add-ons, founders banner, checkout links (Phase 2 original completada)
