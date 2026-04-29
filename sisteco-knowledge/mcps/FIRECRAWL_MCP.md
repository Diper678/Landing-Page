# Firecrawl MCP — Guia de Uso en Sisteco

> Firecrawl convierte sitios web en datos limpios (Markdown, JSON, HTML).
> Se usa para investigacion de competidores, extraccion de datos de empresas, y análisis de sitios.

---

## Que hace Firecrawl

- **Scrape:** Extrae el contenido de una URL especifica
- **Crawl:** Extrae el contenido de un sitio web completo (todas las paginas)
- **Map:** Obtiene el mapa de URLs de un sitio
- **Extract:** Extrae datos estructurados de una pagina segun un schema

**Ventaja vs ScrapingBee:** Firecrawl maneja JavaScript, SPAs, y es especialmente bueno con contenido de marketing/landing pages. ScrapingBee es mejor para scraping masivo.

---

## Herramientas disponibles (MCP tools)

```
mcp__firecrawl__scrape_url     — Scrape una URL especifica
mcp__firecrawl__crawl_url      — Crawl de sitio completo
mcp__firecrawl__map_url        — Obtener mapa de URLs
mcp__firecrawl__extract        — Extraer datos estructurados
mcp__firecrawl__check_crawl    — Verificar estado de un crawl
mcp__firecrawl__cancel_crawl   — Cancelar un crawl en progreso
mcp__firecrawl__get_crawl_data — Obtener datos de un crawl completado
```

---

## Uso tipico en Sisteco

### 1. Investigar competidor

```
"Usa Firecrawl para hacer scrape de apollo.io/pricing y extrae:
- Los planes y precios
- Los features de cada plan
- Las empresas que mencionan como clientes"
```

Claude Code usara:
```javascript
mcp__firecrawl__scrape_url({
  url: "https://www.apollo.io/pricing",
  formats: ["markdown"],
  onlyMainContent: true
})
```

### 2. Analizar landing page de empresa target

```
"Usa Firecrawl para scrape de [empresa].cl y dame:
- Descripcion del negocio
- Productos o servicios que ofrecen
- Tamano estimado de la empresa
- Stack tecnologico (si se detecta)"
```

### 3. Crawl de sitio completo

```
"Usa Firecrawl para crawl de amplemarket.com, maximo 20 paginas,
y dame un resumen de:
- Su propuesta de valor
- Features que destacan
- Como estructuran su pricing"
```

---

## Usos reales en el proyecto de Sisteco

### Analisis competitivo para landing page (2026-03-04)
Se uso Firecrawl para scrape de:
- `apollo.io` — Footer horizontal, social proof, CTA patterns
- `amplemarket.com` — Navbar floating pill, estructura de copy
- `firecrawl.dev` — Gradient orbs, dark theme animations
- `base10.vc` — Estetica dark minimal, tipografia bold
- `humbleops.com` — Tabla comparativa 4 columnas, timeline de implementacion

Resultado: Documento `.planning/LANDING_PAGE_IMPROVEMENTS.md` con 8 mejoras priorizadas.

---

## Formatos de output

```
formats: ["markdown"]  — Texto limpio con formato MD (mejor para leer)
formats: ["html"]      — HTML completo
formats: ["rawHtml"]   — HTML sin procesar
formats: ["links"]     — Solo links de la pagina
formats: ["screenshot"] — Screenshot de la pagina
```

---

## Configuracion del MCP

```json
// En claude.json
"firecrawl": {
  "command": "npx",
  "args": ["-y", "firecrawl-mcp"],
  "env": {
    "FIRECRAWL_API_KEY": "fc-..."
  }
}
```

**API Key:** Obtener en firecrawl.dev (plan gratuito disponible)

---

## Tips de uso

1. **`onlyMainContent: true`** — Elimina navegacion, footer, sidebar. Solo el contenido principal.
2. **Para SPAs (React, Vue):** Firecrawl renderiza JavaScript, ideal para apps modernas.
3. **Para crawl masivo:** Usar `limit: 10-20` para empezar, aumentar si necesario.
4. **Rate limits:** El plan gratuito tiene limites — usar con moderacion.

---

## Alternativa: WebFetch nativo de Claude Code

Para URLs simples sin JavaScript, Claude Code tiene `WebFetch` nativo:
```
WebFetch({ url: "https://ejemplo.com", format: "markdown" })
```

Usar Firecrawl cuando:
- El sitio usa JavaScript/React/Vue
- Necesitas crawl de multiples paginas
- Necesitas extraccion estructurada

---

*Firecrawl es usado tanto como MCP en Claude Code como herramienta de scraping en los workflows de extraccion de datos de n8n.*
