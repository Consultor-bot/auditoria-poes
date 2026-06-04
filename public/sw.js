const CACHE_NAME = 'poes-v4';
const RUNTIME_CACHE = 'poes-runtime-v4';
const ASSET_CACHE = 'poes-assets-v4';

// Archivos críticos que se cachean al instalar
const CRITICAL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// =======================
// INSTALAR Service Worker
// =======================
self.addEventListener('install', event => {
  console.log('🔧 Service Worker v4 instalándose...');
  
  event.waitUntil(
    (async () => {
      try {
        // Cachear archivos críticos
        const cache = await caches.open(CACHE_NAME);
        await cache.addAll(CRITICAL_ASSETS).catch(err => {
          console.warn('⚠️ Algunos archivos críticos no pudieron cachearse:', err);
        });
        console.log('✅ Archivos críticos cacheados');
        
        // Forzar activación inmediata
        self.skipWaiting();
      } catch (error) {
        console.error('❌ Error durante install:', error);
      }
    })()
  );
});

// ===========================
// ACTIVAR Service Worker
// ===========================
self.addEventListener('activate', event => {
  console.log('🚀 Service Worker v4 activándose...');
  
  event.waitUntil(
    (async () => {
      try {
        // Limpiar cachés antiguos
        const cacheNames = await caches.keys();
        const cachesToDelete = cacheNames.filter(name => 
          !name.includes('poes-v4')
        );
        
        await Promise.all(
          cachesToDelete.map(name => {
            console.log(`🗑️  Eliminando caché antiguo: ${name}`);
            return caches.delete(name);
          })
        );
        
        // Tomar control de clientes
        self.clients.claim();
        console.log('✅ Service Worker v4 activo y controlando clientes');
      } catch (error) {
        console.error('❌ Error durante activate:', error);
      }
    })()
  );
});

// ==================
// FETCH - Estrategias
// ==================
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignorar peticiones no-GET
  if (request.method !== 'GET') {
    return;
  }

  // Permitir cross-origin si es necesario
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return;
  }

  // ESTRATEGIA POR TIPO DE ARCHIVO
  
  // 1. Archivos estáticos (JS, CSS, fuentes, imágenes) - CACHE FIRST
  if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirst(request, ASSET_CACHE));
  }
  
  // 2. Documentos HTML - NETWORK FIRST CON CACHE FALLBACK
  else if (url.pathname.endsWith('.html') || url.pathname === '/') {
    event.respondWith(networkFirst(request, RUNTIME_CACHE));
  }
  
  // 3. API/Datos - NETWORK FIRST
  else if (url.pathname.includes('/api/')) {
    event.respondWith(networkFirst(request, RUNTIME_CACHE));
  }
  
  // 4. Data URIs y otros - CACHE FIRST
  else if (url.protocol === 'data:') {
    return;
  }
  
  // 5. Otros (imágenes, etc.) - STALE WHILE REVALIDATE
  else {
    event.respondWith(staleWhileRevalidate(request, ASSET_CACHE));
  }
});

// ========================
// ESTRATEGIA: CACHE FIRST
// ========================
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  if (cached) {
    console.log(`📦 Cache hit: ${request.url}`);
    return cached;
  }

  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone()).catch(err => {
        console.warn(`⚠️ No se pudo cachear ${request.url}:`, err);
      });
      console.log(`💾 Cacheado: ${request.url}`);
    }
    
    return response;
  } catch (error) {
    console.error(`❌ Fetch failed for ${request.url}:`, error);
    const offlineResponse = await cache.match(request);
    
    if (offlineResponse) {
      console.log(`📦 Sirviendo desde caché (offline): ${request.url}`);
      return offlineResponse;
    }
    
    return new Response('Offline - Archivo no disponible', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// ==========================
// ESTRATEGIA: NETWORK FIRST
// ==========================
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  
  try {
    const response = await Promise.race([
      fetch(request),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 5000)
      )
    ]);
    
    if (response.ok) {
      cache.put(request, response.clone()).catch(err => {
        console.warn(`⚠️ No se pudo cachear ${request.url}:`, err);
      });
      console.log(`🌐 Network update: ${request.url}`);
    }
    
    return response;
  } catch (error) {
    console.warn(`⚠️ Network error for ${request.url}, using cache:`, error.message);
    const cached = await cache.match(request);
    
    if (cached) {
      console.log(`📦 Serving from cache: ${request.url}`);
      return cached;
    }
    
    // Página de offline amigable
    if (request.destination === 'document') {
      return new Response(
        `<!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Offline</title>
          <style>
            body { font-family: sans-serif; text-align: center; padding: 50px; background: #f5f5f5; }
            h1 { color: #666; }
            p { color: #999; }
          </style>
        </head>
        <body>
          <h1>📡 Sin conexión</h1>
          <p>Tu app está funcionando sin internet.</p>
          <p>Los cambios se guardarán localmente.</p>
        </body>
        </html>`,
        { 
          status: 200,
          statusText: 'OK',
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        }
      );
    }
    
    return new Response('Offline', { status: 503 });
  }
}

// ================================
// ESTRATEGIA: STALE WHILE REVALIDATE
// ================================
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone()).catch(err => {
        console.warn(`⚠️ No se pudo cachear ${request.url}:`, err);
      });
      console.log(`🔄 Revalidado: ${request.url}`);
    }
    return response;
  }).catch(error => {
    console.warn(`⚠️ Revalidate failed: ${request.url}`);
    return cached || new Response('Offline', { status: 503 });
  });

  return cached || fetchPromise;
}

// ==========================
// HELPERS
// ==========================
function isStaticAsset(pathname) {
  return /\.(js|css|woff|woff2|ttf|eot|svg|png|jpg|jpeg|gif|webp)(\?.*)?$/.test(pathname);
}

// ==============================
// MENSAJES DEL CLIENTE
// ==============================
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('⏭️  Saltando espera, activando nueva versión...');
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    console.log('🗑️  Limpiando caché...');
    caches.keys().then(names => {
      names.forEach(name => {
        if (name.includes('poes')) {
          caches.delete(name);
        }
      });
    });
  }
});
