# Sisteco — Workflows n8n Construidos

> Workflows reales en produccion o listos para produccion.
> Motor: n8n Self-Hosted en VPS (~$10/mes, sin limites de ejecuciones)

---

## Por que n8n Self-Hosted

- **Sin limites:** n8n Cloud tiene caps de ejecuciones/mes. Self-hosted = ilimitado
- **Control de datos:** Importante para cumplimiento Ley 21.719 (datos en nuestro VPS)
- **Costo:** ~$10/mes (VPS) vs $50-150/mes en n8n Cloud
- **Integraciones:** Acceso a todos los nodos premium sin costo adicional

---

## Workflow 1: LinkedIn Lead Scoring

### Objetivo
Extraer perfiles de LinkedIn, evaluarlos con IA, clasificarlos y alertar al equipo sobre leads calientes.

### Herramientas
- **PhantomBuster** — Extraccion de perfiles LinkedIn
- **ScrapingBee** — Web scraping de websites de empresas
- **Google Gemini** — Motor de scoring IA

### Motor de puntuacion (100 puntos)

```
EMPRESA (40 pts max):
  - Tamano empresa 50-500 empleados:  +20 pts
  - Industria objetivo:               +10 pts
  - Presencia web activa:             +10 pts

PERFIL LINKEDIN (35 pts max):
  - Cargo decision-maker (CEO, VP, Dir): +20 pts
  - Antiguedad en cargo > 1 ano:        +10 pts
  - Actividad reciente en LinkedIn:     +5 pts

SENALES DE INTERES (25 pts max):
  - Stack tecnologico compatible:       +15 pts
  - Crecimiento reciente (contratando): +10 pts
```

### Clasificacion

| Score | Categoria | Accion |
|---|---|---|
| 75-100 | HOT | Alerta Slack inmediata + contacto personal |
| 50-74 | WARM | Entrar a secuencia email prioritaria |
| 25-49 | NURTURE | Secuencia email estandar |
| 0-24 | SKIP | No contactar |

### Flujo del workflow

```
[PhantomBuster LinkedIn Scraper]
  → [n8n: recibe lista de perfiles]
  → [ScrapingBee: scrape website de empresa]
  → [Gemini: analiza perfil + empresa, aplica motor de puntuacion]
  → [n8n: clasifica HOT / WARM / NURTURE / SKIP]
  → Si HOT: [Slack alert al equipo de ventas en tiempo real]
  → Si WARM/NURTURE: [Agregar a secuencia de email en Convex DB]
  → [Notion: actualizar pipeline]
```

---

## Workflow 2: Secuencias de Email B2B

### Objetivo
Enviar secuencias de email personalizadas por IA a leads calificados, con deteccion de respuestas para pausar automaticamente.

### Herramientas
- **n8n** — Orquestacion del workflow
- **Gemini** — Personalizacion de cada email
- **Resend/Gmail** — Envio de emails
- **Convex** — Almacenamiento de estado de secuencia
- **Slack** — Alertas cuando hay respuesta

### Estructura de la secuencia (35 dias)

```
Dia 1   (9:00 AM) → Email 1: Presentacion y propuesta de valor especifica
Dia 4   (9:00 AM) → Email 2: Caso de uso relevante para su industria
Dia 9   (9:00 AM) → Email 3: Datos y metricas (ROI, 5-7x conversiones)
Dia 18  (9:00 AM) → Email 4: FOMO — "Estos son sus competidores que ya automatizaron..."
Dia 35  (9:00 AM) → Email 5: Cierre con oferta especifica + CTA claro
```

### Reglas de la secuencia

```
IF respuesta detectada:
  → Pausa inmediata de la secuencia
  → Slack alert: "Lead X respondio al email Y"
  → Marcar en Convex como "responded"
  → El vendedor toma control manual

IF rebote hard:
  → Remover de la lista
  → Marcar como "invalid_email"

IF unsubscribe:
  → Remover permanentemente
  → Marcar como "unsubscribed"
```

### Personalizacion por IA

Gemini recibe por cada lead:
- Nombre, cargo, empresa
- Industria y tamano de empresa
- Website de la empresa (scraped)
- Score y categoria (HOT/WARM)

Output: Subject + cuerpo del email personalizado

### Flujo del workflow

```
[Vercel Cron: cada dia 8:45 AM]
  → [api/cron/send-drip.js]
  → [Convex: getPending emails para hoy]
  → [Para cada email pendiente:]
      → [Gemini: personaliza segun perfil del lead]
      → [Resend: envia email]
      → [Convex: markSent con resendId]
      → Si respuesta detectada:
          → [Convex: markSequencePaused]
          → [n8n webhook: notifica al equipo]
          → [Slack: alerta]
```

---

## Workflow 3: Facturacion Automatica

### Objetivo
Automatizar la generacion de facturas cuando se cierra un deal en Notion.

### Herramientas
- **Notion** — CRM interno (trigger cuando deal pasa a "Cerrado")
- **n8n** — Orquestacion
- **Bsale** (o sistema DTE) — Emision de facturas electronicas

### Flujo del workflow

```
[Notion: Deal pasa a status "Cerrado" ]
  → [n8n webhook: recibe evento]
  → [n8n: extrae datos del deal (empresa, monto, plan)]
  → [Bsale API: genera DTE (factura electronica)]
  → [Email: envia factura al cliente]
  → [Slack: notifica al equipo "Deal cerrado + factura emitida"]
  → [Convex: actualiza subscription a "active"]
```

---

## Variables de entorno para n8n

```env
N8N_WEBHOOK_URL=https://tu-instancia.n8n.cloud/webhook/sisteco-orchestration
N8N_AUTH_KEY=your_auth_key_here
```

### En las API routes de Vercel:

```javascript
// Enviar evento a n8n
await fetch(process.env.N8N_WEBHOOK_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.N8N_AUTH_KEY}`
  },
  body: JSON.stringify({
    event: 'lead.qualified',
    leadId: lead._id,
    email: lead.email,
    score: lead.score,
    category: 'HOT'
  })
});
```

---

## Configuracion del VPS n8n

### Requisitos minimos del VPS
- 1 vCPU, 1GB RAM (suficiente para < 1000 ejecuciones/dia)
- Ubuntu 22.04 LTS
- Puerto 5678 abierto (o proxy Nginx con SSL)

### Instalacion rapida
```bash
npx n8n
# O con Docker:
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

### Variables de entorno n8n
```env
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=your_password
WEBHOOK_URL=https://tu-dominio.com
N8N_HOST=tu-dominio.com
N8N_PORT=5678
N8N_PROTOCOL=https
```

---

*Ultima actualizacion: 2026-03-04*
