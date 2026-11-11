const CACHE_NAME = 'personal-os-v30';
const MEDIA_CACHE_NAME = 'mcp-offline-media-v3';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './calendar.html',
  './admin.html',
  './diary.html',
  './pomodoro.html',
  './pomodoro.css',
  './oauth.html',
  './assets/vendor/tailwind.js',
  './assets/vendor/three.min.js',
  './assets/vendor/gsap.min.js',
  './assets/vendor/marked.min.js',
  './assets/vendor/purify.min.js',
  './assets/vendor/supabase.js',
  './assets/vendor/ogl.js',
  './assets/vendor/confetti.browser.min.js',
  './js/media-cache-manager.js',
  './js/media-compressor.js',
  './js/supabase-auth-gate.js',
  './js/imagekit-client.js',
  './js/habit-tracker.js',
  './js/control-engine.js',
  './js/glass-dialog.js',
  './js/webgl-backgrounds.js',
  './js/pomodoro-webgl.js',
  './js/pomodoro-app.js',
  './js/diary-crypto.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(
        ASSETS_TO_CACHE.map((url) =>
          fetch(new Request(url, { cache: 'reload' }))
            .then((res) => { if (res && res.status === 200) return cache.put(url, res); })
            .catch(() => null)
        )
      )
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.map((c) => {
          if (c !== CACHE_NAME && c !== MEDIA_CACHE_NAME) {
            console.log('[SW] Deletando cache antigo:', c);
            return caches.delete(c);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

/**
 * Função auxiliar para sintetizar respostas 206 Partial Content a partir de um arquivo em cache
 */
async function createRangeResponse(response, rangeHeader) {
  if (!response || response.type === 'opaque') {
    return response;
  }
  try {
    const arrayBuffer = await response.arrayBuffer();
    const total = arrayBuffer.byteLength;
    const parts = rangeHeader.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : total - 1;

    if (start >= total || end >= total) {
      return new Response('', {
        status: 416,
        headers: {
          'Content-Range': `bytes */${total}`,
          'Accept-Ranges': 'bytes'
        }
      });
    }

    const sliced = arrayBuffer.slice(start, end + 1);
    const headers = new Headers(response.headers);
    headers.set('Content-Range', `bytes ${start}-${end}/${total}`);
    headers.set('Content-Length', String(sliced.byteLength));
    headers.set('Accept-Ranges', 'bytes');

    return new Response(sliced, {
      status: 206,
      statusText: 'Partial Content',
      headers: headers
    });
  } catch (e) {
    return response;
  }
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  const isSameOrigin = url.origin === self.location.origin;

  // 1. Cross-Origin (ImageKit CDN, Supabase Storage, Google APIs, etc.)
  // NUNCA interceptar domínios externos via Service Worker: deixar o navegador/WebKit carregar diretamente de forma nativa e sem erros de CORS/404.
  if (!isSameOrigin || url.hostname.includes('imagekit.io') || url.hostname.includes('supabase.co')) {
    return;
  }

  // 2. Navegação HTML principal (App Shell) -> Network-First com fallback para página em cache
  if (req.mode === 'navigate' || (isSameOrigin && (url.pathname === '/' || url.pathname.endsWith('/')))) {
    event.respondWith(
      fetch(req)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return networkResponse;
        })
        .catch(() => caches.match(req).then((c) => c || caches.match('./index.html')))
    );
    return;
  }

  // 3. Scripts e Estilos locais (.js, .css) -> Network-First (NUNCA retornar index.html se falhar!)
  if (isSameOrigin && /\.(?:js|css|json)$/i.test(url.pathname)) {
    event.respondWith(
      fetch(req)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return networkResponse;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // 4. CDNs externas e demais recursos -> Cache-First com fallback de rede
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((networkResponse) => {
        if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        }
        return networkResponse;
      }).catch(() => cached);
    })
  );
});
