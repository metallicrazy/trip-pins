/* Trip Pins service worker: offline app shell + cached map tiles */
const SHELL = 'tripins-shell-v1';
const TILES = 'tripins-tiles-v1';
const SHELL_FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-180.png',
  'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js', 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css'];
const TILE_LIMIT = 3000;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(SHELL).then(c => c.addAll(SHELL_FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => ![SHELL, TILES].includes(k)).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  if (url.hostname.endsWith('tile.openstreetmap.org')) {
    e.respondWith(caches.open(TILES).then(async cache => {
      const hit = await cache.match(e.request);
      if (hit) return hit;
      try {
        const res = await fetch(e.request);
        if (res.ok) { cache.put(e.request, res.clone()); trimCache(cache); }
        return res;
      } catch (err) { return hit || Response.error(); }
    }));
    return;
  }
  if (url.hostname.includes('nominatim')) return; // always live
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
    if (res.ok && (url.origin === location.origin || url.hostname === 'cdn.jsdelivr.net')) {
      caches.open(SHELL).then(c => c.put(e.request, res.clone()));
    }
    return res;
  }).catch(() => hit)));
});
async function trimCache(cache) {
  const keys = await cache.keys();
  if (keys.length > TILE_LIMIT) { for (const k of keys.slice(0, keys.length - TILE_LIMIT)) await cache.delete(k); }
}
