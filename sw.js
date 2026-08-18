/* Live Call Copilot — service worker (v38)
   Scopo: app installabile e shell disponibile offline. Regole:
   - intercetta SOLO ciò che è in allowlist esplicita (precache + pagine
     /app/*.html + icone + manifest): API, pagine SEO e tutto il resto
     passano dritti in rete, mai toccati;
   - asset versionati (-vN.js/.css): cache-first (immutabili per contratto);
   - pagine HTML: network-first, cache SOTTO IL PROPRIO URL, fallback per
     rotta (kit.html offline → kit.html in cache, non index.html);
   - la PRECACHE è generata da tools/gen-sw-precache.mjs (allowlist da build). */
const CACHE = 'lcc-v38';

/* @generated-precache-start */
const PRECACHE = [
  "./manifest.webmanifest",
  "./caccia.html",
  "./index.html",
  "./jobs.html",
  "./kit.html",
  "./landing.html",
  "./practice.html",
  "./storico.html",
  "./storie.html",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-32.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./assets/app-v13.js",
  "./assets/caccia-v1.js",
  "./assets/design-system-v3.css",
  "./assets/jobs-v10.js",
  "./assets/kit-v10.js",
  "./assets/landing-v8.js",
  "./assets/lcc-core-v4.js",
  "./assets/md.js",
  "./assets/page-caccia-v1.css",
  "./assets/page-index-v2.css",
  "./assets/page-jobs-v1.css",
  "./assets/page-kit-v1.css",
  "./assets/page-landing-v1.css",
  "./assets/page-practice-v1.css",
  "./assets/page-storico-v1.css",
  "./assets/page-storie-v1.css",
  "./assets/plancia.js",
  "./assets/practice-v8.js",
  "./assets/storico-v9.js",
  "./assets/storie-v3.js"
];
/* @generated-precache-end */

const SCOPE_PATH = new URL(self.registration ? self.registration.scope : self.location.href).pathname.replace(/[^/]*$/, ''); // es. /app/
const norm = (p) => p.replace(/^\.\//, SCOPE_PATH);
const ALLOW = new Set(PRECACHE.map(norm));
const isVersioned = (p) => /-v\d+\.(js|css|png)$/.test(p);
const isPage = (p) => /\.html$/.test(p) || p === SCOPE_PATH;

/* Decisione di routing (pura, testabile): 'asset' | 'page' | null */
function route(pathname) {
  if (pathname === SCOPE_PATH) return 'page';
  if (!ALLOW.has(pathname)) return null;
  return isPage(pathname) ? 'page' : 'asset';
}
self.__lccRoute = route; // esposto per i test

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(PRECACHE.map(norm)))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  const kind = route(url.pathname);
  if (!kind) return; // non in allowlist: rete, senza intercettare

  if (kind === 'asset') {
    // versionato = immutabile: cache-first; altrimenti stale-while-revalidate
    e.respondWith(caches.open(CACHE).then(async (c) => {
      const hit = await c.match(req);
      if (hit && isVersioned(url.pathname)) return hit;
      const net = fetch(req).then((res) => { if (res.ok) c.put(req, res.clone()); return res; }).catch(() => hit);
      return hit || net;
    }));
    return;
  }

  // pagina: network-first, cache sotto il PROPRIO URL, fallback per rotta
  const key = url.pathname === SCOPE_PATH ? SCOPE_PATH + 'index.html' : url.pathname;
  e.respondWith(
    fetch(req)
      .then((res) => { if (res.ok) caches.open(CACHE).then((c) => c.put(key, res.clone())); return res; })
      .catch(() => caches.match(key).then((hit) => hit || caches.match(SCOPE_PATH + 'index.html')))
  );
});
