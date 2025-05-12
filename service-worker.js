const CACHE_NAME = 'pwa-cache-v1';
const ASSETS_TO_CACHE = [
  'PWA/index.html',
  'PWA/styles.css',
  'PWA/app.js',
  'PWA/manifest.json',
  'PWA/img/icon-72.png',
  'PWA/img/icon-96.png',
  'PWA/img/icon-128.png',
  'PWA/img/icon-144.png',
  'PWA/img/icon-152.png',
  'PWA/img/icon-192.png',
  'PWA/img/icon-384.png',
  'PWA/img/icon-512.png'
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
  self.clients.claim();
});

// Fetch event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response =>
      response || fetch(event.request)
    )
  );
});
