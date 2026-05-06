/**
 * Sisteco Sub-Pages — Shared JavaScript
 * Handles icons, navigation, scroll-to-top, FAQ accordion, pricing toggle, GSAP animations
 */

// =============================================
// INITIALIZATION
// =============================================

// API Configuration
const API_BASE = window.location.hostname === 'localhost'
  ? 'http://localhost:3000/api'
  : '/api';

function initPages() {
    // Floating pill navbar on scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 80);
        }, { passive: true });
    }

    initIcons();
    initMobileNav();
    initScrollToTop();
    initFaqAccordion();
    initPricingToggle();
    initContactForm();
    initPageAnimations();
    initNavActiveState();
    initScrollProgress();
    initCustomCursor();

    console.log('Sisteco Pages JS initialized');
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
// MOBILE NAVIGATION
// =============================================

function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (!hamburger || !navLinks) return;

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

    // Escape to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('open')) {
            toggleMenu();
        }
    });
}

// =============================================
// SCROLL TO TOP
// =============================================

function initScrollToTop() {
    const btn = document.createElement('button');
    btn.className = 'scroll-top';
    btn.setAttribute('aria-label', 'Volver arriba');
    btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>';
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// =============================================
// FAQ ACCORDION
// =============================================

function initFaqAccordion() {
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const wasOpen = item.classList.contains('open');

            // Close all
            document.querySelectorAll('.faq-item.open').forEach(openItem => {
                openItem.classList.remove('open');
            });

            // Toggle clicked
            if (!wasOpen) {
                item.classList.add('open');
            }
        });
    });
}

// =============================================
// PRICING TOGGLE (Monthly/Annual)
// =============================================

function initPricingToggle() {
    const toggle = document.querySelector('.toggle-switch');
    if (!toggle) return;

    const monthlyLabel = document.querySelector('.pricing-toggle .monthly-label');
    const annualLabel = document.querySelector('.pricing-toggle .annual-label');

    toggle.addEventListener('click', () => {
        const isAnnual = toggle.classList.toggle('active');

        if (monthlyLabel) monthlyLabel.classList.toggle('active', !isAnnual);
        if (annualLabel) annualLabel.classList.toggle('active', isAnnual);

        // Update prices
        document.querySelectorAll('[data-monthly]').forEach(el => {
            el.textContent = isAnnual ? el.dataset.annual : el.dataset.monthly;
        });

        document.querySelectorAll('[data-period-monthly]').forEach(el => {
            el.textContent = isAnnual ? el.dataset.periodAnnual : el.dataset.periodMonthly;
        });
    });
}

// =============================================
// CONTACT FORM
// =============================================

function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const nameInput = form.querySelector('#contact-name');
        const emailInput = form.querySelector('#contact-email');
        const companyInput = form.querySelector('#contact-company');
        const messageInput = form.querySelector('#contact-message');

        const name = nameInput?.value.trim();
        const email = emailInput?.value.trim();
        const company = companyInput?.value.trim();
        const message = messageInput?.value.trim();

        if (!name) {
            nameInput?.focus();
            showPageToast('Por favor ingresa tu nombre', 'error');
            return;
        }

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            emailInput?.focus();
            showPageToast('Por favor ingresa un email válido', 'error');
            return;
        }

        if (!message) {
            messageInput?.focus();
            showPageToast('Por favor escribe un mensaje', 'error');
            return;
        }

        submitBtn.disabled = true;
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';

        try {
            const response = await fetch(`${API_BASE}/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, company: company || null, message })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al enviar');
            }

            showPageToast(data.message || 'Mensaje enviado correctamente', 'success');
            form.reset();
        } catch (error) {
            showPageToast(error.message || 'Error al enviar el mensaje', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

function showPageToast(message, type) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icon = document.createElement('span');
    icon.className = 'toast-icon';
    icon.textContent = type === 'success' ? '\u2713' : '\u2715';

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

// =============================================
// GSAP PAGE ANIMATIONS
// =============================================

function initPageAnimations() {
    if (typeof gsap === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // Navbar items
    gsap.fromTo(
        '.navbar-item',
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.1 }
    );

    // Page hero elements
    gsap.fromTo(
        '.page-hero h1',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.2 }
    );

    gsap.fromTo(
        '.page-hero p',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.4 }
    );

    gsap.fromTo(
        '.breadcrumb',
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: 'power3.out', delay: 0.3 }
    );

    // Content cards stagger with ScrollTrigger
    if (typeof ScrollTrigger !== 'undefined') {
        document.querySelectorAll('.content-card, .dashboard-feature, .pricing-card, .team-card, .app-mockup, .lead-scoring-block, .core-feature, .stack-column, .cta-card').forEach((card, i) => {
            gsap.fromTo(card,
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                        once: true
                    }
                }
            );
        });

        // Section headers
        document.querySelectorAll('.section-header').forEach(header => {
            gsap.fromTo(header,
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.7,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: header,
                        start: 'top 85%',
                        once: true
                    }
                }
            );
        });
    }
}

// =============================================
// ACTIVE NAV STATE
// =============================================

function initNavActiveState() {
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.includes(currentPage + '.html')) {
            link.classList.add('active');
        }
    });
}

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
    }, { passive: true });
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

    const interactiveSelector = 'a, button, .content-card, .pricing-card, .team-card, .dashboard-feature, .faq-question, input, textarea, select';
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

    if ('ontouchstart' in window) {
        cursor.style.display = 'none';
    }
}

// =============================================
// RUN
// =============================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPages);
} else {
    initPages();
}
