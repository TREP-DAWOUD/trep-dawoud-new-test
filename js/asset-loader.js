/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TREP DAWOUD - Smart Asset Loader
 * نظام ذكي لتحميل CSS و JS تلقائياً مع معالجة الأخطاء
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function() {
  'use strict';

  // ═══════════════════════════════════════════════════════════════════════
  // حساب مسار القاعدة (Root Path)
  // ═══════════════════════════════════════════════════════════════════════

  const ROOT_PATH = (function() {
    const pathname = window.location.pathname;
    
    // إذا كانت الصفحة في /pages/
    if (pathname.includes('/pages/')) {
      return '../';
    }
    
    // إذا كانت في جذر GitHub Pages
    if (pathname === '/' || pathname === '') {
      return '/';
    }
    
    // للملفات المباشرة في الجذر
    return '/';
  })();

  // ═══════════════════════════════════════════════════════════════════════
  // قائمة الملفات المطلوبة (بالترتيب الدقيق!)
  // ═══════════════════════════════════════════════════════════════════════

  const REQUIRED_ASSETS = {
    css: [
      { path: `${ROOT_PATH}css/style.css`, id: 'style-css', priority: 1 },
      { path: `${ROOT_PATH}css/effects.css`, id: 'effects-css', priority: 2 }
    ],
    js: [
      { path: `${ROOT_PATH}js/main.js`, id: 'main-js', priority: 1, defer: false },
      { path: `${ROOT_PATH}js/effects.js`, id: 'effects-js', priority: 2, defer: false }
    ]
  };

  // ═══════════════════════════════════════════════════════════════════════
  // أداة لتحميل CSS
  // ═══════════════════════════════════════════════════════════════════════

  class CSSLoader {
    constructor(asset) {
      this.asset = asset;
      this.loaded = false;
      this.error = false;
    }

    load() {
      return new Promise((resolve, reject) => {
        // تحقق من عدم وجود الملف مسبقاً
        if (document.getElementById(this.asset.id)) {
          console.log(`✅ CSS already loaded: ${this.asset.id}`);
          resolve();
          return;
        }

        const link = document.createElement('link');
        link.id = this.asset.id;
        link.rel = 'stylesheet';
        link.href = this.asset.path;

        link.onload = () => {
          this.loaded = true;
          console.log(`✅ CSS loaded: ${this.asset.path}`);
          resolve();
        };

        link.onerror = () => {
          this.error = true;
          console.error(`❌ Failed to load CSS: ${this.asset.path}`);
          // رغم الخطأ، نكمل التحميل (التأثير على الوظيفة محدود)
          resolve();
        };

        document.head.appendChild(link);
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // أداة لتحميل JavaScript
  // ═══════════════════════════════════════════════════════════════════════

  class JSLoader {
    constructor(asset) {
      this.asset = asset;
      this.loaded = false;
      this.error = false;
    }

    load() {
      return new Promise((resolve, reject) => {
        // تحقق من عدم وجود الملف مسبقاً
        if (document.getElementById(this.asset.id)) {
          console.log(`✅ JS already loaded: ${this.asset.id}`);
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.id = this.asset.id;
        script.src = this.asset.path;
        script.async = false; // تنفيذ بالترتيب!

        script.onload = () => {
          this.loaded = true;
          console.log(`✅ JS loaded: ${this.asset.path}`);
          resolve();
        };

        script.onerror = () => {
          this.error = true;
          console.error(`❌ Failed to load JS: ${this.asset.path}`);
          resolve(); // نكمل حتى لو حدث خطأ
        };

        document.body.appendChild(script);
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // المدير الرئيسي للموارد
  // ═══════════════════════════════════════════════════════════════════════

  class AssetManager {
    constructor() {
      this.cssLoaders = [];
      this.jsLoaders = [];
      this.stats = {
        cssLoaded: 0,
        cssFailure: 0,
        jsLoaded: 0,
        jsFailure: 0
      };
    }

    async initialize() {
      console.group('🔧 TREP DAWOUD - Asset Loader');
      console.log('📍 Root Path:', ROOT_PATH);
      console.log('⏳ Loading assets...');

      // تحميل CSS أولاً
      await this.loadCSS();
      
      // ثم تحميل JS
      await this.loadJS();

      this.reportStatus();
      console.groupEnd();
    }

    async loadCSS() {
      for (const cssAsset of REQUIRED_ASSETS.css) {
        const loader = new CSSLoader(cssAsset);
        this.cssLoaders.push(loader);
        
        await loader.load();
        
        if (loader.loaded) {
          this.stats.cssLoaded++;
        } else if (loader.error) {
          this.stats.cssFailure++;
        }
      }
    }

    async loadJS() {
      for (const jsAsset of REQUIRED_ASSETS.js) {
        const loader = new JSLoader(jsAsset);
        this.jsLoaders.push(loader);
        
        await loader.load();
        
        if (loader.loaded) {
          this.stats.jsLoaded++;
        } else if (loader.error) {
          this.stats.jsFailure++;
        }
      }
    }

    reportStatus() {
      console.group('📊 Load Summary');
      console.log(`✅ CSS: ${this.stats.cssLoaded}/${REQUIRED_ASSETS.css.length}`);
      console.log(`✅ JS: ${this.stats.jsLoaded}/${REQUIRED_ASSETS.js.length}`);
      
      if (this.stats.cssFailure > 0) {
        console.warn(`⚠️ CSS Failures: ${this.stats.cssFailure}`);
      }
      if (this.stats.jsFailure > 0) {
        console.warn(`⚠️ JS Failures: ${this.stats.jsFailure}`);
      }
      
      console.log('✅ All assets initialized');
      console.groupEnd();
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // تشغيل النظام عند تحميل الصفحة
  // ═══════════════════════════════════════════════════════════════════════

  const manager = new AssetManager();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      manager.initialize();
    });
  } else {
    manager.initialize();
  }

  // ═══════════════════════════════════════════════════════════════════════
  // اختبار Effects System
  // ═══════════════════════════════════════════════════════════════════════

  window.addEventListener('load', () => {
    setTimeout(() => {
      console.group('🧪 Testing Effects System');
      
      // اختبر effects.js
      if (window.TREP && window.TREP.Effects) {
        console.log('✅ effects.js working');
        console.log('   Config:', window.TREP.Effects.config);
      } else {
        console.warn('⚠️ effects.js not initialized');
      }
      
      // اختبر عناصر CSS
      const testElements = {
        '.glow-btn': document.querySelector('.glow-btn'),
        '.glass-card': document.querySelector('.glass-card'),
        '.reveal': document.querySelector('.reveal'),
        '.counter': document.querySelector('.counter')
      };
      
      console.group('🎨 CSS Classes Found');
      for (const [selector, element] of Object.entries(testElements)) {
        if (element) {
          console.log(`✅ ${selector} - Found`);
        } else {
          console.log(`⚠️ ${selector} - Not found on this page`);
        }
      }
      console.groupEnd();
      
      console.groupEnd();
    }, 500);
  });

})();
