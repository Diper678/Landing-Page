/**
 * consent.js — Banner de consentimiento (Ley 21.719) + init de PostHog.
 *
 * Uso: <script src="/js/consent.js" defer
 *        data-ph-key="phc_..." data-privacy="/pages/privacidad.html" data-cookies="/pages/cookies.html"></script>
 *
 * PostHog parte en opt-out; solo captura si el visitante acepta.
 * La decisión se guarda en localStorage ('sisteco_consent': 'accepted' | 'essential').
 */
(function () {
  var script = document.currentScript;
  var PH_KEY = (script && script.dataset.phKey) || 'phc_ugKr4vo7XUGtWCE3xSGVZA7GtHOb98jblPTUq3YxRBv';
  var PRIVACY_URL = (script && script.dataset.privacy) || '/pages/privacidad.html';
  var COOKIES_URL = (script && script.dataset.cookies) || '/pages/cookies.html';
  var STORAGE_KEY = 'sisteco_consent';

  // --- PostHog snippet (EU Frankfurt — Ley 21.719 compliant) ---
  !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing reset isFeatureEnabled getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group identify setPersonProperties setPersonPropertiesForFlags setGroupPropertiesForFlags".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
  window.posthog.init(PH_KEY, {
    api_host: 'https://eu.i.posthog.com',
    person_profiles: 'identified_only',
    capture_pageview: true,
    capture_pageleave: true,
    ip: false,
    opt_out_capturing_by_default: true,
    session_recording: { maskAllInputs: true, maskTextSelector: '.ph-mask' }
  });

  var choice = null;
  try { choice = localStorage.getItem(STORAGE_KEY); } catch (e) { /* storage bloqueado: tratar como sin decisión */ }

  if (choice === 'accepted') {
    window.posthog.opt_in_capturing();
    return;
  }
  if (choice === 'essential') return; // ya decidió: queda en opt-out

  function save(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) {}
  }

  function showBanner() {
    var style = document.createElement('style');
    style.textContent =
      '#sisteco-consent{position:fixed;bottom:16px;left:16px;right:16px;max-width:520px;margin:0 auto;z-index:9999;' +
      'background:#F8F7F5;color:#111111;border:1px solid #e5e5e5;border-radius:12px;padding:20px;' +
      'box-shadow:0 8px 30px rgba(0,0,0,.12);font-family:"Hanken Grotesk","Instrument Sans",system-ui,sans-serif;font-size:14px;line-height:1.5}' +
      '#sisteco-consent p{margin:0 0 14px}' +
      '#sisteco-consent a{color:#111111;text-decoration:underline}' +
      '#sisteco-consent .sc-actions{display:flex;gap:10px;flex-wrap:wrap}' +
      '#sisteco-consent button{cursor:pointer;border-radius:8px;padding:10px 18px;font:inherit;font-weight:600;border:1px solid #e5e5e5}' +
      '#sisteco-consent .sc-accept{background:#c5ed36;border-color:#c5ed36}' +
      '#sisteco-consent .sc-accept:hover{background:#b3d82f;border-color:#b3d82f}' +
      '#sisteco-consent .sc-essential{background:transparent}';
    document.head.appendChild(style);

    var banner = document.createElement('div');
    banner.id = 'sisteco-consent';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Consentimiento de cookies');
    banner.innerHTML =
      '<p>Usamos cookies de analítica (PostHog, servidores en la UE) para entender cómo se usa el sitio y mejorarlo. ' +
      'Solo se activan si aceptas, según la Ley 21.719. Más info en nuestra ' +
      '<a href="' + COOKIES_URL + '">política de cookies</a> y <a href="' + PRIVACY_URL + '">política de privacidad</a>.</p>' +
      '<div class="sc-actions">' +
      '<button type="button" class="sc-accept">Aceptar</button>' +
      '<button type="button" class="sc-essential">Solo esenciales</button>' +
      '</div>';
    document.body.appendChild(banner);

    banner.querySelector('.sc-accept').addEventListener('click', function () {
      save('accepted');
      window.posthog.opt_in_capturing();
      banner.remove();
    });
    banner.querySelector('.sc-essential').addEventListener('click', function () {
      save('essential');
      window.posthog.opt_out_capturing();
      banner.remove();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showBanner);
  } else {
    showBanner();
  }

  // --- Agendador: Google Calendar appointment schedule ---
  // TODO Felipe: pegar el link real. Mientras esté vacío, los CTAs siguen usando Cal.com.
  // Este archivo se carga en todas las páginas, así que un solo cambio actualiza todo el sitio.
  var BOOKING_URL = '';
  if (BOOKING_URL) {
    var rewrite = function () {
      document.querySelectorAll('a[href*="cal.com"]').forEach(function (a) {
        a.href = BOOKING_URL;
      });
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', rewrite);
    } else {
      rewrite();
    }
  }
})();
