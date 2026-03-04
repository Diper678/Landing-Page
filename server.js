require('dotenv').config();
const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración n8n Webhook
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'https://tu-instancia.n8n.cloud/webhook/sisteco-orchestration';

// Rate limiting para APIs públicas
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10,
  message: { error: 'Demasiadas peticiones, por favor intenta más tarde', code: 'RATE_LIMIT_EXCEEDED' }
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Inicializar Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

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

    const { data, error } = await supabase
      .from('leads')
      .upsert({
        email: email.toLowerCase().trim(),
        source,
        utm_source,
        utm_medium,
        utm_campaign,
        referrer,
        user_agent: userAgent,
        ip_address: ip
      }, {
        onConflict: 'email',
        ignoreDuplicates: false
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      if (error.code === '23505') {
        return res.status(200).json({
          success: true,
          message: 'Ya estas registrado. Te contactaremos pronto.',
          isExisting: true
        });
      }
      return res.status(500).json({ error: 'Error al procesar la solicitud en base de datos', code: 'DATABASE_ERROR' });
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
            id: data.id,
            email: data.email,
            source: data.source,
            isBusiness: isBusinessEmail(email),
            utm: { utm_source, utm_medium, utm_campaign }
          }
        })
      });
      console.log('Lead enviado exitosamente a n8n para orquestación.');
    } catch (n8nError) {
      console.error('Error enviando payload a n8n:', n8nError);
      // No bloqueamos la respuesta al usuario si n8n falla.
    }

    return res.status(201).json({
      success: true,
      message: isBusinessEmail(email)
        ? 'Excelente! Te contactaremos en las proximas 24 horas.'
        : 'Gracias por tu interes. Te enviaremos informacion pronto.',
      isBusinessEmail: isBusinessEmail(email),
      leadId: data.id
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Error interno del servidor', code: 'SERVER_ERROR' });
  }
});

// API: Track clicks
app.post('/api/track', async (req, res) => {
  try {
    const { buttonId, buttonText, pageUrl, leadId } = req.body;

    if (!buttonId) {
      return res.status(400).json({ error: 'buttonId requerido' });
    }

    const { error } = await supabase
      .from('cta_clicks')
      .insert({
        button_id: buttonId,
        button_text: buttonText,
        page_url: pageUrl,
        lead_id: leadId || null
      });

    if (error) {
      console.error('Track error:', error);
    }

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

    const { data: leadData } = await supabase
      .from('leads')
      .upsert({
        email: email.toLowerCase().trim(),
        source: 'demo_request'
      }, {
        onConflict: 'email',
        ignoreDuplicates: true
      })
      .select()
      .single();

    const { data, error } = await supabase
      .from('demo_requests')
      .insert({
        email: email.toLowerCase().trim(),
        company_name: escapeHTML(companyName),
        company_size: escapeHTML(companySize),
        phone: escapeHTML(phone),
        message: escapeHTML(message),
        lead_id: leadData?.id || null,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Demo request error:', error);
      return res.status(500).json({ error: 'Error al procesar la solicitud', code: 'DATABASE_ERROR' });
    }

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
            request_id: data.id,
            email: data.email,
            company_name: data.company_name,
            company_size: data.company_size,
            phone: data.phone,
            message: data.message
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
      requestId: data.id
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Error interno del servidor', code: 'SERVER_ERROR' });
  }
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
  console.log(`  Supabase: ${process.env.SUPABASE_URL ? 'Conectado' : 'No configurado'}`);
  console.log(`========================================\n`);
});
