// js/checkout.js
// Maneja el flujo de checkout con Stripe desde la página de precios

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

      // Actualizar labels activos
      monthlyLabel?.classList.toggle('active', !isAnnual);
      annualLabel?.classList.toggle('active', isAnnual);

      // Mostrar precio correcto en cada card
      document.querySelectorAll('.monthly-price').forEach(el => {
        el.style.display = isAnnual ? 'none' : 'inline';
      });
      document.querySelectorAll('.annual-price').forEach(el => {
        el.style.display = isAnnual ? 'inline' : 'none';
      });

      // Mostrar nota de precio correcta
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
      const priceMonthly = btn.dataset.priceMonthly;
      const priceAnnual = btn.dataset.priceAnnual;
      const priceId = isAnnual ? priceAnnual : priceMonthly;

      // Si el priceId no está configurado aún, redirigir al formulario de contacto
      if (!priceId || priceId.includes('_ID')) {
        window.location.href = '../index.html#hero';
        return;
      }

      // Deshabilitar botón para evitar doble click
      btn.disabled = true;
      const originalText = btn.textContent;
      btn.textContent = 'Redirigiendo...';

      try {
        const res = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ priceId }),
        });

        const data = await res.json();

        if (!res.ok || !data.url) {
          throw new Error(data.error || 'Error al iniciar pago');
        }

        window.location.href = data.url;
      } catch (err) {
        console.error('Checkout error:', err);
        alert('Hubo un error al procesar tu solicitud. Por favor intenta nuevamente o escríbenos a contacto@sisteco.cl');
        btn.disabled = false;
        btn.textContent = originalText;
      }
    });
  });

  // ── Mostrar banner si viene de cancelación ──────────────────────────
  const params = new URLSearchParams(window.location.search);
  if (params.get('canceled') === 'true') {
    const banner = document.createElement('div');
    banner.style.cssText = 'background:#fff3cd;color:#856404;padding:12px 24px;text-align:center;font-size:0.875rem;';
    banner.textContent = 'Cancelaste el proceso de pago. No se realizó ningún cargo. ¿Necesitas ayuda? ';
    const link = document.createElement('a');
    link.href = '../index.html#hero';
    link.textContent = 'Escríbenos →';
    link.style.color = '#856404';
    banner.appendChild(link);
    document.body.insertBefore(banner, document.body.firstChild);
  }
})();
