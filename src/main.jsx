import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// ==========================
// Registrar Service Worker
// ==========================
if ('serviceWorker' in navigator) {
  // Esperar a que la app esté completamente cargada
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then(registration => {
        console.log('✅ Service Worker registrado:', registration);
        console.log('📡 App lista para funcionar sin internet');

        // Revisar actualizaciones periódicamente
        setInterval(() => {
          registration.update();
        }, 60000); // Cada minuto

        // Escuchar si hay una actualización disponible
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Nueva versión disponible
              console.log('📢 Nueva versión disponible');
              
              // Notificar al usuario (opcional)
              const shouldUpdate = window.confirm('Hay una actualización disponible. ¿Descargarla ahora?');
              if (shouldUpdate) {
                newWorker.postMessage({ type: 'SKIP_WAITING' });
              }
            }
          });
        });
      })
      .catch(error => {
        console.error('⚠️ Error al registrar Service Worker:', error);
        console.warn('La app funcionará pero sin soporte offline');
      });

    // Recargar cuando el SW toma control de una nueva versión
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('🔄 Service Worker actualizado');
    });
  });
  
  // Listeners adicionales para diagnóstico
  navigator.serviceWorker.addEventListener('error', event => {
    console.error('❌ Error en Service Worker:', event.error);
  });
  
  // Mostrar estado de conexión
  window.addEventListener('online', () => {
    console.log('🟢 Conexión establecida');
  });
  
  window.addEventListener('offline', () => {
    console.log('🔴 Sin conexión - La app sigue funcionando con caché');
  });
}
