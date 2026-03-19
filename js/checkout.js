// js/checkout.js
// Maneja el flujo de checkout con dLocal Go (API) como método principal
// y Reveniu (links directos) como fallback para tarjetas chilenas.
//
// Flujo dLocal Go:
//   1. Usuario hace clic en "Pagar con tarjeta"
//   2. POST a /api/create-checkout-session con planKey (ej. "base_monthly")
//   3. API retorna { url } → redirect al hosted checkout de dLocal Go
//   4. Post-pago: dLocal Go redirige a /pages/success.html
//   5. Webhook /api/dlocalgo-webhook actualiza Convex

(function () {
  'use strict';

  let isAnnual = false;

  // ── Plan keys que se envían al API ────────────────────────────────────
  // Cada botón principal tiene data-plan="base|growth|enterprise"
  // El key se compone como: {plan}_{monthly|annual}
  function getCurrentPlanKey(btn) {
    const plan = btn.dataset.plan;
    if (!plan) return null;
    return plan + '_' + (isAnnual ? 'annual' : 'monthly');
  }

  // ── Toggle mensual / anual ──────────────────────────────────────────
  const toggle = document.getElementById('billingToggle');
  const monthlyLabel = document.querySelector('.monthly-label');
  const annualLabel = document.querySelector('.annual-label');

  if (toggle) {
    toggle.addEventListener('click', () => {
      isAnnual = !isAnnual;
      toggle.classList.toggle('on', isAnnual);

      monthlyLabel?.classList.toggle('active', !isAnnual);
      annualLabel?.classList.toggle('active', isAnnual);

      // Precios mostrados
      document.querySelectorAll('.monthly-price').forEach(el => {
        el.style.display = isAnnual ? 'none' : 'inline';
      });
      document.querySelectorAll('.annual-price').forEach(el => {
        el.style.display = isAnnual ? 'inline' : 'none';
      });

      // Notas de precio
      document.querySelectorAll('.monthly-note').forEach(el => {
        el.style.display = isAnnual ? 'none' : 'block';
      });
      document.querySelectorAll('.annual-note').forEach(el => {
        el.style.display = isAnnual ? 'block' : 'none';
      });

      // Actualizar href de los botones Reveniu (fallback) según billing period
      document.querySelectorAll('.checkout-btn.checkout-alt').forEach(btn => {
        const link = isAnnual ? btn.dataset.linkAnnual : btn.dataset.linkMonthly;
        if (link) btn.href = link;
      });
    });
  }

  // ── Planes válidos para checkout API ────────────────────────────────
  const VALID_PLAN_KEYS = new Set([
    'base_monthly', 'base_annual',
    'growth_monthly', 'growth_annual',
    'enterprise_monthly',
  ]);

  // ── dLocal Go API checkout (botones principales) ────────────────────
  // Intercepta clics en botones .checkout-btn que NO sean .checkout-alt (Reveniu)
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.checkout-btn:not(.checkout-alt)');
    if (!btn) return;

    const planKey = getCurrentPlanKey(btn);
    if (!planKey) return; // sin data-plan, dejar comportamiento normal

    // Enterprise anual es cotización personalizada → redirigir a contacto
    if (planKey === 'enterprise_annual') {
      e.preventDefault();
      window.location.href = '../index.html#hero';
      return;
    }

    // Validar que el plan existe antes de llamar al API
    if (!VALID_PLAN_KEYS.has(planKey)) return;

    e.preventDefault();

    // Deshabilitar botón y mostrar estado de carga
    const originalHTML = btn.innerHTML;
    btn.style.pointerEvents = 'none';
    btn.style.opacity = '0.6';
    btn.innerHTML = '<i data-lucide="loader-2" style="animation:spin 1s linear infinite;width:16px;height:16px"></i> Procesando...';

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planKey: planKey }),
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || 'Error al crear la sesión de pago.');
      }

      // Redirigir al checkout hosted de dLocal Go
      window.location.href = data.url;

    } catch (err) {
      // Restaurar botón
      btn.innerHTML = originalHTML;
      btn.style.pointerEvents = '';
      btn.style.opacity = '';
      if (window.lucide) lucide.createIcons();

      // Mostrar error al usuario
      showCheckoutError(
        err.message || 'Hubo un problema al conectar con el procesador de pagos. Intenta de nuevo o usa Reveniu como alternativa.'
      );
    }
  });

  // ── Mostrar error de checkout ──────────────────────────────────────
  function showCheckoutError(message) {
    // Remover banner anterior si existe
    const prev = document.getElementById('checkout-error-banner');
    if (prev) prev.remove();

    const banner = document.createElement('div');
    banner.id = 'checkout-error-banner';
    banner.style.cssText =
      'background:#fee2e2;color:#991b1b;padding:14px 24px;' +
      'text-align:center;font-size:0.875rem;position:fixed;top:0;left:0;right:0;z-index:9999;' +
      'box-shadow:0 2px 8px rgba(0,0,0,0.1);';
    banner.innerHTML =
      message +
      ' <button onclick="this.parentElement.remove()" style="background:none;border:none;color:#991b1b;cursor:pointer;font-weight:700;margin-left:12px;font-size:1rem;">&times;</button>';
    document.body.insertBefore(banner, document.body.firstChild);

    // Auto-remove después de 8 segundos
    setTimeout(() => { if (banner.parentElement) banner.remove(); }, 8000);
  }

  // ── Banner de cancelación ───────────────────────────────────────────
  const params = new URLSearchParams(window.location.search);
  if (params.get('canceled') === 'true') {
    const banner = document.createElement('div');
    banner.style.cssText =
      'background:#fff3cd;color:#856404;padding:12px 24px;' +
      'text-align:center;font-size:0.875rem;position:relative;z-index:100;';
    banner.innerHTML =
      'Cancelaste el proceso de pago — no se realizó ningún cargo. ' +
      '¿Necesitas ayuda? <a href="../index.html#hero" style="color:#856404;text-decoration:underline;">Escríbenos →</a>';
    document.body.insertBefore(banner, document.body.firstChild);
  }

  // ── CSS para spinner ───────────────────────────────────────────────
  if (!document.getElementById('checkout-spinner-css')) {
    const style = document.createElement('style');
    style.id = 'checkout-spinner-css';
    style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
    document.head.appendChild(style);
  }
})();

/* ── FALLBACK: Reveniu direct links (kept for reference) ──────────────
 * Los botones con clase .checkout-alt siguen usando links directos a Reveniu.
 * Estos son la alternativa para tarjetas de débito chilenas / Redcompra.
 * Links configurados en data-link-monthly y data-link-annual en precios.html.
 * Si dLocal Go falla completamente, se puede revertir quitando el event listener
 * de arriba y restaurando los data-link-monthly/annual en los botones principales.
 * ──────────────────────────────────────────────────────────────────── */
