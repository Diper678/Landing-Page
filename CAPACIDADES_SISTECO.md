# Sisteco — Capacidades y Resultados Esperables

> Documento de soporte para presentaciones de venta B2B
> Actualizado: Marzo 2026

---

## Qué es Sisteco

Sisteco es una infraestructura de ventas automatizada diseñada para empresas B2B en Chile y Latinoamérica. Construimos y desplegamos workflows de automatización que cubren todo el ciclo comercial: desde identificar al decisor correcto hasta cerrar el contrato y automatizar la facturación.

**Propuesta de valor:** "Menos leads, más cierres" — bajo volumen, alta conversión.

---

## Nuestra Ventaja Competitiva: Pensamiento en Sistemas + IA de Última Generación

Lo que diferencia a Sisteco no es solo la tecnología que usamos — es **cómo pensamos en sistemas** para diseñar cada workflow.

### Claude Code como Motor de Ingeniería
Trabajamos de la mano con **Claude Code** (Anthropic) como nuestra propia capacidad de pensamiento en sistemas. Esto nos permite:

- **Modelar mentalmente** cómo se puede extraer información de cualquier fuente (scraping de compañías, perfiles LinkedIn, websites) de la manera más rápida y eficiente posible
- **Diseñar arquitecturas de datos** que conectan fuentes heterogéneas en un pipeline unificado
- **Iterar a velocidad de código**: lo que a una consultora tradicional le toma semanas planificar, nosotros lo prototipamos y desplegamos en días
- **Optimizar cada nodo** del workflow con razonamiento de ingeniería de software de nivel experto

### Stack de IA de Última Generación
Combinamos las herramientas más avanzadas del mercado:
- **Claude Code** para diseño de sistemas, arquitectura de workflows y lógica de negocio
- **Google Gemini Flash 2.0** para análisis de perfiles y personalización de mensajes a escala
- **Phantombuster + ScrapingBee** para extracción de datos a velocidad industrial

Esta combinación nos permite conseguir leads cualificados a una velocidad que **ninguna otra herramienta por sí sola es capaz de alcanzar** — porque no es una herramienta, es un sistema completo pensado de extremo a extremo.

### n8n Self-Hosted: Control Total
No usamos n8n Cloud. **Self-hosteamos n8n** para exprimir sus capacidades al máximo:
- **Sin límites artificiales** de ejecuciones o workflows
- **Costo optimizado**: infraestructura propia a fracción del precio de cloud
- **Control total** sobre datos, rendimiento y escalabilidad
- **Personalización profunda**: nodos custom, integraciones a medida, sin restricciones de plan

---

## Arquitectura del Sistema (5 Capas)

### Capa 1: Captura de Datos
- **Phantombuster:** Extracción automática de perfiles LinkedIn (cargo, antigüedad, actividad)
- **ScrapingBee:** Análisis de websites de empresas target para detectar pain points
- **Resultado:** Datos verificados de prospectos con 97%+ de precisión

### Capa 2: Lead Scoring con IA
- **Motor de puntuación 0-100** con análisis dual (perfil LinkedIn + website empresa)
- **Google Gemini Flash 2.0** como motor de IA para análisis y personalización
- **Clasificación automática:**

| Rango | Clasificación | Acción Automática |
|-------|---------------|-------------------|
| 70-100 | HOT LEAD | Alerta inmediata en Slack + hoja HOT |
| 50-69 | WARM LEAD | Entra a secuencia de emails automatizada |
| 30-49 | NURTURE | Solo contenido educativo |
| 0-29 | SKIP | Descartado automáticamente |

- **Criterios de scoring (100 puntos):**
  - Perfil del Decisor (30 pts): C-Level, Manager, antigüedad en cargo
  - Señales de Compra (30 pts): Actividad LinkedIn, hiring, cambios recientes
  - Fit de Empresa (25 pts): Industria target, tamaño 50-500, stack tecnológico
  - Timing y Engagement (15 pts): Pain points en website, señales de inversión

### Capa 3: Orquestación Sisteco (Core)
- **n8n Self-Hosted** como orquestador de automatizaciones (sin límites de ejecuciones)
- Motor de decisión y routing automático de leads
- Google Sheets como base de datos operativa (fuente de verdad)
- Pipeline de LinkedIn Lead Scoring alimenta automáticamente el pipeline de B2B Prospecting

### Capa 4: Secuencias Multicanal
- **5 emails personalizados en 5 semanas**, con IA generando contenido único por prospecto
- Envío programado a las **9:00 AM** (mejor hora de apertura)
- **Intervalos de 7 días** entre cada email
- **Detección automática de respuestas** con clasificación de intención por IA

