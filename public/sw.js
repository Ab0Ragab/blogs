const CACHE_NAME = "blog-v1";
const OFFLINE_URL = "/offline";
const OFFLINE_FALLBACK_URLS = [OFFLINE_URL, `${OFFLINE_URL}/`];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      await Promise.allSettled(
        OFFLINE_FALLBACK_URLS.map(async (url) => {
          const response = await fetch(url, { cache: "reload" });
          if (!response.ok) {
            throw new Error(
              `Offline page fetch failed for ${url}: ${response.status}`,
            );
          }
          await cache.put(url, response.clone());
        }),
      );
    })().catch((error) => {
      console.warn(
        "Service worker install: offline page caching failed",
        error,
      );
    }),
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)),
        ),
      ),
  );

  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(async () => {
        const cache = await caches.open(CACHE_NAME);
        return (
          (await cache.match(OFFLINE_URL)) ||
          (await cache.match(`${OFFLINE_URL}/`)) ||
          new Response("<h1>Offline</h1><p>Please check your connection.</p>", {
            headers: { "Content-Type": "text/html" },
            status: 503,
          })
        );
      }),
    );
  }
});
