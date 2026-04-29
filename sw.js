// v:2026-04-29T00:09:37
const CACHE = 'san-neomeo-san-v:2026-04-29T00:09:37';
const ASSETS = [
  '/san-neomeo-san/',
  '/san-neomeo-san/index.html',
  '/san-neomeo-san/manifest.json',
  '/san-neomeo-san/firebase-config.js',
  '/san-neomeo-san/icons/icon-192.png',
  '/san-neomeo-san/icons/icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('message', e => {
  if (e.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('firestore') || e.request.url.includes('firebase') || e.request.url.includes('googleapis')) {
    e.respondWith(fetch(e.request));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
