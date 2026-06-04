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
              console.log('📢 Nueva versión disponible. Recarga para actualizar.');
              
              // Mostrar notificación al usuario (opcional)
              if (window.confirm('Nueva versión disponible. ¿Actualizar ahora?')) {
                newWorker.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
              }
            }
          });
        });
      })
      .catch(error => {
        console.error('❌ Error al registrar Service Worker:', error);
      });

    // Recargar cuando el SW toma control de una nueva versión
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('🔄 Service Worker actualizado. Recargando...');
      window.location.reload();
    });
  });
  
  // Listeners adicionales para diagnóstico
  navigator.serviceWorker.addEventListener('error', event => {
    console.error('❌ Error en Service Worker:', event.error);
  });
}
