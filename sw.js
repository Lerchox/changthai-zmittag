// Offline-Cache: App-Dateien beim Installieren, Schriften beim ersten Laden
const CACHE = "changthai-zmittag-v4";
const FILES = ["./", "index.html", "manifest.webmanifest", "menu.json", "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png", "fonts/fonts.css", "fonts/AtkinsonHyperlegible-400.woff2", "fonts/AtkinsonHyperlegible-700.woff2", "fonts/BricolageGrotesque-600.woff2", "fonts/BricolageGrotesque-800.woff2"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  // App selbst: zuerst Netz (damit Updates ankommen), sonst Cache
  if (url.origin === location.origin) {
    e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; })
      .catch(() => caches.match(e.request).then(r => r || caches.match("index.html"))));
    return;
  }
});
