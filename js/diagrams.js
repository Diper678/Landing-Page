/* diagrams.js — reveal progresivo + inyección de diagramas (shadow DOM) + CTA tracking
   Compartido por home y subpáginas. Ruta root-relative para funcionar desde /pages/. */
(function () {
  var de = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reveal progresivo (visible sin JS)
  if ('IntersectionObserver' in window && !reduce) {
    de.classList.add('rh-anim-ready');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('rh-revealed'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    document.querySelectorAll('.rh-reveal').forEach(function (el) { io.observe(el); });
  }

  // Inyección de diagramas SVG vía shadow DOM (aísla estilos, hereda fuentes)
  document.querySelectorAll('[data-diagram]').forEach(function (host) {
    var name = host.getAttribute('data-diagram');
    fetch('/assets/diagrams/' + name + '.svg', { credentials: 'same-origin' })
      .then(function (r) { return r.ok ? r.text() : Promise.reject(r.status); })
      .then(function (svg) {
        var root = host.shadowRoot || host.attachShadow({ mode: 'open' });
        root.innerHTML = '<style>:host{display:block}svg{display:block;width:100%;height:auto}</style>' + svg;
      })
      .catch(function () { host.setAttribute('data-diagram-error', '1'); });
  });

  // CTA tracking (PostHog, si está presente)
  document.querySelectorAll('[data-cta-id]').forEach(function (el) {
    el.addEventListener('click', function () {
      if (window.posthog) { posthog.capture('cta_click', { id: el.getAttribute('data-cta-id') }); }
    });
  });

  // Asegura iconos lucide
  if (window.lucide && typeof lucide.createIcons === 'function') { lucide.createIcons(); }
})();
