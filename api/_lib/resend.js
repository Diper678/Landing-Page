import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || 'Sisteco <noreply@onboarding.sisteco.cl>';

export { resend, FROM_EMAIL };
