/* ═══════════════════════════════════════════════════════════════════════════════
   TREP DAWOUD - Modern Effects & Interactions
   Version: 2.0 | JavaScript Effects System
   ═══════════════════════════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  console.log('✅ effects.js loaded and executing');

  const config = {
    revealSelector: '.reveal',
    revealGroupSelector: '.reveal-group',
    counterSelector: '.counter',
    navbarSelector: '.navbar',
    scrollThreshold: 0.1,
    counterDuration: 2000
  };

  // ===================== SCROLL REVEAL EFFECT =====================
  function initScrollReveal() {
    const observerOptions = {
      threshold: config.scrollThreshold,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          if (entry.target.classList.contains('reveal-group')) {
            const children = entry.target.querySelectorAll('> *');
            children.forEach(child => {
              child.classList.add('active');
            });
          }
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll(config.revealSelector);
    const revealGroupElements = document.querySelectorAll(config.revealGroupSelector);

    revealElements.forEach(el => {
      if (!el.classList.contains('reveal-group')) {
        observer.observe(el);
      }
    });

    revealGroupElements.forEach(el => observer.observe(el));
  }

  // ===================== NAVBAR SCROLL EFFECT =====================
  function initNavbarScroll() {
    const navbar = document.querySelector(config.navbarSelector);
    if (!navbar) return;

    let lastScrollTop = 0;
    let ticking = false;

    function updateNavbarScroll() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      lastScrollTop = scrollTop;
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateNavbarScroll);
        ticking = true;
      }
    }, { passive: true });

    updateNavbarScroll();
  }

  // ===================== RIPPLE EFFECT =====================
  function initRippleEffect() {
    document.addEventListener('click', function(e) {
      const button = e.target.closest('.ripple, .btn, .glow-btn, .glass-btn, .glow-btn-accent');
      
      if (!button) return;

      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.style.position = 'absolute';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.style.width = '0';
      ripple.style.height = '0';
      ripple.style.borderRadius = '50%';
      ripple.style.background = 'rgba(255, 255, 255, 0.5)';
      ripple.style.pointerEvents = 'none';
      ripple.style.animation = 'ripple 0.6s ease-out';

      button.style.position = 'relative';
      button.style.overflow = 'hidden';
      button.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    }, { passive: true });
  }

  // ===================== PARALLAX EFFECT =====================
  function initParallax() {
    window.addEventListener('scroll', () => {
      const parallaxElements = document.querySelectorAll('[data-parallax]');
      
      parallaxElements.forEach(el => {
        const speed = el.getAttribute('data-parallax') || 0.5;
        el.style.transform = `translateY(${window.pageYOffset * speed}px)`;
      });
    }, { passive: true });
  }

  // ===================== CARD TILT EFFECT =====================
  function initCardTilt() {
    const tiltCards = document.querySelectorAll('.glass-card');

    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
      });
    });
  }

  // ===================== SCROLL TO TOP BUTTON =====================
  function initScrollToTop() {
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '↑';
    scrollTopBtn.className = 'scroll-to-top';
    scrollTopBtn.setAttribute('aria-label', 'الذهاب إلى الأعلى');
    scrollTopBtn.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 50px;
      height: 50px;
      background: var(--accent-color);
      color: white;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      opacity: 0;
      pointer-events: none;
      transition: all 0.3s ease;
      font-size: 1.5rem;
      z-index: 999;
      box-shadow: 0 0 20px rgba(255, 107, 53, 0.4);
    `;

    document.body.appendChild(scrollTopBtn);

    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        scrollTopBtn.style.opacity = '1';
        scrollTopBtn.style.pointerEvents = 'auto';
      } else {
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.pointerEvents = 'none';
      }
    }, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===================== LAZY LOADING =====================
  function initLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      });
      
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  // ===================== FORM VALIDATION =====================
  function initFormValidation() {
    document.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', (e) => {
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
          if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#ff6b35';
          } else {
            input.style.borderColor = '';
          }
        });
        
        if (!isValid) {
          e.preventDefault();
        }
      });
    });
  }

  // ===================== SMOOTH PAGE TRANSITIONS =====================
  function initPageTransitions() {
    document.querySelectorAll('a:not([target="_blank"])').forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        if (href && !href.startsWith('#') && !href.startsWith('http')) {
          e.preventDefault();
          
          document.body.style.opacity = '0.7';
          document.body.style.transition = 'opacity 0.3s ease';
          
          setTimeout(() => {
            window.location.href = href;
          }, 300);
        }
      });
    });
  }

  // ===================== MAIN INITIALIZATION =====================
  function initializeEffects() {
    console.log('🎨 Initializing TREP DAWOUD Effects System');

    initScrollReveal();
    initNavbarScroll();
    initRippleEffect();
    initParallax();
    initCardTilt();
    initScrollToTop();
    initLazyLoading();
    initFormValidation();
    initPageTransitions();

    console.log('✨ All effects initialized successfully');
  }

  // ===================== STARTUP =====================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeEffects);
  } else {
    initializeEffects();
  }

  window.TREP = window.TREP || {};
  window.TREP.Effects = {
    initScrollReveal,
    initNavbarScroll,
    config
  };

})();
