const CACHE_NAME = 'trep-dawoud-v1';
const urlsToCache = [
  '/',
  '/css/style.css',
  '/js/main.js',
  '/index.html',
  '/pages/about.html',
  '/pages/services.html',
  '/pages/destinations.html',
  '/pages/trips.html',
  '/pages/courses.html',
  '/pages/blog.html',
  '/pages/contact.html',
  '/pages/safety.html',
  '/pages/gear-checklist.html',
  '/pages/terms.html',
  '/pages/privacy.html',
  '/auth/login.html',
  '/auth/register.html',
  '/dashboard/index.html',
  '/404.html'
];

// تثبيت Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// تفعيل Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// استراتيجية Cache First with Network Fallback
self.addEventListener('fetch', event => {
  // تخطي طلبات POST والـ non-GET
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // إذا كانت النتيجة موجودة في الـ cache، أرجعها
        if (response) {
          return response;
        }

        return fetch(event.request).then(response => {
          // لا تخزن ردود غير صحيحة
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }

          // نسخ الـ response للتخزين
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(() => {
        // إذا فشل الـ fetch والملف غير متوفر في الـ cache
        return caches.match('/404.html');
      })
  );
});

// معالجة الرسائل من الصفحة
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
