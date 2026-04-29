# Sisteco — Integraciones con Servicios de Terceros

> Catalogo de todas las integraciones de terceros que usa o planea usar Sisteco.

---

## Extraccion de Datos

### PhantomBuster
- **URL:** phantombuster.com
- **Uso:** Extraccion de perfiles LinkedIn, auto-connect con mensajes personalizados
- **Plan actual:** Start ($69/mes por cuenta LinkedIn de cliente)
- **Plan Enterprise:** Grow ($159/mes)
- **Casos de uso:**
  - LinkedIn Profile Scraper: hasta 1,000 perfiles/mes (Start)
  - LinkedIn Auto-Connect: mensajes personalizados por IA
  - Sales Navigator Scraper (si el cliente tiene Sales Navigator)
- **Limitacion clave:** Una cuenta PhantomBuster por cuenta LinkedIn (no compartir entre clientes)

### ScrapingBee
- **URL:** scrapingbee.com
- **Uso:** Web scraping de websites de empresas (extraer info de negocio)
- **Plan actual:** Startup ($99/mes, prorrateado entre ~5 clientes)
- **Plan Enterprise:** Business ($249/mes, hasta 8 clientes en paralelo)
- **Casos de uso:**
  - Scraping de pagina de empresa (descripcion, industria, tamano)
  - Extraccion de info de contacto (emails, telefonos)
  - Verificacion de stack tecnologico
- **Ventaja:** Maneja JavaScript, proxies rotativos, headless browser

### Firecrawl
- **URL:** firecrawl.dev
- **Uso:** Web crawling avanzado (crawl de sitios completos, no solo paginas individuales)
- **MCP disponible:** Si (ver mcps/FIRECRAWL_MCP.md)
- **Casos de uso:**
  - Crawl de sitio completo de empresa target
  - Extraccion de datos estructurados de multiples paginas
  - Ideal para empresas con mucho contenido web

---

## IA y Scoring

### Google Gemini
- **Uso:** Motor de scoring de leads (100 puntos), personalizacion de emails
- **Modelo preferido:** Gemini Pro / Flash (equilibrio costo-velocidad)
- **Costo estimado:** ~$15-75/cliente/mes segun volumen
- **Casos de uso:**
  - Analizar perfil LinkedIn + website → score 0-100
  - Generar emails personalizados (subject + cuerpo)
  - Clasificar HOT/WARM/NURTURE/SKIP

### Anthropic Claude
- **Modelo:** claude-sonnet-4-6 (modelo principal de trabajo con Claude Code)
- **Uso primario:** Desarrollo y arquitectura (no en workflows de produccion por costo)
- **Casos de uso en produccion (si aplica):**
  - Analisis de respuestas complejas de leads
  - Generacion de propuestas comerciales personalizadas
  - Clasificacion de intencion de compra

---

## Comunicacion y Canales

### Resend (Email)
- **URL:** resend.com
- **Uso:** Envio de emails transaccionales y secuencias drip
- **Free tier:** 100 emails/dia
- **Configuracion:**
  ```
  RESEND_API_KEY=re_...
  FROM_EMAIL=Sisteco <hola@sisteco.cl>
  ```
- **Templates en:** `api/lib/email-templates.js`

### Slack
- **Uso:** Alertas en tiempo real al equipo de ventas
- **Cuando se usa:**
  - Lead calificado como HOT → alerta inmediata
  - Lead responde un email → alerta al vendedor
  - Deal cerrado → notificacion al equipo
- **Integracion:** Via n8n o Slack Webhook URL directo

### WhatsApp Business API (Meta)
- **Plan:** Solo en Plan Enterprise ($50/mes extra en costos variables)
- **Uso:** Mensajes outbound a leads WARM/HOT
- **Configuracion:** Via Meta Business Suite + API oficial
- **Nota:** Requiere template messages aprobados por Meta para outbound

### LinkedIn (via PhantomBuster)
- **Uso:** Auto-connect + mensajes de prospeccion
- **Limitaciones LinkedIn:** ~200 conexiones/semana por cuenta (limite de seguridad)
- **Buenas practicas:** Mensajes de conexion cortos (<200 caracteres), sin pitching directo

