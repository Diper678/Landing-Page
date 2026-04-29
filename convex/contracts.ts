import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Crear contrato pendiente (cuando se genera el link)
export const create = mutation({
  args: {
    contractId: v.string(),
    email: v.string(),
    company: v.string(),
    plan: v.string(),
    price: v.number(),
    billingCycle: v.string(),
    contractVersion: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("contracts", {
      contractId: args.contractId,
      email: args.email,
      company: args.company,
      plan: args.plan,
      price: args.price,
      billingCycle: args.billingCycle,
      contractVersion: args.contractVersion,
      status: "pending",
      createdAt: Date.now(),
    });
    return { _id: id };
  },
});

// Obtener contrato por contractId
export const getByContractId = query({
  args: { contractId: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("contracts")
      .withIndex("by_contractId", (q) => q.eq("contractId", args.contractId))
      .unique();
  },
});

// Aceptar contrato (firma electrónica)
export const accept = mutation({
  args: {
    contractId: v.string(),
    contactName: v.string(),
    contactRole: v.string(),
    companyRut: v.string(),
    acceptedIp: v.optional(v.string()),
    acceptedUserAgent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const contract = await ctx.db
      .query("contracts")
      .withIndex("by_contractId", (q) => q.eq("contractId", args.contractId))
      .unique();

    if (!contract) {
      throw new Error("Contrato no encontrado");
    }

    if (contract.status === "accepted") {
      throw new Error("Este contrato ya fue firmado");
    }

    if (contract.status === "expired") {
      throw new Error("Este contrato ha expirado");
    }

    await ctx.db.patch(contract._id, {
      contactName: args.contactName,
      contactRole: args.contactRole,
      companyRut: args.companyRut,
      acceptedIp: args.acceptedIp,
      acceptedUserAgent: args.acceptedUserAgent,
      acceptedAt: Date.now(),
      status: "accepted",
    });

    return { _id: contract._id, success: true };
  },
});

// Listar contratos por estado
export const listByStatus = query({
  args: { status: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("contracts")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect();
  },
});
