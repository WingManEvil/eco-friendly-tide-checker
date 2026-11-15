/*
  Offline support for the Tide Checker.

  Strategy: network first, cache as a fallback.
  Deliberately NOT cache-first — cache-first means that after a deploy, phones keep showing
  the old app forever and nobody can tell why. Network-first always shows the newest version
  when there is signal, and falls back to the saved copy when there is none.
*/

const CACHE = "tide-checker-v1";
const CORE = ["./", "index.html", "manifest.json", "icon-192.png", "icon-512.png"];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(CORE))
      .catch(() => {})          // a missing file must never block installation
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        const copy = response.clone();
        caches.open(CACHE)
          .then(cache => cache.put(event.request, copy))
          .catch(() => {});
        return response;
      })
      .catch(() =>
        caches.match(event.request).then(hit => hit || caches.match("index.html"))
      )
  );
});
