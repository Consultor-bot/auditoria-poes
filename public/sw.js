const CACHE_NAME = 'poes-v3';
const RUNTIME_CACHE = 'poes-runtime-v3';
const ASSET_CACHE = 'poes-assets-v3';

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
  console.log('🔧 Service Worker instalándose...');
  
  event.waitUntil(
    (async () => {
      try {
        // Cachear archivos críticos
        const cache = await caches.open(CACHE_NAME);
        await cache.addAll(CRITICAL_ASSETS);
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
  console.log('🚀 Service Worker activándose...');
  
  event.waitUntil(
    (async () => {
      try {
        // Limpiar cachés antiguos
        const cacheNames = await caches.keys();
        const cachesToDelete = cacheNames.filter(name => 
          name !== CACHE_NAME && 
          name !== RUNTIME_CACHE && 
          name !== ASSET_CACHE
        );
        
        await Promise.all(
          cachesToDelete.map(name => {
            console.log(`🗑️  Eliminando caché antiguo: ${name}`);
            return caches.delete(name);
          })
        );
        
        // Tomar control de clientes
        self.clients.claim();
        console.log('✅ Service Worker activo y controlando clientes');
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

  // Ignorar solicitudes a dominios externos
  if (url.origin !== self.location.origin) {
    return;
  }

  // ESTRATEGIA POR TIPO DE ARCHIVO
  
  // 1. Archivos estáticos (JS, CSS, fuentes) - CACHE FIRST
  if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirst(request, ASSET_CACHE));
  }
  
  // 2. Documentos HTML - NETWORK FIRST
  else if (url.pathname.endsWith('.html') || url.pathname === '/') {
    event.respondWith(networkFirst(request, RUNTIME_CACHE));
  }
  
  // 3. API/Datos - NETWORK FIRST
  else if (url.pathname.includes('/api/')) {
    event.respondWith(networkFirst(request, RUNTIME_CACHE));
  }
  
  // 4. Otros (imágenes, etc.) - STALE WHILE REVALIDATE
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
      cache.put(request, response.clone());
      console.log(`💾 Cacheado: ${request.url}`);
    }
    
    return response;
  } catch (error) {
    console.error(`❌ Fetch failed for ${request.url}:`, error);
    const offlineResponse = await cache.match(request);
    
    if (offlineResponse) {
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
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
      console.log(`🌐 Network update: ${request.url}`);
    }
    
    return response;
  } catch (error) {
    console.warn(`⚠️  Network error for ${request.url}, using cache`);
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    
    if (cached) {
      console.log(`📦 Serving from cache: ${request.url}`);
      return cached;
    }
    
    return new Response('Offline - No hay conexión', {
      status: 503,
      statusText: 'Service Unavailable'
    });
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
      cache.put(request, response.clone());
      console.log(`🔄 Revalidado: ${request.url}`);
    }
    return response;
  }).catch(error => {
    console.warn(`⚠️  Revalidate failed: ${request.url}`);
    return cached || new Response('Offline', { status: 503 });
  });

  return cached || fetchPromise;
}

// ==========================
// HELPERS
// ==========================
function isStaticAsset(pathname) {
  return /\.(js|css|woff|woff2|ttf|eot|svg)(\?.*)?$/.test(pathname);
}

// ==============================
// MENSAJES DEL CLIENTE
// ==============================
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('⏭️  Saltando espera, activando nueva versión...');
    self.skipWaiting();
  }
});
