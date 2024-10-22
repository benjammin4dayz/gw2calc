// https://github.com/nikkifurls/simplepwa/blob/90aba597540fd0b9942ac7d0893634e603fdfa5e/sw.js
//

const CACHE_NAME = 'v1';

self.addEventListener('install', event => {
  self.skipWaiting();

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache =>
        cache.addAll([
          '/icon.png',
          '/index.html',
          '/manifest.json',
          'https://unpkg.com/mvp.css@1.16.0/mvp.css',
        ])
      )
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys =>
        keys.map(key => [!CACHE_NAME].includes(key) && caches.delete(key))
      )
  );
});

// cache-first
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(CACHE_NAME).then(cache =>
      cache.match(event.request).then(
        response =>
          response ||
          fetch(event.request).then(networkResponse => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          })
      )
    )
  );
});
