import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const track = mutation({
  args: {
    buttonId: v.string(),
    buttonText: v.optional(v.string()),
    pageUrl: v.optional(v.string()),
    leadId: v.optional(v.id("leads")),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("ctaClicks", {
      buttonId: args.buttonId,
      buttonText: args.buttonText,
      pageUrl: args.pageUrl,
      leadId: args.leadId,
    });
  },
});
