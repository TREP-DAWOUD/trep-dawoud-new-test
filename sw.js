const CACHE_NAME = 'trepdawoud-v1';
const urlsToCache = [
  '/',
  '/css/style.css',
  '/css/effects.css',
  '/js/main.js',
  '/js/effects.js',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    }).catch(() => {
      return caches.match('/');
    })
  );
});
