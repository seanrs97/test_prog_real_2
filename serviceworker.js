var BASE_PATH = '/test_prog_real_2/';
var CACHE_NAME = 'gih-cache-v6';
var CACHED_URLS = [
    // Our HTML
    BASE_PATH + 'first.html',
    
    // Images for favicons
    BASE_PATH + 'eventImages/android-icon-36x36.png',
    BASE_PATH + 'eventImages/android-icon-48x48.png',
    BASE_PATH + 'eventImages/android-icon-72x72.png',
    BASE_PATH + 'eventImages/android-icon-96x96.png',
    BASE_PATH + 'eventImages/android-icon-144x144.png',
    BASE_PATH + 'eventImages/android-icon-192x192.png',
    BASE_PATH + 'eventImages/favicon-32x32.png',

    //Images for page
    BASE_PATH + 'appImages/offlinemap.jpg',
    BASE_PATH + 'eventImages/dino.png',
    BASE_PATH + 'appImages/jack.jpg',
    BASE_PATH + 'appImages/paddy.jpg',
    BASE_PATH + 'appImages/favicon.ico',
    BASE_PATH + 'appImages/favicon-16x16.png',
    BASE_PATH + 'appImages/favicon-32x32.png',
    BASE_PATH + 'appImages/favicon-96x96.png',
    BASE_PATH + 'appImages/ms-icon-70x70.png',
    BASE_PATH + 'appImages/ms-icon-144x144.png',
    BASE_PATH + 'appImages/ms-icon-150x150.png',
    BASE_PATH + 'appImages/ms-icon-310x310.png',
    BASE_PATH + 'eventsImages/example-blog01.jpg',
    BASE_PATH + 'eventImages/example-blog02.jpg',
    BASE_PATH + 'eventImages/example-blog03.jpg',
    BASE_PATH + 'eventImages/example-blog04.jpg',
    BASE_PATH + 'eventImages/example-blog05.jpg',
    BASE_PATH + 'eventImages/example-blog06.jpg',
    BASE_PATH + 'eventImages/example-blog07.jpg',
    BASE_PATH + 'eventImages/example-work01.jpg',
    BASE_PATH + 'eventImages/example-work02.jpg',
    BASE_PATH + 'eventImages/example-work03.jpg',
    BASE_PATH + 'eventImages/example-work04.jpg',
    BASE_PATH + 'eventImages/example-work05.jpg',
    BASE_PATH + 'eventImages/example-work06.jpg',
    BASE_PATH + 'eventImages/example-work07.jpg',
    BASE_PATH + 'eventImages/example-work08.jpg',
    BASE_PATH + 'eventImages/example-work09.jpg',  
    // JavaScript
    BASE_PATH + 'offline-map.js',
    BASE_PATH + 'material.js',
    // Manifest
    BASE_PATH + 'manifest.json',
  // CSS and fonts
    'https://fonts.googleapis.com/css?family=Roboto:regular,bold,italic,thin,light,bolditalic,black,medium&lang=en',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    BASE_PATH + 'min-style.css',
    BASE_PATH + 'styles.css'
];

var googleMapsAPIJS = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDx4ApTFTqBYO6wNIJlBZ7DulIN46Zaq3g&callback=initMap';

self.addEventListener('install', function(event) {
  // Cache everything in CACHED_URLS. Installation fails if anything fails to cache
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(CACHED_URLS);
    })
  );
});

self.addEventListener('fetch', function(event) {
  var requestURL = new URL(event.request.url);
  // Handle requests for index.html
  if (requestURL.pathname === BASE_PATH + 'first.html') {
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
 // Handle requests for Google Maps JavaScript API file
  } else if (requestURL.href === googleMapsAPIJS) {
    event.respondWith(
      fetch(
        googleMapsAPIJS+'&'+Date.now(),
        { mode: 'no-cors', cache: 'no-store' }
      ).catch(function() {
        return caches.match('offline-map.js');
      })
    );
  } else if (
    CACHED_URLS.includes(requestURL.href) ||
    CACHED_URLS.includes(requestURL.pathname)
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return cache.match(event.request).then(function(response) {
          return response || fetch(event.request);
        });
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





