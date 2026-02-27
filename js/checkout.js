// js/checkout.js
// Maneja el flujo de checkout con dLocal Go desde la página de precios
// Sin dependencias externas — pura fetch API

(function () {
  'use strict';

  let isAnnual = false;

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
    });
  }

  // ── Checkout buttons ────────────────────────────────────────────────
  document.querySelectorAll('.checkout-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const planIdMonthly = btn.dataset.planIdMonthly;
      const planIdAnnual  = btn.dataset.planIdAnnual;
      const planId = isAnnual ? planIdAnnual : planIdMonthly;

      // Si el plan ID no está configurado aún, redirigir al formulario de contacto
      if (!planId || planId.includes('_ID') || planId === 'undefined') {
        window.location.href = '../index.html#hero';
        return;
      }

      // Deshabilitar botón
      btn.disabled = true;
      const originalText = btn.textContent;
      btn.textContent = 'Procesando...';

      try {
        const res = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ planId }),
        });

        const data = await res.json();

        if (!res.ok || !data.url) {
          throw new Error(data.error || 'Error al iniciar pago');
        }

        // Redirigir al checkout de dLocal Go (hosted page)
        window.location.href = data.url;

      } catch (err) {
        console.error('Checkout error:', err);
        alert(
          'Hubo un error al procesar tu solicitud.\n' +
          'Por favor intenta nuevamente o escríbenos a contacto@sisteco.cl'
        );
        btn.disabled = false;
        btn.textContent = originalText;
      }
    });
  });

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
})();
