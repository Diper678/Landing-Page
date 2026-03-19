import { convex } from './_lib/convex.js';
import { api } from '../convex/_generated/api.js';
import { z } from 'zod';

const allowedOrigins = ['https://sisteco.com', 'https://sisteco-landing.vercel.app', 'http://localhost:3000'];

export default async function handler(req, res) {
  // CORS headers
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const trackSchema = z.object({
      buttonId: z.string().min(1).max(100),
      buttonText: z.string().max(100).optional().nullable(),
      pageUrl: z.string().max(500).optional().nullable(),
      leadId: z.string().optional().nullable()
    });

    const parsed = trackSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Datos inválidos', details: parsed.error });
    }

    const { buttonId, buttonText, pageUrl, leadId } = parsed.data;

    await convex.mutation(api.ctaClicks.track, {
      buttonId,
      buttonText: buttonText || undefined,
      pageUrl: pageUrl || undefined,
      // leadId from Convex is a typed ID, so we only pass it if valid
      // For now, skip leadId from frontend (it was a UUID before, now it's a Convex ID)
    });

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(200).json({ success: true }); // Fail silently
  }
}
