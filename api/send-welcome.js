// api/send-welcome.js
// Sends onboarding welcome email + schedules drip sequence
// Can be called manually or from a webhook after payment setup
// Deploy: Vercel Serverless Function

import { convex } from './_lib/convex.js';
import { api } from '../convex/_generated/api.js';
import { resend } from './_lib/resend.js';
import { onboardingWelcomeEmail } from './_lib/email-templates.js';
import { z } from 'zod';

const FROM_EMAIL = 'Felipe Palma - Sisteco <contacto@sisteco.cl>';

const allowedOrigins = ['https://sisteco.com', 'https://sisteco-landing.vercel.app', 'http://localhost:3000'];

const welcomeSchema = z.object({
  email: z.string().email().max(255),
  name: z.string().max(100).optional().nullable(),
  plan: z.string().max(50).optional().nullable(),
});

export default async function handler(req, res) {
  // CORS headers
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Verify authorization (CRON_SECRET or API key)
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const parsed = welcomeSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Datos invalidos',
        code: 'INVALID_DATA',
        details: parsed.error,
      });
    }

    const { email, name, plan } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Send onboarding welcome email
    const template = onboardingWelcomeEmail(normalizedEmail, {
      name: name || undefined,
      plan: plan || undefined,
    });

    const { data: emailResult, error: emailError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: template.to,
      subject: template.subject,
      html: template.html,
    });

    if (emailError) {
      console.error('Onboarding welcome email error:', emailError);
      return res.status(500).json({
        error: 'Error enviando email',
        code: 'EMAIL_ERROR',
      });
    }

    console.log('Onboarding welcome email sent:', emailResult?.id);

    // 2. Schedule follow-up drip sequence in Convex
    const now = Date.now();
    const day1 = now + 1 * 24 * 60 * 60 * 1000;
    const day3 = now + 3 * 24 * 60 * 60 * 1000;
    const day7 = now + 7 * 24 * 60 * 60 * 1000;

    await convex.mutation(api.emailSequence.scheduleDrip, {
      email: normalizedEmail,
      items: [
        { templateKey: 'onboarding_session_reminder', scheduledAt: day1 },
        { templateKey: 'onboarding_pipeline_active', scheduledAt: day3 },
        { templateKey: 'onboarding_week_review', scheduledAt: day7 },
      ],
    });

    console.log('Onboarding drip scheduled for:', normalizedEmail);

    return res.status(200).json({
      success: true,
      message: 'Welcome email enviado y drip programado',
      resendId: emailResult?.id,
    });

  } catch (error) {
    console.error('Send welcome error:', error);
    return res.status(500).json({
      error: 'Error interno del servidor',
      code: 'SERVER_ERROR',
    });
  }
}
