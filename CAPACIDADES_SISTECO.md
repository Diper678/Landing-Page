# Sisteco — Capacidades y Resultados Esperables

> Documento de soporte para presentaciones de venta B2B
> Actualizado: Marzo 2026

---

## Qué es Sisteco

Sisteco es una infraestructura de ventas automatizada diseñada para empresas B2B en Chile y Latinoamérica. Construimos y desplegamos workflows de automatización que cubren todo el ciclo comercial: desde identificar al decisor correcto hasta cerrar el contrato y automatizar la facturación.

**Propuesta de valor:** "Vende más, preocúpate menos" — bajo volumen, alta conversión.

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

### Operativo en Menos de 24 Horas
- **Setup completo en menos de un día:** Armar el mismo stack por tu cuenta toma entre 2 y 4 semanas de integración técnica. Con Sisteco, el sistema está configurado, probado y generando prospectos desde el día siguiente a la contratación
- **Sin curva de aprendizaje:** No hay herramientas que aprender ni workflows que construir — eso ya está hecho
- **Sin costo oculto de implementación:** Otras soluciones cobran entre $3,000 y $8,000 USD de setup por separado. Aquí está incluido

### El Costo Real de No Automatizar
- **Stack DIY completo (Apollo + PhantomBuster + ScrapingBee + Instantly + n8n) cuesta ~$1,253/mes en la práctica** — sumando herramientas, tiempo del SDR integrándolas (~20h/mes) y soporte (~10h/mes)
- **Sisteco desde $472/mes:** Todo integrado, configurado y operando desde el primer día
- **El agente de Sisteco rinde como 3 SDRs y cuesta como uno solo:** Reduce el Costo de Adquisición de Clientes eliminando el trabajo manual en prospectos que nunca comprarán

### Tu Equipo de Ventas Solo Cierra
- **El vendedor entra a la conversación cuando el prospecto ya respondió:** No prospecta, no hace seguimiento, no envía emails — solo gestiona las conversaciones calientes que el sistema le entrega
- **Alertas en tiempo real vía Slack** cuando un prospecto responde, para actuar en el momento exacto en que están interesados
- **6+ horas ahorradas por día** en tareas manuales de prospección que ahora ocurren automáticamente cada mañana

### Calidad de Leads con Inteligencia de Scoring
- **Solo recibes prospectos con señales reales de intención:** Nuestro motor de scoring 0-100 clasifica cada lead en HOT / WARM / NURTURE / SKIP antes de que tu equipo lo vea
- **5 a 7 veces más conversiones** al contactar exclusivamente leads cualificados en vez de prospectar masivamente
- **Sabes por qué un lead es HOT:** El sistema reporta qué criterios activaron la clasificación — actividad LinkedIn, señales de contratación, cambios de cargo, pain points detectados en el website. Es inteligencia de mercado que antes no tenías

### Velocidad de Respuesta que Cierra Negocios
- **Tiempo de respuesta < 5 minutos** para leads entrantes, hasta de noche y fines de semana
- **21 veces más conversiones** cuando se responde en menos de 5 minutos (Harvard Business Review)
- **El 78% de los clientes compra a quien responde primero** — con Sisteco siempre eres tú

### Personalización a Escala con Tasas de Respuesta Reales
- **15-25% de tasa de respuesta** en secuencias personalizadas por IA, vs 2-5% con mensajes genéricos
- Cada prospecto recibe comunicación única basada en su perfil LinkedIn, empresa y contexto extraído automáticamente — no son templates
- **~200+ prospectos procesados por semana** de forma automatizada, vs ~50 en prospección manual
- Secuencias de 5 emails durante 5 semanas que se adaptan al comportamiento del prospecto: si responde al email 2, el sistema lo redirige al flujo correspondiente

### Nadie Cae por las Grietas
- **Cada prospecto recorre la secuencia completa** de 5 touchpoints automáticamente — el sistema nunca olvida hacer seguimiento
- En prospección manual, el seguimiento es inconsistente por naturaleza: los vendedores priorizan, olvidan, tienen días malos. El sistema es siempre constante en calidad, timing y mensajes
- **Operativo 24/7:** El sistema nunca para, nunca se enferma, nunca se va de vacaciones

### Escalabilidad Sin Contratar
- Si quieres duplicar el pipeline de prospectos, no necesitas contratar otro SDR — el sistema escala sin costo marginal significativo
- Canales activos: Email, LinkedIn, WhatsApp, Slack, Instagram — **5 puntos de contacto vs 1-2 del competidor** que no automatiza
- **89% de retención de clientes con estrategia omnicanal vs 33% sin ella** — más canales activos significa más conversaciones abiertas

### Cumplimiento Legal
- **Ley 21.719 (Chile):** Cumplimiento total con la nueva ley de datos personales (vigente diciembre 2026)
- **GDPR compatible:** Privacy by design en todo el pipeline
- Protección de datos de nivel empresarial — el cliente no asume riesgo regulatorio

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
