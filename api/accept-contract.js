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

const acceptSchema = z.object({
  contractId: z.string().min(1),
  contactName: z.string().min(1).max(200),
  contactRole: z.string().min(1).max(200),
  companyRut: z.string().min(1).max(20),
  acceptedTerms: z.literal(true),
  acceptedDPA: z.literal(true),
});

export default async function handler(req, res) {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // GET: fetch contract details by ?id=
  if (req.method === 'GET') {
    try {
      const contractId = req.query.id;
      if (!contractId || typeof contractId !== 'string') {
        return res.status(400).json({ error: 'ID de contrato requerido', code: 'MISSING_ID' });
      }
      const contract = await convex.query(api.contracts.getByContractId, { contractId });
      if (!contract) {
        return res.status(404).json({ error: 'Contrato no encontrado', code: 'NOT_FOUND' });
      }
      return res.status(200).json({
        contractId: contract.contractId,
        email: contract.email,
        company: contract.company,
        plan: contract.plan,
        price: contract.price,
        billingCycle: contract.billingCycle,
        contractVersion: contract.contractVersion,
        status: contract.status,
        createdAt: contract.createdAt,
      });
    } catch (error) {
      console.error('Get contract error:', error);
      return res.status(500).json({ error: 'Error interno del servidor', code: 'SERVER_ERROR' });
    }
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const parsed = acceptSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Datos invalidos', code: 'INVALID_DATA', details: parsed.error });
    }

    const { contractId, contactName, contactRole, companyRut } = parsed.data;

    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.headers['x-real-ip'] || req.socket?.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'unknown';

    // Get contract details first
    const contract = await convex.query(api.contracts.getByContractId, { contractId });
    if (!contract) {
      return res.status(404).json({ error: 'Contrato no encontrado', code: 'NOT_FOUND' });
    }

    if (contract.status === 'accepted') {
      return res.status(409).json({ error: 'Este contrato ya fue firmado', code: 'ALREADY_ACCEPTED' });
    }

    if (contract.status === 'expired') {
      return res.status(410).json({ error: 'Este contrato ha expirado', code: 'EXPIRED' });
    }

    // Accept the contract in Convex
    await convex.mutation(api.contracts.accept, {
      contractId,
      contactName,
      contactRole,
      companyRut,
      acceptedIp: ip,
      acceptedUserAgent: userAgent,
    });

    const planName = PLAN_NAMES[contract.plan] || contract.plan;
    const priceFormatted = contract.price.toLocaleString('en-US', { minimumFractionDigits: 0 });
    const cycleLabel = contract.billingCycle === 'anual' ? 'anual' : 'mensual';
    const now = new Date();
    const dateStr = now.toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' });

    // Send confirmation email to client
    resend.emails.send({
      from: FROM_EMAIL,
      to: contract.email,
      subject: `Contrato firmado — Sisteco x ${contract.company}`,
      html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><style>
  body { margin: 0; padding: 0; background-color: #F8F7F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #111111; }
  .container { max-width: 600px; margin: 0 auto; padding: 40px 24px; }
  .header { padding-bottom: 32px; border-bottom: 1px solid #e5e5e5; margin-bottom: 32px; }
  h1 { font-size: 28px; font-weight: 700; line-height: 1.3; margin: 0 0 16px; }
  h2 { font-size: 18px; font-weight: 600; margin: 24px 0 12px; }
  p { font-size: 16px; line-height: 1.6; color: #333; margin: 0 0 16px; }
  .success-badge { display: inline-block; background: #c5ed36; color: #111; padding: 6px 16px; border-radius: 20px; font-weight: 600; font-size: 14px; margin-bottom: 24px; }
  .detail-box { background: #ffffff; border: 1px solid #e5e5e5; border-radius: 12px; padding: 24px; margin: 24px 0; }
  .detail-row { padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
  .detail-row:last-child { border-bottom: none; }
  .detail-label { color: #666; display: block; margin-bottom: 2px; }
  .detail-value { font-weight: 600; }
  .legal-note { background: #f0f0f0; border-radius: 8px; padding: 16px; font-size: 13px; color: #666; margin: 24px 0; }
  .footer { margin-top: 40px; padding-top: 24px; border-top: 1px solid #e5e5e5; font-size: 13px; color: #888; }
</style></head>
<body><div class="container">
  <div class="header">
    <img src="https://sisteco.cl/assets/logos/sisteco-email-logo.png" alt="Sisteco" width="200" style="width:200px;height:auto;display:block;" />
  </div>

  <span class="success-badge">Contrato firmado</span>
  <h1>Confirmacion de firma de contrato</h1>
  <p>El contrato de servicios entre <strong>Sisteco</strong> y <strong>${escapeHtml(contract.company)}</strong> ha sido firmado electronicamente.</p>

  <div class="detail-box">
    <h2 style="margin-top:0;">Resumen del contrato</h2>
    <div class="detail-row">
      <span class="detail-label">Empresa</span>
      <span class="detail-value">${escapeHtml(contract.company)}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">RUT</span>
      <span class="detail-value">${escapeHtml(companyRut)}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Firmante</span>
      <span class="detail-value">${escapeHtml(contactName)} — ${escapeHtml(contactRole)}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Plan</span>
      <span class="detail-value">${escapeHtml(planName)}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Precio</span>
      <span class="detail-value">USD $${priceFormatted} + IVA / ${cycleLabel}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Fecha de firma</span>
      <span class="detail-value">${dateStr}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Version del contrato</span>
      <span class="detail-value">${escapeHtml(contract.contractVersion)}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">ID de contrato</span>
      <span class="detail-value" style="font-family:monospace;font-size:12px;">${escapeHtml(contractId)}</span>
    </div>
  </div>

  <div class="legal-note">
    <strong>Nota legal:</strong> Este contrato fue aceptado electronicamente conforme a la Ley 19.799 de Firma Electronica de Chile. La aceptacion quedo registrada con la direccion IP ${escapeHtml(ip)} el ${dateStr}. Ambas partes reciben una copia de este acuerdo.
  </div>

  <p>Nuestro equipo se pondra en contacto contigo para comenzar el onboarding. Si tienes preguntas, escribenos a <a href="mailto:contacto@sisteco.cl" style="color:#111;font-weight:600;">contacto@sisteco.cl</a>.</p>

  <div class="footer">
    <p>Sisteco — Infraestructura inteligente para tus ventas</p>
    <p>contacto@sisteco.cl | +56 9 40065566</p>
  </div>
</div></body></html>`
    }).catch(err => console.error('Client confirmation email error:', err));

    // Send notification to Sisteco team
    resend.emails.send({
      from: FROM_EMAIL,
      to: 'contacto@sisteco.cl',
      subject: `CONTRATO FIRMADO — ${contract.company} · Plan ${planName}`,
      html: `
        <h2>Contrato firmado electronicamente</h2>
        <table style="border-collapse:collapse;width:100%;max-width:500px;">
          <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Empresa</td><td style="padding:8px;border-bottom:1px solid #eee;font-weight:600;">${escapeHtml(contract.company)}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">RUT</td><td style="padding:8px;border-bottom:1px solid #eee;font-weight:600;">${escapeHtml(companyRut)}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Firmante</td><td style="padding:8px;border-bottom:1px solid #eee;font-weight:600;">${escapeHtml(contactName)} (${escapeHtml(contactRole)})</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Email</td><td style="padding:8px;border-bottom:1px solid #eee;font-weight:600;">${escapeHtml(contract.email)}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Plan</td><td style="padding:8px;border-bottom:1px solid #eee;font-weight:600;">${escapeHtml(planName)}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Precio</td><td style="padding:8px;border-bottom:1px solid #eee;font-weight:600;">USD $${priceFormatted} + IVA / ${cycleLabel}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Fecha</td><td style="padding:8px;border-bottom:1px solid #eee;font-weight:600;">${dateStr}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">IP</td><td style="padding:8px;border-bottom:1px solid #eee;font-family:monospace;font-size:12px;">${escapeHtml(ip)}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Contract ID</td><td style="padding:8px;border-bottom:1px solid #eee;font-family:monospace;font-size:12px;">${escapeHtml(contractId)}</td></tr>
        </table>
      `
    }).catch(err => console.error('Sisteco notification email error:', err));

    // Send Discord notification (fire-and-forget)
    if (process.env.DISCORD_WEBHOOK_URL) {
      fetch(process.env.DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `CONTRATO FIRMADO — ${contract.company} (${contactName}) · Plan ${planName} · RUT: ${companyRut}`,
        }),
      }).catch(err => console.error('Discord notification error:', err));
    }

    return res.status(200).json({
      success: true,
      message: 'Contrato firmado exitosamente. Se ha enviado una confirmacion a tu email.',
    });

  } catch (error) {
    console.error('Accept contract error:', error);

    // Handle specific Convex errors
    if (error.message?.includes('ya fue firmado')) {
      return res.status(409).json({ error: 'Este contrato ya fue firmado', code: 'ALREADY_ACCEPTED' });
    }
    if (error.message?.includes('no encontrado')) {
      return res.status(404).json({ error: 'Contrato no encontrado', code: 'NOT_FOUND' });
    }
    if (error.message?.includes('expirado')) {
      return res.status(410).json({ error: 'Este contrato ha expirado', code: 'EXPIRED' });
    }

    return res.status(500).json({ error: 'Error interno del servidor', code: 'SERVER_ERROR' });
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
