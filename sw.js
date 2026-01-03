
const CACHE_NAME = 'cafecito-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  'https://cdn.tailwindcss.com',
  'https://www.transparenttextures.com/patterns/natural-paper.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
