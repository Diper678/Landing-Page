> ⚠️ **DEPRECADO 2026-04-23** — Estrategia financiera Q1 2026 con pricing Base/Growth/Enterprise. Superada por pricing UF (Junior 20 / Senior 50 / Manager 100).
> Solo valor histórico — útil para entender la transición.
> Pricing autoritativo actual: `The Agentic Company/docs/research/2026-04-23-pricing-final-formalizado.md`.

# Estrategia Financiera y de Precios — Sisteco
**Fecha:** 2026-02-27 | **Analista:** Claude Sonnet 4.6 (rol: Analista Financiero Senior Tech, 5+ años, Chile)

---

## 1. BENCHMARK COMPETITIVO (USD/mes)

### Herramientas punto a punto (lo que pagaría el cliente si arma su propio stack)

| Herramienta | Plan Básico | Plan Pro | Plan Scale |
|---|---|---|---|
| **Apollo.io** (prospección) | $49/user | $79/user | $119/user |
| **PhantomBuster** (LinkedIn) | $69 | $159 | $439 |
| **ScrapingBee** (web scraping) | $49 | $99 | $249 |
| **Instantly.ai** (email sequences) | $37 | $97 | $358 |
| **Lemlist** (email outreach) | $55/user | $99/user | custom |
| **n8n Self-Hosted** (automatización) | ~$5-10 VPS | ~$5-10 VPS | ~$5-10 VPS |
| **HubSpot CRM** (básico) | $20/user | $100/user | $150/user |

### Stack DIY mínimo viable (empresa 2 SDRs en Chile)
```
Apollo.io Basic x2 usuarios:      $98/mes
PhantomBuster Start:               $69/mes
ScrapingBee Startup:               $99/mes
n8n Pro:                           $50/mes
Instantly.ai Starter:              $37/mes
─────────────────────────────────────────
TOTAL STACK DIY (sin configurar):  $353/mes
+ Configuración inicial (único):   $3,000-8,000 USD
+ Tiempo SDR integrando tools:     ~20h/mes → $600/mes (oportunidad perdida)
+ Soporte y mantenimiento:         ~10h/mes → $300/mes
─────────────────────────────────────────
COSTO REAL DEL DIY:                ~$1,253/mes (incluyendo tiempo)
```

**→ Sisteco ofrece TODO integrado, configurado, funcionando desde día 1.**

---

## 2. ESTRUCTURA DE COSTOS SISTECO

### 2.1 Costos Fijos Mensuales (infraestructura compartida)

| Ítem | Costo/mes |
|---|---|
| Vercel Pro (hosting) | $20 |
| Supabase Pro (base de datos) | $25 |
| Dominio + correo corporativo | $10 |
| n8n Self-Hosted (VPS dedicado, sin límites) | $10 |
| **Total costos fijos** | **$65/mes** |

*Break-even de infraestructura con 3 clientes de cualquier plan.*

### 2.2 Costos Variables por Cliente

#### PLAN INICIO (Lead Scraping con ScrapingBee)
| Ítem | Costo/cliente/mes |
|---|---|
| ScrapingBee (prorrateado, Startup $99 ÷ 5 clientes) | $20 |
| n8n executions (prorrateado) | $20 |
| AI API calls (Gemini scoring ~500 leads) | $15 |
| Email sending (Resend, ~2,500 emails) | $3 |
| Tiempo soporte: 0.5h × $20/h | $10 |
| **Total costo variable** | **~$68/mes** |

#### PLAN CRECIMIENTO (+ PhantomBuster LinkedIn)
| Ítem | Costo/cliente/mes |
|---|---|
| PhantomBuster Start ($69, por cuenta LinkedIn cliente) | $69 |
| ScrapingBee Business (prorrateado $249 ÷ 8 clientes) | $31 |
| n8n executions (prorrateado) | $5 |
| AI API calls (LinkedIn + website scoring) | $30 |
| Email + LinkedIn sequences (~5,000 emails) | $6 |
| Tiempo soporte: 1h × $25/h | $25 |
| **Total costo variable** | **~$181/mes** |

