const C = 'struk-v7';
const ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './icon-maskable-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(ASSETS))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(hit => hit || fetch(e.request).then(r => {
    if (r && (r.ok || r.type === 'opaque')) { const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)); }
    return r;
  }).catch(() => caches.match('./index.html'))));
});
