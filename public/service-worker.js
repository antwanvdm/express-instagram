// Flag for enabling cache in production
let doCache = true;
let version = '0.1';
const CACHE_NAME = 'instagram-express-pwa-cache-' + version;

// Delete old caches
self.addEventListener('activate', event => {
  const currentCachelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys()
      .then(keyList =>
        Promise.all(keyList.map(key => {
          if (!currentCachelist.includes(key)) {
            return caches.delete(key);
          }
        }))
      )
  );
});

// This triggers when user starts the app
self.addEventListener('install', function (event) {
  if (doCache) {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(function (cache) {
          // We will cache initial page and the main.js
          // We could also cache assets like CSS and images
          const urlsToCache = [
            '/',
            '/js/main.js',
            '/stylesheets/style.css'
          ];
          cache.addAll(urlsToCache);
        })
    );
  }
});

// Here we intercept request and serve up the matching files
self.addEventListener('fetch', function (event) {
  console.log(event);
  if (doCache) {
    event.respondWith(
      caches.match(event.request).then(function (response) {
        return response || fetch(event.request);
      })
    );
  }
});