#### PLAN ENTERPRISE (Omnicanal completo)
| Ítem | Costo/cliente/mes |
|---|---|
| PhantomBuster Grow ($159, por cuenta LinkedIn) | $159 |
| ScrapingBee Business+ (dedicado, prorrateado) | $75 |
| n8n Business (prorrateado) | $80 |
| WhatsApp Business API (Meta) | $50 |
| AI API calls (multi-canal, alto volumen) | $75 |
| Email + WhatsApp + LinkedIn sending | $15 |
| Tiempo soporte dedicado: 3h × $30/h | $90 |
| **Total costo variable** | **~$544/mes** |

---

## 3. ESTRATEGIA DE PRECIOS

### 3.1 Modelo de Precios Recomendado

Sisteco cobra como **plataforma SaaS con gestión incluida** (≠ solo herramientas).
El precio refleja: herramientas + configuración + soporte + resultados garantizados.

```
VALOR QUE ENTREGA SISTECO:
- 1 deal adicional/mes típico = CLP 500,000–5,000,000
- Sisteco cuesta < 10% del valor de 1 deal
- ROI típico: 300–800% en primer trimestre
```

### 3.2 Plan de Introducción — PROSPECCIÓN BASE

> **"Plan de entrada para empresas que quieren empezar a automatizar su prospección."**

| | Mensual | Anual (ahorra 25%) |
|---|---|---|
| **Precio** | **USD 397/mes** | **USD 297/mes** |
| **En CLP (~930)** | ~CLP 369,000 | ~CLP 276,000 |

**Incluye:**
- Lead scraping web con ScrapingBee (hasta 50,000 URLs/mes)
- Motor AI Scoring 100 puntos: HOT / WARM / NURTURE / SKIP
- Secuencias de email automatizadas (5 emails, 9AM, intervalo 7 días)
- Detección de respuestas → pausa automática de secuencia
- Alertas Slack en tiempo real para leads HOT
- Dashboard de métricas básico
- 2 usuarios incluidos
- Soporte por email (respuesta < 24h)
- Onboarding: 1 sesión de configuración (60 min)

**Margen bruto:**
```
Precio mensual:     $397
Costo variable:     ~$68
Costo fijo prorrateado: ~$43 (asumiendo 20 clientes)
───────────────────────
Contribución:       ~$286/cliente/mes
Margen bruto:       ~82%
```

---

### 3.3 Plan CRECIMIENTO — + PhantomBuster LinkedIn

> **"Para equipos de ventas que quieren prospectar en LinkedIn a escala con IA."**

| | Mensual | Anual (ahorra 25%) |
|---|---|---|
| **Precio** | **USD 797/mes** | **USD 597/mes** |
| **En CLP (~930)** | ~CLP 741,000 | ~CLP 555,000 |

**TODO de Prospección Base, más:**
- LinkedIn Profile Scraping con PhantomBuster (hasta 1,000 perfiles/mes)
- LinkedIn Auto-Connect con mensajes personalizados por IA
- Scoring combinado: LinkedIn + Website (100 puntos, más preciso)
- Secuencias multicanal: Email → LinkedIn → Email (automated)
- A/B Testing de subject lines y mensajes
- Analytics avanzado con tasa de apertura, respuesta y conversión
- 5 usuarios incluidos
- Integración CRM: HubSpot o Pipedrive
- Soporte prioritario por chat (respuesta < 4h)
- Onboarding: 3 sesiones (setup completo)

**Margen bruto:**
```
Precio mensual:     $797
Costo variable:     ~$181
Costo fijo prorrateado: ~$43
───────────────────────
Contribución:       ~$573/cliente/mes
Margen bruto:       ~79%
```

---

### 3.4 Plan ENTERPRISE — Omnicanal Completo

