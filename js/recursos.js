/**
 * Recursos feed — infinite scroll with IntersectionObserver
 * Vanilla JS, zero dependencies.
 */
(function () {
  'use strict';

  // Absolute path so the fetch works regardless of trailing slash or rewrites.
  const MANIFEST_URL = '/recursos/api/posts.json';
  const PAGE_SIZE = 6;

  const feedEl = document.getElementById('recursos-feed');
  const sentinelEl = document.getElementById('recursos-sentinel');
  const statusEl = document.getElementById('recursos-status');
  const emptyEl = document.getElementById('recursos-empty');
  const filterButtons = document.querySelectorAll('.recursos-filter');

  if (!feedEl || !sentinelEl) return;

  const state = {
    allPosts: [],
    filtered: [],
    rendered: 0,
    filter: 'all',
    loading: false,
    done: false,
  };

  function formatDate(iso) {
    try {
      const d = new Date(iso + 'T12:00:00');
      return d.toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (_) {
      return iso;
    }
  }

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }

  function cardHtml(post) {
    // Use absolute URL as provided in manifest; Vercel rewrites handle routing.
    const href = post.url;
    return (
      '<a class="recurso-card' + (post.featured ? ' is-featured' : '') + '" href="' + href + '">' +
        '<div class="recurso-card__meta">' +
          '<span class="recurso-card__category">' + escapeHtml(post.category) + '</span>' +
          '<span class="recurso-card__date">' + escapeHtml(formatDate(post.date)) + '</span>' +
        '</div>' +
        '<h3 class="recurso-card__title">' + escapeHtml(post.title) + '</h3>' +
        '<p class="recurso-card__excerpt">' + escapeHtml(post.excerpt) + '</p>' +
        '<div class="recurso-card__footer">' +
          '<span class="recurso-card__author">' + escapeHtml(post.author) + '</span>' +
          '<span class="recurso-card__reading">' + escapeHtml(post.readingTime) + '</span>' +
          '<span class="recurso-card__cta">Leer →</span>' +
        '</div>' +
      '</a>'
    );
  }

  function renderNext() {
    if (state.loading || state.done) return;
    state.loading = true;

    const slice = state.filtered.slice(state.rendered, state.rendered + PAGE_SIZE);
    if (slice.length === 0) {
      state.done = true;
      statusEl.innerHTML = state.filtered.length === 0 ? '' : '<p class="recursos-end-text">— Fin del feed —</p>';
      state.loading = false;
      return;
    }

    const html = slice.map(cardHtml).join('');
    feedEl.insertAdjacentHTML('beforeend', html);
    state.rendered += slice.length;

    if (state.rendered >= state.filtered.length) {
      state.done = true;
      statusEl.innerHTML = '<p class="recursos-end-text">— Fin del feed —</p>';
    }
    state.loading = false;
  }

  function applyFilter(category) {
    state.filter = category;
    state.rendered = 0;
    state.done = false;
    feedEl.innerHTML = '';
    emptyEl.hidden = true;
    statusEl.innerHTML = '<p class="recursos-loading-text">Cargando…</p>';

    state.filtered = category === 'all'
      ? state.allPosts.slice()
      : state.allPosts.filter(function (p) { return p.category === category; });

    if (state.filtered.length === 0) {
      statusEl.innerHTML = '';
      emptyEl.hidden = false;
      state.done = true;
      return;
    }
    renderNext();
  }

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterButtons.forEach(function (b) {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');
      applyFilter(btn.dataset.filter);
    });
  });

  // IntersectionObserver for infinite scroll
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) renderNext();
      });
    }, { rootMargin: '200px' });
    observer.observe(sentinelEl);
  } else {
    // Fallback: load everything at once
    PAGE_SIZE_FALLBACK: {
      // no-op; renderNext will handle in chunks via scroll events
    }
    window.addEventListener('scroll', function () {
      const rect = sentinelEl.getBoundingClientRect();
      if (rect.top < window.innerHeight + 200) renderNext();
    }, { passive: true });
  }

  // Load manifest
  fetch(MANIFEST_URL, { cache: 'no-cache' })
    .then(function (r) {
      if (!r.ok) throw new Error('manifest fetch failed: ' + r.status);
      return r.json();
    })
    .then(function (data) {
      state.allPosts = Array.isArray(data.posts) ? data.posts.slice() : [];
      // Newest first
      state.allPosts.sort(function (a, b) {
        return String(b.date).localeCompare(String(a.date));
      });
      applyFilter('all');
    })
    .catch(function (err) {
      console.error('[recursos] manifest error', err);
      statusEl.innerHTML = '<p class="recursos-error">No pudimos cargar los recursos. Intenta recargar la página.</p>';
    });
})();
