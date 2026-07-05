import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Leads capturados desde landing page
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
  })
    .index("by_email", ["email"]),

  // Tracking de clicks en CTAs
  ctaClicks: defineTable({
    leadId: v.optional(v.id("leads")),
    buttonId: v.string(),
    buttonText: v.optional(v.string()),
    pageUrl: v.optional(v.string()),
  })
    .index("by_lead_id", ["leadId"])
    .index("by_button_id", ["buttonId"]),

  // Solicitudes de demo/contacto
  demoRequests: defineTable({
    leadId: v.optional(v.id("leads")),
    email: v.string(),
    companyName: v.optional(v.string()),
    companySize: v.optional(v.string()),
    phone: v.optional(v.string()),
    message: v.optional(v.string()),
    // Origen del formulario: 'contact_form' (Sisteco) | 'microsec'
    source: v.optional(v.string()),
    status: v.string(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_status", ["status"])
    .index("by_email", ["email"]),

  // Alertas internas ya enviadas (dedupe de notificaciones Discord)
  alertsSent: defineTable({
    event: v.string(),
    dedupKey: v.string(),
    sentAt: v.number(),
  })
    .index("by_dedup", ["event", "dedupKey"]),

  // Secuencia de emails drip (Day 0, 3, 7)
  emailSequence: defineTable({
    leadId: v.optional(v.id("leads")),
    email: v.string(),
    templateKey: v.string(),
    scheduledAt: v.number(),
    sentAt: v.optional(v.number()),
    status: v.string(),
    resendId: v.optional(v.string()),
  })
    .index("by_status_scheduled", ["status", "scheduledAt"])
    .index("by_lead_id", ["leadId"]),

  // Suscripciones (Flow.cl / dLocal Go / Reveniu)
  subscriptions: defineTable({
    email: v.string(),
    companyName: v.optional(v.string()),
    // dLocal Go (LATAM internacional)
    dlocalgoCustomerId: v.optional(v.string()),
    dlocalgoSubscriptionId: v.optional(v.string()),
    dlocalgoPaymentId: v.optional(v.string()),
    // Flow.cl (Chile pasarela principal)
    flowPaymentId: v.optional(v.string()),
    flowSubscriptionId: v.optional(v.string()),
    // Reveniu (Chile alternativa)
    reveniuSubscriptionId: v.optional(v.string()),
    // Plan: 'junior' | 'senior' | 'manager' (legacy: 'base' | 'growth' | 'enterprise')
    plan: v.optional(v.string()),
    // billingCycle: 'quarterly' | 'annual' (legacy: 'monthly' aún aceptado en datos viejos)
    billingCycle: v.optional(v.string()),
    status: v.optional(v.string()),
    currentPeriodEnd: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  })
    .index("by_email", ["email"])
    .index("by_subscription_id", ["dlocalgoSubscriptionId"])
    .index("by_payment_id", ["dlocalgoPaymentId"])
    .index("by_flow_payment_id", ["flowPaymentId"]),

  // Contratos de servicio (firma electrónica)
  contracts: defineTable({
    contractId: v.string(),
    email: v.string(),
    company: v.string(),
    contactName: v.optional(v.string()),
    contactRole: v.optional(v.string()),
    companyRut: v.optional(v.string()),
    plan: v.string(),
    price: v.number(),
    billingCycle: v.string(),
    contractVersion: v.string(),
    status: v.string(), // "pending" | "accepted" | "expired"
    acceptedAt: v.optional(v.number()),
    acceptedIp: v.optional(v.string()),
    acceptedUserAgent: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_contractId", ["contractId"])
    .index("by_status", ["status"]),

  // Usuarios autenticados (sincronizados desde Clerk via webhook)
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  })
    .index("by_clerk_id", ["clerkId"]),
});
