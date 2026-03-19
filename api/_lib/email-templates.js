const LOGO_URL = 'https://sisteco.cl/assets/logos/sisteco-email-logo.png';

// Lucide SVG icons inline — same icons used on sisteco.cl landing page
// Rendered at 24x24 with brand color #c5ed36 background circles
const icon = (svg) => `<div style="width:44px;height:44px;background:#c5ed36;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:8px;">
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${svg}</svg>
</div>`;

// Lucide: target (landing uses data-lucide="target")
const iconTarget = icon('<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>');
// Lucide: brain (landing uses data-lucide="brain")
const iconBrain = icon('<path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M19.967 17.484A4 4 0 0 1 18 18"/>');
// Lucide: mail (landing uses data-lucide="mail")
const iconMail = icon('<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>');
// Lucide: clipboard-list
const iconClipboard = icon('<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>');
// Lucide: bar-chart-3 (landing uses data-lucide="bar-chart-3")
const iconChart = icon('<path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>');
// Lucide: message-circle (landing uses data-lucide="message-circle")
const iconMessage = icon('<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>');
// Lucide: sparkles (landing uses data-lucide="sparkles")
const iconSparkles = icon('<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>');

// Inline SVG check icon for lists (replaces ✅)
const checkSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111111" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:6px;background:#c5ed36;border-radius:50%;padding:3px;width:22px;height:22px;"><path d="M20 6 9 17l-5-5"/></svg>`;

const baseStyles = `
  body { margin: 0; padding: 0; background-color: #F8F7F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #111111; }
  .container { max-width: 600px; margin: 0 auto; padding: 40px 24px; }
  .header { padding-bottom: 32px; border-bottom: 1px solid #e5e5e5; margin-bottom: 32px; }
  h1 { font-size: 28px; font-weight: 700; line-height: 1.3; margin: 0 0 16px; }
  h2 { font-size: 20px; font-weight: 600; margin: 24px 0 12px; }
  p { font-size: 16px; line-height: 1.6; color: #333; margin: 0 0 16px; }
  .accent { color: #111; background-color: #c5ed36; padding: 2px 6px; border-radius: 4px; font-weight: 600; }
  .cta-btn { display: inline-block; background-color: #111111; color: #ffffff !important; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; margin: 24px 0; }
  .feature-box { background: #ffffff; border: 1px solid #e5e5e5; border-radius: 12px; padding: 20px; margin: 12px 0; }
  .stat { font-size: 32px; font-weight: 700; color: #111; }
  .footer { margin-top: 40px; padding-top: 24px; border-top: 1px solid #e5e5e5; font-size: 13px; color: #888; }
  .footer a { color: #888; }
`;

const footer = `
  <div class="footer">
    <p>Sisteco — Infraestructura inteligente para tus ventas</p>
    <p>Si no solicitaste este correo, puedes ignorarlo.</p>
  </div>
`;

const headerHtml = `
  <div class="header">
    <a href="https://sisteco.cl" style="text-decoration:none;"><img src="${LOGO_URL}" alt="Sisteco" width="200" height="60" style="width:200px;height:auto;display:block;" /></a>
  </div>`;

export function welcomeEmail(email) {
  const subject = 'Bienvenido a Sisteco — Tu prospección B2B, automatizada';
  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><style>${baseStyles}</style></head>
<body><div class="container">
  ${headerHtml}

  <h1>Bienvenido a la automatización inteligente de ventas B2B</h1>
  <p>Gracias por registrarte. Estás a un paso de transformar tu proceso de prospección con infraestructura que trabaja por ti.</p>

  <p>Esto es lo que Sisteco puede hacer por tu equipo:</p>

  <div class="feature-box">
    ${iconTarget}
    <h2>Extracción Inteligente</h2>
    <p>Extraemos datos de prospectos de cualquier fuente web con precisión. LinkedIn, directorios empresariales, sitios de la industria — todo automatizado.</p>
  </div>

  <div class="feature-box">
    ${iconBrain}
    <h2>Análisis con IA</h2>
    <p>Procesamos y enriquecemos los datos con los modelos de IA más avanzados del mercado. Cada prospecto llega calificado y listo para contactar.</p>
  </div>

  <div class="feature-box">
    ${iconMail}
    <h2>Secuencias Multicanal</h2>
    <p>Ejecutamos campañas automatizadas por email, LinkedIn y más canales. Mensajes personalizados con IA que generan respuestas reales.</p>
  </div>

  <a href="https://sisteco.cl/#soluciones" class="cta-btn">Ver cómo funciona →</a>

  <p>En los próximos días te compartiremos casos de éxito y una oferta especial para que empieces sin riesgo.</p>

  ${footer}
</div></body></html>`;

  return { subject, html, to: email };
}

export function caseStudyEmail(email) {
  const subject = 'Caso de éxito: +300% en reuniones agendadas con Sisteco';
  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><style>${baseStyles}</style></head>
<body><div class="container">
  ${headerHtml}

  <h1>De 5 a 20+ reuniones por semana con automatización inteligente</h1>

  <p>Queremos compartirte cómo empresas B2B están transformando sus resultados con Sisteco.</p>

  <div class="feature-box">
    <h2>El problema</h2>
    <p>Un equipo de ventas de 4 personas dedicaba <span class="accent">15+ horas semanales</span> a buscar prospectos manualmente, investigar empresas y redactar emails personalizados. Resultado: 5 reuniones por semana.</p>
  </div>

  <div class="feature-box">
    <h2>La solución con Sisteco</h2>
    <p>Implementamos un workflow automatizado:</p>
    <p>1. <strong>Extracción automática</strong> de prospectos ideales desde múltiples fuentes</p>
    <p>2. <strong>Enriquecimiento con IA</strong> — cada prospecto analizado y calificado automáticamente</p>
    <p>3. <strong>Secuencias personalizadas</strong> — emails escritos por IA que suenan humanos y relevantes</p>
  </div>

  <div class="feature-box" style="text-align: center;">
    <h2>Resultados en 30 días</h2>
    <p><span class="stat">+300%</span></p>
    <p>Más reuniones agendadas</p>
    <p><span class="stat">85%</span></p>
    <p>Menos tiempo en tareas manuales</p>
    <p><span class="stat">4.2x</span></p>
    <p>ROI en el primer trimestre</p>
  </div>

  <a href="https://sisteco.cl/#soluciones" class="cta-btn">Quiero resultados así →</a>

  <p>Mañana te compartiremos algo especial para que puedas probarlo con tu equipo.</p>

  ${footer}
</div></body></html>`;

  return { subject, html, to: email };
}

export function quickWinEmail(email) {
  const subject = 'Tu prueba gratuita de Sisteco está lista';
  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><style>${baseStyles}</style></head>
<body><div class="container">
  ${headerHtml}

  <h1>Prueba Sisteco gratis — sin compromiso, sin tarjeta</h1>

  <p>Llevamos unos días compartiendo cómo la automatización inteligente puede transformar tu prospección B2B. Ahora queremos que lo experimentes.</p>

  <div class="feature-box" style="text-align: center;">
    <h2>Tu oferta exclusiva</h2>
    <p><span class="stat">Consultoría gratuita</span></p>
    <p>30 minutos con nuestro equipo para:</p>
    <p>${checkSvg} Analizar tu proceso actual de prospección</p>
    <p>${checkSvg} Identificar oportunidades de automatización</p>
    <p>${checkSvg} Diseñar un workflow personalizado para tu equipo</p>
    <p>${checkSvg} Ver una demo en vivo con tus datos reales</p>
  </div>

  <p>Sin presión, sin compromiso. Si no ves valor, no pierdes nada.</p>

  <a href="https://sisteco.cl/#soluciones" class="cta-btn">Agendar mi consultoría gratuita →</a>

  <p style="font-size: 14px; color: #666;">Esta oferta es válida por los próximos 7 días. Después de eso, las consultorías tienen un costo de $150 USD.</p>

  ${footer}
</div></body></html>`;

  return { subject, html, to: email };
}

export function demoConfirmationEmail(email, companyName) {
  const subject = `Demo confirmada${companyName ? ` para ${companyName}` : ''} — Sisteco`;
  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><style>${baseStyles}</style></head>
<body><div class="container">
  ${headerHtml}

  <h1>Recibimos tu solicitud de demo</h1>

  <p>Gracias por tu interés${companyName ? ` desde <strong>${companyName}</strong>` : ''}. Nuestro equipo revisará tu solicitud y te contactará en las próximas <span class="accent">24 horas hábiles</span>.</p>

  <div class="feature-box">
    <h2>¿Qué esperar de la demo?</h2>
    <p>${iconClipboard} <strong>Diagnóstico</strong> — Entenderemos tu proceso actual de prospección y ventas</p>
    <p>${iconTarget} <strong>Demo personalizada</strong> — Te mostraremos cómo Sisteco se adapta a tu negocio</p>
    <p>${iconChart} <strong>Proyección de resultados</strong> — Estimaremos el impacto en tu pipeline</p>
    <p>${iconMessage} <strong>Q&A</strong> — Resolveremos todas tus dudas técnicas y comerciales</p>
  </div>

  <div class="feature-box">
    <h2>Mientras tanto, prepárate</h2>
    <p>Para aprovechar al máximo la demo, piensa en:</p>
    <p>• ¿Cuántos prospectos necesitas contactar por semana?</p>
    <p>• ¿Qué canales usas actualmente (email, LinkedIn, llamadas)?</p>
    <p>• ¿Cuál es tu mayor cuello de botella en prospección?</p>
  </div>

  <a href="https://cal.com/felipe-sisteco/demo" class="cta-btn">Agendar tu demo ahora →</a>

  <p style="margin-top:12px;font-size:14px;color:#666;">¿Prefieres una conversación 1:1 con Felipe? <a href="https://cal.com/felipe-sisteco/ventas" style="color:#111;font-weight:600;">Agenda aquí →</a></p>

  ${footer}
</div></body></html>`;

  return { subject, html, to: email };
}

// ── Payment Confirmation Email ───────────────────────────────────────────────
export function paymentConfirmationEmail(email, { name, plan, billingCycle, amount }) {
  const planNames = { base: 'Base', growth: 'Crecimiento', enterprise: 'Enterprise' };
  const cycleNames = { monthly: 'Mensual', annual: 'Anual' };
  const displayPlan = planNames[plan] || plan || 'Suscripción';
  const displayCycle = cycleNames[billingCycle] || billingCycle || '';
  const displayAmount = amount ? `$${amount}` : '';
  const greeting = name ? `Hola ${name}` : 'Hola';

  const subject = '¡Bienvenido a Sisteco! Tu suscripción está activa';
  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><style>${baseStyles}</style></head>
<body><div class="container">
  ${headerHtml}

  <h1>¡Tu suscripción está activa!</h1>

  <p>${greeting}, gracias por confiar en Sisteco para automatizar tus ventas B2B.</p>

  <div class="feature-box" style="text-align: center;">
    <h2>Detalle de tu plan</h2>
    <p><span class="stat">${displayPlan}</span></p>
    ${displayCycle ? `<p>Ciclo: <span class="accent">${displayCycle}</span></p>` : ''}
    ${displayAmount ? `<p>Monto: <span class="accent">${displayAmount}</span></p>` : ''}
  </div>

  <h2>Próximos pasos</h2>

  <div class="feature-box">
    ${iconMail}
    <p><strong>1. Sesión de configuración</strong></p>
    <p>En las próximas 24 horas recibirás un email para agendar tu sesión de configuración (60 min).</p>
  </div>

  <div class="feature-box">
    ${iconTarget}
    <p><strong>2. Perfil de cliente ideal</strong></p>
    <p>Configuraremos tu perfil de cliente ideal (ICP) y activaremos tu pipeline de prospección.</p>
  </div>

  <div class="feature-box">
    ${iconChart}
    <p><strong>3. Primeros leads</strong></p>
    <p>Recibirás tus primeros leads calificados en menos de 48 horas después de la configuración.</p>
  </div>

  <div class="feature-box" style="background: #f0f9e0; border-color: #c5ed36;">
    ${iconMessage}
    <p><strong>¿Preguntas?</strong></p>
    <p>Escríbenos a <a href="mailto:contacto@sisteco.cl" style="color:#111;font-weight:600;">contacto@sisteco.cl</a> o al <a href="https://wa.me/56940065566" style="color:#111;font-weight:600;">+56 9 40065566</a>.</p>
  </div>

  ${footer}
</div></body></html>`;

  return { subject, html, to: email };
}

// ── Onboarding Welcome Email (post-payment) ─────────────────────────────────
export function onboardingWelcomeEmail(email, { name, plan }) {
  const greeting = name ? `Hola ${name}` : 'Hola';
  const subject = 'Tu pipeline de ventas está listo — próximos pasos';
  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><style>${baseStyles}</style></head>
<body><div class="container">
  ${headerHtml}

  <h1>Tu pipeline de ventas está listo</h1>

  <p>${greeting}, soy Felipe de Sisteco. Quiero asegurarme de que saques el máximo provecho de tu suscripción desde el día uno.</p>

  <h2>Agenda tu sesión de configuración</h2>

  <p>En esta sesión de 60 minutos configuraremos todo tu pipeline personalizado:</p>

  <div class="feature-box">
    ${iconTarget}
    <p><strong>Lo que haremos juntos:</strong></p>
    <p>${checkSvg} Definir tus industrias y verticales target</p>
    <p>${checkSvg} Configurar los roles de decisión que buscas</p>
    <p>${checkSvg} Establecer el tamaño de empresa ideal</p>
    <p>${checkSvg} Integrar tu CRM actual (si aplica)</p>
  </div>

  <a href="https://cal.com/felipe-sisteco/demo" class="cta-btn">Agendar sesión de configuración →</a>

  <div class="feature-box">
    ${iconClipboard}
    <p><strong>Prepárate para la sesión:</strong></p>
    <p>• ¿Qué industrias son tu target principal?</p>
    <p>• ¿Qué cargos toman la decisión de compra?</p>
    <p>• ¿Cuál es el tamaño ideal de empresa? (empleados o facturación)</p>
    <p>• ¿Usan CRM? ¿Cuál? (HubSpot, Pipedrive, Salesforce, otro)</p>
  </div>

  <div class="feature-box" style="background: #f0f9e0; border-color: #c5ed36;">
    ${iconSparkles}
    <p><strong>Timeline</strong></p>
    <p>En <span class="accent">48 horas después de la sesión</span>, tendrás tu primer batch de leads calificados en tu Sheet o CRM.</p>
  </div>

  <p>Cualquier duda, responde este correo o escríbeme directo.</p>

  <p style="margin-top: 24px;">
    <strong>Felipe Palma</strong><br>
    Fundador, Sisteco<br>
    <a href="mailto:contacto@sisteco.cl" style="color:#111;">contacto@sisteco.cl</a> · <a href="https://wa.me/56940065566" style="color:#111;">+56 9 40065566</a>
  </p>

  ${footer}
</div></body></html>`;

  return { subject, html, to: email };
}

// ── Onboarding Drip Day 1: Session Reminder ──────────────────────────────────
export function onboardingSessionReminderEmail(email) {
  const subject = '¿Listo para tu sesión de configuración?';
  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><style>${baseStyles}</style></head>
<body><div class="container">
  ${headerHtml}

  <h1>¿Ya agendaste tu sesión?</h1>

  <p>Queremos asegurarnos de que tu pipeline quede configurado lo antes posible.</p>

  <p>En la sesión de configuración (60 min) haremos todo el setup para que recibas leads calificados en tu Sheet o CRM en menos de 48 horas.</p>

  <a href="https://cal.com/felipe-sisteco/demo" class="cta-btn">Agendar ahora →</a>

  <div class="feature-box">
    ${iconSparkles}
    <p><strong>¿Sabías que...</strong></p>
    <p>Los clientes que configuran en las primeras <span class="accent">48 horas</span> ven resultados un 70% más rápido.</p>
  </div>

  <p>Si tienes problemas para agendar, responde este correo y coordinamos directo.</p>

  ${footer}
</div></body></html>`;

  return { subject, html, to: email };
}

// ── Onboarding Drip Day 3: Pipeline Active ───────────────────────────────────
export function onboardingPipelineActiveEmail(email) {
  const subject = 'Tu pipeline está activo — aquí van tus primeros resultados';
  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><style>${baseStyles}</style></head>
<body><div class="container">
  ${headerHtml}

  <h1>Tu pipeline ya está trabajando</h1>

  <p>Si ya completaste tu sesión de configuración, tu pipeline de prospección está activo y extrayendo leads calificados para tu equipo.</p>

  <div class="feature-box">
    ${iconChart}
    <p><strong>Qué está pasando ahora:</strong></p>
    <p>${checkSvg} Extracción automática de prospectos según tu ICP</p>
    <p>${checkSvg} Enriquecimiento con datos de SII y fuentes públicas</p>
    <p>${checkSvg} Scoring inteligente de cada lead</p>
    <p>${checkSvg} Entrega a tu Sheet/CRM con toda la información lista</p>
  </div>

  <p>Revisa tu Sheet o CRM — deberías ver los primeros leads entrando. Si no los ves, avísanos y lo revisamos juntos.</p>

  <div class="feature-box" style="background: #f0f9e0; border-color: #c5ed36;">
    ${iconMessage}
    <p><strong>Tip:</strong> Los primeros leads son los mejores para calibrar. Revísalos y dinos si el perfil coincide con lo que buscas — ajustamos al instante.</p>
  </div>

  ${footer}
</div></body></html>`;

  return { subject, html, to: email };
}

// ── Onboarding Drip Day 7: First Week Review ────────────────────────────────
export function onboardingWeekReviewEmail(email) {
  const subject = 'Primera semana: así va tu pipeline';
  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><style>${baseStyles}</style></head>
<body><div class="container">
  ${headerHtml}

  <h1>Tu primera semana con Sisteco</h1>

  <p>Ya llevas una semana con tu pipeline activo. Queremos saber cómo te fue.</p>

  <div class="feature-box">
    ${iconClipboard}
    <p><strong>Checklist de primera semana:</strong></p>
    <p>${checkSvg} Sesión de configuración completada</p>
    <p>${checkSvg} Primeros leads recibidos en Sheet/CRM</p>
    <p>${checkSvg} Perfil ICP validado con datos reales</p>
    <p>${checkSvg} Equipo de ventas contactando leads calificados</p>
  </div>

  <p>Si hay algo que ajustar en tu pipeline — industrias, tamaño de empresa, roles target — solo responde este correo y lo configuramos.</p>

  <div class="feature-box" style="background: #f0f9e0; border-color: #c5ed36;">
    ${iconBrain}
    <p><strong>Dato clave:</strong></p>
    <p>Las empresas que responden en menos de <span class="accent">5 minutos</span> tienen 21x más probabilidades de cerrar. Tu pipeline entrega los leads justo cuando están listos — asegúrate de que tu equipo los contacte rápido.</p>
  </div>

  <a href="mailto:contacto@sisteco.cl" class="cta-btn">Agendar revisión de resultados →</a>

  ${footer}
</div></body></html>`;

  return { subject, html, to: email };
}

export const TEMPLATES = {
  welcome: welcomeEmail,
  case_study: caseStudyEmail,
  quick_win: quickWinEmail,
  demo_confirmation: demoConfirmationEmail,
  payment_confirmation: paymentConfirmationEmail,
  onboarding_welcome: onboardingWelcomeEmail,
  onboarding_session_reminder: onboardingSessionReminderEmail,
  onboarding_pipeline_active: onboardingPipelineActiveEmail,
  onboarding_week_review: onboardingWeekReviewEmail,
};
