# MCPs de Sisteco — Vision General

> MCP = Model Context Protocol — Protocolo de Anthropic que permite a Claude Code
> conectarse con herramientas externas como si fueran capacidades nativas.

---

## Que son los MCPs

Los MCPs son servidores que extienden las capacidades de Claude Code:
- Se configuran en `~/.claude/claude.json` o `~/.config/claude/claude.json`
- Claude puede llamarlos como herramientas nativas
- Permiten acceder a APIs externas, bases de datos, sistemas de archivos, etc.
- Son "deferred tools" — se cargan bajo demanda cuando Claude los necesita

---

## MCPs configurados en el entorno de Sisteco

| MCP | Categoria | Uso principal |
|---|---|---|
| **Firecrawl** | Extraccion de datos | Crawling de sitios web |
| **Perplexity** | Investigacion | Busquedas con fuentes verificadas |
| **Playwright** | Automatizacion web | Testing, scraping con browser |
| **IDE (mcp__ide__)** | Desarrollo | getDiagnostics, executeCode |

---

## Como usar un MCP en Claude Code

```
# Paso 1: Buscar el MCP
ToolSearch: "firecrawl"
→ Claude carga mcp__firecrawl__scrape_url y mcp__firecrawl__crawl

# Paso 2: Usar el MCP directamente
mcp__firecrawl__scrape_url({
  url: "https://ejemplo.com/pricing",
  formats: ["markdown"]
})
```

O simplemente menciona la herramienta en tu instruccion:
```
"Usa Firecrawl para extraer el pricing de apollo.io"
```

---

## MCPs disponibles en el sistema (lista completa conocida)

### Datos y Extraccion
- `mcp__firecrawl__*` — Firecrawl: scraping y crawling
- `mcp__playwright__*` — Playwright: browser automation

### Investigacion
- `mcp__perplexity__*` — Perplexity: busquedas con fuentes

### IDE y Desarrollo
- `mcp__ide__executeCode` — Ejecutar codigo directamente
- `mcp__ide__getDiagnostics` — Obtener diagnosticos del IDE

### n8n (si configurado)
- `mcp__n8n__*` — Gestionar workflows n8n directamente

---

## Configuracion de MCPs

Los MCPs se configuran en el archivo de configuracion de Claude Code:

```json
// ~/.claude/claude.json (aproximado)
{
  "mcpServers": {
    "firecrawl": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "fc-..."
      }
    },
    "perplexity": {
      "command": "npx",
      "args": ["-y", "perplexity-mcp"],
      "env": {
        "PERPLEXITY_API_KEY": "pplx-..."
      }
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp"]
    }
  }
}
```

---

## Ver documentos especificos

- `FIRECRAWL_MCP.md` — Guia detallada de Firecrawl
- `PERPLEXITY_MCP.md` — Guia detallada de Perplexity
- `PLAYWRIGHT_MCP.md` — Guia detallada de Playwright

---

*Los MCPs se ejecutan como procesos separados y se comunican con Claude Code via el protocolo MCP.*
