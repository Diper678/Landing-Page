# Playwright MCP — Guia de Uso en Sisteco

> Playwright es un framework de automatizacion de browsers (Chrome, Firefox, Safari).
> Via MCP, Claude Code puede controlar un browser real para testing, scraping y automatizacion.

---

## Que hace Playwright MCP

Playwright MCP permite a Claude Code:
- Abrir URLs en un browser real
- Hacer clic en elementos, llenar formularios, navegar
- Tomar screenshots de paginas
- Extraer datos de paginas con JavaScript complejo
- Ejecutar flujos de testing automatizados

**Diferencia con Firecrawl:** Playwright controla un browser real (interactivo). Firecrawl es headless/optimizado para extraccion. Usa Playwright cuando necesitas interaccion real con la pagina.

---

## Herramientas disponibles

```
mcp__playwright__navigate      — Navegar a una URL
mcp__playwright__click         — Hacer clic en un elemento
mcp__playwright__type          — Escribir texto en un campo
mcp__playwright__screenshot    — Tomar screenshot
mcp__playwright__evaluate      — Ejecutar JavaScript en la pagina
mcp__playwright__get_text      — Extraer texto de un elemento
mcp__playwright__wait_for      — Esperar que aparezca un elemento
```

---

## Uso tipico en Sisteco

### 1. Testing del formulario de leads

```
"Usa Playwright para:
1. Abrir http://localhost:3000
2. Llenar el formulario de email con 'test@empresa.cl'
3. Hacer clic en 'Comenzar gratis'
4. Tomar screenshot del resultado
5. Verificar que aparece el mensaje de confirmacion"
```

### 2. Verificacion visual de la landing page

```
"Con Playwright, toma screenshots de:
- http://localhost:3000 en 1920x1080 (desktop)
- http://localhost:3000 en 375x812 (mobile)
- Cada seccion de la pagina (navbar, hero, bento, comparison, cta, footer)

Verificar que el navbar flotante aparece correctamente al hacer scroll"
```

### 3. Testing del checkout (dLocal Go)

```
"Usa Playwright para simular el flujo de checkout:
1. Ir a /pages/precios.html
2. Hacer clic en 'Plan Crecimiento - Mensual'
3. Verificar que redirige a dLocal Go sandbox
4. Tomar screenshot del checkout page"
```

### 4. Scraping de paginas con JavaScript

```
"Con Playwright, extrae la tabla de precios de [competidor].com
La pagina usa React y carga los precios dinamicamente.
Espera que carguen y dame el HTML de la tabla."
```

---

## Configuracion del MCP

```json
// En claude.json
"playwright": {
  "command": "npx",
  "args": ["-y", "@playwright/mcp"]
}
```

*No requiere API key — Playwright se ejecuta localmente.*

### Instalar Playwright (si no esta instalado)

```bash
npx playwright install chromium
```

---

## Ejemplos de uso con Claude Code

### Testing E2E del formulario de leads

```
"Ejecuta un test E2E completo del formulario de leads:
1. Abre http://localhost:3000 con Playwright
2. Llena email: 'test-[timestamp]@empresa.cl'
3. Submit el formulario
4. Verifica en el dashboard de Convex que el lead aparece
5. Toma screenshot de confirmacion
6. Dame el resultado del test"
```

### Verificacion de animaciones

```
"Con Playwright, verifica que las animaciones de Sisteco funcionan:
1. Abre la landing en viewport 1440x900
2. Hace scroll hacia abajo lentamente (simula scroll del usuario)
3. En cada seccion, toma screenshot para verificar fadeInUp
4. Verifica que el navbar cambia a pill despues de scrollear 80px"
```

---

## Cuando usar cada herramienta

| Necesidad | Herramienta |
|---|---|
| Scrape de contenido estatico | Firecrawl o WebFetch |
| Scrape de SPA (React/Vue) | Firecrawl |
| Testing interactivo | Playwright |
| Scrape que requiere login | Playwright |
| Screenshot de paginas | Playwright |
| Verificacion de formularios | Playwright |
| Investigacion de mercado | Perplexity |
| Crawl de sitio completo | Firecrawl |

---

*Playwright MCP es especialmente util para el ciclo de desarrollo: verificar que los cambios en la landing page se ven correctamente antes de hacer deploy.*
