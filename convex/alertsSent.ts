import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Registra una alerta si no fue enviada antes (dedupe atómico).
// Devuelve { isNew: true } si el caller debe enviar la notificación.
export const claimAlert = mutation({
  args: {
    event: v.string(),
    dedupKey: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("alertsSent")
      .withIndex("by_dedup", (q) => q.eq("event", args.event).eq("dedupKey", args.dedupKey))
      .first();
    if (existing) return { isNew: false };
    await ctx.db.insert("alertsSent", {
      event: args.event,
      dedupKey: args.dedupKey,
      sentAt: Date.now(),
    });
    return { isNew: true };
  },
});
