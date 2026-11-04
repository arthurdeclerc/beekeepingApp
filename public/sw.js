// Service worker for the web build: caches the app shell so the PWA opens offline.
// Only same-origin GET requests are handled; Supabase (another origin) is never cached.
const CACHE_NAME = 'hivemind-v1';

const APP_SHELL = [
  '/',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

// Navigations go network-first so new deploys show up immediately; the cached '/' is the offline fallback.
async function handleNavigation(request) {
  try {
    return await fetch(request);
  } catch {
    const cached = await caches.match('/');
    return cached ?? Response.error();
  }
}

// Bundles under /_expo/static have a hash in their file name, so a cached copy never goes stale.
async function handleStaticAsset(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
  }
  return response;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(request));
  } else if (url.pathname.startsWith('/_expo/static/') || url.pathname.startsWith('/icons/')) {
    event.respondWith(handleStaticAsset(request));
  }
});