### Instagram DM
- **Plan:** Solo Enterprise / como add-on (+$99/mes)
- **Uso:** Automation de DMs de inbound (leads que llegan por Instagram)
- **Estado:** Planificado, no implementado aun

---

## CRM

### HubSpot
- **Planes clientes:** Incluido en Plan Crecimiento y Enterprise
- **Integracion:** Sync bidireccional via API + n8n
- **Datos que se sincronizan:**
  - Lead nuevo → Contacto en HubSpot
  - Email enviado → Activity en HubSpot
  - Respuesta → Deal update en HubSpot
  - Score → Custom property en HubSpot

### Pipedrive
- **Alternativa a HubSpot** para clientes que lo prefieren
- **Misma logica de integracion** via n8n

### Notion
- **Uso interno:** Pipeline de deals de Sisteco, trigger para facturacion automatica
- **No para clientes** (a menos que el cliente ya use Notion como CRM)

---

## Pagos

### dLocal Go (Principal — API)
- **URL:** dlocalgo.com
- **Sandbox:** dashboard-sbx.dlocalgo.com
- **Cobertura:** 13+ paises LATAM (Chile, Mexico, Colombia, Peru, etc.)
- **Fees:** ~3.56% efectivo (comision 2.99% + IVA sobre comision)
- **Capacidades:** Suscripciones recurrentes, webhooks, API REST completa
- **Requiere:** Entidad legal en Chile para cuenta live
- **Flujo de pago:**
  ```
  POST /v1/payments {amount, currency:"USD", country:"CL", ...}
  → Response: {redirect_url: "https://checkout.dlocalgo.com/..."}
  → Usuario paga
  → Webhook: https://sisteco.cl/api/dlocalgo-webhook
  ```

### Reveniu (Quick-Start — Chile only)
- **URL:** reveniu.com
- **Uso:** Quick start sin codigo — links de pago directos
- **Fees:** ~4.5-5% efectivo
- **Ventaja:** Funciona sin entidad legal formal (plan Starter gratuito)
- **Limitacion:** Solo Chile, solo CLP/UF, sin API en planes basicos

### Bsale (Facturacion DTE)
- **URL:** bsale.cl
- **Costo:** CLP 29,900/mes
- **Uso:** Emision de facturas electronicas (DTE) requeridas por SII Chile
- **Integracion:** Via API + n8n webhook

---

## Hosting e Infraestructura

### Vercel
- **Plan:** Pro ($20/mes)
- **Uso:** Hosting de landing page + Serverless Functions (API routes)
- **Deploy:** `npx vercel --prod`
- **Cron jobs:** Via `vercel.json` con `CRON_SECRET`

### Convex
- **URL:** convex.dev
- **Plan:** Free tier (generoso) → Pro ~$25/mes
- **Uso:** Base de datos reactiva en la nube
- **Deploy:** `npx convex deploy`

### Clerk
- **URL:** clerk.com
- **Plan:** Free (hasta 50,000 usuarios activos mensuales)
- **Uso:** Autenticacion (Email + Google OAuth)
- **Costo cuando crece:** $0.02/usuario/mes mas alla de 50K

### Upstash Redis (Rate Limiting)
- **URL:** upstash.com
- **Plan:** Free tier suficiente para MVP
- **Uso:** Rate limiting en API routes (prevenir spam/abuse)

---

## Busqueda e Investigacion (para uso interno)

### Perplexity (via MCP)
- **MCP disponible:** Si (ver mcps/PERPLEXITY_MCP.md)
- **Uso:** Investigacion de mercado, analisis de competidores, datos de empresas target

### Firecrawl (via MCP)
- **MCP disponible:** Si (ver mcps/FIRECRAWL_MCP.md)
- **Uso:** Crawling de sitios de competidores, extraccion de datos de landing pages

---

## Pendiente / Planeado

| Integracion | Estado | Prioridad | Notas |
|---|---|---|---|
| dLocal Go live | Pendiente | Alta | Requiere entidad legal SpA/EIRL |
| Bsale DTE | Pendiente | Alta | Junto con entidad legal |
| Sales Navigator | Planeado | Media | Para clientes Enterprise |
| Salesforce | Planeado | Media | Solo Plan Enterprise + add-on $99 |
| SAP | Planeado | Baja | Custom integration Enterprise |

---

*Ultima actualizacion: 2026-03-04*
