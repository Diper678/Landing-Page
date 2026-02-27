# Sisteco — Pricing & Payments Milestone

## Project Vision
Sisteco es una plataforma SaaS B2B de automatización de ventas para empresas medianas chilenas (50+ empleados). Este milestone implementa la estrategia de precios real (reemplazando los mockup prices), conecta Stripe para cobros recurrentes, y sienta las bases para escalar a LATAM e internacionalmente.

## Business Context
- **Modelo:** SaaS + Managed Automation (hybríd)
- **Target primario:** Empresas 50+ empleados en Chile, Sector: ventas B2B
- **Target secundario (Q3 2026+):** Colombia, Perú, México
- **Moneda de cobro:** USD (estándar en SaaS regional)
- **Ciclo de facturación:** Mensual y Anual (20% descuento anual)
- **Procesador de pagos:** Stripe (Stripe Checkout + Billing)

## Milestone Goal
Implementar pricing real basado en análisis financiero de mercado, integrarlo con Stripe para cobros automáticos, y actualizar la página de precios con los planes definitivos.

## Success Criteria
- [ ] Precios reales publicados en precios.html (sin mockup numbers)
- [ ] Stripe configurado con 3 productos + add-ons
- [ ] Checkout funcional (mensual/anual)
- [ ] Webhook de Stripe conectado a Supabase
- [ ] Portal del cliente para gestionar suscripción
- [ ] Footer de precios.html corregido (Santiago, no Madrid)