| Email | Día | Propósito |
|-------|-----|-----------|
| 1 | 0 | Introducción + observación específica del prospecto |
| 2 | 7 | Caso de estudio relevante para su industria |
| 3 | 14 | Quick win + CTA suave |
| 4 | 21 | Social proof (datos de mercado) |
| 5 | 28 | Breakup email (última oportunidad) |

### Capa 5: Seguimiento y Cierre
- **Alertas en tiempo real** cuando un prospecto responde (Slack #sales-leads)
- **Facturación automatizada** vía Notion (trigger al actualizar contrato)
- Pipeline independiente de facturación que se activa automáticamente

---

## Workflows Desarrollados y Operativos

### 1. LinkedIn Lead Scoring
- **Ejecución:** Automático cada lunes a las 8:00 AM
- **Flujo:** Google Sheets → Phantombuster (LinkedIn) → Polling resultado → Deduplicar → ScrapingBee (website) → Gemini (análisis dual) → Motor de Scoring → Clasificación → Distribución por hojas + alertas
- **Integraciones:** Phantombuster, ScrapingBee, Gemini Flash 2.0, Google Sheets, Slack

### 2. B2B Prospecting con IA
- **4 flujos integrados:**
  1. Extracción y análisis (scraping + Gemini)
  2. Secuencia de 5 emails automatizados
  3. Detección de respuestas (webhook + clasificación)
  4. Manejo de errores (error trigger → Slack + Log)
- **Integraciones:** ScrapingBee, Gemini Flash 2.0, Google Sheets, Gmail, Slack

### 3. Facturación Automática
- **Trigger:** Actualización de contrato en Notion
- **Flujo:** Notion trigger → generación de factura → envío automático
- **Pipeline independiente** que no interfiere con la prospección

---

## Resultados Esperables para el Cliente

### Eficiencia Operativa
- **Reducción de tiempo de prospección:** Lo que antes tomaba una semana (investigar empresas, personalizar mensajes, enviar) ahora ocurre automáticamente cada mañana
- **6+ horas ahorradas por día** en tareas manuales de prospección
- **Operativo 24/7:** El sistema nunca para, nunca se enferma, nunca se va de vacaciones

### Calidad de Leads
- **Eliminación de leads irrelevantes:** Solo recibes prospectos con señales reales de intención
- **5-7x más conversiones** al contactar solo leads cualificados (vs. prospección masiva)
- **Reducción de CAC** al eliminar esfuerzo en prospectos que nunca comprarán

### Velocidad de Respuesta
- **Tiempo de respuesta < 5 minutos** para leads entrantes
- **Dato clave:** 21x más conversiones cuando se responde en menos de 5 minutos (Harvard Business Review)
- **Dato clave:** El 78% de los clientes compra al primer vendor que responde

### Personalización a Escala
- Cada prospecto recibe comunicación única basada en su perfil, empresa y contexto
- No son templates genéricos: la IA genera mensajes específicos con datos reales
- Secuencias que se adaptan al comportamiento del prospecto

### Cumplimiento Legal
- **Ley 21.719 (Chile):** Cumplimiento total con la nueva ley de datos personales (vigente diciembre 2026)
- **GDPR compatible:** Privacy by design en todo el pipeline
- Protección de datos de nivel empresarial

---

## Stack Tecnológico Completo

| Tecnología | Rol en el Sistema |
|------------|-------------------|
| n8n Self-Hosted | Orquestador de automatizaciones (sin límites) |
| Claude Code (Anthropic) | Diseño de sistemas, arquitectura de workflows, lógica de negocio |
| Google Gemini Flash 2.0 | Motor de IA (análisis y personalización) |
| ScrapingBee | Web scraping empresarial |
| Phantombuster | Extracción de datos LinkedIn |
| Google Sheets | Base de datos operativa |
| Gmail | Canal de outreach (secuencias de email) |
| Slack | Notificaciones y alertas en tiempo real |
| Notion | Gestión de contratos y facturación |

---

## Estadísticas de Referencia del Mercado

Estas cifras provienen de investigación publicada y respaldan la propuesta de valor:

- **21x** más conversiones cuando se responde en <5 minutos (Harvard Business Review)
- **78%** de los clientes compran al primer vendor que responde
- **391%** ROI en chatbots con IA (Forrester/PolyAI)
- **89%** de retención con estrategia omnicanal vs. 33% sin ella
- **$3.8T** perdidos globalmente por mal servicio al cliente

---

## Canales de Comunicación Sisteco

- **Email:** contacto@sisteco.cl
- **Teléfono:** +56 9 40065566
- **Dirección:** Av. Alonso de Córdova 5870 Of. 413, Las Condes, Santiago de Chile
- **LinkedIn:** linkedin.com/company/sisteco/
