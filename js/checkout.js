// js/checkout.js
// Maneja el flujo de checkout con Reveniu (links directos) o dLocal Go (API)
// Actualmente usa Reveniu links — cuando dLocal Go esté configurado,
// descomentar la sección de API y cambiar los data attributes en precios.html

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

      // Actualizar href de los botones de checkout según billing period
      document.querySelectorAll('.checkout-btn').forEach(btn => {
        const link = isAnnual ? btn.dataset.linkAnnual : btn.dataset.linkMonthly;
        if (link) btn.href = link;
      });
    });
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
})();
