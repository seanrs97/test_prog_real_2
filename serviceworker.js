var CACHE_NAME = 'gih-cache-v5';
var CACHED_URLS = [
  // Our HTML
  'browserconfig.xml',
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
  'test_start_materialize',
  //images
  'appImages/dino.png',
  'appImages/favicon.icon',
  'appImages/favicon-16x16.png',
  'appImages/favicon-32x32.png',
  'appImages/favicon-96x96.png',
  'appImages/jack.png',
  'appImages/paddy.png',
  //android icons
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
  var requestURL = new URL(event.request.url);
  if (requestURL.pathname === 'first.html') {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return cache.match('first.html').then(function(cachedResponse) {
          var fetchPromise = fetch('first.html').then(function(networkResponse) {
            cache.put('first.html', networkResponse.clone());
            return networkResponse;
          });
          return cachedResponse || fetchPromise;
        });
      })
    );
  } else if (
    CACHED_URLS.indexOf(requestURL.href) !== -1 ||
    CACHED_URLS.indexOf(requestURL.pathname) !== -1
  ) {
    event.respondWith(         
      caches.open(CACHE_NAME).then(function(cache) {
        return cache.match(event.request).then(function(response) {
          return response || fetch(event.request);
        })
      })
    );
  }
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




