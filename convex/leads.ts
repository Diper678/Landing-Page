import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Upsert lead: si el email existe, actualiza; si no, inserta
export const upsertLead = mutation({
  args: {
    email: v.string(),
    source: v.optional(v.string()),
    utmSource: v.optional(v.string()),
    utmMedium: v.optional(v.string()),
    utmCampaign: v.optional(v.string()),
    referrer: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("leads")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        source: args.source ?? existing.source,
        utmSource: args.utmSource ?? existing.utmSource,
        utmMedium: args.utmMedium ?? existing.utmMedium,
        utmCampaign: args.utmCampaign ?? existing.utmCampaign,
        referrer: args.referrer ?? existing.referrer,
        userAgent: args.userAgent ?? existing.userAgent,
        ipAddress: args.ipAddress ?? existing.ipAddress,
        updatedAt: Date.now(),
      });
      return { _id: existing._id, isExisting: true };
    }

    const id = await ctx.db.insert("leads", {
      email: args.email,
      source: args.source ?? "landing_hero",
      utmSource: args.utmSource,
      utmMedium: args.utmMedium,
      utmCampaign: args.utmCampaign,
      referrer: args.referrer,
      userAgent: args.userAgent,
      ipAddress: args.ipAddress,
      updatedAt: Date.now(),
    });
    return { _id: id, isExisting: false };
  },
});

// Upsert lead sin sobreescribir datos (para demo requests que no quieren pisar UTMs)
export const upsertLeadSoft = mutation({
  args: {
    email: v.string(),
    source: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("leads")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (existing) {
      return { _id: existing._id };
    }

    const id = await ctx.db.insert("leads", {
      email: args.email,
      source: args.source ?? "demo_request",
      updatedAt: Date.now(),
    });
    return { _id: id };
  },
});

// Listar todos los leads
export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("leads").collect();
  },
});

// Obtener lead por email
export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("leads")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
  },
});
