const CACHE_NAME = "site-cache-v1";

// Add ALL the pages you want to work offline here
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/login.html",      // Add your login page
  "/dashboard.html",  // Add other pages
  "/styles.css",      // Your CSS
  "/script.js",       // Your JS
  "/offline.html"     // (Optional) A backup page if a link isn't cached
];

// 1. Install: Save files to the browser storage
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching shell assets");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting(); // Makes the new SW take over immediately
});

// 2. Activate: Clean up old caches if you update the version
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// 3. Fetch: The logic that makes it work offline
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // If we have internet, return the fresh page
        return networkResponse;
      })
      .catch(() => {
        // If internet fails (offline), look for it in the cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // If the specific page isn't cached, show a fallback
          return caches.match("/offline.html");
        });
      })
  );
});
