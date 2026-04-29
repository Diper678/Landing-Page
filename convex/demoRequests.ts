import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Listar todas las solicitudes de demo
export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("demoRequests").collect();
  },
});

export const create = mutation({
  args: {
    email: v.string(),
    companyName: v.optional(v.string()),
    companySize: v.optional(v.string()),
    phone: v.optional(v.string()),
    message: v.optional(v.string()),
    leadId: v.optional(v.id("leads")),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("demoRequests", {
      email: args.email,
      companyName: args.companyName,
      companySize: args.companySize,
      phone: args.phone,
      message: args.message,
      leadId: args.leadId,
      status: "pending",
      updatedAt: Date.now(),
    });
    return { _id: id };
  },
});
