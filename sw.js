/**
 * ConVerse PWA Service Worker
 * PS-10: Financial Scam Simulator & Awareness Engine
 * Foundation Owner: Tanishka
 */

const CACHE_NAME = 'converse-shell-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/src/styles/tokens.css',
  '/src/styles/base.css',
  '/src/styles/components.css',
  '/src/styles/layout.css',
  '/src/app/app.js',
  '/src/app/router.js',
  '/src/app/state.js',
  '/src/i18n/i18n.js',
  '/src/locales/en/common.js',
  '/src/locales/hi/common.js',
  '/src/locales/mr/common.js',
  '/src/locales/ta/common.js',
  '/src/locales/te/common.js',
  '/src/locales/gu/common.js',
  '/src/locales/pa/common.js',
  '/src/components/button.js',
  '/src/components/chip.js',
  '/src/components/card.js',
  '/src/components/badge.js',
  '/src/components/tabs.js',
  '/src/components/modal.js',
  '/src/components/progress.js',
  '/src/components/toast.js',
  '/src/pages/dashboard.js',
  '/src/pages/simulator.js',
  '/src/pages/safety-tips.js',
  '/src/pages/progress.js',
  '/src/pages/settings.js',
  '/src/pages/styleguide.js',
  '/public/manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        return networkResponse;
      }).catch(() => {
        // Fallback to cached index.html for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
