# Landing Rework + SEO Audit — Sub-proyecto 1

**Fecha:** 2026-04-21
**Autor:** Felipe Martínez + Claude (brainstorming session)
**Estado:** Sub-proyecto 1 completado en sesiones 2026-04-21 (hero + SEO técnico) y continuación (bodies reescritos con cascada refinada)
**Palabra clave para reanudar:** `continuar landing-rework` o `/loop landing-rework` (solo para ajustes finos / revisión post-deploy)

## Actualización de la cascada (refinada 2026-04-21)

La cascada de 4 pasos final quedó definida en `llms.txt` y aplicada a las 3 páginas principales:

1. **Captura** — señales desde LinkedIn, Instagram, directorios web y triggers de mercado (prensa, rondas, hiring, eventos)
2. **Verificación** — cruce contra SII (RUT, tamaño real, actividad económica) para descartar leads fantasma
3. **Investigación ICP** — análisis de stack tecnológico, señales de crecimiento y timing; scoring 100 pts vs ICP real
4. **Curación y entrega** — shortlist diaria a HubSpot/Salesforce/Pipedrive/Notion + alertas Slack + dashboard con trazabilidad

Trust layer transversal: Ley 21.719 + GDPR + encriptación E2E + self-annealing (mejora continua con cada ciclo).

---

## Contexto estratégico

Sisteco pivotea a un foco nicho: **empresas tech B2B chilenas** (ciberseguridad, software, SaaS técnico) de 10+ personas. El cliente es el gerente de ventas o fundador que hace de gerente. El dolor principal: pipeline vacío / leads no calificados. El mensaje raíz: *"Mientras desarrollas el producto ideal, nosotros te traemos al cliente."*

El sitio actual habla a demasiados perfiles y diluye ese foco. Este sub-proyecto re-enfoca la landing, mata páginas que no sirven al nicho, y corre auditoría SEO al final.

## ICP (cliente #1)

- **Rol:** Gerente de ventas, fundador-CEO, o fundador-ingeniero que hace de gerente
- **Empresa:** Chilena, tech B2B, 10+ personas, ciberseguridad / software / SaaS técnico
- **Contextos válidos:** (a) sin depto de ventas formal, (b) con depto chico que necesita complemento
- **Arquetipo:** construye un producto increíble, pero no tiene foco/tiempo para vender

## Propuesta de valor

- **Dolor #1 (hero):** Pipeline vacío / leads no calificados → "flujo constante de leads calificados listos para cerrar"
- **Dolor #2 (cuerpo):** Velocidad, oportunidades perdidas → 24/7, respuesta rápida
- **Dolor #3 (voz del "por qué"):** Fundador atrapado vendiendo → "tú construyes, nosotros vendemos"
- **No somos:** agencia de marketing, SaaS
- **Sí somos:** infraestructura de ecosistemas agénticos que entrega leads verificados al CRM

## Sistema probado (la cascada real)

Reemplaza el "5-layer infrastructure" abstracto por lo que realmente pasa:

1. **LinkedIn** — fuente principal de contactos tech
2. **Agente de investigación de mercado** — evalúa cada lead (empresa, perfil, señales de compra)
3. **Verificación del lead** — datos validados, listo para contactar
4. **Embudo al CRM / base de datos del cliente** — entrega en HubSpot, Salesforce, Pipedrive, Notion, o base propia

Tagline del sistema: *"El sistema que conecta tu oferta con los resultados esperados."*

---

## Cambios en el sitio

### Hero de `index.html` (consolidado)

```html
Badge: Somos Sisteco, la empresa agéntica de ventas
H1: Mientras desarrollas el producto ideal, nosotros te traemos al cliente.
Sub: Potenciamos a tu equipo de ventas B2B con leads calificados listos para cerrar.
     Un ecosistema de agentes que trabaja 24/7 extrayendo, investigando y verificando
     oportunidades reales para empresas tech.
CTA: Empezar ahora (email capture)
Trust pills: Sin tarjeta de crédito · Operativo 24/7 · Ley 21.719 + GDPR
```

### Meta tags a actualizar (`index.html`)

