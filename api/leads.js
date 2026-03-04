import { createClient } from '@supabase/supabase-js';
import { resend, FROM_EMAIL } from './lib/resend.js';
import { welcomeEmail } from './lib/email-templates.js';
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
// Inicializar Supabase con service key (segura en serverless)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Validación de email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Detectar si es email corporativo (no gmail, hotmail, etc.)
const isBusinessEmail = (email) => {
  const personalDomains = [
    'gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com',
    'live.com', 'icloud.com', 'me.com', 'mail.com', 'protonmail.com'
  ];
  const domain = email.split('@')[1]?.toLowerCase();
  return domain && !personalDomains.includes(domain);
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
    const { success } = await ratelimit.limit(`ratelimit_${ip}`);
    if (!success) {
      return res.status(429).json({ error: 'Too many requests' });
    }
  }

  try {
    const leadSchema = z.object({
      email: z.string().email().max(255),
      source: z.string().max(50).optional(),
      utm_source: z.string().max(100).optional().nullable(),
      utm_medium: z.string().max(100).optional().nullable(),
      utm_campaign: z.string().max(100).optional().nullable(),
    });

    const parsed = leadSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Datos inválidos',
        code: 'INVALID_DATA',
        details: parsed.error
      });
    }

    const { email, source = 'landing_hero', utm_source, utm_medium, utm_campaign } = parsed.data;

    // Extraer metadata del request
    const referrer = req.headers.referer || req.headers.referrer || null;
    const userAgent = req.headers['user-agent'] || null;
    const ip = req.headers['x-forwarded-for']?.split(',')[0] ||
      req.headers['x-real-ip'] ||
      req.socket?.remoteAddress || null;

    // Insertar en Supabase
    const { data, error } = await supabase
      .from('leads')
      .upsert({
        email: email.toLowerCase().trim(),
        source,
        utm_source,
        utm_medium,
        utm_campaign,
        referrer,
        user_agent: userAgent,
        ip_address: ip
      }, {
        onConflict: 'email',
        ignoreDuplicates: false
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);

      // Si el email ya existe, no es un error para el usuario
      if (error.code === '23505') {
        return res.status(200).json({
          success: true,
          message: 'Ya estás registrado. Te contactaremos pronto.',
          isExisting: true
        });
      }

      return res.status(500).json({
        error: 'Error al procesar la solicitud',
        code: 'DATABASE_ERROR'
      });
    }

    // Enviar welcome email y programar secuencia drip (fire-and-forget)
    const normalizedEmail = email.toLowerCase().trim();
    sendWelcomeAndScheduleDrip(normalizedEmail, data.id).catch(err =>
      console.error('Email/drip error (non-blocking):', err)
    );

    return res.status(201).json({
      success: true,
      message: isBusinessEmail(email)
        ? 'Excelente! Te contactaremos en las próximas 24 horas.'
        : 'Gracias por tu interés. Te enviaremos información pronto.',
      isBusinessEmail: isBusinessEmail(email),
      leadId: data.id
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      error: 'Error interno del servidor',
      code: 'SERVER_ERROR'
    });
  }
}

async function sendWelcomeAndScheduleDrip(email, leadId) {
  // 1. Enviar welcome email inmediatamente
  const welcome = welcomeEmail(email);
  const { data: emailResult, error: emailError } = await resend.emails.send({
    from: FROM_EMAIL,
    to: welcome.to,
    subject: welcome.subject,
    html: welcome.html
  });

  if (emailError) {
    console.error('Welcome email error:', emailError);
  } else {
    console.log('Welcome email sent:', emailResult?.id);
  }

  // 2. Programar secuencia drip en Supabase
  const now = new Date();
  const day3 = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  const day7 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const { error: seqError } = await supabase
    .from('email_sequence')
    .insert([
      {
        lead_id: leadId,
        email,
        template_key: 'case_study',
        scheduled_at: day3.toISOString(),
        status: 'pending'
      },
      {
        lead_id: leadId,
        email,
        template_key: 'quick_win',
        scheduled_at: day7.toISOString(),
        status: 'pending'
      }
    ]);

  if (seqError) {
    console.error('Drip sequence insert error:', seqError);
  }
}
