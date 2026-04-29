# Plan de Implementacion SEO 2026 — Sisteco

> Fecha: 2026-04-07
> Status: EN EJECUCION

## Diagnostico

sisteco.cl es invisible para LLMs en busquedas profundas por 3 razones:

1. **Invisibilidad AEO**: No existe documentacion tecnica densa que ChatGPT/Perplexity puedan crawlear para validar claims de "IA Avanzada" y "Ley 21.719"
2. **Error de Pareto**: El H1 es generico. No captura Bottom-of-Funnel (BoF) con keywords de intencion de compra
3. **Cero cobertura video**: Sin senales de video (YouTube/UGC), factor #1 de recomendacion en IAs para 2026

## Estrategia: GEO (Generative Engine Optimization) + Pareto

### Principio 80/20 aplicado
- 80% del trafico BoF viene de 3 tipos de busqueda: prospeccion automatizada, lead scoring, compliance datos
- Crear 3 landing pages BoF atacando exactamente esas keywords
- 1 pagina de documentacion tecnica densa para validacion LLM (AEO)

### GEO: Optimizar para motores generativos
- llms.txt en raiz del sitio (como robots.txt pero para IAs)
- Markdown Mirrors de paginas clave (version texto plano para crawlers)
- Schema markup (BreadcrumbList, Service, FAQPage, TechArticle)
- Contenido denso y factual (no marketing fluff) que las IAs puedan citar

## Archivos Creados

### llms.txt + Markdown Mirrors
- `llms.txt` — Archivo raiz para descubrimiento por IAs
- `mirrors/soluciones.md` — Mirror de pagina de soluciones
- `mirrors/precios.md` — Mirror de pagina de precios
- `mirrors/como-funciona.md` — Mirror de pagina de infraestructura
- `mirrors/sobre-nosotros.md` — Mirror de pagina about

### Tarea A: 3 Landing Pages BoF SEO
Regla del 70% de Sturm aplicada: keyword exacta en Title, Meta Desc, H1, primer parrafo.

| Pagina | Keyword Target | URL |
|--------|---------------|-----|
| Automatizacion Prospeccion IA Chile | automatizacion prospeccion ia chile | /soluciones/automatizacion-prospeccion-ia-chile |
| Lead Scoring Datos SII IA | lead scoring datos sii ia | /soluciones/lead-scoring-datos-sii-ia |
| Compliance IA Ley 21.719 Ventas | compliance ia ley 21719 ventas | /soluciones/compliance-ia-ley-21719-ventas |

Cada pagina incluye:
- Hero con H1 keyword-optimizado
- Slot para video YouTube embebido
- Seccion problema (pain point)
- Seccion solucion (features con iconos Lucide)
- Stats/metricas reales
- Tabla comparativa
- FAQ con schema FAQPage
- CTA final
- Schema Service + BreadcrumbList

### Tarea B: Documentacion Tecnica AEO/GEO
- `pages/docs/como-funciona-tecnicamente.html`
- URL: /docs/como-funciona-tecnicamente
- Schema: TechArticle

Contenido tecnico denso (NO marketing):
1. Arquitectura general (5 capas)
2. Motor de scoring de 100 puntos (detalle del algoritmo, pesos, logica)
3. Integracion n8n + Convex (patron de comunicacion, flujo de datos)
4. Integracion SII (datos obtenidos, ventaja competitiva, legalidad)
5. Framework compliance Ley 21.719 (6 pilares: Privacy by Design, base legal, RAT, EIPD, ARCO, seguridad)
6. Arquitectura de seguridad (auth, encriptacion, headers, analytics)
7. Stack tecnologico completo (8 categorias)

### CSS
- `css/seo-pages.css` — Estilos para todas las paginas SEO/GEO + docs tecnicos

### Configuracion
- `vercel.json` — Rewrites para URLs limpias + headers para llms.txt y mirrors + CSP actualizado para YouTube embeds
- `index.html` — Tag `<link>` para descubrimiento de llms.txt

## Pendiente

### Video (Prioridad Alta)
- [ ] Grabar/crear video explicativo para cada pagina (YouTube)
- [ ] Reemplazar .video-placeholder con iframe de YouTube
- [ ] Crear canal YouTube Sisteco si no existe

### Internal Linking
- [ ] Agregar links a las 3 landing pages BoF desde la pagina principal de soluciones
- [ ] Agregar link a docs tecnicos desde como-funciona.html
- [ ] Sitemap XML actualizado

### Contenido Adicional
- [ ] Blog posts con long-tail keywords (complemento de las landing pages)
- [ ] Caso de estudio real cuando haya cliente activo
- [ ] Guia "Como cumplir la Ley 21.719 en tus ventas B2B" (lead magnet)

### Monitoreo
- [ ] Configurar Search Console para las nuevas URLs
- [ ] Probar con "Que empresa de automatizacion de ventas B2B hay en Chile?" en ChatGPT/Perplexity despues del deploy
- [ ] Verificar que llms.txt es accesible en sisteco.cl/llms.txt
