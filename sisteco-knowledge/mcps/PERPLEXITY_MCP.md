# Perplexity MCP — Guia de Uso en Sisteco

> Perplexity es un motor de busqueda con IA que proporciona respuestas con fuentes verificadas.
> Ideal para investigacion de mercado, datos de industria, y contexto actualizado.

---

## Que hace Perplexity MCP

A diferencia de Claude (que tiene cutoff de conocimiento), Perplexity:
- Busca en internet en tiempo real
- Proporciona fuentes verificadas con cada respuesta
- Especializado en busquedas complejas que necesitan datos actualizados

---

## Herramientas disponibles

```
mcp__perplexity__search    — Busqueda general con fuentes
mcp__perplexity__research  — Investigacion profunda (multiples busquedas)
```

---

## Uso tipico en Sisteco

### 1. Investigacion de mercado

```
"Usa Perplexity para investigar:
- Cuantas empresas de 50-500 empleados hay en Chile en sectores B2B
- Cuanto gasta una empresa chilena mediana en herramientas de ventas
- Cuales son los principales CRMs usados en Chile"
```

### 2. Datos de industria para argumentos de venta

```
"Con Perplexity, busca estadisticas actualizadas sobre:
- ROI de automatizacion de ventas en LATAM
- Tasa de adopcion de IA en empresas chilenas
- Tiempo promedio de respuesta a leads en B2B Chile"
```

### 3. Analisis de competidores (datos actualizados)

```
"Usa Perplexity para investigar:
- Que nuevas funcionalidades lanzo Apollo.io en los ultimos 6 meses
- Precio actual de PhantomBuster en Chile (con IVA si aplica)
- Nuevos players de sales automation en LATAM en 2025-2026"
```

### 4. Investigacion legal / compliance

```
"Con Perplexity, busca informacion actualizada sobre:
- Estado de implementacion de la Ley 21.719 en Chile
- Multas aplicadas por el PDPC en Chile en 2025-2026
- Requisitos especificos para empresas SaaS bajo Ley 21.719"
```

---

## Usos reales en Sisteco

### Investigacion financiera (2026-02-27)
Se uso para verificar:
- Benchmarks de pricing de herramientas de ventas (Apollo, PhantomBuster, ScrapingBee)
- Costo de SDRs en Chile (CLP 800K-1.2M/mes)
- Estadisticas de ROI en automatizacion de ventas (391% Forrester/PolyAI)
- Tasas de conversion de respuesta rapida (21x en < 5 minutos)

### Analisis competitivo landing page (2026-03-04)
Usado para:
- Verificar posicionamiento actual de Apollo.io y AmpleMarket
- Tendencias de diseno en landing pages SaaS 2025-2026
- Estadisticas de omnichannel vs monocanal (89% vs 33% retencion)

---

## Configuracion del MCP

```json
// En claude.json
"perplexity": {
  "command": "npx",
  "args": ["-y", "perplexity-mcp"],
  "env": {
    "PERPLEXITY_API_KEY": "pplx-..."
  }
}
```

**API Key:** Obtener en perplexity.ai (plan gratuito con limites)

---

## Cuando usar Perplexity vs WebSearch de Claude Code

| Herramienta | Cuando usar |
|---|---|
| **Perplexity MCP** | Investigacion con citaciones, datos de mercado actualizados, analisis profundo |
| **WebSearch nativo** | Busquedas rapidas, verificar algo especifico, busquedas simples |
| **WebFetch nativo** | Cuando tienes la URL exacta y quieres extraer contenido |
| **Firecrawl MCP** | Cuando el sitio usa JavaScript o necesitas crawl de multiples paginas |

---

## Mejores practicas

1. **Ser especifico en la busqueda:** En vez de "pricing de herramientas de ventas", pide "precio de Apollo.io Plan Pro en USD para mercado latinoamerica 2026"
2. **Pedir fuentes:** Siempre pedir que Perplexity cite las fuentes para verificar
3. **Cruzar con datos internos:** Los datos de Perplexity son externos — siempre validar contra experiencia propia
4. **Usar para actualizaciones:** Ideal para verificar si algo cambio desde el cutoff de conocimiento de Claude

---

*Perplexity es especialmente valioso para mantener la investigacion de Sisteco actualizada con datos reales del mercado chileno y LATAM.*
