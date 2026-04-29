require('dotenv').config();
const express = require('express');
const path = require('path');
const { ConvexHttpClient } = require('convex/browser');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración n8n Webhook
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'https://tu-instancia.n8n.cloud/webhook/sisteco-orchestration';

// Inicializar Convex
const convex = new ConvexHttpClient(process.env.CONVEX_URL);

// NOTE: Convex API types are generated after running `npx convex dev`.
// We use dynamic import since server.js is CommonJS.
let _api = null;
async function getApi() {
  if (!_api) {
    const mod = await import('./convex/_generated/api.js');
    _api = mod.api;
  }
  return _api;
}

// Rate limiting para APIs públicas
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10,
  message: { error: 'Demasiadas peticiones, por favor intenta más tarde', code: 'RATE_LIMIT_EXCEEDED' }
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Validaciones
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isBusinessEmail = (email) => {
  const personalDomains = [
    'gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com',
    'live.com', 'icloud.com', 'me.com', 'mail.com', 'protonmail.com'
  ];
  const domain = email.split('@')[1]?.toLowerCase();
  return domain && !personalDomains.includes(domain);
};

// Utilidad de escape
const escapeHTML = (str) => {
  if (!str) return str;
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag]));
};

// CORS middleware
const allowedOrigins = ['https://sisteco.com', 'https://sisteco-landing.vercel.app', 'http://localhost:3000'];
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// API: Leads
app.post('/api/leads', apiLimiter, async (req, res) => {
  try {
    const { email, source = 'landing_hero', utm_source, utm_medium, utm_campaign } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email requerido', code: 'EMAIL_REQUIRED' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Email invalido', code: 'INVALID_EMAIL' });
    }

    const referrer = req.headers.referer || req.headers.referrer || null;
    const userAgent = req.headers['user-agent'] || null;
    const ip = req.headers['x-forwarded-for']?.split(',')[0] ||
      req.headers['x-real-ip'] ||
      req.socket?.remoteAddress || null;

    const api = await getApi();
    const result = await convex.mutation(api.leads.upsertLead, {
      email: email.toLowerCase().trim(),
      source,
      utmSource: utm_source || undefined,
      utmMedium: utm_medium || undefined,
      utmCampaign: utm_campaign || undefined,
      referrer: referrer || undefined,
      userAgent: userAgent || undefined,
      ipAddress: ip || undefined,
    });

    if (result.isExisting) {
      return res.status(200).json({
        success: true,
        message: 'Ya estas registrado. Te contactaremos pronto.',
        isExisting: true
      });
    }

    // Integración n8n - Orquestar Lead
    try {
      await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.N8N_AUTH_KEY || 'default_key'}`
        },
        body: JSON.stringify({
          event: 'lead_captured',
          data: {
            id: result._id,
            email: email.toLowerCase().trim(),
            source,
            isBusiness: isBusinessEmail(email),
            utm: { utm_source, utm_medium, utm_campaign }
          }
        })
      });
      console.log('Lead enviado exitosamente a n8n para orquestación.');
    } catch (n8nError) {
      console.error('Error enviando payload a n8n:', n8nError);
    }

    return res.status(201).json({
      success: true,
      message: isBusinessEmail(email)
        ? 'Excelente! Te contactaremos en las proximas 24 horas.'
        : 'Gracias por tu interes. Te enviaremos informacion pronto.',
      isBusinessEmail: isBusinessEmail(email),
      leadId: result._id
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Error interno del servidor', code: 'SERVER_ERROR' });
  }
});

// API: Track clicks
app.post('/api/track', async (req, res) => {
  try {
    const { buttonId, buttonText, pageUrl } = req.body;

    if (!buttonId) {
      return res.status(400).json({ error: 'buttonId requerido' });
    }

    const api = await getApi();
    await convex.mutation(api.ctaClicks.track, {
      buttonId,
      buttonText: buttonText || undefined,
      pageUrl: pageUrl || undefined,
    });

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(200).json({ success: true });
  }
});

// API: Demo requests
app.post('/api/demo', apiLimiter, async (req, res) => {
  try {
    const { email, companyName, companySize, phone, message } = req.body;

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ error: 'Email valido requerido', code: 'INVALID_EMAIL' });
    }

    const api = await getApi();

    const leadResult = await convex.mutation(api.leads.upsertLeadSoft, {
      email: email.toLowerCase().trim(),
      source: 'demo_request',
    });

    const demoResult = await convex.mutation(api.demoRequests.create, {
      email: email.toLowerCase().trim(),
      companyName: escapeHTML(companyName) || undefined,
      companySize: escapeHTML(companySize) || undefined,
      phone: escapeHTML(phone) || undefined,
      message: escapeHTML(message) || undefined,
      leadId: leadResult._id,
    });

    // Integración n8n - Orquestar Demo Request
    try {
      await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.N8N_AUTH_KEY || 'default_key'}`
        },
        body: JSON.stringify({
          event: 'demo_requested',
          data: {
            request_id: demoResult._id,
            email: email.toLowerCase().trim(),
            company_name: companyName,
            company_size: companySize,
            phone,
            message
          }
        })
      });
      console.log('Demo Request enviada exitosamente a n8n.');
    } catch (n8nError) {
      console.error('Error enviando payload a n8n:', n8nError);
    }

    return res.status(201).json({
      success: true,
      message: 'Solicitud recibida. Nuestro equipo te contactara pronto.',
      requestId: demoResult._id
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Error interno del servidor', code: 'SERVER_ERROR' });
  }
});

