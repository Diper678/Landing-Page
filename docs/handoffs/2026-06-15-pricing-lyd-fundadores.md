# Pricing LYD — Plan Fundadores USD 500/mes (2026-06-15)

## Decisión

El precio público de LYD (solución de leadgen de Sisteco) es el **Plan Fundadores: USD 500/mes**.

- Es el **sistema de leads autoservicio** para los primeros clientes.
- Cobro **mensual, sin permanencia**. Cancela cuando quieras.
- En Chile se factura en CLP al equivalente del día, con IVA incluido y DTE válido ante el SII.
- A cambio del precio fundador, el cliente participa como **caso de estudio** + feedback.
- Funciona como **ancla de entrada**: alcances mayores (más volumen, multicanal coordinado,
  varios perfiles de ICP) se cotizan en un **plan a tu medida**, no con precio público fijo.

## Dónde quedó reflejado (3 fuentes coherentes)

| Fuente | Qué dice |
|--------|----------|
| `pages/precios.html` | Hero "Plan Fundadores · desde USD 500/mes · sin permanencia"; sección reencuadrada a "un precio de entrada, y de ahí a tu medida"; FAQ JSON-LD "¿Cuánto cuesta LYD?" = USD 500/mes; meta tags actualizados |
| `pages/soluciones.html` | Tarjeta LYD con badge "Desde USD 500/mes" |
| `llms.txt` | Sección Pricing = Plan Fundadores USD 500/mes + Planes a medida; FAQ y diferenciadores alineados; eliminados Junior/Senior/Manager |
| `mirrors/precios.md` | Plan Fundadores USD 500/mes + Planes a medida; eliminados Junior/Senior/Manager |
| `api/create-checkout-session.js` | Plan key `lyd_fundadores` = USD 500; comentario autoritativo |
| `.env.example` | `DLOCALGO_PLAN_LYD_FUNDADORES` (pendiente generar ID real) |

## Eliminado (stale)

Planes **Junior (20 UF) / Senior (50 UF) / Manager (~100 UF)** con sus tarifas viejas, en
`llms.txt` y `mirrors/precios.md`. También: Plan Gratis (10 leads), add-ons SaaS por-lead/por-seat,
"40% descuento permanente" del Fundadores, "prueba gratis 14 días", referencias a Reveniu (deprecado).

## ⚠️ Hilo abierto — NO hardcodear todavía

Existe una **propuesta en conversación** de subir el precio a **~USD 700/mes tras la primera
llamada** (precio post-call vs. precio de entrada). **Aún no está confirmado.**

- **NO** está en precio público (web, llms.txt, mirrors).
- **NO** está en el checkout (`create-checkout-session.js` cobra USD 500 para `lyd_fundadores`).
- Queda **solo documentado acá** hasta que Felipe lo confirme.

Cuando se decida: actualizar las mismas 3 fuentes públicas + backend de forma coherente, o
modelar dos price points (entrada USD 500 / post-call ~USD 700) si conviven.

## Compliance

Se mantuvo intacta la coherencia **Ley 21.719** verificada antes del pivote (RAT por cliente,
trazabilidad día uno, drip con métricas inventadas sigue desactivado). Ningún cambio de pricing
toca el flujo de compliance.

## Pendiente operativo (Felipe)

- [ ] Generar plan/link de pago real (dLocal Go y/o Flow.cl) y pegar el ID en `DLOCALGO_PLAN_LYD_FUNDADORES`.
- [ ] Decidir el hilo ~USD 700 post-call.
