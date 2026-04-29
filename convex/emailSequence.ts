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
