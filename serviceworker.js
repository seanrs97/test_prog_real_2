var CACHE_NAME = 'gih-cache-v5';
var CACHED_URLS = [
  // Our HTML
  'browserconfig.xml'
  'first.html',
  'index.html',
  'manifest.JSON',
  'mystyles.css',
  'offline.html',
  'README.MD',
  'second.html',
  'serviceworker.js',
  'styles.css',
  'test_manifest.html',
  'test_start_materialize'
  'appImages/dino.png',
  'appImages/favicon.icon',
  'appImages/favicon-16x16.png',
  'appImages/favicon-32x32.png',
  'appImages/favicon-96x96.png',
  'appImages/jack.png',
  'appImages/paddy.png',
  'eventImages/android-icon-36x36.png',
  'eventImages/android-icon-48x48.png',
  'eventImages/android-icon-72x72.png',
  'eventImages/android-icon-96x96.png',
  'eventImages/android-icon-144x144.png',
  'eventImages/android-icon-192x192.png',
  'eventImages/example-blog01.jpg',
  'eventImages/example-blog02.jpg',
  'eventImages/example-blog03.jpg',
  'eventImages/example-blog04.jpg',
  'eventImages/example-blog05.jpg',
  'eventImages/example-blog06.jpg',
  'eventImages/example-blog07.jpg',
  'eventImages/example-blog08.jpg',
  'eventImages/example-blog09.jpg',
  
  // Stylesheets and fonts
  // JavaScript
  // Images
];

self.addEventListener('install', function(event) {
  // Cache everything in CACHED_URLS. Installation will fail if something fails to cache
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(CACHED_URLS);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request).then(function(response) {
        if (response) {
          return response;
        } else if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('first.html');
        }
      });
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName.startsWith('gih-cache') && CACHE_NAME !== cacheName) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});




