# Sisteco — Arquitectura Convex (DB Reactiva)

> Migracion completada: 2026-03-04
> Antes: Supabase (PostgreSQL) | Ahora: Convex + Clerk

---

## Por que Convex en vez de Supabase

| Aspecto | Supabase (antes) | Convex (ahora) |
|---|---|---|
| Modelo de datos | PostgreSQL relacional | Documentos reactivos |
| Queries | SQL manual + RLS | Schema TypeScript + funciones tipadas |
| Auth | Service key en cada route | Clerk integrado, JWT automatico |
| Cron/drip | SQL queries manuales | Queries con indices optimizados |
| Tiempo real | Websockets manuales | Reactivo por defecto |
| Costo | ~$25/mes Pro | Gratis tier generoso |

---

## Schema completo (convex/schema.ts)

### Tabla: leads

```typescript
leads: defineTable({
  email: v.string(),
  source: v.optional(v.string()),
  utmSource: v.optional(v.string()),
  utmMedium: v.optional(v.string()),
  utmCampaign: v.optional(v.string()),
  referrer: v.optional(v.string()),
  userAgent: v.optional(v.string()),
  ipAddress: v.optional(v.string()),
  updatedAt: v.optional(v.number()),
}).index("by_email", ["email"])
```

### Tabla: ctaClicks

```typescript
ctaClicks: defineTable({
  leadId: v.optional(v.id("leads")),
  buttonId: v.string(),
  buttonText: v.optional(v.string()),
  pageUrl: v.optional(v.string()),
}).index("by_button_id", ["buttonId"])
```

### Tabla: demoRequests

```typescript
demoRequests: defineTable({
  leadId: v.optional(v.id("leads")),
  companyName: v.optional(v.string()),
  companySize: v.optional(v.string()),
  status: v.string(),
}).index("by_status", ["status"])
```

### Tabla: emailSequence

```typescript
emailSequence: defineTable({
  leadId: v.id("leads"),
  templateKey: v.string(),
  scheduledAt: v.number(),   // Epoch ms
  sentAt: v.optional(v.number()),
  resendId: v.optional(v.string()),
  status: v.string(),        // "pending", "sent", "failed"
}).index("by_lead_status", ["leadId", "status"])
 .index("by_scheduled", ["scheduledAt"])
```

### Tabla: subscriptions

```typescript
subscriptions: defineTable({
  leadId: v.optional(v.id("leads")),
  dlocalgoSubscriptionId: v.optional(v.string()),
  dlocalgoPaymentId: v.optional(v.string()),
  plan: v.string(),
  status: v.string(),
  currentPeriodEnd: v.optional(v.number()),
}).index("by_subscription_id", ["dlocalgoSubscriptionId"])
 .index("by_payment_id", ["dlocalgoPaymentId"])
```

### Tabla: users (para Clerk sync)

```typescript
users: defineTable({
  clerkId: v.string(),
  email: v.string(),
  name: v.optional(v.string()),
  imageUrl: v.optional(v.string()),
}).index("by_clerk_id", ["clerkId"])
```

---

## Archivos de funciones Convex

| Archivo | Funciones |
|---|---|
| `convex/leads.ts` | `upsertLead`, `upsertLeadSoft`, `getByEmail` |
| `convex/ctaClicks.ts` | `track` |
| `convex/demoRequests.ts` | `create` |
| `convex/emailSequence.ts` | `scheduleDrip`, `markSent`, `markFailed`, `getPending` |
| `convex/subscriptions.ts` | `upsertByPayment`, `upsertBySubscription`, `updateStatus` |
| `convex/users.ts` | `upsertUser`, `deleteUser`, `getCurrentUser` |
| `convex/auth.config.ts` | Configuracion Clerk como auth provider |
| `convex/http.ts` | HTTP router: webhook Clerk para sync de usuarios |

**Cliente compartido:** `api/lib/convex.js` — `ConvexHttpClient` para todas las API routes de Vercel

---

## Patron de Upsert (sin SQL CONFLICT)

```typescript
// En convex/leads.ts
export const upsertLead = mutation({
  args: { email: v.string(), source: v.optional(v.string()), /* ... */ },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("leads")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { updatedAt: Date.now() });
      return { _id: existing._id, isExisting: true };
    }

    const id = await ctx.db.insert("leads", {
      email: args.email,
      source: args.source,
      // ...
    });
    return { _id: id, isExisting: false };
  },
});
```

---

## Patron de uso en API Routes (Vercel)

```javascript
// api/leads.js
const { ConvexHttpClient } = require("convex/browser");
const { api } = require("../convex/_generated/api");

const convex = new ConvexHttpClient(process.env.CONVEX_URL);

module.exports = async (req, res) => {
  const result = await convex.mutation(api.leads.upsertLead, {
    email: req.body.email,
    source: req.body.source,
  });
  res.json({ success: true, id: result._id });
};
```

---

## Clerk Webhook → Convex HTTP Router

```typescript
// convex/http.ts
import { httpRouter } from "convex/server";

const http = httpRouter();

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: async (ctx, req) => {
    const body = await req.json();
    if (body.type === "user.created") {
      await ctx.runMutation(api.users.upsertUser, {
        clerkId: body.data.id,
        email: body.data.email_addresses[0].email_address,
        name: `${body.data.first_name} ${body.data.last_name}`,
      });
    }
    return new Response(null, { status: 200 });
  },
});

export default http;
```

---

## Costos Convex

| Tier | Costo | Incluye |
|---|---|---|
| Free | $0 | Generoso para MVP |
| Pro | ~$25/mes | Cuando el volumen crece |

---

*Para historial completo de la migracion, ver `MIGRATION_SUPABASE_TO_CONVEX.md` en la raiz del proyecto.*
