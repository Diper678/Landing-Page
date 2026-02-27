# STATE

milestone_version: v1.0
current_phase: 2
paused_at: null

## decisions
- decision: Cobrar en USD (no CLP) para posicionamiento premium y facilitar expansión LATAM
- decision: Stripe como procesador de pagos (opera en Chile desde 2021, mejor DX)
- decision: Precios: Base $397, Growth $797, Enterprise $1,800+ (margen bruto ~79%)
- decision: Descuento anual del 25% (no 20% como en mockup) — más atractivo
- decision: Plan Fundadores: 40% off para primeros 10 clientes a cambio de caso de estudio
- decision: Add-ons como módulos separados (no incluidos en plan base) para maximizar ARPU

## blockers
- blocker: Usuario debe crear cuenta Stripe y completar KYC antes de Phase 3/4
- blocker: Usuario debe crear Price IDs en Stripe Dashboard para las env vars
- blocker: Facturación SII Chile requiere software externo (Bsale, DTE) — fuera de scope inicial

## context
- Análisis financiero completo en .planning/research/FINANCIAL_STRATEGY.md
- Margen bruto promedio: 79% (superior al benchmark SaaS de 60-80%)
- Break-even operacional: ~4 clientes activos en cualquier plan
- Proyección MRR Q4 Año 1: USD 15,000-25,000 (escenario conservador)
