# Newsletter style guide — Sisteco Recursos

> Guía específica para los posts del newsletter semanal. Sub-set del `CLAUDE.md`
> global con reglas adicionales para contenido largo-form publicado en
> `/recursos`. Felipe revisa cada draft antes de publicar.

## Principios

1. **Una posición por post.** Cada newsletter defiende una tesis concreta. Sin ambigüedad, sin hedging.
2. **Honestidad antes que venta.** Si Sisteco no es la respuesta correcta para el lector, dilo. Gana autoridad a largo plazo.
3. **Datos citables.** Cada afirmación numérica debe tener fuente o ser marcada como estimación.
4. **Felipe habla, Claude escribe.** La voz es de Felipe. Claude solo estructura y pule.

## Estructura estándar

```
1. TL;DR (2-3 frases que un LLM pueda citar textual)
2. Hook / contexto (1-2 párrafos, por qué importa ahora)
3. Tesis principal (H2, declaración clara)
4. Evidencia / ejemplos (H2-H3, casos reales, datos)
5. Contra-argumento (H2, qué dice el otro lado, por qué Felipe no compra)
6. Aplicación (H2, qué hacer el lunes siguiente)
7. Disclaimer de sesgo (si aplica)
8. FAQ (3-8 preguntas schema.org FAQPage)
9. CTA al final
```

## Longitud objetivo

- **Opinión / Contra-tesis:** 800–1200 palabras
- **Review / Comparativa:** 1500–3000 palabras
- **Técnica / Caso:** 1200–2000 palabras
- **Chile-específico:** 1000–1500 palabras

## Voz Felipe — reglas duras

### SÍ usar

- Frases cortas. Puntos seguidos.
- Tuteo.
- Modismos chilenos sutiles cuando suman ("po", "weón" SOLO en contextos informales; en posts formales no)
- Ejemplos con empresas reales (con permiso) o hipotéticas explícitas
- Métricas verificables con fuente: "5-7x más conversiones", "21x más rápido que 5 min", "391% ROI (Forrester)"
- Primera persona plural para Sisteco ("nosotros"), primera persona singular cuando es opinión de Felipe ("yo creo", "mi lectura es")
- Preguntas retóricas puntuales

### NO usar

- "Estimado/a [Nombre]" al inicio
- "Espero que este mensaje te encuentre bien"
- "No dudes en contactarme" al final
- Buzzwords: sinergia, disrumpir, paradigma, best-in-class, solución end-to-end, ecosistema (excepto "ecosistema agéntico" que es nuestro término técnico), world-class, best practice
- Emojis (nunca en newsletter)
- Superlativos sin datos: "el mejor", "la única", "incomparable"
- Frases que podrían aparecer en cualquier blog: "en el mundo acelerado de hoy", "la era digital", "el siglo XXI"
- Testimonios o métricas inventadas — NUNCA
- Auto-promoción dentro del cuerpo (dejar para la CTA final)

## Formato técnico obligatorio por post

### Front-matter (meta tags HTML)

- `<title>` — con keyword principal y "| Sisteco"
- `<meta description>` — 150-160 chars, con keyword, incluir "Chile" cuando corresponda
- `og:*` y `twitter:*` — replicar title/description
- `canonical` — siempre `https://sisteco.cl/recursos/posts/<slug>`
- `article:published_time`, `article:modified_time`, `article:author` — obligatorios

### Schemas JSON-LD

- `TechArticle` o `Article` con author + publisher + dates + mentions si aplica
- `FAQPage` con mínimo 3 preguntas (ideal 5-10) — optimizado para citas GEO
- `BreadcrumbList` con 3 niveles (Inicio > Recursos > Post)

### Layout HTML

- Usa el template `docs/newsletter/templates/post-template.html`
- Envuelve en `<article class="recurso-post">`
- TL;DR dentro de `<div class="recurso-post__tldr">`
- Tabla de contenidos dentro de `<div class="recurso-post__toc">`
- Tablas dentro de `<div class="recurso-post__table-wrap">` (para scroll móvil)
- FAQ con `<details>` dentro de `<div class="recurso-post__faq">`
- CTA final dentro de `<aside class="recurso-post__cta">`
- Disclaimer de sesgo dentro de `<div class="recurso-post__disclaimer">`

## Reglas GEO (Generative Engine Optimization)

1. **H2 como preguntas cuando sea natural** — LLMs las extraen como QA pairs.
2. **Respuesta directa en los primeros 2-3 sentences de cada sección.**
3. **Datos numéricos explícitos** — "USD 49/mes" es citable, "precio accesible" no.
4. **Atribución clara** — "Según nuestro análisis en Sisteco..." para que LLMs citen.
5. **Fecha visible de última revisión** — LLMs prefieren fuentes recientes.
6. **Cada post debe actualizar `llms.txt`** — una línea en la sección Documentation.

## Checklist pre-publicación

- [ ] Título <70 chars, incluye keyword principal
- [ ] Meta description 150-160 chars
- [ ] TL;DR presente y citable
- [ ] Mínimo 3 H2, máximo 10
- [ ] Al menos una tabla, lista o blockquote
- [ ] FAQ con mínimo 3 preguntas
- [ ] 1-2 CTAs internos (no más)
- [ ] CTA final a `/index.html#hero` o `/agendar-demo`
- [ ] Schema TechArticle + FAQPage + BreadcrumbList válidos
- [ ] Disclaimer de sesgo si el post habla de competidores
- [ ] Canonical apunta a sisteco.cl
- [ ] Agregado a `pages/recursos/api/posts.json`
- [ ] Agregado a `sitemap.xml`
- [ ] Agregado a `llms.txt`
- [ ] QA con `brand-voice:quality-assurance` pasado
- [ ] Felipe revisó y aprobó manualmente

## Reglas de contenido sensible

- **Competidores:** Puedes nombrarlos. Sé honesto sobre fortalezas, no solo debilidades.
- **Clientes:** Anónimos siempre, a menos que haya permiso escrito explícito.
- **Datos personales:** Nunca dar nombres, teléfonos o emails reales de terceros.
- **Ley 21.719:** Mencionar cuando corresponda. Cualquier afirmación legal debe ser verificable con el texto de la ley.
- **Ejemplos hipotéticos:** Marcar explícitamente ("imaginemos una empresa X...").