// API: Contact form
app.post('/api/contact', apiLimiter, async (req, res) => {
  try {
    const { name, email, company, message } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Nombre requerido', code: 'NAME_REQUIRED' });
    }

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ error: 'Email valido requerido', code: 'INVALID_EMAIL' });
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Mensaje requerido', code: 'MESSAGE_REQUIRED' });
    }

    const api = await getApi();

    const leadResult = await convex.mutation(api.leads.upsertLeadSoft, {
      email: email.toLowerCase().trim(),
      source: 'contact_form',
    });

    await convex.mutation(api.demoRequests.create, {
      email: email.toLowerCase().trim(),
      companyName: escapeHTML(company) || undefined,
      message: escapeHTML(message) || undefined,
      leadId: leadResult._id,
    });

    return res.status(201).json({
      success: true,
      message: 'Mensaje enviado. Te responderemos en menos de 24 horas.',
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ error: 'Error interno del servidor', code: 'SERVER_ERROR' });
  }
});

// Rutas limpias para SEO pages (soluciones/* y docs/*)
app.get('/soluciones/:slug', (req, res) => {
  const slug = req.params.slug;
  if (!/^[a-zA-Z0-9-]+$/.test(slug)) {
    return res.status(400).send('Petición inválida');
  }
  const filePath = path.join(__dirname, 'pages', 'soluciones', `${slug}.html`);
  res.sendFile(filePath, (err) => {
    if (err) res.status(404).send('Página no encontrada');
  });
});

app.get('/docs/:slug', (req, res) => {
  const slug = req.params.slug;
  if (!/^[a-zA-Z0-9-]+$/.test(slug)) {
    return res.status(400).send('Petición inválida');
  }
  const filePath = path.join(__dirname, 'pages', 'docs', `${slug}.html`);
  res.sendFile(filePath, (err) => {
    if (err) res.status(404).send('Página no encontrada');
  });
});

// Recursos (newsletter feed + posts)
app.get('/recursos', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'recursos', 'index.html'));
});
app.get('/recursos/api/posts.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'recursos', 'api', 'posts.json'));
});
app.get('/recursos/posts/:slug', (req, res) => {
  const slug = req.params.slug;
  if (!/^[a-zA-Z0-9-]+$/.test(slug)) {
    return res.status(400).send('Petición inválida');
  }
  const filePath = path.join(__dirname, 'pages', 'recursos', 'posts', `${slug}.html`);
  res.sendFile(filePath, (err) => {
    if (err) res.status(404).send('Post no encontrado');
  });
});

// Rutas limpias para mirrors (.md)
app.get('/:page.md', (req, res) => {
  const page = req.params.page;
  if (!/^[a-zA-Z0-9-]+$/.test(page)) {
    return res.status(400).send('Petición inválida');
  }
  const filePath = path.join(__dirname, 'mirrors', `${page}.md`);
  res.type('text/plain').sendFile(filePath, (err) => {
    if (err) res.status(404).send('No encontrado');
  });
});

// Servir sub-páginas
app.get('/pages/:page', (req, res) => {
  const page = req.params.page;

  // Sanitización contra Path Traversal
  if (!/^[a-zA-Z0-9-]+$/.test(page.replace('.html', ''))) {
    return res.status(400).send('Petición inválida');
  }

  const safePage = page.endsWith('.html') ? page : `${page}.html`;
  const filePath = path.join(__dirname, 'pages', safePage);
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).send('Página no encontrada');
    }
  });
});

// Servir index.html para la raiz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`  Sisteco Landing - Servidor Local`);
  console.log(`========================================`);
  console.log(`  URL: http://localhost:${PORT}`);
  console.log(`  Convex: ${process.env.CONVEX_URL ? 'Conectado' : 'No configurado'}`);
  console.log(`========================================\n`);
});
