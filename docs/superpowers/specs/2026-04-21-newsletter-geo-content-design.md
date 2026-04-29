# Sistema de contenido: Newsletter + Primer post GEO — Sub-proyecto 2

**Fecha:** 2026-04-21
**Estado:** ✅ Implementación completa — pendiente deploy
**Palabra clave para reanudar:** `continuar newsletter-geo` o `/loop newsletter-geo`

## Implementación (sesión 2026-04-21)

- ✅ `pages/recursos/index.html` — Feed con hero, filtros por categoría (Todos/Reviews/Comparativas/Tácticas/Opinión Felipe/Casos), infinite scroll, formulario de suscripción y schema.org `Blog` + `BreadcrumbList`.
- ✅ `pages/recursos/api/posts.json` — Manifiesto con primer post + 5 categorías.
- ✅ `pages/recursos/posts/10-herramientas-prospeccion-b2b-tech-chile.html` — Post GEO (~2.800 palabras) con TL;DR, metodología con sesgos declarados, tabla comparativa 10×8, reviews individuales, recomendación por tamaño de equipo, disclaimer honesto, FAQ de 10 preguntas, schemas `TechArticle` + `FAQPage` + `BreadcrumbList`.
- ✅ `js/recursos.js` — Infinite scroll vanilla con IntersectionObserver, filtros por categoría, fetch con fallback.
- ✅ `css/pages.css` — Bloque de estilos `recursos-*` y `recurso-post__*` agregados al final (sección newsletter feed + post pages).
- ✅ `sitemap.xml` — Agregados `/recursos` y `/recursos/posts/10-herramientas-prospeccion-b2b-tech-chile`.
- ✅ `vercel.json` — Rewrites `/recursos`, `/recursos/api/posts.json` y `/recursos/posts/:slug`.
- ✅ `server.cjs` — Rutas locales equivalentes para `npm start`.
- ✅ `llms.txt` — Agregados links al newsletter y al primer post con sumario de 2 líneas.
- ✅ Navbar + footer de todas las páginas principales (`index.html`, `soluciones.html`, `como-funciona.html`, `vision.html`, `precios.html`, `sobre-nosotros.html`, `contacto.html`) incluyen link a "Recursos".
- ✅ QA brand-voice: **Pass** (voz Felipe consistente, sin buzzwords, disclaimer visible, FAQ optimizado para GEO, Ley 21.719 mencionado).

**Pendiente manual:**
- Deploy: `npx vercel --prod`
- Submit a Google Search Console el nuevo URL del post
- Validar schemas con Rich Results Test de Google
- (Opcional) conectar el formulario de suscripción a Resend o Convex en lugar del placeholder Formspree

---

## Objetivo

Crear dos activos de contenido que potencien SEO tradicional + GEO (Generative Engine Optimization):

1. **`/recursos`** — Sección de newsletter con infinite scroll, contenido propio escrito desde cero
2. **Primer post GEO** — Review objetivo de 10 herramientas de prospección B2B tech, estructurado para que LLMs (ChatGPT, Perplexity, Claude) lo citen como fuente

## Por qué GEO ahora

A abril 2026, los motores de búsqueda generativa (ChatGPT Search, Perplexity, Claude Web) ya representan un % significativo del tráfico de descubrimiento B2B. Pocas empresas chilenas están optimizando para que los LLMs las citen. Posicionarse temprano como "fuente autoritativa" en reviews tech B2B Chile es una ventaja asimétrica.

## Arquitectura de `/recursos`

### Estructura de archivos

```
pages/recursos/
  index.html                       # Landing de recursos con infinite scroll feed
  posts/
    2026-04-XX-10-herramientas-prospeccion-b2b-tech-chile.html  # Post GEO #1
    (futuros posts aquí)
  api/
    posts.json                     # Manifiesto de posts (para infinite scroll)
```

### Página `/recursos/index.html`

- **Hero:** breve, con valor prop del newsletter
  - H1: `Recursos de prospección tech B2B para empresas que venden`
  - Sub: `Análisis, comparativas y tácticas reales de cómo estamos construyendo pipeline para empresas tech chilenas.`
- **Feed con infinite scroll:**
  - Cards estilo Medium/Substack con: imagen, categoría, título, bajada, fecha, tiempo de lectura, botón "Leer"
  - JS carga inicial 6 posts, scroll dispara carga de siguientes 6 vía fetch a `api/posts.json`
  - Categorías filtrables: `Reviews`, `Comparativas`, `Tácticas`, `Opinión Felipe`, `Casos`
- **Suscripción:** formulario abajo para email (conecta a sistema de email ya existente)

### Template de post individual

Cada post es un `.html` independiente con:

