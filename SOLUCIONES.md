# Soluciones n8n - Workflows Desarrollados

> Instancia: [sistecotest.app.n8n.cloud](https://sistecotest.app.n8n.cloud)
> Actualizado: 2026-02-26

---

## Resumen

| # | Workflow | Categoría | Archivo | Estado |
|---|----------|-----------|---------|--------|
| 1 | [Facturación Automática - Contratos Sisteco](#1-facturación-automática---contratos-sisteco) | Automatización de procesos | `invoice-automation-sisteco.json` | ✅ Desarrollado |
| 2 | [B2B Prospecting con IA](#2-b2b-prospecting-con-ia) | IA / Ventas | `b2b-prospecting-workflow.json` | ✅ Desarrollado |
| 3 | [LinkedIn Lead Scoring](#3-linkedin-lead-scoring) | IA / Ventas | `linkedin-lead-scoring-workflow.json` | ✅ Desarrollado |

---

## 1. Facturación Automática - Contratos Sisteco

**Archivo**: `workflows/invoice-automation-sisteco.json`

### Descripción
Automatiza la generación y envío de facturas a partir de contratos almacenados en Notion. Se dispara cuando un contrato es actualizado en una base de datos de Notion.

### Trigger
- **Tipo**: Notion Trigger (`notionTrigger`)
- **Evento**: `pagedUpdatedInDatabase` — se activa cuando se actualiza una página en la base de datos de contratos
- **Polling**: cada minuto

### Integraciones
| Servicio | Uso |
|----------|-----|
| **Notion** | Lectura de contratos (trigger + datos) |

### Credenciales Requeridas
- `Notion account` (ID: `KbzWUrO5AH8VBd5n`)

---

## 2. B2B Prospecting con IA

**Archivo**: `workflows/b2b-prospecting-workflow.json`
**Guía de setup**: `workflows/b2b-prospecting-SETUP.md`

### Descripción
Sistema completo de prospección B2B automatizada. Extrae datos de sitios web, los analiza con IA, y ejecuta una secuencia de 5 emails personalizados durante 5 semanas, con detección automática de respuestas.

### Arquitectura (4 flujos)

| Flujo | Función |
|-------|---------|
| **Flujo 1** - Extracción y análisis | Scraping de websites + análisis con Gemini |
| **Flujo 2** - Secuencia de emails | 5 emails automáticos con timing de 7 días entre cada uno a las 9:00 AM |
| **Flujo 3** - Detección de respuestas | Webhook + clasificación de intención con IA |
| **Flujo 4** - Manejo de errores | Error trigger → Slack + Log |

### Secuencia de Emails

| Email | Día | Propósito |
|-------|-----|-----------|
| 1 | 0 | Introducción + observación específica |
| 2 | 7 | Caso de estudio relevante |
| 3 | 14 | Quick win + CTA suave |
| 4 | 21 | Social proof |
| 5 | 28 | Breakup email |

### Integraciones
| Servicio | Uso |
|----------|-----|
| **ScrapingBee** | Extracción de HTML de sitios web |
| **Gemini Flash 2.0** | Análisis de empresas y personajes |
| **Google Sheets** | Base de datos de prospectos y logs |
| **Gmail** | Envío de secuencia de emails |
| **Slack** | Alertas de leads interesados y errores |

### Credenciales Requeridas
- `ScrapingBee API Key` (HTTP Query Auth)
- `Gemini API Key` (HTTP Query Auth)
- `Google Sheets OAuth2`
- `Gmail OAuth2`
- `Slack OAuth2`

### Canales Slack
- `#sales-leads` — leads interesados
- `#automation-errors` — errores del sistema

---

## 3. LinkedIn Lead Scoring

**Archivo**: `workflows/linkedin-lead-scoring-workflow.json`
**Guía de setup**: `workflows/linkedin-lead-scoring-SETUP.md`

### Descripción
Automatiza la prospección B2B via LinkedIn con scoring inteligente. Extrae perfiles con Phantombuster, analiza los websites con ScrapingBee, y aplica un motor de puntuación de 0-100 usando Gemini para clasificar leads en HOT / WARM / NURTURE / SKIP.

### Arquitectura

```
Schedule (lunes 8AM)
  → Google Sheets (leer búsquedas)
  → Phantombuster (lanzar agente LinkedIn)
  → Polling (esperar resultado)
  → Deduplicar
  → ScrapingBee (analizar website empresa)
  → Gemini (análisis dual: perfil + website)
  → Motor de Lead Scoring
  → Switch por clasificación
      ├── HOT  → Hoja HOT + Slack alert
      ├── WARM → Hoja Prospectos (alimenta workflow B2B)
      ├── NURTURE → Hoja Nurture
      └── SKIP → Lead Score Log
```

### Motor de Lead Scoring (100 puntos)

| Categoría | Pts | Criterios |
|-----------|-----|-----------|
| Perfil del Decisor | 30 | C-Level, Manager, antigüedad en cargo |
| Señales de Compra | 30 | Actividad LinkedIn, hiring, cambio reciente |
| Fit de Empresa | 25 | Industria target, tamaño 50-500, stack tecnológico |
| Timing y Engagement | 15 | Pain points en website, señales de inversión |

### Clasificación de Leads

| Rango | Clasificación | Acción |
|-------|---------------|--------|
| 70-100 | HOT LEAD | Hoja "HOT Leads" + alerta Slack inmediata |
| 50-69 | WARM LEAD | Hoja "Prospectos" → alimenta workflow B2B Prospecting |
| 30-49 | NURTURE | Hoja "Nurture" (solo contenido) |
| 0-29 | SKIP | Lead Score Log y descartar |

### Integraciones
| Servicio | Uso |
|----------|-----|
| **Phantombuster** | Extracción de perfiles LinkedIn |
| **ScrapingBee** | Análisis de websites de empresas |
| **Gemini Flash 2.0** | Análisis dual perfil + website |
| **Google Sheets** | Almacenamiento por categoría |
| **Slack** | Alertas de HOT leads |

### Credenciales Requeridas
- `Phantombuster API Key` (HTTP Header Auth: `X-Phantombuster-Key`)
- `ScrapingBee API Key` (HTTP Query Auth)
- `Gemini API Key` (HTTP Query Auth)
- `Google Sheets OAuth2`
- `Slack OAuth2`

### Integración con B2B Prospecting
Los leads WARM (50-69) se escriben automáticamente en la hoja `Prospectos` con `status: nuevo`, siendo recogidos por el workflow de B2B Prospecting en su ciclo horario sin ninguna modificación al workflow existente.

---

## Arquitectura General del Sistema

```
[LinkedIn Lead Scoring]
        |
        | (WARM leads → hoja "Prospectos")
        ↓
[B2B Prospecting]  ←→  Google Sheets (fuente de verdad)
        |
        | (emails personalizados, 9AM diario)
        ↓
[Prospectos] → [Detectar Respuesta] → [Slack #sales-leads]
        |
[Facturación Sisteco]  (pipeline independiente via Notion)
```

---

## Stack Tecnológico

| Tecnología | Rol |
|------------|-----|
| n8n Self-Hosted | Orquestador de automatizaciones (sin límites, costo optimizado) |
| Claude Code (Anthropic) | Diseño de sistemas, arquitectura de workflows, lógica de negocio |
| Google Gemini Flash 2.0 | Motor de IA (análisis y personalización) |
| ScrapingBee | Web scraping empresarial |
| Phantombuster | Extracción de datos LinkedIn |
| Google Sheets | Base de datos operativa |
| Gmail | Canal de outreach |
| Slack | Notificaciones y alertas |
| Notion | Gestión de contratos (Sisteco) |
