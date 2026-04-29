import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

// Webhook de Clerk para sincronizar usuarios
http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const { type, data } = await request.json();

    if (type === "user.created" || type === "user.updated") {
      await ctx.runMutation(api.users.upsertUser, {
        clerkId: data.id,
        email: data.email_addresses[0]?.email_address ?? "",
        name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
        imageUrl: data.image_url,
      });
    }

    if (type === "user.deleted") {
      await ctx.runMutation(api.users.deleteUser, { clerkId: data.id });
    }

    return new Response(null, { status: 200 });
  }),
});

export default http;
