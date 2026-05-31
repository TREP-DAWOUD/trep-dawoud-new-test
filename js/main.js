/* =====================================================
   TREP DAWOUD - JavaScript Main File
   Interactions, Dark Mode, Navigation, Animations
   ===================================================== */

(function() {
  'use strict';

  // ======================== DARK MODE ========================
  class DarkMode {
      constructor() {
          this.html = document.documentElement;
          this.storageKey = 'trep-dawoud-theme';
          this.init();
      }

      init() {
          this.loadTheme();
          this.setupEventListeners();
      }

      loadTheme() {
          const saved = localStorage.getItem(this.storageKey);
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          const isDark = saved ? saved === 'dark' : prefersDark;

          if (isDark) {
              this.html.classList.add('dark-mode');
          }
      }

      toggle() {
          this.html.classList.toggle('dark-mode');
          const isDark = this.html.classList.contains('dark-mode');
          localStorage.setItem(this.storageKey, isDark ? 'dark' : 'light');
          this.updateIcon();
      }

      updateIcon() {
          const btn = document.querySelector('.theme-toggle');
          if (!btn) return;

          const isDark = this.html.classList.contains('dark-mode');
          btn.innerHTML = isDark ? '☀️' : '🌙';
      }

      setupEventListeners() {
          const btn = document.querySelector('.theme-toggle');
          if (btn) {
              btn.addEventListener('click', () => this.toggle());
              this.updateIcon();
          }
      }
  }

  // ======================== MOBILE MENU ========================
  class MobileMenu {
      constructor() {
          this.btn = document.querySelector('.mobile-menu-btn');
          this.nav = document.querySelector('.navbar-nav');
          this.init();
      }

      init() {
          if (!this.btn) return;

          this.btn.addEventListener('click', () => this.toggle());

          // Close menu when clicking on a link
          const links = this.nav?.querySelectorAll('a');
          links?.forEach(link => {
              link.addEventListener('click', () => this.close());
          });

          // Close menu when clicking outside
          document.addEventListener('click', (e) => {
              if (!e.target.closest('.navbar-container')) {
                  this.close();
              }
          });
      }

      toggle() {
          this.nav?.classList.toggle('active');
          this.btn.classList.toggle('active');
      }

      close() {
          this.nav?.classList.remove('active');
          this.btn?.classList.remove('active');
      }
  }

  // ======================== NAVBAR SCROLL EFFECT ========================
  class NavbarScroll {
      constructor() {
          this.navbar = document.querySelector('.navbar');
          this.lastScroll = 0;
          this.init();
      }

      init() {
          if (!this.navbar) return;

          window.addEventListener('scroll', () => this.handleScroll());
      }

      handleScroll() {
          const scroll = window.scrollY;

          if (scroll > 50) {
              this.navbar.classList.add('scrolled');
          } else {
              this.navbar.classList.remove('scrolled');
          }

          this.lastScroll = scroll;
      }
  }

  // ======================== SCROLL ANIMATIONS ========================
  class ScrollAnimations {
      constructor() {
          this.elements = document.querySelectorAll('[data-animate]');
          this.init();
      }

      init() {
          if (!this.elements.length) return;

          const observer = new IntersectionObserver((entries) => {
              entries.forEach(entry => {
                  if (entry.isIntersecting) {
                      const animation = entry.target.dataset.animate;
                      entry.target.classList.add(animation);
                      observer.unobserve(entry.target);
                  }
              });
          }, {
              threshold: 0.1,
              rootMargin: '0px 0px -100px 0px'
          });

          this.elements.forEach(el => observer.observe(el));
      }
  }

  // ======================== SMOOTH SCROLL NAVIGATION ========================
  class SmoothScroll {
      constructor() {
          this.init();
      }

      init() {
          document.querySelectorAll('a[href^="#"]').forEach(anchor => {
              anchor.addEventListener('click', (e) => {
                  const href = anchor.getAttribute('href');
                  if (href === '#') return;

                  e.preventDefault();
                  const target = document.querySelector(href);

                  if (target) {
                      target.scrollIntoView({ behavior: 'smooth' });
                  }
              });
          });
      }
  }

  // ======================== FORM VALIDATION ========================
  class FormValidator {
      constructor() {
          this.forms = document.querySelectorAll('.form-validate');
          this.init();
      }

      init() {
          this.forms.forEach(form => {
              form.addEventListener('submit', (e) => this.validate(e));
          });
      }

      validate(e) {
          const form = e.target;
          let isValid = true;

          form.querySelectorAll('input, textarea, select').forEach(field => {
              const value = field.value.trim();
              const type = field.type;
              const required = field.required;

              if (required && !value) {
                  this.showError(field, 'هذا الحقل مطلوب');
                  isValid = false;
              } else if (type === 'email' && value && !this.isValidEmail(value)) {
                  this.showError(field, 'بريد إلكتروني غير صحيح');
                  isValid = false;
              } else if (type === 'tel' && value && !this.isValidPhone(value)) {
                  this.showError(field, 'رقم هاتف غير صحيح');
                  isValid = false;
              } else {
                  this.clearError(field);
              }
          });

          if (!isValid) {
              e.preventDefault();
          }

          return isValid;
      }

      isValidEmail(email) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      }

      isValidPhone(phone) {
          return /^[\d\s\-\+\(\)]{7,}$/.test(phone);
      }

      showError(field, message) {
          field.classList.add('is-invalid');
          let error = field.nextElementSibling;

          if (!error || !error.classList.contains('error-message')) {
              error = document.createElement('small');
              error.className = 'error-message';
              field.parentNode.insertBefore(error, field.nextSibling);
          }

          error.textContent = message;
          error.style.color = 'var(--danger)';
          error.style.display = 'block';
      }

      clearError(field) {
          field.classList.remove('is-invalid');
          const error = field.nextElementSibling;
          if (error && error.classList.contains('error-message')) {
              error.remove();
          }
      }
  }

  // ======================== ACTIVE NAV LINK ========================
  class ActiveNavLink {
      constructor() {
          this.navLinks = document.querySelectorAll('.navbar-nav a');
          this.init();
      }

      init() {
          this.updateActiveLink();
          window.addEventListener('hashchange', () => this.updateActiveLink());
      }

      updateActiveLink() {
          const currentPath = window.location.pathname;

          this.navLinks.forEach(link => {
              link.classList.remove('active');
              const href = link.getAttribute('href');

              if (currentPath === '/' && href === 'index.html') {
                  link.classList.add('active');
              } else if (href && currentPath.includes(href.replace('.html', ''))) {
                  link.classList.add('active');
              }
          });
      }
  }

  // ======================== MODAL HANDLER ========================
  class Modal {
      constructor(modalId) {
          this.modal = document.getElementById(modalId);
          this.init();
      }

      init() {
          if (!this.modal) return;

          const closeBtn = this.modal.querySelector('.modal-close');
          if (closeBtn) {
              closeBtn.addEventListener('click', () => this.close());
          }

          this.modal.addEventListener('click', (e) => {
              if (e.target === this.modal) {
                  this.close();
              }
          });
      }

      open() {
          if (this.modal) {
              this.modal.classList.add('active');
              document.body.style.overflow = 'hidden';
          }
      }

      close() {
          if (this.modal) {
              this.modal.classList.remove('active');
              document.body.style.overflow = '';
          }
      }
  }

  // ======================== LAZY LOADING IMAGES ========================
  class LazyLoadImages {
      constructor() {
          this.init();
      }

      init() {
          const observer = new IntersectionObserver((entries) => {
              entries.forEach(entry => {
                  if (entry.isIntersecting) {
                      const img = entry.target;
                      img.src = img.dataset.src;
                      img.classList.add('loaded');
                      observer.unobserve(img);
                  }
              });
          });

          document.querySelectorAll('img[data-src]').forEach(img => {
              observer.observe(img);
          });
      }
  }

  // ======================== PAGINATION ========================
  class Pagination {
      constructor(containerId, itemsPerPage = 6) {
          this.container = document.getElementById(containerId);
          this.itemsPerPage = itemsPerPage;
          this.currentPage = 1;

          if (this.container) {
              this.init();
          }
      }

      init() {
          this.items = Array.from(this.container.querySelectorAll('[data-item]'));
          this.totalPages = Math.ceil(this.items.length / this.itemsPerPage);
          this.showPage(1);
          this.renderPagination();
      }

      showPage(page) {
          this.currentPage = page;
          const start = (page - 1) * this.itemsPerPage;
          const end = start + this.itemsPerPage;

          this.items.forEach((item, index) => {
              item.style.display = (index >= start && index < end) ? 'block' : 'none';
          });

          this.updatePaginationButtons();
      }

      renderPagination() {
          const paginationDiv = document.createElement('div');
          paginationDiv.className = 'pagination';
          paginationDiv.style.cssText = `
              display: flex;
              justify-content: center;
              gap: 8px;
              margin-top: 2rem;
              flex-wrap: wrap;
          `;

          for (let i = 1; i <= this.totalPages; i++) {
              const btn = document.createElement('button');
              btn.textContent = i;
              btn.className = 'btn btn-sm';
              btn.style.cssText = i === this.currentPage ? 'background: var(--primary-color); color: white;' : '';
              btn.addEventListener('click', () => this.showPage(i));
              paginationDiv.appendChild(btn);
          }

          this.container.parentNode.appendChild(paginationDiv);
      }

      updatePaginationButtons() {
          const buttons = document.querySelectorAll('.pagination button');
          buttons.forEach((btn, index) => {
              if (index + 1 === this.currentPage) {
                  btn.style.background = 'var(--primary-color)';
                  btn.style.color = 'white';
              } else {
                  btn.style.background = '';
                  btn.style.color = '';
              }
          });
      }
  }

  // ======================== COUNTER ANIMATION ========================
  class CounterAnimation {
      constructor() {
          this.counters = document.querySelectorAll('[data-counter]');
          this.init();
      }

      init() {
          if (!this.counters.length) return;

          const observer = new IntersectionObserver((entries) => {
              entries.forEach(entry => {
                  if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                      this.animateCounter(entry.target);
                      entry.target.classList.add('animated');
                  }
              });
          }, { threshold: 0.5 });

          this.counters.forEach(counter => observer.observe(counter));
      }

      animateCounter(element) {
          const target = parseInt(element.dataset.counter);
          const duration = 2000;
          const startTime = Date.now();

          const animate = () => {
              const elapsed = Date.now() - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const current = Math.floor(target * progress);

              element.textContent = current.toLocaleString('ar-SA');

              if (progress < 1) {
                  requestAnimationFrame(animate);
              }
          };

          animate();
      }
  }

  // ======================== TOAST NOTIFICATIONS ========================
  class Toast {
      static show(message, type = 'info', duration = 3000) {
          const toast = document.createElement('div');
          toast.className = `toast toast-${type}`;
          toast.textContent = message;
          toast.style.cssText = `
              position: fixed;
              top: 20px;
              right: 20px;
              background: var(--${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'info'});
              color: white;
              padding: 1rem 1.5rem;
              border-radius: 8px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.15);
              z-index: 10000;
              animation: slideInRight 0.3s ease-out;
              max-width: 400px;
          `;

          document.body.appendChild(toast);

          setTimeout(() => {
              toast.style.animation = 'slideInLeft 0.3s ease-out';
              setTimeout(() => toast.remove(), 300);
          }, duration);
      }
  }

  // ======================== INITIALIZE ALL ========================
  document.addEventListener('DOMContentLoaded', () => {
      // Initialize all modules
      new DarkMode();
      new MobileMenu();
      new NavbarScroll();
      new ScrollAnimations();
      new SmoothScroll();
      new FormValidator();
      new ActiveNavLink();
      new LazyLoadImages();
      new CounterAnimation();

      // Add smooth scroll behavior
      document.documentElement.style.scrollBehavior = 'smooth';
  });

  // ======================== UTILITY FUNCTIONS ========================

  // Format currency to Arabic format
  function formatCurrency(amount, currency = 'MAD') {
      return new Intl.NumberFormat('ar-SA', {
          style: 'currency',
          currency: currency
      }).format(amount);
  }

  // Format date to Arabic
  function formatDate(date) {
      return new Intl.DateTimeFormat('ar-SA', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
      }).format(new Date(date));
  }

  // Debounce function
  function debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
          const later = () => {
              clearTimeout(timeout);
              func(...args);
          };
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
      };
  }

  // Check if element is in viewport
  function isInViewport(element) {
      const rect = element.getBoundingClientRect();
      return (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
  }

  // ======================== SERVICE WORKER REGISTRATION ========================
  if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
          navigator.serviceWorker.register('/js/service-worker.js')
              .then(registration => {
                  console.log('✅ Service Worker registered successfully:', registration);
                  
                  // التحقق من التحديثات
                  setInterval(() => {
                      registration.update();
                  }, 60000); // كل دقيقة

                  // الاستماع للتحديثات الجديدة
                  registration.addEventListener('updatefound', () => {
                      const newWorker = registration.installing;
                      newWorker.addEventListener('statechange', () => {
                          if (newWorker.state === 'activated') {
                              // إشعار المستخدم بوجود نسخة جديدة
                              if (confirm('تحديث جديد متوفر! هل تريد إعادة تحميل الصفحة؟')) {
                                  window.location.reload();
                              }
                          }
                      });
                  });
              })
              .catch(error => {
                  console.log('❌ Service Worker registration failed:', error);
              });
      });

      // التعامل مع الاتصال والانقطاع
      window.addEventListener('online', () => {
          console.log('🟢 Back online');
          showToast('تم استعادة الاتصال بالإنترنت', 'success');
      });

      window.addEventListener('offline', () => {
          console.log('🔴 You are offline');
          showToast('تم قطع الاتصال بالإنترنت. يمكنك الاستمرار في تصفح الصفحات المخزنة', 'warning');
      });
  }

  // ===================== THEME TOGGLE =====================
  const themeToggle = document.querySelector('.theme-toggle');
  
  if (themeToggle) {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeToggleButton(savedTheme);
    
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeToggleButton(newTheme);
    });
  }

  function updateThemeToggleButton(theme) {
    if (themeToggle) {
      themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
      themeToggle.title = theme === 'dark' ? 'تبديل إلى الوضع الفاتح' : 'تبديل إلى الوضع المظلم';
    }
  }

  // ===================== MOBILE MENU TOGGLE =====================
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navbarNav = document.querySelector('.navbar-nav');
  
  if (mobileMenuBtn && navbarNav) {
    mobileMenuBtn.addEventListener('click', () => {
      const isVisible = navbarNav.style.display === 'flex';
      navbarNav.style.display = isVisible ? 'none' : 'flex';
      mobileMenuBtn.classList.toggle('active');
    });

    navbarNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navbarNav.style.display = 'none';
        mobileMenuBtn.classList.remove('active');
      });
    });
  }

  // ===================== COUNTER ANIMATION =====================
  function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current);
      }
    }, 30);
  }

  // ===================== INTERSECTION OBSERVER =====================
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
        
        // Animate counters
        if (entry.target.classList.contains('counter')) {
          const target = parseInt(entry.target.getAttribute('data-target'));
          if (!entry.target.dataset.animated) {
            animateCounter(entry.target, target);
            entry.target.dataset.animated = 'true';
          }
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });

  // ===================== SMOOTH SCROLL FOR ANCHOR LINKS =====================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ===================== NEWSLETTER SUBSCRIPTION =====================
  const newsletterForm = document.querySelector('.footer-newsletter');
  if (newsletterForm) {
    const input = newsletterForm.querySelector('input');
    const button = newsletterForm.querySelector('button');
    
    if (button) {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        if (input && input.value) {
          alert('شكراً لاشتراكك! سيتم إرسال النشرة الإخبارية إلى بريدك الإلكتروني.');
          input.value = '';
        } else {
          alert('يرجى إدخال بريد إلكتروني صحيح');
        }
      });
    }
  }

  // ===================== PAGE SCROLL ACTIVE NAVBAR LINK =====================
  window.addEventListener('scroll', () => {
    const navLinks = document.querySelectorAll('.navbar-nav a');
    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === window.location.pathname || href === './') {
        link.classList.add('active');
      }
    });
  });

  // ===================== INITIALIZE ON LOAD =====================
  console.log('✅ TREP DAWOUD - Main Script Loaded Successfully');

})();
