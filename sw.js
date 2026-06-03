// ============================================================
//  Service Worker — Encurtador de Link PWA
// ============================================================

const CACHE_NAME = 'encurtador-v1';

// Arquivos que ficam disponíveis offline
const ASSETS = [
  '/encurtador/',
  '/encurtador/index.html',
  '/encurtador/r.html',
  '/encurtador/style.css',
  '/encurtador/app.js',
  '/encurtador/config.js',
  '/encurtador/manifest.json',
  '/encurtador/icon-192.png',
  '/encurtador/icon-512.png'
];

// Instalação — faz cache dos arquivos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Ativação — limpa caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Requisições — tenta rede primeiro, cai no cache se offline
self.addEventListener('fetch', event => {
  // Ignora requisições ao Supabase (precisam de rede sempre)
  if (event.request.url.includes('supabase.co')) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Atualiza cache com versão mais recente
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
