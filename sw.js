// A unique name for the cache. Changing this name will force a cache update.
const CACHE_NAME = 'magic-8-ball-cache-v1';

// A list of all the files and resources the app needs to function offline.
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap'
];

// --- Service Worker Event Listeners ---

// 'install' event: Fired when the service worker is first installed.
// We open a cache and add all our essential files to it.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and adding assets.');
        return cache.addAll(urlsToCache);
      })
  );
});

// 'fetch' event: Fired for every network request made by the page.
// This allows us to intercept the request and respond with a cached version if available.
self.addEventListener('fetch', event => {
  event.respondWith(
    // Check the cache first for a matching request.
    caches.match(event.request)
      .then(response => {
        // If a cached version is found, return it.
        if (response) {
          return response;
        }
        // If the resource is not in the cache, fetch it from the network.
        return fetch(event.request);
      }
    )
  );
});

// 'activate' event: Fired when the service worker becomes active.
// This is a good place to clean up old, unused caches.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME]; // The only cache we want to keep
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // If the cache is not in our whitelist, delete it.
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
