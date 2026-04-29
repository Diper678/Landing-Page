import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Listar todas las suscripciones
export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("subscriptions").collect();
  },
});

// Upsert suscripción por payment ID
// Acepta dlocalgoPaymentId O flowPaymentId — al menos uno de los dos requerido.
export const upsertByPayment = mutation({
  args: {
    email: v.string(),
    companyName: v.optional(v.string()),
    dlocalgoPaymentId: v.optional(v.string()),
    flowPaymentId: v.optional(v.string()),
    plan: v.optional(v.string()),
    billingCycle: v.optional(v.string()),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.dlocalgoPaymentId && !args.flowPaymentId) {
      throw new Error("upsertByPayment requires either dlocalgoPaymentId or flowPaymentId");
    }

    let existing = null;
    if (args.flowPaymentId) {
      existing = await ctx.db
        .query("subscriptions")
        .withIndex("by_flow_payment_id", (q) =>
          q.eq("flowPaymentId", args.flowPaymentId)
        )
        .unique();
    }
    if (!existing && args.dlocalgoPaymentId) {
      existing = await ctx.db
        .query("subscriptions")
        .withIndex("by_payment_id", (q) =>
          q.eq("dlocalgoPaymentId", args.dlocalgoPaymentId)
        )
        .unique();
    }

    if (existing) {
      await ctx.db.patch(existing._id, {
        email: args.email,
        companyName: args.companyName,
        plan: args.plan,
        billingCycle: args.billingCycle,
        status: args.status,
        updatedAt: Date.now(),
      });
      return existing._id;
    }

    return await ctx.db.insert("subscriptions", {
      email: args.email,
      companyName: args.companyName,
      dlocalgoPaymentId: args.dlocalgoPaymentId,
      flowPaymentId: args.flowPaymentId,
      plan: args.plan,
      billingCycle: args.billingCycle,
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});

// Upsert suscripción por subscription ID
export const upsertBySubscription = mutation({
  args: {
    email: v.optional(v.string()),
    companyName: v.optional(v.string()),
    dlocalgoSubscriptionId: v.string(),
    plan: v.optional(v.string()),
    billingCycle: v.optional(v.string()),
    status: v.string(),
    currentPeriodEnd: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("subscriptions")
      .withIndex("by_subscription_id", (q) =>
        q.eq("dlocalgoSubscriptionId", args.dlocalgoSubscriptionId)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        email: args.email ?? existing.email,
        companyName: args.companyName ?? existing.companyName,
        plan: args.plan ?? existing.plan,
        billingCycle: args.billingCycle ?? existing.billingCycle,
        status: args.status,
        currentPeriodEnd: args.currentPeriodEnd,
        updatedAt: Date.now(),
      });
      return existing._id;
    }

    return await ctx.db.insert("subscriptions", {
      email: args.email ?? "",
      companyName: args.companyName,
      dlocalgoSubscriptionId: args.dlocalgoSubscriptionId,
      plan: args.plan,
      billingCycle: args.billingCycle,
      status: args.status,
      currentPeriodEnd: args.currentPeriodEnd,
      updatedAt: Date.now(),
    });
  },
});

// Actualizar status por payment ID
export const updateStatusByPayment = mutation({
  args: {
    dlocalgoPaymentId: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("subscriptions")
      .withIndex("by_payment_id", (q) =>
        q.eq("dlocalgoPaymentId", args.dlocalgoPaymentId)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        status: args.status,
        updatedAt: Date.now(),
      });
    }
  },
});

// Actualizar status por subscription ID
export const updateStatusBySubscription = mutation({
  args: {
    dlocalgoSubscriptionId: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("subscriptions")
      .withIndex("by_subscription_id", (q) =>
        q.eq("dlocalgoSubscriptionId", args.dlocalgoSubscriptionId)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        status: args.status,
        updatedAt: Date.now(),
      });
    }
  },
});
