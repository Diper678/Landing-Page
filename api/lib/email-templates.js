const baseStyles = `
  body { margin: 0; padding: 0; background-color: #F8F7F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #111111; }
  .container { max-width: 600px; margin: 0 auto; padding: 40px 24px; }
  .logo { font-size: 24px; font-weight: 700; color: #111111; text-decoration: none; }
  .logo span { color: #c5ed36; }
  .header { padding-bottom: 32px; border-bottom: 1px solid #e5e5e5; margin-bottom: 32px; }
  h1 { font-size: 28px; font-weight: 700; line-height: 1.3; margin: 0 0 16px; }
  h2 { font-size: 20px; font-weight: 600; margin: 24px 0 12px; }
  p { font-size: 16px; line-height: 1.6; color: #333; margin: 0 0 16px; }
  .accent { color: #111; background-color: #c5ed36; padding: 2px 6px; border-radius: 4px; font-weight: 600; }
  .cta-btn { display: inline-block; background-color: #111111; color: #ffffff !important; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; margin: 24px 0; }
  .feature-box { background: #ffffff; border: 1px solid #e5e5e5; border-radius: 12px; padding: 20px; margin: 12px 0; }
  .feature-icon { font-size: 24px; margin-bottom: 8px; }
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

export function welcomeEmail(email) {
  const subject = 'Bienvenido a Sisteco — Tu prospección B2B, automatizada';
  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><style>${baseStyles}</style></head>
<body><div class="container">
  <div class="header">
    <a class="logo" href="https://sisteco.com">sist<span>e</span>co</a>
  </div>

  <h1>Bienvenido a la automatización inteligente de ventas B2B</h1>
  <p>Gracias por registrarte. Estás a un paso de transformar tu proceso de prospección con infraestructura que trabaja por ti.</p>

  <p>Esto es lo que Sisteco puede hacer por tu equipo:</p>

  <div class="feature-box">
    <div class="feature-icon">🎯</div>
    <h2>Extracción Inteligente</h2>
    <p>Extraemos datos de prospectos de cualquier fuente web con precisión. LinkedIn, directorios empresariales, sitios de la industria — todo automatizado.</p>
  </div>

  <div class="feature-box">
    <div class="feature-icon">🤖</div>
    <h2>Análisis con IA</h2>
    <p>Procesamos y enriquecemos los datos con los modelos de IA más avanzados del mercado. Cada prospecto llega calificado y listo para contactar.</p>
  </div>

  <div class="feature-box">
    <div class="feature-icon">📧</div>
    <h2>Secuencias Multicanal</h2>
    <p>Ejecutamos campañas automatizadas por email, LinkedIn y más canales. Mensajes personalizados con IA que generan respuestas reales.</p>
  </div>

  <a href="https://sisteco.com/#soluciones" class="cta-btn">Ver cómo funciona →</a>

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
  <div class="header">
    <a class="logo" href="https://sisteco.com">sist<span>e</span>co</a>
  </div>

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

  <a href="https://sisteco.com/#soluciones" class="cta-btn">Quiero resultados así →</a>

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
  <div class="header">
    <a class="logo" href="https://sisteco.com">sist<span>e</span>co</a>
  </div>

  <h1>Prueba Sisteco gratis — sin compromiso, sin tarjeta</h1>

  <p>Llevamos unos días compartiendo cómo la automatización inteligente puede transformar tu prospección B2B. Ahora queremos que lo experimentes.</p>

  <div class="feature-box" style="text-align: center;">
    <h2>Tu oferta exclusiva</h2>
    <p><span class="stat">Consultoría gratuita</span></p>
    <p>30 minutos con nuestro equipo para:</p>
    <p>✅ Analizar tu proceso actual de prospección</p>
    <p>✅ Identificar oportunidades de automatización</p>
    <p>✅ Diseñar un workflow personalizado para tu equipo</p>
    <p>✅ Ver una demo en vivo con tus datos reales</p>
  </div>

  <p>Sin presión, sin compromiso. Si no ves valor, no pierdes nada.</p>

  <a href="https://sisteco.com/#soluciones" class="cta-btn">Agendar mi consultoría gratuita →</a>

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
  <div class="header">
    <a class="logo" href="https://sisteco.com">sist<span>e</span>co</a>
  </div>

  <h1>Recibimos tu solicitud de demo 🎉</h1>

  <p>Gracias por tu interés${companyName ? ` desde <strong>${companyName}</strong>` : ''}. Nuestro equipo revisará tu solicitud y te contactará en las próximas <span class="accent">24 horas hábiles</span>.</p>

  <div class="feature-box">
    <h2>¿Qué esperar de la demo?</h2>
    <p>📋 <strong>Diagnóstico</strong> — Entenderemos tu proceso actual de prospección y ventas</p>
    <p>🎯 <strong>Demo personalizada</strong> — Te mostraremos cómo Sisteco se adapta a tu negocio</p>
    <p>📊 <strong>Proyección de resultados</strong> — Estimaremos el impacto en tu pipeline</p>
    <p>💬 <strong>Q&A</strong> — Resolveremos todas tus dudas técnicas y comerciales</p>
  </div>

  <div class="feature-box">
    <h2>Mientras tanto, prepárate</h2>
    <p>Para aprovechar al máximo la demo, piensa en:</p>
    <p>• ¿Cuántos prospectos necesitas contactar por semana?</p>
    <p>• ¿Qué canales usas actualmente (email, LinkedIn, llamadas)?</p>
    <p>• ¿Cuál es tu mayor cuello de botella en prospección?</p>
  </div>

  <p>Si necesitas agendar antes, puedes responder directamente a este correo.</p>

  ${footer}
</div></body></html>`;

  return { subject, html, to: email };
}

export const TEMPLATES = {
  welcome: welcomeEmail,
  case_study: caseStudyEmail,
  quick_win: quickWinEmail,
  demo_confirmation: demoConfirmationEmail
};