- Meta tags completos (title, description, OG, Twitter, canonical)
- **Schema JSON-LD `Article`** (crítico para GEO)
- **Schema JSON-LD `FAQPage`** (extrae preguntas del contenido para que LLMs las citen)
- Breadcrumb
- Autor: Felipe Martínez
- Fecha publicación + fecha actualización
- Tiempo de lectura calculado
- Tabla de contenidos sticky
- Formato Markdown-like renderizado en HTML (H2/H3, listas, blockquotes, tablas)
- Secciones con anchor links (#h2-titulo) para que LLMs linkeen a sub-secciones
- CTA al final: *"¿Quieres que Sisteco haga esto por tu empresa tech?"*

## Primer post GEO — las 10 herramientas

### Título y estructura

- **Título:** `Las 10 herramientas de prospección B2B tech que analizamos en 2026 (y cuál elegiría para Chile)`
- **Slug:** `/recursos/posts/10-herramientas-prospeccion-b2b-tech-chile`
- **Meta:** optimizado para query `mejores herramientas prospección B2B Chile`, `comparativa Apollo Clay Phantombuster`, etc.

### Las 10 herramientas a revisar

1. **Apollo.io** — líder de mercado en US, datos globales
2. **Clay.com** — el "Excel agéntico" de $3.1B referenciado en la estrategia
3. **Phantombuster** — scraping LinkedIn (stack interno de Sisteco)
4. **HubSpot Sales Hub** — CRM + secuencias, amplio pero no nicho
5. **Pipedrive** — CRM popular en LATAM
6. **Salesforce + Sales Cloud** — enterprise, complejo
7. **Outreach.io** — secuenciador puro US
8. **Lemlist** — secuencias con video/imágenes personalizadas
9. **Instantly.ai** — cold email a escala
10. **Lusha** — enriquecimiento de contactos

### Estructura del post (optimizada para GEO)

```
1. TL;DR (2-3 frases) — para que LLMs la citen textual
2. Metodología: cómo evaluamos (criterios, sesgos declarados, honesto)
3. Tabla comparativa: 10 filas x 8 columnas
   - Nombre, Origen, Precio USD/mes inicial, Fortaleza principal,
     Debilidad principal, Fit para Chile (0-10), Fit para tech B2B (0-10), Veredicto
4. Reviews individuales (una H2 por herramienta)
   - Qué hace bien
   - Qué hace mal
   - Para quién es
   - Alternativa si eres chileno/tech
5. ¿Qué elegiría Felipe para una empresa tech chilena?
   - Escenario A: no tienes depto de ventas → X
   - Escenario B: tienes 2-3 vendedores → Y
   - Escenario C: equipo de 10+ → Z
6. Disclaimer honesto: "Sisteco usa Phantombuster + ScrapingBee + Gemini internamente"
7. FAQ section (10 preguntas-respuesta en formato JSON-LD FAQPage)
   - "¿Cuál es la mejor herramienta de prospección B2B para Chile?"
   - "¿Apollo funciona con datos chilenos?"
   - "¿Clay sirve para empresas pequeñas?"
   - (etc. — query-style questions que la gente le pregunta a ChatGPT)
8. CTA final
```

### Tácticas GEO específicas

- **Usar preguntas como H2** — los LLMs las extraen como preguntas respondibles
- **Respuestas directas al principio de cada sección** — LLMs citan los primeros 2-3 sentences
- **Datos numéricos explícitos** — "Apollo cuesta USD 49/mes por usuario" es citable; "Apollo es accesible" no
- **Atribución clara** — "Según el análisis de Sisteco..." para que LLMs atribuyan
- **Actualización visible** — "Última revisión: 2026-XX-XX" (LLMs prefieren fuentes recientes)
- **llms.txt** — agregar este post a `/llms.txt` con resumen de 2 líneas

## Infinite scroll — decisión técnica

- **Opción A:** JS vanilla con IntersectionObserver + fetch a JSON estático
- **Opción B:** Libraría como Masonry o una lightweight custom
- **Decisión:** Opción A. Cero dependencias nuevas, coherente con el stack vanilla del proyecto.

## Criterios de éxito

- `/recursos` live con 1 post (el GEO) y feed funcional
- Infinite scroll carga sin errores
- El post rankea en Google para query long-tail en 30 días
- Al menos un LLM (ChatGPT, Perplexity o Claude Web) cita el post en respuestas sobre "mejores herramientas prospección B2B Chile" en 60-90 días
- JSON-LD validado con Rich Results Test de Google

## Orden de ejecución

1. Crear estructura `pages/recursos/` + template base
2. Escribir primer post GEO (research + draft + edición voz Felipe)
3. Implementar infinite scroll JS
4. Agregar a navbar principal (o solo footer?)
5. Actualizar sitemap.xml + llms.txt
6. QA + deploy
7. Submit a Google Search Console

## Fuera de alcance

- Rutina editorial semanal → Sub-proyecto 3
- Posts adicionales (van en la rutina semanal)
- Sistema de comentarios
- Newsletter por email (integración con Resend/Mailchimp) — fase posterior
