// Self-destroying service worker to force clear caches and unregister
self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  self.clients.claim();
  self.registration.unregister().then(function() {
    console.log('[Service Worker] Unregistered successfully.');
  });
  // Clear all cache storages
  caches.keys().then(function(names) {
    return Promise.all(
      names.map(function(name) {
        return caches.delete(name);
      })
    );
  }).then(function() {
    console.log('[Service Worker] Caches cleared.');
  });
});