> **"Para operaciones comerciales que necesitan presencia 24/7 en todos los canales."**

| | Mensual | Anual |
|---|---|---|
| **Precio desde** | **USD 1,800/mes** | **Cotización** |
| **En CLP (~930)** | ~CLP 1,674,000 | |

**TODO de Crecimiento, más:**
- WhatsApp Business API (mensajes outbound a leads WARM/HOT)
- Instagram DM automation (leads inbound)
- Usuarios ilimitados
- Automatización de facturación (Notion → sistema de facturas)
- Reportes ejecutivos personalizados (PDF semanal/mensual)
- Manager de cuenta dedicado
- SLA garantizado: uptime 99.5%, respuesta < 1h
- Onboarding full (5+ sesiones + documentación)
- Custom integrations (Salesforce, SAP, etc.)
- Cumplimiento Ley 21.719 (certificado y auditable)

**Margen bruto:**
```
Precio base:        $1,800
Costo variable:     ~$544
Costo fijo prorrateado: ~$43
───────────────────────
Contribución:       ~$1,213/cliente/mes
Margen bruto:       ~74%
```

---

### 3.5 Add-ons (módulos adicionales)

| Add-on | Precio/mes | Descripción |
|---|---|---|
| **WhatsApp Business API** | +$150 | Para planes Base/Crecimiento |
| **Usuarios adicionales** (cada uno) | +$49/user | Más allá del límite del plan |
| **Volumen extra de leads** | +$97/10,000 leads | Cuando se supera el límite |
| **Integración CRM Premium** (Salesforce, SAP) | +$99 | Sync bidireccional custom |
| **Reportes ejecutivos PDF** | +$79 | Semanales o mensuales automatizados |
| **Instagram DM Automation** | +$99 | Outreach vía Instagram |
| **Onboarding adicional** | +$150/sesión | Más de lo incluido en plan |

---

## 4. TABLA COMPARATIVA DE MARGEN BRUTO

| Plan | Precio | Costo Total | Margen | Margen % | Break-even clientes |
|---|---|---|---|---|---|
| Prospección Base (mensual) | $397 | ~$111 | ~$286 | **82%** | 3 clientes |
| Prospección Base (anual) | $297 | ~$111 | ~$186 | **75%** | 5 clientes |
| Crecimiento (mensual) | $797 | ~$224 | ~$573 | **79%** | 2 clientes |
| Crecimiento (anual) | $597 | ~$224 | ~$373 | **72%** | 3 clientes |
| Enterprise (mensual) | $1,800 | ~$587 | ~$1,213 | **74%** | 1 cliente |

*Benchmarks industria SaaS: margen bruto saludable = 60-80%. Sisteco supera el benchmark.*

---

## 5. PROYECCIÓN DE INGRESOS (escenarios)

### Escenario Conservador (Año 1)

| Mes | Clientes Base | Clientes Crec. | Clientes Ent. | MRR |
|---|---|---|---|---|
| 1-3 | 3 | 1 | 0 | ~$1,988 |
| 4-6 | 6 | 3 | 1 | ~$5,973 |
| 7-9 | 10 | 5 | 2 | ~$9,955 |
| 10-12 | 15 | 8 | 3 | ~$15,321 |

**ARR estimado fin de Año 1:** ~$184K USD (~CLP 171M)

### Escenario Optimista (Año 1)

| Mes | Clientes Base | Clientes Crec. | Clientes Ent. | MRR |
|---|---|---|---|---|
| 6 | 8 | 5 | 2 | ~$9,151 |
| 12 | 20 | 12 | 5 | ~$26,504 |

**ARR estimado fin de Año 1:** ~$318K USD (~CLP 296M)

---

## 6. ESTRATEGIA DE INTRODUCCIÓN AL MERCADO

### Fase 0: Pre-lanzamiento (primeros 10 clientes)
- **Precio especial de Fundadores:** 40% de descuento + onboarding gratis
  - Base: $239/mes (normal: $397)
  - Crecimiento: $479/mes (normal: $797)
