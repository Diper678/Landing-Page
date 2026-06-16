import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Insertar emails programados en la secuencia drip
export const scheduleDrip = mutation({
  args: {
    leadId: v.optional(v.id("leads")),
    email: v.string(),
    items: v.array(
      v.object({
        templateKey: v.string(),
        scheduledAt: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const item of args.items) {
      await ctx.db.insert("emailSequence", {
        leadId: args.leadId,
        email: args.email,
        templateKey: item.templateKey,
        scheduledAt: item.scheduledAt,
        status: "pending",
      });
    }
  },
});

// Obtener emails pendientes con scheduledAt <= ahora
export const getPending = query({
  args: { now: v.number(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("emailSequence")
      .withIndex("by_status_scheduled", (q) =>
        q.eq("status", "pending").lte("scheduledAt", args.now)
      )
      .take(args.limit ?? 50);
    return results;
  },
});

// Marcar email como enviado
export const markSent = mutation({
  args: {
    id: v.id("emailSequence"),
    resendId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "sent",
      sentAt: Date.now(),
      resendId: args.resendId,
    });
  },
});

// Marcar email como fallido
export const markFailed = mutation({
  args: { id: v.id("emailSequence") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: "failed" });
  },
});

// Cancela todos los emails pendientes de templates desactivados.
// Uso operativo: limpieza one-shot tras desactivar un templateKey por compliance.
// Idempotente: solo afecta items con status="pending".
// Ver decisión 2026-05-15: case_study + quick_win desactivados por métricas inventadas.
export const cancelPendingByTemplates = mutation({
  args: { templateKeys: v.array(v.string()) },
  handler: async (ctx, args) => {
    const targets = new Set(args.templateKeys);
    const pending = await ctx.db
      .query("emailSequence")
      .withIndex("by_status_scheduled", (q) => q.eq("status", "pending"))
      .collect();

    let cancelled = 0;
    for (const item of pending) {
      if (targets.has(item.templateKey)) {
        await ctx.db.patch(item._id, { status: "cancelled" });
        cancelled++;
      }
    }
    return { cancelled, scanned: pending.length };
  },
});

// Cuenta pendientes por template (para auditoria sin escribir).
export const countPendingByTemplate = query({
  args: {},
  handler: async (ctx) => {
    const pending = await ctx.db
      .query("emailSequence")
      .withIndex("by_status_scheduled", (q) => q.eq("status", "pending"))
      .collect();

    const counts: Record<string, number> = {};
    for (const item of pending) {
      counts[item.templateKey] = (counts[item.templateKey] || 0) + 1;
    }
    return { total: pending.length, byTemplate: counts };
  },
});
