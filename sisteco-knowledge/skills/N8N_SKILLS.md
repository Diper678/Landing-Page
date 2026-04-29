# Skills n8n — Guia de Uso en Sisteco

> Claude Code tiene 5 skills especializadas para trabajar con n8n.
> Estas skills se activan automaticamente cuando trabajas con codigo o configuracion de n8n.

---

## Las 5 Skills de n8n

### 1. `/n8n-code-javascript` — Codigo JavaScript en n8n
**Cuando usar:** Escribir JavaScript en nodos Code de n8n

**Variables especiales de n8n:**
```javascript
// Input del nodo anterior
$input.all()        // todos los items
$input.first()      // primer item
$input.item         // item actual en loop

// Acceder a datos
$json              // datos del item actual (shorthand)
$node["NombreNodo"].json  // datos de un nodo especifico

// HTTP requests
await $helpers.httpRequest({
  method: 'GET',
  url: 'https://api.ejemplo.com/data',
  headers: { 'Authorization': 'Bearer token' }
})

// Fechas con DateTime de Luxon
const ahora = DateTime.now();
const manana = DateTime.now().plus({ days: 1 });
const formateado = ahora.toFormat('yyyy-MM-dd');
```

**Modos de nodo Code:**
- `Run Once for All Items` — corre una vez, procesa todo el array `$input.all()`
- `Run Once for Each Item` — corre por cada item individualmente

### 2. `/n8n-code-python` — Codigo Python en n8n
**Cuando usar:** Escribir Python en nodos Code de n8n

**Variables en Python (con underscore en vez de $):**
```python
# Input
_input.all()       # todos los items
_input.first()     # primer item
_json              # datos del item actual

# Limitaciones Python en n8n:
# - Solo libreria estandar de Python
# - No pip install dentro del nodo
# - No requests nativos (usar HTTP Request node en su lugar)
```

### 3. `/n8n-expression-syntax` — Expresiones en n8n
**Cuando usar:** Escribir expresiones `{{}}` en campos de n8n

**Sintaxis de expresiones:**
```
{{ $json.nombre }}                  // Campo del item actual
{{ $json.email.toLowerCase() }}     // Con JS nativo
{{ $node["Lead Score"].json.score }}  // De otro nodo
{{ $now.toISO() }}                  // Timestamp actual
{{ $runIndex }}                     // Indice del run actual

// Condicional
{{ $json.score > 75 ? "HOT" : "WARM" }}

// Concatenar
{{ "Hola " + $json.nombre + ", tu score es " + $json.score }}
```

**Errores comunes:**
- `Cannot read property of undefined` → el nodo anterior no emitio datos
- `Expression Error` → sintaxis JS incorrecta dentro de `{{ }}`
- Usar `$json?.campo` (optional chaining) para campos opcionales

### 4. `/n8n-node-configuration` — Configurar nodos correctamente
**Cuando usar:** Configurar nodos HTTP Request, webhook, email, etc.

**Nodos mas usados en Sisteco:**

```
HTTP Request Node:
- Method: POST/GET/PATCH/DELETE
- URL: endpoint
- Authentication: Header Auth (Bearer token)
- Body: JSON { key: value }
- Response: JSON

Webhook Node:
- Authentication: Header Auth
- HTTP Method: POST
- Path: /sisteco-leads (o lo que sea)
- Response Mode: Last Node / Respond to Webhook

Code Node:
- Language: JavaScript/Python
- Mode: Run Once / Each Item

Set Node:
- Mapear campos de un item a otro nombre
- Util para renombrar o transformar

IF Node:
- Condicion: $json.score > 75
- Dos outputs: true / false

Merge Node:
- Combinar datos de dos ramas
```

### 5. `/n8n-workflow-patterns` — Patrones arquitecturales
**Cuando usar:** Disenando la estructura de un workflow nuevo

**Patrones usados en Sisteco:**

```
Patron Webhook → Procesar → Notificar:
[Webhook] → [Validar datos] → [Code: Scoring] → [IF: HOT?]
  YES → [Slack alert]
  NO → [Agregar a secuencia email]

Patron Scheduled Trigger → Batch:
[Schedule Trigger: 8:45 AM] → [HTTP: Get pending emails from Convex]
  → [Split In Batches] → [Gemini: personalizar] → [Resend: enviar]
  → [HTTP: mark sent in Convex]

Patron Error Handling:
[Cualquier nodo] → (si falla) → [Error Trigger] → [Slack: alert error]
  → [HTTP: mark failed in Convex]
```

---

## Conexion n8n ↔ Sisteco

### Desde la API de Vercel → n8n

```javascript
// En api/leads.js (despues de guardar en Convex)
if (isHotLead) {
  await fetch(process.env.N8N_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.N8N_AUTH_KEY}`
    },
    body: JSON.stringify({
      event: 'lead.hot',
      leadId: result._id,
      email: email,
      score: score,
      company: company
    })
  });
}
```

### Desde n8n → Convex (via HTTP Request)

```javascript
// En nodo HTTP Request de n8n
// URL: {{ process.env.CONVEX_URL }}/api/leads/mark-contacted
// Method: POST
// Body (JSON):
{
  "leadId": "{{ $json.leadId }}",
  "status": "contacted",
  "channel": "email"
}
```

---

## Buenas practicas con n8n en Sisteco

1. **Siempre loguear errores a Slack** — nunca dejes un workflow sin manejo de errores
2. **Usar Convex como fuente de verdad** — n8n procesa, Convex almacena estado
3. **Rate limiting en outreach** — max 200 conexiones LinkedIn/semana, max 500 emails/dia
4. **Testear en staging primero** — usar leads de prueba antes de activar con datos reales
5. **Documentar cada workflow** — nombre descriptivo + nota en el nodo inicial con el proposito
6. **Webhooks con autenticacion** — siempre usar N8N_AUTH_KEY para proteger endpoints

---

*Las skills de n8n se activan automaticamente en Claude Code cuando detecta codigo o configuracion relacionada con n8n.*