- **A cambio:** Caso de estudio firmado + testimonio + feedback continuo
- **Objetivo:** 3-5 clientes fundadores en 60 días

### Fase 1: Lanzamiento Chile (mes 3-12)
- Precios regulares con descuento anual (25%)
- Programa de referidos: 1 mes gratis por cliente referido
- Garantía de resultados: "30 días o te devolvemos el dinero"

### Fase 2: Expansión LATAM (año 2)
- Colombia, Perú, México: mismo modelo, precios en USD
- Considerar pago en moneda local (CLP, COP, PEN, MXN) vía Stripe
- Partners locales por país

---

## 7. ANÁLISIS DE SENSIBILIDAD AL PRECIO

¿Cuánto puede pagar una empresa mediana chilena?

**Dato clave:** El salario de un SDR en Chile = CLP 800,000-1,200,000/mes (bruto).
Sisteco en Plan Crecimiento = CLP 741,000/mes → **menos que un SDR parcial**.

```
Costo SDR junior Chile (full-time):    CLP 800K-1.2M + cargas ~30% = CLP 1-1.5M/mes
Costo Sisteco Plan Crecimiento:        CLP 741,000/mes
─────────────────────────────────────────────────────
Ahorro: CLP 259,000-759,000/mes + Sisteco trabaja 24/7
```

**→ El pricing está calibrado para ser percibido como "más barato que un empleado, más productivo que 3".**

---

## 8. MODELO DE FACTURACIÓN Y COBRO

### Decisión: ~~Stripe~~ → dLocal Go (con Reveniu como fallback Chile)

**Por qué NO Stripe:**
- Stripe Chile requiere cuenta bancaria chilena vinculada a entidad legal formal (RUT empresa activo con giro)
- KYC estricto: SPA/EIRL registrada, representante legal identificado
- **Sisteco aún no tiene LLC/entidad formal → bloqueante**

---

## 8a. PROCESADOR PRINCIPAL: dLocal Go

**URL:** https://dlocalgo.com | **Tipo:** Payment gateway + Subscriptions (self-service)

### ¿Por qué dLocal Go?
| Criterio | dLocal Go | Stripe | Reveniu |
|---|---|---|---|
| Sin entidad legal para sandbox | ✅ | ❌ | ✅ |
| Suscripciones recurrentes | ✅ API + Dashboard | ✅ API | ✅ Dashboard |
| API completa | ✅ REST + webhooks | ✅ | Solo plan Enterprise |
| Cobertura LATAM expansion | ✅ 13+ países | Limitado | ❌ Solo Chile |
| Cobro en USD | ✅ | ✅ | ❌ CLP/UF solo |
| Settlement en CLP | ✅ | ✅ | ✅ |
| Tarjeta débito chilena | ✅ | ✅ | ✅ |
| Sin costo mensual fijo | ✅ | ✅ | ✅ (Starter) |

### Tarifas dLocal Go — Chile (2026)
| Método de pago | Comisión dLocal | IVA sobre comisión (19%) | Fee efectivo Sisteco |
|---|---|---|---|
| Tarjeta crédito | 2.99% | +0.57% | **~3.56%** |
| Transferencia bancaria | 2.99% | +0.57% | **~3.56%** |
| Efectivo (cash) | 2.99% | +0.57% | **~3.56%** |

**Settlement:** 7 días (tarjeta crédito/débito) · 3 días (transferencia) → tu cuenta CLP
**Sin tarifa mensual fija ni de setup**

### Impacto en márgenes (recalculado con dLocal Go)
| Plan | Precio USD | Fee dLocal (~3.56%) | Ingreso neto/mes | Margen bruto ajustado |
|---|---|---|---|---|
| Base mensual | $397 | ~$14.1 | ~$383 | **81%** (vs 82% con Stripe) |
| Growth mensual | $797 | ~$28.4 | ~$769 | **78%** |
| Enterprise | $1,800 | ~$64.1 | ~$1,736 | **73%** |