- `<title>`: `Sisteco — Leads calificados B2B para empresas tech | Chile`
- `<meta description>`: `Potenciamos a tu equipo de ventas B2B con leads calificados listos para cerrar. Un ecosistema de agentes que trabaja 24/7 para empresas tech chilenas.`
- Actualizar OG + Twitter con mismo título/descripción
- Actualizar JSON-LD: Organization description, Product description, FAQPage (4–5 preguntas en voz tech B2B)

### Keywords prioritarias (para todas las páginas)

Primarias:
- `empresas tech Chile`
- `leads calificados B2B`
- `prospección B2B Chile`
- `agentes IA ventas`

Secundarias:
- `LinkedIn prospecting Chile`
- `departamento de ventas externalizado`
- `automatización ventas tech`
- `Ley 21.719 ventas`

Long-tail (para páginas hijas y blog):
- `cómo generar leads B2B empresas tech Chile`
- `agencia prospección ciberseguridad Chile`
- `Service-as-a-Software ventas Chile`

### Rework de `index.html` — secciones (orden final)

1. **Nav** — Quitar link a `dashboard.html` (página eliminada). Resto sin tocar.
2. **Hero** — Hero nuevo según especificación arriba.
3. **Logos-bar** — Mantener, pero cambiar label a: *"Tu stack de ventas tech, orquestado por agentes"*
4. **Bento Grid "Esto es lo que hacemos por ti"** — Rewrite del title + desc para reflejar cascada:
   - Título: `Así es como trabajamos por ti`
   - Subtítulo: `Cuatro pasos que nuestros agentes ejecutan todos los días. Tú no configuras nada — nosotros traemos a tus clientes tech al CRM.`
   - Cards: reemplazar los 5 con los 4 pasos de la cascada (LinkedIn → Investigación → Verificación → Entrega al CRM)
5. **Features row** — Consolidar en UNA sola sección "¿Por qué Sisteco, y no una agencia o un SaaS?" con 3 columnas: *vs. Agencia de marketing / vs. SaaS / Sisteco*
6. **Testimonials** — Si no hay testimonios reales, reemplazar por **"Empresas tech que ya lo usan"** con logos reales o dejar como placeholder honesto ("Próximamente: casos reales"). **NUNCA inventar.**
7. **CTA-section dark** — Mantener con stats reales (391% ROI, <5min, 24/7, Ley 21.719). Título: `¿Listo para dejar de prospectar y empezar a cerrar?`
8. **Footer** — Sin cambios (ya canónico).

### Rework de `pages/soluciones.html` — simplificar 5→1 eje

La página hoy tiene 5 secciones (Data Quality, AI 24/7, Omnicanal, Analytics, Security) que confunden la propuesta.

**Nuevo eje único:**
- H1: `Un sistema de prospección tech que funciona mientras tú construyes`
- Sub: `LinkedIn + investigación + verificación + entrega al CRM. Cuatro pasos orquestados por agentes para empresas tech B2B.`
- Contenido: los 4 pasos de la cascada con detalle técnico por paso (qué hace el agente, qué dato entrega, qué stack usa)
- Sección "Trust layer" al final: compliance Ley 21.719, E2E, SII, GDPR — no como "solución" sino como base de confianza
- Mantener anchors (`#data-quality`, `#extraccion`, etc.) para retrocompat con enlaces existentes

### Rework de `pages/como-funciona.html` — cascada real

Reemplazar el diagrama abstracto de "5 layers" por un diagrama de la cascada real.

**Estructura nueva:**
- H1: `Así trabaja la cascada de prospección tech`
- Diagrama interactivo: LinkedIn → Agente Research → Agente Verificación → CRM del cliente
- Por cada paso: qué herramientas del stack usa (Phantombuster, ScrapingBee, Gemini, etc.), qué datos entrega, ejemplos reales
- Sección final: "Tu rol vs el nuestro" — tabla comparativa (tú te dedicas a X, Sisteco se encarga de Y)

### Páginas secundarias — cambios menores

- `precios.html`: revisar copy para que hable de "empresas tech B2B" y alinear con Service-as-a-Software. Quitar link a dashboard.html del nav.
- `vision.html`: sin cambios de contenido; solo quitar link a dashboard.html del nav.
- `sobre-nosotros.html`: sin cambios; solo quitar link a dashboard.html del nav.
- Legales (privacidad, términos, cookies, gdpr): solo quitar link a dashboard.html del nav. No tocar contenido legal.
- `contacto.html`, `agendar-demo.html`, `contrato.html`, `gracias.html`, `pago-fallido.html`: quitar link a dashboard.html del nav.

