// vite-plugin-pwa used to generate this service worker, precaching index.html
// and serving stale builds after deploys. The plugin was removed, so this
// replaces it with a kill switch so already-installed copies clean themselves
// up: unregister, clear caches, and reload once.
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));
      await self.registration.unregister();
      const clientsList = await self.clients.matchAll({ type: 'window' });
      clientsList.forEach((client) => client.navigate(client.url));
    })()
  );
});
