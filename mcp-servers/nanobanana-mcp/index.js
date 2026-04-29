#!/usr/bin/env node
/**
 * Nano Banana 2 MCP Server
 * Powered by Google AI Studio (Gemini 3.1 Flash Image Preview)
 * via @google/generative-ai SDK — direct access, no proxy.
 *
 * Models available:
 *   gemini-3.1-flash-image-preview  ← Nano Banana 2 (fast)
 *   gemini-3-pro-image-preview      ← Nano Banana Pro (quality)
 *
 * Required env var: GOOGLE_AI_API_KEY (format: AIzaSy...)
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

// ── Auth ──────────────────────────────────────────────────────────────────────
const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY;
if (!GOOGLE_AI_API_KEY) {
  process.stderr.write(
    "[nanobanana-mcp] ERROR: GOOGLE_AI_API_KEY not set.\n" +
    "Get your key at https://aistudio.google.com/apikey\n"
  );
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(GOOGLE_AI_API_KEY);

const MODELS = {
  fast:    "gemini-3.1-flash-image-preview",   // Nano Banana 2
  pro:     "gemini-3-pro-image-preview",        // Nano Banana Pro
  flash25: "gemini-2.5-flash-image",            // Fallback
};

// ── Helpers ───────────────────────────────────────────────────────────────────
async function generateImages({ prompt, num_images = 1, model_tier = "fast", save_locally = false }) {
  const modelId = MODELS[model_tier] ?? MODELS.fast;
  const model = genAI.getGenerativeModel({ model: modelId });

  // Build full prompt request (num_images hint embedded if >1)
  const promptText = num_images > 1
    ? `${prompt}\n\nGenerate ${num_images} distinct variations.`
    : prompt;

  const response = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: promptText }] }],
    generationConfig: {
      responseModalities: ["IMAGE", "TEXT"],
    },
  });

  const candidate = response.response.candidates?.[0];
  if (!candidate) throw new Error("No candidates returned by the model.");

  const parts = candidate.content?.parts ?? [];
  const imageParts = parts.filter((p) => p.inlineData);
  const textParts  = parts.filter((p) => p.text).map((p) => p.text).join("\n");

  if (imageParts.length === 0) {
    throw new Error(`No images in response. Text output: ${textParts.slice(0, 500)}`);
  }

  const results = [];

  for (let i = 0; i < imageParts.length; i++) {
    const { mimeType, data } = imageParts[i].inlineData;
    const ext = mimeType === "image/jpeg" ? "jpg" : "png";
    const filename = `mockup-${Date.now()}-${i + 1}.${ext}`;

    let fileUrl = null;

    if (save_locally) {
      const mockupsDir = join(process.cwd(), "mockups");
      if (!existsSync(mockupsDir)) mkdirSync(mockupsDir, { recursive: true });
      const filePath = join(mockupsDir, filename);
      writeFileSync(filePath, Buffer.from(data, "base64"));
      fileUrl = `file://${filePath.replace(/\\/g, "/")}`;
      process.stderr.write(`[nanobanana-mcp] Saved: mockups/${filename}\n`);
    } else {
      // Return as data URI so Claude can reference it
      fileUrl = `data:${mimeType};base64,${data.slice(0, 80)}... [${Math.round(data.length * 0.75 / 1024)}KB]`;
    }

    results.push({ filename, mimeType, fileUrl, base64: data });
  }

  return { results, modelUsed: modelId, description: textParts };
}

async function urlToInlineData(url) {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Failed to fetch image: ${url} (${resp.status})`);
  const buffer = Buffer.from(await resp.arrayBuffer());
  const mimeType = resp.headers.get("content-type") ?? "image/png";
  return { inlineData: { data: buffer.toString("base64"), mimeType } };
}

// ── Prompt Templates ──────────────────────────────────────────────────────────
const TEMPLATES = {
  landing_b2b: (d) =>
    `Professional B2B SaaS landing page UI mockup. Desktop full-page screenshot, 16:9. Clean modern design, clear visual hierarchy. ` +
    `Hero: bold headline + benefit subtext + prominent CTA. Social proof logos bar. Feature cards grid. 3-tier pricing with highlighted Pro plan. ` +
    `Dark/light professional palette, sans-serif typography, generous white space. Photorealistic Figma-quality screenshot. ${d}`,

  mobile_onboarding: (d) =>
    `Mobile app onboarding UI screen mockup. Smartphone portrait view, 9:16. Step-by-step flow, progress indicator at top. ` +
    `Large hero illustration, bold headline, 2-line supporting text, full-width CTA button at bottom. ` +
    `Minimal, modern, conversion-optimized. Rounded corners, subtle shadows. Photorealistic mockup. ${d}`,

  dashboard: (d) =>
    `Data analytics dashboard UI mockup. Desktop application, 16:9. Left sidebar navigation with icons + labels. ` +
    `Main area: 4 KPI summary cards top row, main chart center, secondary tables/panels below. ` +
    `Professional SaaS aesthetic, consistent spacing system. Pixel-perfect screenshot. ${d}`,

  pricing_table: (d) =>
    `SaaS pricing page UI mockup. Desktop full-width. Three tiers side by side: Starter, Pro (highlighted/recommended badge), Enterprise. ` +
    `Each card: plan name, large monthly price, 5-6 features with checkmarks, CTA button. Monthly/annual billing toggle. ` +
    `Trust-building, clean design. High-fidelity screenshot. ${d}`,

  custom: (d) => d,
};

// ── MCP Server ────────────────────────────────────────────────────────────────
const server = new McpServer({
  name: "nanobanana-mcp",
  version: "3.0.0",
  description:
    "Generate and edit UI/UX mockups with Google Nano Banana 2 (Gemini 3.1 Flash Image Preview) via AI Studio API. Direct access — no proxy.",
});

// ── Tool: generate_ui_mockup ──────────────────────────────────────────────────
server.tool(
  "generate_ui_mockup",
  "Generate UI/UX mockup images with Google Nano Banana 2 (Gemini 3.1 Flash Image). Supports templates for landing pages, dashboards, mobile onboarding, and pricing tables.",
  {
    description: z.string().describe("What to generate. Be specific: layout, sections, colors, style, target audience."),
    template: z
      .enum(["landing_b2b", "mobile_onboarding", "dashboard", "pricing_table", "custom"])
      .default("custom")
      .describe("Prompt template. 'custom' uses your description verbatim."),
    num_images: z.number().int().min(1).max(4).default(1).describe("Variants to generate (1-4)."),
    model_tier: z
      .enum(["fast", "pro"])
      .default("fast")
      .describe("'fast' = Nano Banana 2 (gemini-3.1-flash-image-preview). 'pro' = Nano Banana Pro (gemini-3-pro-image-preview)."),
    save_locally: z
      .boolean()
      .default(true)
      .describe("Save images to ./mockups/ directory. Recommended: true (images are returned as base64 otherwise)."),
  },
  async ({ description, template, num_images, model_tier, save_locally }) => {
    const prompt = TEMPLATES[template](description);
    process.stderr.write(`[nanobanana-mcp] Generating ${num_images} image(s) | model:${MODELS[model_tier]} | template:${template}\n`);

    let output;
    try {
      output = await generateImages({ prompt, num_images, model_tier, save_locally });
    } catch (err) {
      return { content: [{ type: "text", text: `ERROR: ${err.message}` }], isError: true };
    }

    const lines = [
      `Generated ${output.results.length} UI mockup(s) with ${output.modelUsed}:`,
      "",
      ...output.results.map((r, i) =>
        save_locally
          ? `**Mockup ${i + 1}:** ${r.fileUrl}\n  File: ${r.filename} | Format: ${r.mimeType}`
          : `**Mockup ${i + 1}:** [base64 PNG, ${Math.round(r.base64.length * 0.75 / 1024)}KB — use save_locally:true to write to disk]`
      ),
      "",
      output.description ? `Model notes: ${output.description.slice(0, 200)}` : "",
      "",
      `Prompt used (template: ${template}):`,
      `> ${prompt.slice(0, 350)}${prompt.length > 350 ? "..." : ""}`,
    ];

    return { content: [{ type: "text", text: lines.filter(Boolean).join("\n") }] };
  }
);

// ── Tool: edit_ui_design ──────────────────────────────────────────────────────
server.tool(
  "edit_ui_design",
  "Edit existing UI designs using Nano Banana 2's image editing capability. Provide image URLs + change instructions. Great for: dark mode conversion, layout changes, color adjustments.",
  {
    edit_instructions: z
      .string()
      .describe("What to change. E.g.: 'switch to dark mode, background #111, accent #c5ed36', 'make CTA button bigger', 'add sidebar navigation'."),
    image_urls: z
      .array(z.string().url())
      .min(1)
      .max(4)
      .describe("URLs of existing UI images to use as reference (1-4)."),
    model_tier: z.enum(["fast", "pro"]).default("fast"),
    num_variants: z.number().int().min(1).max(3).default(1),
    save_locally: z.boolean().default(true),
  },
  async ({ edit_instructions, image_urls, model_tier, num_variants, save_locally }) => {
    process.stderr.write(`[nanobanana-mcp] Editing ${image_urls.length} image(s) → ${num_variants} variant(s)\n`);

    const modelId = MODELS[model_tier] ?? MODELS.fast;
    const model = genAI.getGenerativeModel({ model: modelId });

    // Build multi-modal content: text + images
    const imageParts = await Promise.all(image_urls.map(urlToInlineData));
    const promptText = num_variants > 1
      ? `${edit_instructions}\n\nGenerate ${num_variants} distinct variations of this edit.`
      : edit_instructions;

    let response;
    try {
      response = await model.generateContent({
        contents: [{
          role: "user",
          parts: [{ text: promptText }, ...imageParts],
        }],
        generationConfig: { responseModalities: ["IMAGE", "TEXT"] },
      });
    } catch (err) {
      return { content: [{ type: "text", text: `ERROR: ${err.message}` }], isError: true };
    }

    const parts = response.response.candidates?.[0]?.content?.parts ?? [];
    const imgs  = parts.filter((p) => p.inlineData);
    const text  = parts.filter((p) => p.text).map((p) => p.text).join("\n");

    if (imgs.length === 0) {
      return { content: [{ type: "text", text: `No images returned. Model said: ${text.slice(0, 300)}` }], isError: true };
    }

    const saved = [];
    for (let i = 0; i < imgs.length; i++) {
      const { mimeType, data } = imgs[i].inlineData;
      const ext = mimeType === "image/jpeg" ? "jpg" : "png";
      const filename = `edit-${Date.now()}-${i + 1}.${ext}`;
      if (save_locally) {
        const dir = join(process.cwd(), "mockups");
        if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
        writeFileSync(join(dir, filename), Buffer.from(data, "base64"));
        saved.push(`mockups/${filename}`);
      } else {
        saved.push(`[base64, ${Math.round(data.length * 0.75 / 1024)}KB]`);
      }
    }

    const lines = [
      `Edited ${image_urls.length} input image(s) → ${imgs.length} result(s):`,
      `Instructions: ${edit_instructions}`,
      "",
      ...saved.map((s, i) => `**Result ${i + 1}:** ${s}`),
      text ? `\nModel notes: ${text.slice(0, 200)}` : "",
    ];

    return { content: [{ type: "text", text: lines.filter(Boolean).join("\n") }] };
  }
);

// ── Tool: list_models ─────────────────────────────────────────────────────────
server.tool(
  "list_ui_templates",
  "List available templates, models, and recommended settings for Nano Banana 2.",
  {},
  async () => {
    const info = [
      "Nano Banana 2 (Google AI Studio) — Templates & Models",
      "",
      "MODELS:",
      "  fast → gemini-3.1-flash-image-preview  (Nano Banana 2 — fast, default)",
      "  pro  → gemini-3-pro-image-preview       (Nano Banana Pro — higher quality)",
      "",
      "TEMPLATES:",
      "  landing_b2b       → B2B SaaS landing page (hero + features + pricing) | 16:9",
      "  mobile_onboarding → Mobile onboarding flow (portrait, step-by-step)    | 9:16",
      "  dashboard         → Data dashboard (sidebar + KPIs + charts)           | 16:9",
      "  pricing_table     → 3-tier pricing page (with recommended highlight)   | auto",
      "  custom            → Your description verbatim                          | any",
      "",
      "TOOLS:",
      "  generate_ui_mockup → text prompt → image(s)",
      "  edit_ui_design     → image URL(s) + instructions → edited image(s)",
    ];
    return { content: [{ type: "text", text: info.join("\n") }] };
  }
);

// ── Start ─────────────────────────────────────────────────────────────────────
const transport = new StdioServerTransport();
await server.connect(transport);
process.stderr.write(`[nanobanana-mcp] v3.0 ready — Nano Banana 2 via Google AI Studio.\n`);
