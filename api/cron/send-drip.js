import { convex } from '../_lib/convex.js';
import { api } from '../../convex/_generated/api.js';
import { resend, FROM_EMAIL } from '../_lib/resend.js';
import { TEMPLATES } from '../_lib/email-templates.js';

export default async function handler(req, res) {
  // Verificar que es una petición autorizada (Vercel Cron o manual)
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Buscar emails pendientes con scheduledAt <= ahora
    const pendingEmails = await convex.query(api.emailSequence.getPending, {
      now: Date.now(),
      limit: 50,
    });

    if (!pendingEmails || pendingEmails.length === 0) {
      return res.status(200).json({ message: 'No pending emails', sent: 0 });
    }

    // Templates desactivados 2026-05-15 por contener metricas inventadas
    // (viola .claude/rules/compliance.md / Ley 21.719). Se cancelan in-place
    // como defensa en profundidad: aunque scheduleDrip ya esta comentado,
    // este guard previene reenvio si quedaron items huerfanos en cola.
    const DISABLED_TEMPLATES = new Set(['case_study', 'quick_win']);

    let sent = 0;
    let failed = 0;
    let cancelled = 0;

    for (const item of pendingEmails) {
      if (DISABLED_TEMPLATES.has(item.templateKey)) {
        await convex.mutation(api.emailSequence.markFailed, { id: item._id });
        cancelled++;
        console.log(`Cancelled disabled template ${item.templateKey} for ${item.email}`);
        continue;
      }

      const templateFn = TEMPLATES[item.templateKey];
      if (!templateFn) {
        console.error(`Unknown template: ${item.templateKey}`);
        await convex.mutation(api.emailSequence.markFailed, { id: item._id });
        failed++;
        continue;
      }

      const template = templateFn(item.email);

      const { data: emailResult, error: emailError } = await resend.emails.send({
        from: FROM_EMAIL,
        to: template.to,
        subject: template.subject,
        html: template.html
      });

      if (emailError) {
        console.error(`Failed to send ${item.templateKey} to ${item.email}:`, emailError);
        await convex.mutation(api.emailSequence.markFailed, { id: item._id });
        failed++;
      } else {
        await convex.mutation(api.emailSequence.markSent, {
          id: item._id,
          resendId: emailResult?.id || undefined,
        });
        sent++;
        console.log(`Sent ${item.templateKey} to ${item.email} (${emailResult?.id})`);
      }
    }

    return res.status(200).json({
      message: `Drip emails processed`,
      sent,
      failed,
      cancelled,
      total: pendingEmails.length
    });

  } catch (error) {
    console.error('Cron error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
