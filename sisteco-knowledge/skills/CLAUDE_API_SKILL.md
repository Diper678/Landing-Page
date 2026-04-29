# Skill: Claude API — Guia de Uso en Sisteco

> Skill de Claude Code para construir aplicaciones que usan la API de Anthropic.
> Se activa automaticamente cuando el codigo importa `anthropic` o `@anthropic-ai/sdk`.

---

## Cuando se activa

La skill `claude-api` se activa cuando:
- El codigo importa `anthropic` o `@anthropic-ai/sdk`
- El usuario pide "usar la API de Claude" o "integrar Anthropic"
- El codigo usa `Claude` o `claude_agent_sdk`

**NO se activa cuando:**
- Importas `openai` u otro SDK de IA
- Haces tareas de programacion general
- Haces ML/data-science sin la API de Anthropic

---

## Setup basico

```bash
npm install @anthropic-ai/sdk
```

```javascript
// .env
ANTHROPIC_API_KEY=sk-ant-...
```

---

## Uso basico — Mensaje simple

```javascript
const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const message = await client.messages.create({
  model: 'claude-sonnet-4-6',  // Modelo recomendado para Sisteco
  max_tokens: 1024,
  messages: [
    {
      role: 'user',
      content: 'Analiza este perfil de empresa y dame un score de 0-100...'
    }
  ]
});

console.log(message.content[0].text);
```

---

## Modelos disponibles (2026)

| Modelo | ID | Uso recomendado |
|---|---|---|
| **Claude Sonnet 4.6** | `claude-sonnet-4-6` | Equilibrio calidad/velocidad/costo — **default Sisteco** |
| **Claude Opus 4.6** | `claude-opus-4-6` | Maximo razonamiento (mas lento y caro) |
| **Claude Haiku 4.5** | `claude-haiku-4-5-20251001` | Tareas rapidas y economicas |

**Para Sisteco:** Usar `claude-sonnet-4-6` como default.

---

## Casos de uso en Sisteco

### 1. Lead Scoring con Claude

```javascript
// api/score-lead.js
const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function scoreLead(leadData) {
  const prompt = `
Eres un experto en B2B sales para el mercado chileno de empresas medianas.

Analiza este perfil y devuelve un JSON con score (0-100) y categoria:

Empresa: ${leadData.companyName}
Industria: ${leadData.industry}
Tamano: ${leadData.employees} empleados
Website: ${leadData.websiteContent}
Cargo del contacto: ${leadData.jobTitle}
LinkedIn summary: ${leadData.linkedinBio}

Criterios de scoring:
- Empresa 50-500 empleados: +20 pts
- Industria objetivo (SaaS, agencias, consultoras): +15 pts
- Decision-maker (CEO, VP, Director): +20 pts
- Stack tecnologico compatible: +15 pts
- Actividad reciente: +10 pts
- Presencia web activa: +10 pts
- Senales de crecimiento: +10 pts

Responde SOLO con JSON: { "score": 85, "categoria": "HOT", "razon": "..." }
`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 200,
    messages: [{ role: 'user', content: prompt }]
  });

  return JSON.parse(response.content[0].text);
}
```

### 2. Personalizacion de Emails

```javascript
async function personalizeEmail(lead, emailTemplate, sequence) {
  const prompt = `
Eres un experto en ventas B2B. Personaliza este email para el siguiente lead.

Lead:
- Nombre: ${lead.firstName}
- Empresa: ${lead.company}
- Cargo: ${lead.title}
- Industria: ${lead.industry}
- Score: ${lead.score}/100 (${lead.category})
- Pagina web de la empresa: ${lead.websiteContent}

Template base del email ${sequence} de 5:
${emailTemplate}

Reglas de personalizacion:
1. Menciona un dato especifico de su empresa o industria
2. El asunto debe ser especifico y generar curiosidad (max 50 chars)
3. Tono: profesional pero directo, sin ser agresivo
4. Maximo 120 palabras en el cuerpo
5. CTA claro al final

Responde SOLO con JSON:
{
  "subject": "...",
  "body": "..."
}
`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 500,
    messages: [{ role: 'user', content: prompt }]
  });

  return JSON.parse(response.content[0].text);
}
```

### 3. Analisis de respuestas de leads

```javascript
async function analyzeLeadResponse(emailBody) {
  const prompt = `
Analiza esta respuesta de un lead a un email de prospeccion B2B.
Clasifica la intencion y sugiere la siguiente accion.

Respuesta del lead:
"${emailBody}"

Responde con JSON:
{
  "intent": "interested" | "not_interested" | "later" | "question" | "objection",
  "urgency": "high" | "medium" | "low",
  "sentiment": "positive" | "neutral" | "negative",
  "suggested_action": "schedule_call" | "send_info" | "follow_up_30d" | "remove",
  "key_points": ["punto 1", "punto 2"]
}
`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 300,
    messages: [{ role: 'user', content: prompt }]
  });

  return JSON.parse(response.content[0].text);
}
```

---

## Streaming (para respuestas largas)

```javascript
const stream = await client.messages.stream({
  model: 'claude-sonnet-4-6',
  max_tokens: 1024,
  messages: [{ role: 'user', content: prompt }]
});

for await (const chunk of stream) {
  if (chunk.type === 'content_block_delta') {
    process.stdout.write(chunk.delta.text);
  }
}
```

---

## Costos estimados (claude-sonnet-4-6)

| Operacion | Tokens approx | Costo approx |
|---|---|---|
| Lead scoring | ~500 tokens | ~$0.002/lead |
| Personalizacion email | ~800 tokens | ~$0.003/email |
| Analisis de respuesta | ~400 tokens | ~$0.0015/respuesta |

Para 500 leads/mes: ~$1-3 USD en API calls. Muy economico.

---

## Variable de entorno

```env
ANTHROPIC_API_KEY=sk-ant-...
```

**En Vercel:** Agregar como variable de entorno sensible en el dashboard.

---

*Esta skill es parte del SDK de Claude Code y se actualiza automaticamente.*
