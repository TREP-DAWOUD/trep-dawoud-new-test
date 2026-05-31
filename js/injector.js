/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TREP DAWOUD - CSS/JS Injector System
 * يقوم بإضافة ملفات CSS و JS تلقائياً إلى جميع الصفحات
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function() {
  'use strict';

  // ═══════════════════════════════════════════════════════════════════════
  // الحصول على مسار الجذر (Root) بناءً على موقع الصفحة الحالية
  // ═══════════════════════════════════════════════════════════════════════

  function getBasePath() {
    const pathname = window.location.pathname;
    
    // إذا كانت الصفحة في /pages/ → العودة لـ ../
    if (pathname.includes('/pages/')) {
      return '../';
    }
    
    // إذا كانت الصفحة في الجذر (Root) → استخدام /
    return '/';
  }

  const basePath = getBasePath();

  // ═══════════════════════════════════════════════════════════════════════
  // 1️⃣ إضافة CSS تلقائياً
  // ═══════════════════════════════════════════════════════════════════════

  function injectCSS() {
    // Array من ملفات CSS المطلوبة (بالترتيب الصحيح!)
    const cssFiles = [
      { href: `${basePath}css/style.css`, id: 'style-css' },
      { href: `${basePath}css/effects.css`, id: 'effects-css' }
    ];

    cssFiles.forEach(cssFile => {
      // تحقق من عدم وجود الملف مسبقاً (تجنب التكرار)
      if (!document.getElementById(cssFile.id)) {
        const link = document.createElement('link');
        link.id = cssFile.id;
        link.rel = 'stylesheet';
        link.href = cssFile.href;
        
        // أضف قبل أي stylesheet موجود أو في نهاية <head>
        const lastLink = document.querySelector('link[rel="stylesheet"]');
        if (lastLink) {
          lastLink.parentNode.insertBefore(link, lastLink.nextSibling);
        } else {
          document.head.appendChild(link);
        }
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 2️⃣ إضافة JavaScript تلقائياً
  // ═══════════════════════════════════════════════════════════════════════

  function injectScripts() {
    // Array من ملفات JS المطلوبة (بالترتيب الصحيح!)
    const jsFiles = [
      { src: `${basePath}js/main.js`, id: 'main-js' },
      { src: `${basePath}js/effects.js`, id: 'effects-js' }
    ];

    jsFiles.forEach((jsFile, index) => {
      // تحقق من عدم وجود الملف مسبقاً
      if (!document.getElementById(jsFile.id)) {
        const script = document.createElement('script');
        script.id = jsFile.id;
        script.src = jsFile.src;
        script.async = false; // تنفيذ بالترتيب!
        
        // أضف قبل إغلاق </body>
        document.body.appendChild(script);
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 3️⃣ تسجيل في Console للتحقق (Development Mode)
  // ═══════════════════════════════════════════════════════════════════════

  function logInjectorStatus() {
    console.group('🔧 TREP DAWOUD - Injector Status');
    console.log('✅ Injector loaded');
    console.log(`📍 Base path: ${basePath}`);
    console.log('📄 CSS Files:');
    console.log('   - style.css ✅');
    console.log('   - effects.css ✅');
    console.log('📜 JavaScript Files:');
    console.log('   - main.js ✅');
    console.log('   - effects.js ✅');
    console.groupEnd();
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 4️⃣ التشغيل الرئيسي
  // ═══════════════════════════════════════════════════════════════════════

  // تشغيل عند تحميل DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      injectCSS();
      injectScripts();
      logInjectorStatus();
    });
  } else {
    // DOM محمّل بالفعل
    injectCSS();
    injectScripts();
    logInjectorStatus();
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 5️⃣ اختبار تحميل الملفات (Network Test)
  // ═══════════════════════════════════════════════════════════════════════

  window.addEventListener('load', function() {
    // اختبر أن effects.js تحمل بنجاح
    if (window.TREP && window.TREP.Effects) {
      console.log('✅ effects.js loaded successfully');
    } else {
      console.warn('⚠️ effects.js may not have loaded properly');
    }
  });

})();
