# Sisteco — Identidad y Marca

> Este documento define quien es Sisteco, que hace, para quien, y como se comunica. Es la base de toda decision de contenido, diseno y producto.

---

## Mision

Sisteco automatiza ventas B2B para empresas chilenas. Workflows inteligentes que hacen la prospeccion para que tus vendedores solo cierren.

## Posicionamiento

- **Categoria:** Agentic Sales Infrastructure / B2B Revenue Automation
- **Identidad central:** "Somos Sisteco, la empresa agéntica de ventas"
- **Para:** Equipos de ventas y founders de empresas medianas en Chile (50+ empleados), especialmente sectores SaaS, agencias y consultoras
- **Diferencial:** Composable — cada capa trabaja en sinconia para convertir datos en ingresos. Self-hosted. Sin limites.
- **Mercado principal:** Chile (2026) → LATAM: Colombia, Peru, Mexico (2027+)

## Propuesta de valor central

> "Vende más, preocúpate menos."

Sisteco no genera volumen de leads — genera leads calificados con IA. El enfoque es calidad > cantidad. Y no solo prospección: el ciclo completo de ventas, gestionado por agentes.

## Slogan / Tagline

- **Principal:** "Somos Sisteco, la empresa agéntica de ventas"
- "Infraestructura inteligente para ventas B2B"
- "Vende más, preocúpate menos"
- "Donde las empresas no duermen, gracias a la tecnologia"
- "Vende más, preocúpate menos. Automatizacion de ventas B2B hecha para Chile."

## Personalidad de Marca

| Atributo | Expresion practica |
|---|---|
| Tecnico pero cercano | Lenguaje preciso sin jerga innecesaria |
| Orientado a resultados | Metricas siempre presentes (10x, 40%, 391% ROI) |
| Confiable | Arquitectura modular, Ley 21.719 compliant |
| Eficiente | Sin fricciones, setup < 24 horas |

## Voz y Tono

- **Idioma principal:** Espanol (es-CL), tuteo profesional (`tu`)
- **Verbos de accion:** Automatiza, Escala, Orquesta, Convierte
- **Nunca:** Frases largas, promesas vagas, tono corporativo frio
- **Siempre:** Metrica concreta > afirmacion generica

### Ejemplos de copy aprobados

```
DO:  "Pasamos de 20 a 200 leads al dia, con mejor calidad."
DO:  "Tu equipo solo habla con leads que ya quieren comprar."
DO:  "5-7x mas conversiones vs. stack DIY"
DO:  "21x mas conversiones cuando respondes en < 5 minutos"

NO:  "Solucion innovadora de vanguardia para el crecimiento empresarial."
NO:  "Plataforma integral de gestion comercial avanzada."
NO:  "Mas informacion" / "Saber mas" (CTAs pasivos)
```

---

## Estadisticas clave (verificadas, usar en marketing)

| Metrica | Valor | Fuente |
|---------|-------|--------|
| Mas conversiones respondiendo rapido | 21x | Investigacion B2B |
| Clientes que compran al primer contacto | 78% | Investigacion sector |
| ROI en chatbots / IA | 391% | Forrester / PolyAI |
| Retencion omnicanal vs. monocanal | 89% vs. 33% | Investigacion |
| Perdida global por mala atencion | $3.8T/año | Estimacion sector |
| Mejora en conversion con Sisteco | 5-7x | Datos internos |
| Tiempo de respuesta IA | < 5 minutos | SLA propio |
| Uptime sistema | 24/7 | SLA propio |

---

## Arquitectura de 5 Capas (como describir el sistema)

```
01 · Adquisicion de Datos    → ScrapingBee, Firecrawl, PhantomBuster
      ↓
02 · Inteligencia AI         → Claude Sonnet, Gemini (scoring, personalizacion)
      ↓
03 · Sisteco Core            → Motor de orquestacion central (n8n self-hosted)
      ↓
04 · Activacion              → Email, LinkedIn, WhatsApp, Slack, Instagram
      ↓
05 · Retencion               → CRM Sync (HubSpot, Pipedrive), Reporting, Notion
```

Los numeros `01`-`05` usan fuente Nasalization para coherencia con el logo.

---

## Workflows reales construidos

### 1. LinkedIn Lead Scoring
- **Herramientas:** PhantomBuster + ScrapingBee + Gemini
- **Motor:** 100 puntos — clasifica leads como HOT / WARM / NURTURE / SKIP
- **Output:** Lista priorizada + alertas Slack para HOT leads en tiempo real

### 2. B2B Prospecting Email Sequences
- **Herramientas:** n8n + Gmail/Resend + Notion
- **Logica:** 5 emails personalizados por IA, enviados a las 9AM, intervalos de 7 dias
- **Smart:** Deteccion de respuestas → pausa automatica de secuencia

### 3. Facturacion Automatica
- **Herramientas:** Notion → n8n → sistema de facturas
- **Pipeline:** Independiente, triggered desde Notion al crear deal

---

## Marco legal (Chile)

- **Ley 21.719:** Nueva ley de proteccion de datos personales en Chile, vigente diciembre 2026
- Sisteco implementa cumplimiento desde el diseno (privacy by design)
- E2E encryption en todos los datos de clientes
- Obligacion de DTE (Documento Tributario Electronico) para facturar
- Entidad legal recomendada: SpA o EIRL (crear en portal.sii.cl en < 48h)

---

## Competidores de referencia

| Empresa | Lo que hacen bien | Lo que aprendermos |
|---------|-------------------|-------------------|
| Apollo.io | Social proof con metricas, footer horizontal | Tabla de comparacion |
| AmpleMarket | Navbar floating pill on scroll | UX de navegacion |
| Firecrawl | Gradient orbs animados, dark theme | Animaciones de fondo |
| HumbleOps | Tabla comparativa 4 columnas, timeline | Comparativa comercial |
| PhantomBuster | LinkedIn scraping | Herramienta que usamos |
| ScrapingBee | Web scraping confiable | Herramienta que usamos |

---

## Contacto

- **Email:** contacto@sisteco.cl
- **Tel:** +56 9 40065566
- **Direccion:** Av. Alonso de Cordova 5870 Of. 413, Las Condes, Santiago de Chile
- **LinkedIn:** https://www.linkedin.com/company/sisteco/
- **Web:** https://sisteco.cl

---

*Ultima actualizacion: 2026-03-04*
