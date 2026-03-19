/**
 * Sisteco Landing Page - Main JavaScript
 * Handles form submissions, CTA tracking, UI interactions, and GSAP animations
 */

// API Configuration
const API_BASE = window.location.hostname === 'localhost'
  ? 'http://localhost:3000/api'
  : '/api';

// State management
const state = {
  leadId: localStorage.getItem('sisteco_lead_id') || null,
  isSubmitting: false
};

// =============================================
// UTILITY FUNCTIONS
// =============================================

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function getUTMParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign')
  };
}

function showToast(message, type = 'success') {
  const existingToast = document.querySelector('.toast');
  if (existingToast) existingToast.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const icon = document.createElement('span');
  icon.className = 'toast-icon';
  icon.textContent = type === 'success' ? '\u2713' : type === 'error' ? '\u2715' : '\u2139';

  const msg = document.createElement('span');
  msg.className = 'toast-message';
  msg.textContent = message;

  toast.appendChild(icon);
  toast.appendChild(msg);
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function setButtonLoading(button, loading) {
  if (loading) {
    button.dataset.originalText = button.textContent;
    button.textContent = '';
    const spinner = document.createElement('span');
    spinner.className = 'spinner';
    button.appendChild(spinner);
    button.appendChild(document.createTextNode(' Enviando...'));
    button.disabled = true;
  } else {
    button.textContent = button.dataset.originalText || 'Enviar';
    button.disabled = false;
  }
}

// =============================================
// API CALLS
// =============================================

async function submitLead(email, source = 'landing_hero') {
  const response = await fetch(`${API_BASE}/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      source,
      ...getUTMParams()
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error al enviar');
  }

  return data;
}

async function trackClick(buttonId, buttonText) {
  try {
    await fetch(`${API_BASE}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        buttonId,
        buttonText,
        pageUrl: window.location.href,
        leadId: state.leadId
      })
    });
  } catch (error) {
    console.warn('Track error:', error);
  }
}

