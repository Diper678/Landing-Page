import { convex } from './_lib/convex.js';
import { api } from '../convex/_generated/api.js';
import { resend, FROM_EMAIL } from './_lib/resend.js';
import { z } from 'zod';

const allowedOrigins = ['https://sisteco.com', 'https://sisteco-landing.vercel.app', 'http://localhost:3000'];

const PLAN_NAMES = {
  inicio: 'Inicio',
  crecimiento: 'Crecimiento',
  enterprise: 'Enterprise',
};

const generateSchema = z.object({
  email: z.string().email().max(255),
  company: z.string().min(1).max(200),
  plan: z.enum(['inicio', 'crecimiento', 'enterprise']),
  price: z.number().positive(),
  billingCycle: z.enum(['mensual', 'anual']),
});

function generateContractId() {
  // Generate a UUID-like ID
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const segments = [8, 4, 4, 4, 12];
  return segments.map(len => {
    let s = '';
    for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
    return s;
  }).join('-');
}

export default async function handler(req, res) {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const parsed = generateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Datos invalidos', code: 'INVALID_DATA', details: parsed.error });
    }

    const { email, company, plan, price, billingCycle } = parsed.data;
    const contractId = generateContractId();
    const planName = PLAN_NAMES[plan] || plan;

    // Store pending contract in Convex
    await convex.mutation(api.contracts.create, {
      contractId,
      email: email.toLowerCase().trim(),
      company,
      plan,
      price,
      billingCycle,
      contractVersion: 'v1.0',
    });

    // Build contract URL
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://sisteco-landing.vercel.app';
    const contractUrl = `${baseUrl}/pages/contrato.html?id=${contractId}`;

    // Send email to client with contract link
    const priceFormatted = price.toLocaleString('en-US', { minimumFractionDigits: 0 });
    const cycleLabel = billingCycle === 'anual' ? 'anual' : 'mensual';

    await resend.emails.send({
      from: FROM_EMAIL,
      to: email.toLowerCase().trim(),
      subject: 'Tu contrato de servicios Sisteco esta listo para firmar',
      html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><style>
  body { margin: 0; padding: 0; background-color: #F8F7F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #111111; }
  .container { max-width: 600px; margin: 0 auto; padding: 40px 24px; }
  .header { padding-bottom: 32px; border-bottom: 1px solid #e5e5e5; margin-bottom: 32px; }
  h1 { font-size: 28px; font-weight: 700; line-height: 1.3; margin: 0 0 16px; }
  p { font-size: 16px; line-height: 1.6; color: #333; margin: 0 0 16px; }
  .detail-box { background: #ffffff; border: 1px solid #e5e5e5; border-radius: 12px; padding: 24px; margin: 24px 0; }
  .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
  .detail-row:last-child { border-bottom: none; }
  .detail-label { color: #666; font-size: 14px; }
  .detail-value { font-weight: 600; font-size: 14px; }
  .cta-btn { display: inline-block; background-color: #111111; color: #ffffff !important; padding: 16px 40px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; margin: 24px 0; }
  .footer { margin-top: 40px; padding-top: 24px; border-top: 1px solid #e5e5e5; font-size: 13px; color: #888; }
</style></head>
<body><div class="container">
  <div class="header">
    <img src="https://sisteco.cl/assets/logos/sisteco-email-logo.png" alt="Sisteco" width="200" style="width:200px;height:auto;display:block;" />
  </div>

  <h1>Tu contrato esta listo para firmar</h1>
  <p>Hola,</p>
  <p>El contrato de servicios de Sisteco para <strong>${escapeHtml(company)}</strong> esta preparado y listo para tu revision y firma electronica.</p>

  <div class="detail-box">
    <div class="detail-row">
      <span class="detail-label">Empresa</span>
      <span class="detail-value">${escapeHtml(company)}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Plan</span>
      <span class="detail-value">${escapeHtml(planName)}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Precio</span>
      <span class="detail-value">USD $${priceFormatted} + IVA / ${cycleLabel}</span>
    </div>
  </div>

  <p style="text-align:center;">
    <a href="${contractUrl}" class="cta-btn">Revisar y firmar contrato</a>
  </p>

  <p style="font-size:13px;color:#888;">Este enlace es unico para tu empresa. Puedes reenviarlo a la persona autorizada para firmar.</p>

  <div class="footer">
    <p>Sisteco — Infraestructura inteligente para tus ventas</p>
    <p>contacto@sisteco.cl | +56 9 40065566</p>
  </div>
</div></body></html>`
    });

    return res.status(201).json({
      success: true,
      contractId,
      contractUrl,
      message: 'Contrato generado y enviado por email.',
    });

  } catch (error) {
    console.error('Generate contract error:', error);
    return res.status(500).json({ error: 'Error interno del servidor', code: 'SERVER_ERROR' });
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
