// Generates static HTML previews from the email templates
import { welcomeEmail, caseStudyEmail, quickWinEmail, demoConfirmationEmail } from '../api/lib/email-templates.js';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const badge = (label) => `<div style="background:#c5ed36;color:#111;padding:8px 16px;font-size:12px;font-weight:700;text-align:center;letter-spacing:1px;">${label}</div>`;

const previews = [
  { fn: welcomeEmail, email: 'demo@empresa.cl', label: 'EMAIL 1: WELCOME (envío inmediato)', file: '1-welcome.html' },
  { fn: caseStudyEmail, email: 'demo@empresa.cl', label: 'EMAIL 2: CASE STUDY (día 3)', file: '2-case-study.html' },
  { fn: quickWinEmail, email: 'demo@empresa.cl', label: 'EMAIL 3: QUICK WIN (día 7)', file: '3-quick-win.html' },
  { fn: demoConfirmationEmail, email: 'demo@empresa.cl', label: 'EMAIL 4: DEMO CONFIRMATION (envío inmediato al pedir demo)', file: '4-demo-confirmation.html', args: ['demo@empresa.cl', 'Acme Corp'] },
];

for (const p of previews) {
  const result = p.args ? p.fn(...p.args) : p.fn(p.email);
  // Replace production logo URL with local path for preview
  let html = result.html.replace(
    'https://sisteco.cl/assets/logos/sisteco-email-logo.png',
    '../assets/logos/sisteco-email-logo.png'
  );
  // Insert preview badge after <body>
  html = html.replace('<body>', `<body>\n${badge(`PREVIEW — ${p.label} · De: noreply@onboarding.sisteco.cl`)}`);
  writeFileSync(join(__dirname, p.file), html);
  console.log(`Created: ${p.file}`);
}
