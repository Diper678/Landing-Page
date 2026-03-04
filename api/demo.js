import { createClient } from '@supabase/supabase-js';
import { resend, FROM_EMAIL } from './lib/resend.js';
import { demoConfirmationEmail } from './lib/email-templates.js';
import { z } from 'zod';
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = process.env.UPSTASH_REDIS_REST_URL ? new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
}) : null;

const ratelimit = redis ? new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"),
}) : null;

const allowedOrigins = ['https://sisteco.com', 'https://sisteco-landing.vercel.app', 'http://localhost:3000'];

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

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

  if (ratelimit) {
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.headers['x-real-ip'] || req.socket?.remoteAddress || '127.0.0.1';
    const { success } = await ratelimit.limit(`demo_ratelimit_${ip}`);
    if (!success) {
      return res.status(429).json({ error: 'Too many requests' });
    }
  }

  try {
    const demoSchema = z.object({
      email: z.string().email().max(255),
      companyName: z.string().max(100).optional().nullable(),
      companySize: z.string().max(50).optional().nullable(),
      phone: z.string().max(50).optional().nullable(),
      message: z.string().max(2000).optional().nullable()
    });

    const parsed = demoSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Datos inválidos', code: 'INVALID_DATA', details: parsed.error });
    }

    const { email, companyName, companySize, phone, message } = parsed.data;

    // Primero crear o encontrar el lead
    const { data: leadData } = await supabase
      .from('leads')
      .upsert({
        email: email.toLowerCase().trim(),
        source: 'demo_request'
      }, {
        onConflict: 'email',
        ignoreDuplicates: true
      })
      .select()
      .single();

    // Crear solicitud de demo
    const { data, error } = await supabase
      .from('demo_requests')
      .insert({
        email: email.toLowerCase().trim(),
        company_name: companyName,
        company_size: companySize,
        phone,
        message,
        lead_id: leadData?.id || null,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Demo request error:', error);
      return res.status(500).json({
        error: 'Error al procesar la solicitud',
        code: 'DATABASE_ERROR'
      });
    }

    // Enviar email de confirmación de demo (fire-and-forget)
    sendDemoConfirmation(email.toLowerCase().trim(), companyName).catch(err =>
      console.error('Demo email error (non-blocking):', err)
    );

    return res.status(201).json({
      success: true,
      message: 'Solicitud recibida. Nuestro equipo te contactará pronto.',
      requestId: data.id
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      error: 'Error interno del servidor',
      code: 'SERVER_ERROR'
    });
  }
}

async function sendDemoConfirmation(email, companyName) {
  const template = demoConfirmationEmail(email, companyName);
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: template.to,
    subject: template.subject,
    html: template.html
  });

  if (error) {
    console.error('Demo confirmation email error:', error);
  } else {
    console.log('Demo confirmation email sent:', data?.id);
  }
}
