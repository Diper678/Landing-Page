import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

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
      leadId: z.string().uuid().optional().nullable()
    });

    const parsed = trackSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Datos inválidos', details: parsed.error });
    }

    const { buttonId, buttonText, pageUrl, leadId } = parsed.data;

    const { error } = await supabase
      .from('cta_clicks')
      .insert({
        button_id: buttonId,
        button_text: buttonText,
        page_url: pageUrl,
        lead_id: leadId || null
      });

    if (error) {
      console.error('Track error:', error);
      // No fallamos silenciosamente para no afectar UX
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(200).json({ success: true }); // Fail silently
  }
}
