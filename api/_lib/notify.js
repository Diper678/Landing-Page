/**
 * notify.js — Alertas internas por Discord (webhook ya configurado: DISCORD_WEBHOOK_URL).
 *
 * Fire-and-forget: los callers deben usar .catch() para no romper el flujo principal.
 * Si el webhook no está configurado, no hace nada (dev/preview).
 */
export async function notifyDiscord(content) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;
  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
}