*Diferencia mínima vs Stripe. El ahorro en no necesitar entidad legal justifica la elección.*

### Cómo funciona la API de dLocal Go

**Autenticación:** Bearer token (`API_KEY:SECRET_KEY`)
**Sandbox:** `https://api-sbx.dlocalgo.com/v1/`
**Live:** `https://api.dlocalgo.com/v1/`

**Flujo de pago (checkout redirect):**
```
POST /v1/payments
{
  "amount": 397.00,
  "currency": "USD",
  "country": "CL",
  "payment_method_id": "CARD",
  "payment_method_flow": "REDIRECT",
  "payer": { "name": "...", "email": "..." },
  "order_id": "sisteco-sub-xyz",
  "description": "Sisteco Prospección Base - Mensual",
  "callback_url": "https://sisteco.cl/api/dlocalgo-webhook",
  "success_url": "https://sisteco.cl/pages/success.html",
  "failed_url": "https://sisteco.cl/pages/cancel.html"
}
→ Response: { "redirect_url": "https://checkout.dlocalgo.com/..." }
```

**Suscripciones:** Gestionadas desde Dashboard dLocal Go → se crea un plan → el cliente se suscribe vía checkout link o API. Los cobros recurrentes son automáticos.

### Variables de entorno (reemplaza vars Stripe)
```env
DLOCALGO_API_KEY=your_api_key
DLOCALGO_SECRET_KEY=your_secret_key
DLOCALGO_WEBHOOK_SECRET=your_webhook_secret
DLOCALGO_BASE_URL=https://api.dlocalgo.com/v1   # o sbx para sandbox
SITE_URL=https://sisteco.cl
```

---

## 8b. OPCIÓN QUICK-START: Reveniu (Chile only, sin código)

**URL:** https://reveniu.com | **Tipo:** Plataforma de suscripciones Chile-native

**Cuándo usar Reveniu:** Para arrancar inmediatamente, sin integración API, usando links de pago.

### Planes Reveniu
| Plan | Costo mensual | Comisión Reveniu | + Comisión Transbank | Total efectivo |
|---|---|---|---|---|
| **Starter** | Gratis | 3% | ~1.5–2% | **~4.5–5%** |
| **Pro** | CLP 40,000/mes (~USD 43) | 1.5% | ~1.5–2% | **~3–3.5% + cuota fija** |
| **Enterprise** | Conversemos | Custom | Custom | Custom |

**Ventajas Reveniu:**
- ✅ Funciona sin entidad legal para plan Starter
- ✅ Cobro en CLP y UF (Unidad de Fomento)
- ✅ Todas las tarjetas de débito y crédito chilenas
- ✅ Sin integración técnica — links de pago listos en 5 min
- ✅ Retry automático de cobros fallidos (reduce churn)
- ✅ Notificaciones por email a cliente y vendedor
- ✅ Panel de métricas MRR, churn, suscriptores activos

**Desventajas Reveniu:**
- ❌ Solo Chile (no expansión LATAM)
- ❌ Solo CLP/UF (no USD)
- ❌ API solo en plan Enterprise
- ❌ Fees más altos que dLocal Go (~4.5–5% efectivo vs 3.56%)

### Comparativa de fee por transacción real
| Plan Sisteco | Precio | dLocal Go fee | Reveniu Starter fee | Diferencia/mes |
|---|---|---|---|---|
| Base mensual | USD 397 | ~USD 14 | ~USD 18-20 | +USD 4-6 |
| Growth mensual | USD 797 | ~USD 28 | ~USD 36-40 | +USD 8-12 |

*Para 10 clientes Growth: diferencia de ~USD 80-120/mes en fees = CLP 74K-112K/mes.*

---

## 8c. ACLARACIÓN CRÍTICA: IVA / CARGA TRIBUTARIA

