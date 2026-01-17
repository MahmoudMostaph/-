
/// <reference lib="webworker" />

const swScope = self as unknown as ServiceWorkerGlobalScope;

const CACHE_NAME = 'dream-weight-v2';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com'
];

swScope.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

swScope.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

swScope.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => swScope.clients.claim())
  );
});

swScope.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    swScope.skipWaiting();
  }
});