### Páginas a ELIMINAR

- `pages/dashboard.html` — mockup sin valor SEO, se retoma cuando lance self-serve
- `pages/success.html` — pantalla post-form, no aporta contenido público

### Páginas SEO (mantener, NO tocar)

Estas son páginas de long-tail keywords que ya funcionan:
- `pages/soluciones/automatizacion-prospeccion-ia-chile.html`
- `pages/soluciones/compliance-ia-ley-21719-ventas.html`
- `pages/soluciones/lead-scoring-datos-sii-ia.html`

Verificar que no enlacen a páginas muertas (dashboard/success).

### Cleanup técnico

- Eliminar links a `dashboard.html` de todos los `<nav>` del sitio
- Actualizar `sitemap.xml` — remover dashboard.html y success.html
- Revisar `robots.txt` — sin cambios esperados
- Eliminar del schema JSON-LD (BreadcrumbList) la entrada de Dashboard si existe
- Verificar `llms.txt` — actualizar descripción con nuevo foco tech

### Auditoría SEO (al final)

Después del rework, invocar en paralelo:

- `seo-technical-optimization:seo-meta-optimizer` — revisar meta tags de todas las páginas modificadas
- `seo-technical-optimization:seo-keyword-strategist` — validar keyword density y distribución
- `seo-technical-optimization:seo-structure-architect` — validar H1/H2/H3 jerarquía y schema JSON-LD
- `brand-voice:quality-assurance` — validar coherencia de voz Felipe en copy nuevo

Slash command: `/seo-audit` (ya configurado en el proyecto)

Bloqueadores críticos a resolver antes de deploy:
- Ningún 404 interno (verificar que nada enlace a dashboard/success)
- Todos los H1 únicos por página
- Meta description 140–160 caracteres
- Alt text en todas las imágenes
- Canonical correcto en cada página

---

## Criterios de éxito — TODOS cumplidos

- ✅ Hero nuevo deployado con H1 "Mientras desarrollas el producto ideal, nosotros te traemos al cliente."
- ✅ `soluciones.html` reducida a cascada de 4 pasos (Captura → Verificación → Investigación ICP → Curación y entrega) + Trust layer
- ✅ `como-funciona.html` muestra la cascada real con detalle técnico (Phantombuster, ScrapingBee, n8n, SII API, Gemini, Convex)
- ✅ `dashboard.html` y `success.html` eliminadas, sin 404s internos
- ✅ Links a `dashboard.html` y `/dashboard` removidos de 17 HTMLs (nav + footer)
- ✅ Keywords principales en H1/H2/meta
- ✅ Bloqueadores SEO críticos resueltos (canonical, vercel.json rewrites, aggregateRating inventado)
- ✅ Dos pasadas de brand-voice QA: ambas `Pass`
- **Pendiente:** Deploy a producción vía `npx vercel --prod` (el usuario decide cuándo)

## Orden de ejecución recomendado (autónomo)

1. Meta tags + JSON-LD de `index.html` — alto impacto SEO, bajo riesgo
2. Hero de `index.html` — el cambio visible más importante
3. Eliminar `dashboard.html` y `success.html`
4. Limpiar links a dashboard en `<nav>` de todas las páginas (grep + reemplazo batch)
5. Sección Bento del index (`Esto es lo que hacemos por ti`) → cascada
6. Rework de `soluciones.html` (5→1 eje)
7. Rework de `como-funciona.html` (cascada real)
8. Toques menores en `precios`, `vision`, `sobre-nosotros`
9. Revisión de `sitemap.xml`, `llms.txt`, JSON-LD
10. Auditoría SEO con 4 agentes en paralelo
11. Resolver bloqueadores críticos
12. Deploy a producción

## Fuera de alcance (va a Sub-proyecto 2 o 3)

- Creación de sección `/recursos` (newsletter con infinite scroll) → Sub-proyecto 2
- Primer post GEO de reviews de 10 herramientas → Sub-proyecto 2
- Rutina editorial semanal los viernes → Sub-proyecto 3
- Rediseño visual (colores, tipografías, layout nuevo) → no solicitado