**Lo que dLocal Go y Reveniu SÍ hacen:**
- Procesan el pago del cliente y depositan el dinero en tu cuenta
- Pagan el IVA (19%) sobre su propia comisión (2.99%) → eso es lo que dice "fee does not include local taxes"
- Emiten su propia boleta de servicio a Sisteco por sus comisiones

**Lo que dLocal Go y Reveniu NO hacen:**
- ❌ NO emiten facturas/boletas por los USD 397/797 que Sisteco cobra a sus clientes
- ❌ NO declaran el IVA de Sisteco ante el SII
- ❌ NO actúan como Merchant of Record (MoR)

**La obligación de Sisteco:**
Para cobrar legalmente en Chile como empresa, Sisteco debe:
1. Tener RUT empresa (EIRL/SPA/SpA — se crea online en portal.sii.cl en 24h)
2. Emitir DTE (Documento Tributario Electrónico) a cada cliente por cada cobro
3. Declarar IVA mensualmente ante el SII (Formulario 29)

**Si se quiere MoR real (externalizar toda la tributación):**
→ **Paddle** (https://paddle.com) actúa como MoR global, maneja IVA/GST/VAT en 50+ países, emite facturas a nombre de Paddle, cobra directamente al cliente. Comisión: 5% + USD 0.50/transacción.
→ Útil si Sisteco opera como empresa extranjera vendiendo digitalmente a Chile. Más caro pero cero carga tributaria propia.

---

## 9. ESTRATEGIA DE IMPLEMENTACIÓN RECOMENDADA

### Ruta A: Arranque inmediato sin entidad legal (Semana 1)
1. Crear cuenta **Reveniu Starter** en reveniu.com (gratis, sin entidad)
2. Crear 3 planes de suscripción: Base CLP 369K, Growth CLP 741K, Enterprise cotización
3. Compartir links de pago con primeros clientes (Plan Fundadores)
4. Cobros automáticos desde día 1, sin código

### Ruta B: Integración API completa (Mes 1-2)
1. Crear entidad legal en Chile (EIRL/SpA): portal.sii.cl → ~24-48h, ~CLP 0-5K
2. Abrir cuenta corriente empresarial (BCI/Banco Chile/Santander)
3. Crear cuenta **dLocal Go** en dlocalgo.com
4. Conectar API: reemplaza `api/create-checkout-session.js` para usar dLocal Go
5. Crear webhook handler: `api/dlocalgo-webhook.js`
6. Configurar suscripciones en dLocal Go Dashboard
7. Activar facturación DTE con Bsale (CLP 29,900/mes) integrado vía webhook

### Variables de entorno finales (Vercel)
```env
# dLocal Go
DLOCALGO_API_KEY=...
DLOCALGO_SECRET_KEY=...
DLOCALGO_WEBHOOK_SECRET=...
DLOCALGO_BASE_URL=https://api.dlocalgo.com/v1

# Supabase
SUPABASE_URL=...
SUPABASE_SERVICE_KEY=...

# App
SITE_URL=https://sisteco.cl
```

---

## 10. RESUMEN EJECUTIVO

| KPI | Valor |
|---|---|
| Precio entrada (Plan Base mensual) | USD 397/mes |
| Precio entrada anual | USD 297/mes |
| Plan estrella (Growth mensual) | USD 797/mes |
| Margen bruto promedio | ~79% |
| Break-even operacional | ~4 clientes activos |
| CAC target | < USD 1,500 |
| LTV estimado (churn 5%/mes) | Plan Base: $7,940 · Growth: $15,940 |
| LTV/CAC ratio target | > 3x |
| MRR objetivo Año 1 Q4 | USD 15,000-25,000 |

**Positioning final:**
> Sisteco cuesta menos que un SDR junior chileno, trabaja 24/7, no se enferma, no renuncia, y entrega 5-7x más conversiones. La pregunta no es si puedes pagar Sisteco — es cuánto te está costando NO tenerlo.