async function submitDemoRequest(formData) {
  const response = await fetch(`${API_BASE}/demo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error al enviar');
  }

  return data;
}

// =============================================
// EVENT HANDLERS
// =============================================

async function handleHeroFormSubmit(event) {
  event.preventDefault();

  if (state.isSubmitting) return;

  const form = event.target;
  const emailInput = form.querySelector('input[type="email"]');
  const submitBtn = form.querySelector('button[type="submit"]');
  const email = emailInput.value.trim();

  if (!email) {
    emailInput.focus();
    showToast('Por favor ingresa tu correo', 'error');
    return;
  }

  if (!isValidEmail(email)) {
    emailInput.focus();
    showToast('Por favor ingresa un correo válido', 'error');
    return;
  }

  state.isSubmitting = true;
  setButtonLoading(submitBtn, true);

  try {
    const result = await submitLead(email, 'hero_form');

    if (result.leadId) {
      state.leadId = result.leadId;
      localStorage.setItem('sisteco_lead_id', result.leadId);
    }

    showToast(result.message, 'success');

    emailInput.value = '';
    form.classList.add('submitted');

    trackClick('hero_form_submit', 'Prueba gratis');

  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    state.isSubmitting = false;
    setButtonLoading(submitBtn, false);
  }
}

function handleCTAClick(event) {
  const button = event.currentTarget;
  const buttonId = button.dataset.ctaId || button.id || 'unknown';
  const buttonText = button.textContent.trim();

  trackClick(buttonId, buttonText);

  if (buttonId === 'cta-navbar' || buttonId === 'cta-empezar') {
    event.preventDefault();
    const heroForm = document.querySelector('.hero-form');
    if (heroForm) {
      heroForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        heroForm.querySelector('input[type="email"]')?.focus();
      }, 500);
    }
  }
}

function handleNavClick(event) {
  const link = event.currentTarget;
  const href = link.getAttribute('href');

  if (href && href.startsWith('#') && href.length > 1) {
    event.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

// =============================================
// MODAL SYSTEM
// =============================================

function createDemoModal() {
  const modal = document.createElement('div');
  modal.id = 'demo-modal';
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-backdrop"></div>
    <div class="modal-content">
      <button class="modal-close" aria-label="Cerrar">&times;</button>
      <h2>Solicitar Demo</h2>
      <p>Completa el formulario y te contactaremos en menos de 24 horas.</p>
      <form id="demo-form" class="demo-form">
        <div class="form-group">
          <label for="demo-email">Email corporativo *</label>
          <input type="email" id="demo-email" name="email" required placeholder="tu@empresa.com">
        </div>
        <div class="form-group">
          <label for="demo-company">Nombre de la empresa</label>
          <input type="text" id="demo-company" name="companyName" placeholder="Tu empresa">
        </div>
        <div class="form-group">
          <label for="demo-size">Tamaño del equipo de ventas</label>
          <select id="demo-size" name="companySize">
            <option value="">Selecciona...</option>
            <option value="1-5">1-5 personas</option>
            <option value="6-20">6-20 personas</option>
            <option value="21-50">21-50 personas</option>
            <option value="50+">Más de 50</option>
          </select>
        </div>
        <div class="form-group">
          <label for="demo-phone">Teléfono (opcional)</label>
          <input type="tel" id="demo-phone" name="phone" placeholder="+52 555 123 4567">
        </div>
        <button type="submit" class="btn btn-primary btn-full">Solicitar Demo</button>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);
  modal.querySelector('.modal-close').addEventListener('click', closeModal);
  modal.querySelector('#demo-form').addEventListener('submit', handleDemoFormSubmit);
}

function openModal() {
  const modal = document.getElementById('demo-modal');
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal() {
  const modal = document.getElementById('demo-modal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

async function handleDemoFormSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const formData = new FormData(form);

  const data = {
    email: formData.get('email'),
    companyName: formData.get('companyName'),
    companySize: formData.get('companySize'),
    phone: formData.get('phone')
  };

  if (!data.email || !isValidEmail(data.email)) {
    showToast('Por favor ingresa un email válido', 'error');
    return;
  }

  setButtonLoading(submitBtn, true);

  try {
    const result = await submitDemoRequest(data);
    showToast(result.message, 'success');
    closeModal();
    form.reset();
    trackClick('demo_form_submit', 'Solicitar Demo');
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    setButtonLoading(submitBtn, false);
  }
}

// =============================================
// GSAP ANIMATIONS
// =============================================

function initAnimations() {
  // Check if GSAP is available
  if (typeof gsap === 'undefined') {
    console.warn('GSAP not loaded, skipping animations');
    return;
  }

  // Register ScrollTrigger
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Respect prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  initHeroAnimations();
  initFeaturesAnimations();
  initCTAAnimations();
}

function initHeroAnimations() {
  // Navbar items fade in
  gsap.fromTo(
    '.navbar-item',
    { y: -20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.2 }
  );

  // Badge
  gsap.fromTo(
    '.hero-badge',
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.3 }
  );

  // Title lines with 3D perspective effect
  gsap.fromTo(
    '.hero-title-line',
    { y: 60, opacity: 0, rotateX: -30 },
    {
      y: 0,
      opacity: 1,
      rotateX: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out',
      delay: 0.5
    }
  );

  // Description
  gsap.fromTo(
    '.hero-desc',
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.9 }
  );

  // Form
  gsap.fromTo(
    '.hero-form',
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 1.1 }
  );

}

function initFeaturesAnimations() {
  if (typeof ScrollTrigger === 'undefined') return;

  // Section title reveal
  ScrollTrigger.create({
    trigger: '.features-title',
    start: 'top 80%',
    onEnter: () => {
      gsap.fromTo(
        '.features-title',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
      );
    },
    once: true,
  });

  // Feature cards stagger
  ScrollTrigger.create({
    trigger: '.features-grid',
    start: 'top 80%',
    onEnter: () => {
      gsap.fromTo(
        '.feature-card',
        { y: 60, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power3.out'
        }
      );
    },
    once: true,
  });

  // Additional features
  ScrollTrigger.create({
    trigger: '.additional-features',
    start: 'top 85%',
    onEnter: () => {
      gsap.fromTo(
        '.additional-feature',
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
      );
    },
    once: true,
  });
}

function initCTAAnimations() {
  if (typeof ScrollTrigger === 'undefined') return;

  // CTA elements
  ScrollTrigger.create({
    trigger: '.cta-section',
    start: 'top 75%',
    onEnter: () => {
      gsap.fromTo(
        '.cta-anim',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out' }
      );
    },
    once: true,
  });

  // CTA glow pulse
  gsap.to('.cta-glow', {
    opacity: 0.6,
    scale: 1.15,
    duration: 3,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  });
}

// =============================================
// LUCIDE ICONS
// =============================================

function initIcons() {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

// =============================================
// ROI CALCULATOR
// =============================================
// INITIALIZATION
// =============================================

// =============================================
// BRUTALIST ENHANCEMENTS (Phase 7)
// =============================================

function initScrollProgress() {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.style.width = '0%';
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = progress + '%';
  });
}

function initCustomCursor() {
  const cursor = document.createElement('div');
  cursor.style.cssText = `
    position: fixed;
    width: 24px;
    height: 24px;
    border: 1.5px solid rgba(197, 237, 54, 0.5);
    border-radius: 50%;
    pointer-events: none;
    z-index: 10000;
    transition: transform 0.15s ease, border-color 0.2s ease, width 0.2s ease, height 0.2s ease;
    transform: translate(-50%, -50%);
    mix-blend-mode: difference;
  `;
  cursor.id = 'custom-cursor';
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });

  // Scale up on interactive elements
  const interactiveSelector = 'a, button, .feature-card, input, textarea, select';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelector)) {
      cursor.style.width = '40px';
      cursor.style.height = '40px';
      cursor.style.borderColor = 'rgba(197, 237, 54, 0.8)';
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelector)) {
      cursor.style.width = '24px';
      cursor.style.height = '24px';
      cursor.style.borderColor = 'rgba(197, 237, 54, 0.5)';
    }
  });

  // Hide on mobile/touch
  if ('ontouchstart' in window) {
    cursor.style.display = 'none';
  }
}

// =============================================
// SCROLL REVEAL ANIMATIONS
// =============================================

function initScrollReveal() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Animate section labels (below-fold only)
  gsap.utils.toArray('.bento-section .section-label, .features .section-label, .cta-section .cta-badge').forEach(el => {
    gsap.fromTo(el,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      }
    );
  });

  // Animate section titles (below-fold only)
  gsap.utils.toArray('.bento-section .section-title, .cta-section h2').forEach(el => {
    gsap.fromTo(el,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.1,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      }
    );
  });

  // Animate section descriptions
  gsap.utils.toArray('.bento-section .section-desc, .cta-section > .container > p').forEach(el => {
    gsap.fromTo(el,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.2,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      }
    );
  });

  // Logos bar fade
  const logosBar = document.querySelector('.logos-bar');
  if (logosBar) {
    gsap.fromTo(logosBar,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: logosBar, start: 'top 90%', once: true }
      }
    );
  }
}

// =============================================
// BENTO CARD STAGGER ANIMATIONS
// =============================================

function initBentoAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const bentoGrid = document.querySelector('.bento-grid');
  if (!bentoGrid) return;

  // Hero card (enters first)
  const heroCard = bentoGrid.querySelector('.bento-card--hero');
  if (heroCard) {
    gsap.fromTo(heroCard,
      { y: 60, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: bentoGrid, start: 'top 80%', once: true }
      }
    );
  }

  // Smaller cards (stagger after hero)
  const smallCards = bentoGrid.querySelectorAll('.bento-card:not(.bento-card--hero)');
  if (smallCards.length > 0) {
    gsap.fromTo(smallCards,
      { y: 50, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.12, ease: 'power3.out', delay: 0.3,
        scrollTrigger: { trigger: bentoGrid, start: 'top 80%', once: true }
      }
    );
  }
}

// =============================================
// CURSOR GLOW (Desktop only)
// =============================================

function initCursorGlow() {
  // Skip on touch devices
  if ('ontouchstart' in window) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);

  let mouseX = 0;
  let mouseY = 0;
  let rafId = null;

  function updateGlow() {
    glow.style.transform = 'translate(' + (mouseX - 200) + 'px, ' + (mouseY - 200) + 'px)';
    rafId = null;
  }

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!rafId) {
      rafId = requestAnimationFrame(updateGlow);
    }
  });
}

function init() {
  // Floating pill navbar on scroll
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    // Dark-hero variant needs a higher threshold before pill kicks in
    const scrollThreshold = navbar.classList.contains('navbar--dark-hero') ? 160 : 80;
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > scrollThreshold);
    }, { passive: true });
  }

  // Initialize Lucide icons
  initIcons();

  // Brutalist enhancements
  initScrollProgress();
  initCustomCursor();

  // Hero form
  const heroForm = document.querySelector('.hero-form');
  if (heroForm) {
    heroForm.addEventListener('submit', handleHeroFormSubmit);
  }

  // CTA buttons
  document.querySelectorAll('.btn-primary').forEach((btn, index) => {
    if (!btn.closest('form')) {
      btn.dataset.ctaId = btn.dataset.ctaId || `cta-${index}`;
      btn.addEventListener('click', handleCTAClick);
    }
  });

  // Navigation links
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', handleNavClick);
  });

  // Navbar CTA
  const navbarCTA = document.querySelector('.navbar .btn-primary');
  if (navbarCTA) {
    navbarCTA.dataset.ctaId = 'cta-navbar';
  }

  // Mobile hamburger menu
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);

    const toggleMenu = () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('active');
      overlay.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    hamburger.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (navLinks.classList.contains('open')) {
          toggleMenu();
        }
      });
    });
  }

  // Create demo modal
  createDemoModal();

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      const navLinksOpen = document.querySelector('.nav-links.open');
      if (navLinksOpen) {
        navLinksOpen.classList.remove('open');
        document.querySelector('.hamburger')?.classList.remove('active');
        document.querySelector('.nav-overlay')?.classList.remove('open');
        document.body.style.overflow = '';
      }
    }
  });

  // Initialize GSAP animations
  initAnimations();

  // Initialize new animation layers
  initScrollReveal();
  initBentoAnimations();
  initCursorGlow();

  // Refresh ScrollTrigger on full page load
  window.addEventListener('load', () => {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  });

  // Ensure lucide icons render for dynamically added content
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  console.log('Sisteco Landing initialized');
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}