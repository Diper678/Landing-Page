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

// Detectar si es email corporativo (no gmail, hotmail, etc.)
const isBusinessEmail = (email) => {
  const personalDomains = [
    'gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com',
    'live.com', 'icloud.com', 'me.com', 'mail.com', 'protonmail.com'
  ];
  const domain = email.split('@')[1]?.toLowerCase();
  return domain && !personalDomains.includes(domain);
};

const discoverySchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(255),
  company: z.string().min(1).max(200),
  role: z.string().min(1).max(100),
  teamSize: z.string().max(20).optional().nullable(),
  crm: z.string().max(50).optional().nullable(),
  pain: z.string().max(2000).optional().nullable(),
  source: z.string().max(50).optional().nullable(),
});

export default async function handler(req, res) {
  // CORS headers
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Rate limiting
  if (ratelimit) {
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.headers['x-real-ip'] || req.socket?.remoteAddress || '127.0.0.1';
    const { success } = await ratelimit.limit(`discovery_ratelimit_${ip}`);
    if (!success) {
      return res.status(429).json({ error: 'Demasiadas solicitudes. Intenta en unos minutos.' });
    }
  }

  try {
    const parsed = discoverySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Datos inválidos', code: 'INVALID_DATA', details: parsed.error });
    }

    const { name, email, company, role, teamSize, crm, pain, source } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    // Validate business email
    if (!isBusinessEmail(normalizedEmail)) {
      return res.status(400).json({
        error: 'Por favor usa tu email corporativo (no Gmail, Hotmail, etc.)',
        code: 'PERSONAL_EMAIL'
      });
    }

    // Upsert lead
    const leadResult = await convex.mutation(api.leads.upsertLeadSoft, {
      email: normalizedEmail,
      source: 'discovery_form',
    });

    // Create demo request with discovery form data
    await convex.mutation(api.demoRequests.create, {
      email: normalizedEmail,
      companyName: company,
      companySize: teamSize || undefined,
      message: buildDiscoveryMessage({ name, role, teamSize, crm, pain, source }),
      leadId: leadResult._id,
    });

    // Send notification email to Sisteco (fire-and-forget)
    resend.emails.send({
      from: FROM_EMAIL,
      to: 'contacto@sisteco.cl',
      subject: `🎯 Nueva demo: ${name} de ${company}`,
      html: buildNotificationEmail({ name, email: normalizedEmail, company, role, teamSize, crm, pain, source }),
    }).catch(err => console.error('Discovery notification email error:', err));

    // Send Discord webhook notification (fire-and-forget)
    if (process.env.DISCORD_WEBHOOK_URL) {
      sendDiscordNotification({ name, email: normalizedEmail, company, role, teamSize, crm, pain, source })
        .catch(err => console.error('Discord notification error:', err));
    }

    return res.status(201).json({
      success: true,
      message: 'Información recibida. Ahora agenda tu demo.',
    });

  } catch (error) {
    console.error('Discovery form error:', error);
    return res.status(500).json({ error: 'Error interno del servidor', code: 'SERVER_ERROR' });
  }
}

function buildDiscoveryMessage({ name, role, teamSize, crm, pain, source }) {
  const parts = [`Cargo: ${role}`];
  if (teamSize) parts.push(`Vendedores: ${teamSize}`);
  if (crm) parts.push(`CRM: ${crm}`);
  if (pain) parts.push(`Dolor: ${pain}`);
  if (source) parts.push(`Fuente: ${source}`);
  return parts.join(' | ');
}

function buildNotificationEmail({ name, email, company, role, teamSize, crm, pain, source }) {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #111; color: #fff; padding: 20px 24px; border-radius: 8px 8px 0 0;">
        <h2 style="margin: 0; font-size: 18px;">Nueva solicitud de demo</h2>
      </div>
      <div style="background: #fff; padding: 24px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 8px 8px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #666; font-size: 14px; width: 140px;">Nombre</td>
            <td style="padding: 8px 0; font-weight: 500;">${escapeHtml(name)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666; font-size: 14px;">Email</td>
            <td style="padding: 8px 0;"><a href="mailto:${escapeHtml(email)}" style="color: #111;">${escapeHtml(email)}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666; font-size: 14px;">Empresa</td>
            <td style="padding: 8px 0; font-weight: 500;">${escapeHtml(company)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666; font-size: 14px;">Cargo</td>
            <td style="padding: 8px 0;">${escapeHtml(role)}</td>
          </tr>
          ${teamSize ? `<tr>
            <td style="padding: 8px 0; color: #666; font-size: 14px;">Vendedores</td>
            <td style="padding: 8px 0;">${escapeHtml(teamSize)}</td>
          </tr>` : ''}
          ${crm ? `<tr>
            <td style="padding: 8px 0; color: #666; font-size: 14px;">CRM actual</td>
            <td style="padding: 8px 0;">${escapeHtml(crm)}</td>
          </tr>` : ''}
          ${source ? `<tr>
            <td style="padding: 8px 0; color: #666; font-size: 14px;">Fuente</td>
            <td style="padding: 8px 0;">${escapeHtml(source)}</td>
          </tr>` : ''}
        </table>
        ${pain ? `
        <div style="margin-top: 16px; padding: 16px; background: #f8f7f5; border-radius: 6px; border-left: 3px solid #c5ed36;">
          <p style="margin: 0 0 4px; font-size: 13px; color: #666; font-weight: 500;">Mayor dolor en ventas:</p>
          <p style="margin: 0; font-size: 14px; color: #111; line-height: 1.5;">${escapeHtml(pain)}</p>
        </div>` : ''}
        <div style="margin-top: 20px; text-align: center;">
          <a href="https://cal.com/sisteco/demo" style="display: inline-block; background: #c5ed36; color: #111; padding: 10px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px;">Ver calendario de demos</a>
        </div>
      </div>
    </div>
  `;
}

async function sendDiscordNotification({ name, email, company, role, teamSize, crm, pain, source }) {
  const fields = [
    { name: '👤 Nombre', value: name, inline: true },
    { name: '🏢 Empresa', value: company, inline: true },
    { name: '💼 Cargo', value: role, inline: true },
    { name: '📧 Email', value: email, inline: true },
  ];

  if (teamSize) fields.push({ name: '👥 Vendedores', value: teamSize, inline: true });
  if (crm) fields.push({ name: '📊 CRM', value: crm, inline: true });
  if (source) fields.push({ name: '📣 Fuente', value: source, inline: true });
  if (pain) fields.push({ name: '🎯 Dolor principal', value: pain.substring(0, 200), inline: false });

  await fetch(process.env.DISCORD_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      embeds: [{
        title: '🎯 Nueva solicitud de demo',
        color: 0xc5ed36,
        fields,
        timestamp: new Date().toISOString(),
        footer: { text: 'Sisteco Discovery Form' },
      }],
    }),
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
