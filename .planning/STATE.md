# STATE

milestone_version: v1.0
current_phase: 3
paused_at: null

## decisions
- decision: Cobrar en USD (no CLP) para posicionamiento premium y facilitar expansión LATAM
- decision: ~~Stripe~~ → PROCESADOR: dLocal Go (API) como principal; Reveniu como opción fallback/quick-start Chile
- decision: dLocal Go elegido por: sin entidad legal obligatoria para sandbox, cobertura 13+ países LATAM, API robusta, 2.99% por transacción tarjeta, sin costo mensual fijo
- decision: Reveniu disponible como opción "quick start" sin código (Plan Starter gratuito, 3%+Transbank) para arrancar antes de integración API
- decision: Precios: Base $397, Growth $797, Enterprise $1,800+ (margen bruto ~79%)
- decision: Descuento anual del 25% — más atractivo que el 20% del mockup original
- decision: Plan Fundadores: 40% off para primeros 10 clientes a cambio de caso de estudio
- decision: Add-ons como módulos separados para maximizar ARPU

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
