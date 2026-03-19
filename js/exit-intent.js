// js/exit-intent.js
// Exit-intent popup para precios.html — detecta salida y ofrece descuento fundadores.
// Solo activo en páginas con .pricing-section o .pricing-grid.
// Muestra 1 vez por sesión (sessionStorage). No se activa antes de DELAY_MS.

(function () {
  'use strict';

  const SESSION_KEY = 'sisteco_exit_shown';
  const DELAY_MS    = 5000;   // esperar 5s antes de activar (usuario leyendo)
  const CTA_LINK    = 'https://cal.com/felipesisteco/demo';

  // No mostrar si ya se vio en esta sesión
  if (sessionStorage.getItem(SESSION_KEY)) return;

  // Solo en páginas de precios
  if (!document.querySelector('.pricing-section, .pricing-grid, .pricing-cards, [class*="pricing"]')) return;

  let activated = false;
  let activationTimer;

  // ── Crear popup ────────────────────────────────────────────────────────
  function createPopup() {
    const overlay = document.createElement('div');
    overlay.id = 'exit-intent-overlay';
    overlay.innerHTML = `
      <div id="exit-intent-popup" role="dialog" aria-modal="true" aria-labelledby="exit-title">
        <button id="exit-intent-close" aria-label="Cerrar">&times;</button>
        <div class="exit-badge">PROGRAMA FUNDADORES</div>
        <h2 class="exit-title" id="exit-title">¿Te vas sin arrancar?</h2>
        <p class="exit-sub">
          Los primeros <strong>5 fundadores</strong> entran con<br>
          <span class="exit-highlight">setup gratuito + precio especial permanente</span><br>
          sin contrato, cancela cuando quieras.
        </p>
        <p class="exit-detail">
          Agenda una demo de 15 min y te mostramos leads reales de tu vertical — sin costo.
        </p>
        <a href="${CTA_LINK}" class="exit-cta" target="_blank" rel="noopener">
          Agendar demo gratis →
        </a>
        <button id="exit-intent-dismiss" class="exit-dismiss">
          No gracias, seguiré buscando
        </button>
      </div>
    `;
    document.body.appendChild(overlay);
    injectStyles();
    bindEvents(overlay);
    // Trigger transition en siguiente frame
    requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add('exit-visible')));
    sessionStorage.setItem(SESSION_KEY, '1');
  }

  function injectStyles() {
    if (document.getElementById('exit-intent-css')) return;
    const s = document.createElement('style');
    s.id = 'exit-intent-css';
    s.textContent = `
      #exit-intent-overlay {
        position: fixed; inset: 0; z-index: 99999;
        background: rgba(0,0,0,0);
        display: flex; align-items: center; justify-content: center;
        padding: 20px;
        transition: background 0.3s ease;
        pointer-events: none;
      }
      #exit-intent-overlay.exit-visible {
        background: rgba(0,0,0,0.55);
        pointer-events: all;
      }
      #exit-intent-popup {
        background: #fff;
        border-radius: 16px;
        padding: 40px 36px 32px;
        max-width: 440px; width: 100%;
        text-align: center;
        position: relative;
        transform: translateY(20px) scale(0.97);
        opacity: 0;
        transition: transform 0.35s cubic-bezier(.22,1,.36,1), opacity 0.3s ease;
        box-shadow: 0 24px 64px rgba(0,0,0,0.18);
      }
      #exit-intent-overlay.exit-visible #exit-intent-popup {
        transform: translateY(0) scale(1);
        opacity: 1;
      }
      #exit-intent-close {
        position: absolute; top: 12px; right: 16px;
        background: none; border: none;
        font-size: 1.5rem; color: #aaa; cursor: pointer;
        line-height: 1; padding: 4px 8px;
        transition: color 0.2s;
      }
      #exit-intent-close:hover { color: #111; }
      .exit-badge {
        display: inline-block;
        background: #c5ed36; color: #111;
        font-size: 0.7rem; font-weight: 700;
        letter-spacing: 0.08em; text-transform: uppercase;
        padding: 4px 12px; border-radius: 100px;
        margin-bottom: 16px;
      }
      .exit-title {
        font-size: 1.6rem; font-weight: 800;
        color: #111; margin: 0 0 14px;
        line-height: 1.2;
        font-family: 'Sharp Grotesk', sans-serif;
      }
      .exit-sub {
        font-size: 1rem; color: #444;
        line-height: 1.65; margin: 0 0 10px;
      }
      .exit-highlight {
        color: #111; font-weight: 700;
        background: #c5ed36;
        padding: 2px 6px; border-radius: 4px;
        display: inline-block; margin: 2px 0;
      }
      .exit-detail {
        font-size: 0.875rem; color: #777;
        margin: 0 0 24px; line-height: 1.5;
      }
      .exit-cta {
        display: block;
        background: #c5ed36; color: #111;
        font-weight: 700; font-size: 1rem;
        text-decoration: none;
        padding: 14px 24px; border-radius: 10px;
        margin-bottom: 12px;
        transition: background 0.2s, transform 0.15s;
      }
      .exit-cta:hover {
        background: #b3d82f;
        transform: translateY(-1px);
        color: #111;
        text-decoration: none;
      }
      .exit-dismiss {
        background: none; border: none;
        color: #aaa; font-size: 0.8rem;
        cursor: pointer; padding: 8px;
        text-decoration: underline;
        width: 100%;
        transition: color 0.2s;
      }
      .exit-dismiss:hover { color: #555; }
      @media (max-width: 480px) {
        #exit-intent-popup { padding: 32px 20px 24px; }
        .exit-title { font-size: 1.3rem; }
      }
    `;
    document.head.appendChild(s);
  }

  function bindEvents(overlay) {
    const close = () => {
      overlay.classList.remove('exit-visible');
      setTimeout(() => { if (overlay.parentElement) overlay.remove(); }, 350);
    };
    document.getElementById('exit-intent-close').addEventListener('click', close);
    document.getElementById('exit-intent-dismiss').addEventListener('click', close);
    // Click en el backdrop
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    // Escape
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); }, { once: true });
  }

  function trigger() {
    if (activated) return;
    activated = true;
    clearTimeout(activationTimer);
    createPopup();
  }

  // ── Activar detecciones después de DELAY_MS ───────────────────────────
  activationTimer = setTimeout(() => {

    // ESCRITORIO: mouse sale hacia la barra de direcciones
    document.addEventListener('mouseleave', (e) => {
      if (e.clientY <= 0) trigger();
    });

    // MÓVIL: scroll up significativo después de haber bajado
    let maxScroll = 0;
    let scrollTimer = null;
    window.addEventListener('scroll', () => {
      const current = window.scrollY;
      if (current > maxScroll) { maxScroll = current; return; }
      if (maxScroll > 400 && current < maxScroll - 200) {
        if (!scrollTimer) scrollTimer = setTimeout(() => { trigger(); }, 600);
      } else {
        clearTimeout(scrollTimer);
        scrollTimer = null;
      }
    }, { passive: true });

    // BACK BUTTON: interceptar navegación hacia atrás
    history.pushState(null, '', location.href);
    window.addEventListener('popstate', () => {
      history.pushState(null, '', location.href);
      trigger();
    }, { once: true });

  }, DELAY_MS);

})();
