const cacheName = 'PWATest';
const CACHE_NAME = 'my-app-cache-v1';
const urlsToCache = [
    '/',
    '/20231019.html',
    '/dist/dbr.js',
    // ... 其他你希望缓存的文件或资源
];


// Installing Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
        .then(response => {
            if (response) {
                return response;  // 如果匹配到则从缓存中返回
            }
            return fetch(event.request).then(
                response => {
                    // 如果请求失败，则跳出
                    if(!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    // 否则，将响应对象复制并存入缓存
                    let responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                    .then(cache => {
                        cache.put(event.request, responseToCache);
                    });
                    return response;
                }
            );
        })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
