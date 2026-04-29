# Cómo Funciona Sisteco — Arquitectura de 5 Capas

Sisteco no es un software que tú operas. Es un servicio que opera por ti. Aquí te explicamos la infraestructura detrás.

## Flujo de Trabajo

1. **Tú defines tu cliente ideal** → industria, tamaño, cargo, zona geográfica
2. **Sisteco prospecta 24/7** → encuentra empresas que calzan con tu perfil
3. **El scoring clasifica** → HOT / WARM / NURTURE / SKIP (0-100 puntos)
4. **La IA personaliza** → escribe emails únicos para cada lead basándose en su web real
5. **Se activan las secuencias** → email, LinkedIn, WhatsApp según canal preferido
6. **Tú recibes leads calificados** → alertas en Slack cuando alguien responde

## Las 5 Capas de la Infraestructura

### Capa 1: Captura de Datos
- Scraping web + LinkedIn para encontrar prospectos
- Integración SII para validar RUT y datos corporativos reales
- PhantomBuster para automatización de LinkedIn

### Capa 2: Inteligencia y Scoring
- Motor de scoring AI de 100 puntos
- Análisis dual: perfil del decisor + señales de empresa
- Datos del SII validan tamaño real (no estimaciones)
- Señales de timing: contrataciones, expansión, cambios

### Capa 3: Personalización con IA
- Cada email se escribe individualmente por IA
- Lee la web real del prospecto para personalizar
- No son plantillas — son mensajes únicos
- A/B testing automático de asuntos y mensajes

### Capa 4: Orquestación Multi-Canal
- Email como canal primario
- LinkedIn para refuerzo profesional
- WhatsApp para urgencia y cercanía
- Slack para alertas internas a tu equipo
- Instagram DM para perfiles B2C-adjacent

### Capa 5: Analytics y Reporting
- Dashboard en tiempo real
- Métricas: apertura, clics, respuestas, conversiones
- Reportes semanales automáticos
- Sync con tu CRM (HubSpot, Pipedrive, Salesforce)

## Seguridad y Compliance

- Ley 21.719 de Protección de Datos Personales (Chile)
- GDPR compatible
- Encriptación end-to-end
- Analytics con PostHog EU (Frankfurt) — datos no salen de la UE
- Privacy by Design desde la arquitectura

## Tiempos

- **Setup inicial**: 1-2 días hábiles
- **Primeros leads calificados**: dentro de la primera semana
- **Secuencia completa optimizada**: 2-3 semanas

## Lo que NO hacemos

- No vendemos datos de terceros
- No hacemos spam
- No contactamos sin base legal
- No inventamos métricas ni testimonios

---

Contacto: contacto@sisteco.cl | +56 9 40065566 | cal.com/sisteco/ventas
