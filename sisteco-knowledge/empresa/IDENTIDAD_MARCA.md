# Sisteco — Identidad y Marca

> Este documento define quien es Sisteco, que hace, para quien, y como se comunica. Es la base de toda decision de contenido, diseno y producto.

---

## Mision

Sisteco es tu agente de ventas autónomo. Detecta, califica, contacta y te agenda reuniones con empresas que sí te pueden comprar. Tú solo cierras.

## Posicionamiento

- **Categoria:** Agente de ventas autónomo / Service-as-a-Software (el agente hace el trabajo, no es una herramienta que operas tú)
- **Identidad central:** "Tu agente de ventas autónomo que te agenda reuniones"
- **Unidad de valor:** reuniones agendadas (NO "leads" ni "cierres")
- **Para:** Empresas tech B2B en Chile, desde 10+ empleados (SaaS, integradores TI, agencias, consultoras)
- **Diferencial (moat):** datos del SII (RUT, giro, tamaño real) · prospección por señales (no listas frías) · cumplimiento Ley 21.719. Lo que un servicio de afuera no puede hacer en Chile.
- **Mercado principal:** Chile (2026) → LATAM: Colombia, Peru, Mexico (2027+)

## Propuesta de valor central

> "Llenamos tu agenda. Tú cierras."

Sisteco no entrega listas ni volumen. Nuestro agente trabaja 24/7, filtra capa por capa y te deja en el calendario reuniones con contexto: quién es y por qué ahora. El ciclo completo, operado por el agente; tú te enfocas en cerrar.

## Slogan / Tagline

- **Principal:** "Llenamos tu agenda. Tú cierras."
- **Producto:** "Tu agente de ventas autónomo"
- **CTA único:** "Agenda una reunión" (→ cal.com/sisteco/ventas)
- "Donde las empresas no duermen, gracias a la tecnología"
- "Hoy tu agente de ventas. Mañana, la plataforma de LATAM." (visión)

> Taglines legados (no usar en la reposición): "Somos Sisteco, la empresa agéntica de ventas", "Vende más, preocúpate menos", "Menos leads, más cierres".

## Personalidad de Marca

| Atributo | Expresion practica |
|---|---|
| Directo | Va al punto. Sin floritura ni jerga corporativa |
| Orientado al resultado | La unidad es la reunión agendada, no la métrica inflada |
| Confiable | Datos del SII, cumplimiento Ley 21.719 desde el día uno |
| Cercano (es-CL) | Lenguaje chileno, claro, sin anglicismos innecesarios |

## Voz y Tono

- **Idioma principal:** Espanol (es-CL), tuteo profesional (`tu`)
- **Verbos de accion:** Automatiza, Escala, Orquesta, Convierte
- **Nunca:** Frases largas, promesas vagas, tono corporativo frio
- **Siempre:** Metrica concreta > afirmacion generica

### Ejemplos de copy aprobados (reposición)

```
DO:  "Llenamos tu agenda. Tú cierras."
DO:  "No recibes una lista. Recibes reuniones."
DO:  "Tu agente vigila el mercado 24/7 y te agenda reuniones con quien sí te puede comprar."
DO:  "Reunión agendada, con el contexto de quién y por qué ahora."
DO:  "Datos del SII: lo que un servicio de afuera no puede hacer en Chile."

NO:  "leads" / "cierres" como unidad de valor (la unidad es la reunión)
NO:  "departamento de ventas agéntico" / "empresa agéntica de ventas" (posicionamiento viejo)
NO:  anglicismos: scoring, timing, ICP, self-annealing, shortlist, hiring, stack
NO:  "Solucion innovadora de vanguardia para el crecimiento empresarial."
NO:  "Mas informacion" / "Saber mas" (CTAs pasivos) — el CTA único es "Agenda una reunión"
```

### Traducciones de voz (es-CL, evitar anglicismos)

| Evitar | Usar |
|---|---|
| scoring | calificar |
| timing | momento |
| ICP | perfil |
| self-annealing | se mejora / se ajusta sola |
| shortlist | lista |
| hiring | contrataciones |
| ambient research | vigilancia continua |
| stack | infraestructura / herramientas |

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

> **Versión pública (reposición):** en la web esta arquitectura se cuenta como "el motor por dentro" en 5 capas (captura → verificación SII → calificación → activación → entrega de reuniones), con el diagrama `assets/diagrams/motor-infraestructura.svg`, sin nombres de proveedores y con la reunión agendada como salida. Los nombres de herramientas (ScrapingBee, Gemini, n8n, etc.) son internos, no van en el frontend.

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

*Ultima actualizacion: 2026-06-07 — reposición a "tu agente de ventas autónomo / reuniones"*
