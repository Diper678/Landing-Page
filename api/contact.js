import { convex } from './_lib/convex.js';
import { api } from '../convex/_generated/api.js';
import { resend, FROM_EMAIL } from './_lib/resend.js';
import { z } from 'zod';
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = process.env.UPSTASH_REDIS_REST_URL ? new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
}) : null;

const ratelimit = redis ? new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(3, "1 m"),
}) : null;

const allowedOrigins = ['https://sisteco.com', 'https://sisteco-landing.vercel.app', 'http://localhost:3000'];

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(255),
  company: z.string().max(100).optional().nullable(),
  message: z.string().min(1).max(5000),
});

export default async function handler(req, res) {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (ratelimit) {
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.headers['x-real-ip'] || req.socket?.remoteAddress || '127.0.0.1';
    const { success } = await ratelimit.limit(`contact_ratelimit_${ip}`);
    if (!success) {
      return res.status(429).json({ error: 'Demasiadas solicitudes. Intenta en unos minutos.' });
    }
  }

  try {
    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Datos invalidos', code: 'INVALID_DATA', details: parsed.error });
    }

    const { name, email, company, message } = parsed.data;

    // Upsert lead
    const leadResult = await convex.mutation(api.leads.upsertLeadSoft, {
      email: email.toLowerCase().trim(),
      source: 'contact_form',
    });

    // Create demo request with the contact message
    await convex.mutation(api.demoRequests.create, {
      email: email.toLowerCase().trim(),
      companyName: company || undefined,
      message: message || undefined,
      leadId: leadResult._id,
    });

    // Send notification email to Sisteco (fire-and-forget)
    resend.emails.send({
      from: FROM_EMAIL,
      to: 'contacto@sisteco.cl',
      subject: `Nuevo contacto: ${name}`,
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Empresa:</strong> ${escapeHtml(company || 'No especificada')}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${escapeHtml(message)}</p>
      `
    }).catch(err => console.error('Contact notification email error:', err));

    return res.status(201).json({
      success: true,
      message: 'Mensaje enviado. Te responderemos en menos de 24 horas.',
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ error: 'Error interno del servidor', code: 'SERVER_ERROR' });
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
