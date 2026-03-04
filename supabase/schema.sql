-- =============================================
-- SISTECO LANDING PAGE - DATABASE SCHEMA
-- =============================================
-- Ejecutar este script en Supabase SQL Editor

-- Tabla principal de leads (prospectos capturados)
CREATE TABLE IF NOT EXISTS leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    source VARCHAR(50) DEFAULT 'landing_hero',
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    referrer TEXT,
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para tracking de interacciones con CTAs
CREATE TABLE IF NOT EXISTS cta_clicks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    button_id VARCHAR(50) NOT NULL,
    button_text VARCHAR(100),
    page_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para solicitudes de demo/contacto
CREATE TABLE IF NOT EXISTS demo_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    email VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    company_size VARCHAR(50),
    phone VARCHAR(50),
    message TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para secuencia de emails drip (Day 0, 3, 7)
CREATE TABLE IF NOT EXISTS email_sequence (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    template_key VARCHAR(50) NOT NULL,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'pending',
    resend_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indices para mejor performance
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cta_clicks_lead_id ON cta_clicks(lead_id);
CREATE INDEX IF NOT EXISTS idx_cta_clicks_button_id ON cta_clicks(button_id);
CREATE INDEX IF NOT EXISTS idx_demo_requests_status ON demo_requests(status);
CREATE INDEX IF NOT EXISTS idx_email_sequence_status_scheduled ON email_sequence(status, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_email_sequence_lead_id ON email_sequence(lead_id);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_demo_requests_updated_at
    BEFORE UPDATE ON demo_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================
-- Habilitamos RLS para proteger las tablas

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE cta_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sequence ENABLE ROW LEVEL SECURITY;

-- Políticas: Solo el service_role puede acceder
-- (las inserciones se hacen desde la API serverless con service key)

-- Política para leads: permitir INSERT desde anónimo vía API
CREATE POLICY "Enable insert for API" ON leads
    FOR INSERT
    WITH CHECK (true);

-- Política para cta_clicks: permitir INSERT desde anónimo vía API
CREATE POLICY "Enable insert for API" ON cta_clicks
    FOR INSERT
    WITH CHECK (true);

-- Política para demo_requests: permitir INSERT desde anónimo vía API
CREATE POLICY "Enable insert for API" ON demo_requests
    FOR INSERT
    WITH CHECK (true);

-- Política para email_sequence: permitir INSERT desde anónimo vía API
CREATE POLICY "Enable insert for API" ON email_sequence
    FOR INSERT
    WITH CHECK (true);

-- NOTA: SELECT, UPDATE, DELETE solo disponibles para authenticated/service_role
-- Esto protege los datos de lecturas no autorizadas

-- =============================================
-- VISTA PARA ANALYTICS (opcional)
-- =============================================
CREATE OR REPLACE VIEW leads_daily_stats AS
SELECT
    DATE(created_at) as date,
    COUNT(*) as total_leads,
    COUNT(DISTINCT source) as sources_count
FROM leads
GROUP BY DATE(created_at)
ORDER BY date DESC;
