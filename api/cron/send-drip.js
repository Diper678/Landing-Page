import { createClient } from '@supabase/supabase-js';
import { resend, FROM_EMAIL } from '../lib/resend.js';
import { TEMPLATES } from '../lib/email-templates.js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  // Verificar que es una petición autorizada (Vercel Cron o manual)
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Buscar emails pendientes con fecha <= ahora
    const { data: pendingEmails, error: fetchError } = await supabase
      .from('email_sequence')
      .select('*')
      .eq('status', 'pending')
      .lte('scheduled_at', new Date().toISOString())
      .order('scheduled_at', { ascending: true })
      .limit(50);

    if (fetchError) {
      console.error('Error fetching pending emails:', fetchError);
      return res.status(500).json({ error: 'Database error', details: fetchError.message });
    }

    if (!pendingEmails || pendingEmails.length === 0) {
      return res.status(200).json({ message: 'No pending emails', sent: 0 });
    }

    let sent = 0;
    let failed = 0;

    for (const item of pendingEmails) {
      const templateFn = TEMPLATES[item.template_key];
      if (!templateFn) {
        console.error(`Unknown template: ${item.template_key}`);
        await markFailed(item.id, `Unknown template: ${item.template_key}`);
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
        console.error(`Failed to send ${item.template_key} to ${item.email}:`, emailError);
        await markFailed(item.id, emailError.message);
        failed++;
      } else {
        await supabase
          .from('email_sequence')
          .update({
            status: 'sent',
            sent_at: new Date().toISOString(),
            resend_id: emailResult?.id || null
          })
          .eq('id', item.id);

        sent++;
        console.log(`Sent ${item.template_key} to ${item.email} (${emailResult?.id})`);
      }
    }

    return res.status(200).json({
      message: `Drip emails processed`,
      sent,
      failed,
      total: pendingEmails.length
    });

  } catch (error) {
    console.error('Cron error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function markFailed(id, reason) {
  await supabase
    .from('email_sequence')
    .update({ status: 'failed' })
    .eq('id', id);
}
