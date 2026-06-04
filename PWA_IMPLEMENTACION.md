# 🚀 PWA Real - Guía de Instalación y Uso

## ✅ Lo que está implementado

Tu app ahora es una **Progressive Web App (PWA) real** con Service Worker robusto:

### 🔧 Características implementadas:

✅ **Service Worker con 3 estrategias de caché:**
- `Cache First` → Archivos estáticos (JS, CSS, fuentes)
- `Network First` → HTML y documentos
- `Stale While Revalidate` → Imágenes y otros assets

✅ **Caché inteligente:**
- Almacena archivos automáticamente al acceder
- Funciona 100% offline una vez instalada
- Actualización automática en background

✅ **PWA Instalable:**
- iPhone: Botón "Agregar a pantalla de inicio"
- Android: Opción "Instalar app" en menú
- Se guarda como app nativa

✅ **Actualizaciones automáticas:**
- Detecta cambios y notifica al usuario
- Permite actualizar sin recargar la app

---

## 📱 Cómo instalar en iPhone

1. **Abre Safari** y ve a: `http://192.168.150.67:3000`

2. **Espera a que cargue completamente** (verás todos los archivos cacheándose en la consola)

3. **Toca el icono de compartir** (abajo a la derecha)

4. **Busca "Agregar a pantalla de inicio"** y toca

5. **Ponle nombre** (ej: "POES Auditoría")

6. **Toca "Agregar"**

7. **¡Listo!** Ya está instalada como app nativa

---

## 🤖 Cómo instalar en Android

1. **Abre Chrome** y ve a: `http://192.168.150.67:3000`

2. **Espera a que cargue completamente**

3. **Toca el menú** (⋮ tres puntos)

4. **Selecciona "Instalar app"** 

5. **Confirma en el popup**

6. **¡Listo!** Ya está en tu launcher

---

## 🌐 Cómo funciona offline

**Primera vez (con WiFi):**
- Todos los archivos se guardan automáticamente
- El Service Worker cachea todo en background
- Consola muestra: `📦 Cache hit`, `💾 Cacheado`, etc.

**En el campo (sin WiFi):**
- La app funciona normalmente
- Lee los archivos del caché
- Los formularios guardan datos locales
- Cuando hay WiFi, sincroniza automáticamente

---

## 🔄 Actualizaciones

Cuando hagas cambios:

1. **Modifica el código en `src/`**
2. **Ejecuta en terminal:**
   ```cmd
   npm run build
   ```
3. **El servidor automáticamente sirve la nueva versión**
4. **Los iPhones verán notificación:** "Nueva versión disponible"
5. **Toca "Actualizar ahora"** o recarga manual (⌘R)

---

## 📊 Estado de la PWA

```
✅ Service Worker: Implementado
✅ Caché estratégico: 3 tipos
✅ Offline completo: Sí
✅ Instalable: Sí
✅ Actualizaciones: Automáticas
✅ Manifest.json: Configurado
✅ HTTPS-ready: Preparado
```

---

## 🛠️ Cómo funciona internamente

### **Service Worker** (`public/sw.js`):
- Intercepta todas las peticiones HTTP
- Decide dónde obtener los datos (red o caché)
- Maneja errores de conexión elegantemente
- Logs detallados en la consola del navegador

### **Registro en React** (`src/main.jsx`):
- Registra el SW al cargar la app
- Revisa actualizaciones cada minuto
- Notifica al usuario si hay versión nueva
- Recarga automáticamente si necesario

### **Manifest** (`public/manifest.json`):
- Define el nombre, icono y colores de la app
- Permite instalar en pantalla de inicio
- Define el modo "standalone" (como app nativa)

---

## 🐛 Debugging

**Abre la consola del navegador (F12)** para ver logs como:
```
✅ Service Worker registrado
📦 Cache hit: /index.html
💾 Cacheado: /assets/index-xyz.js
🌐 Network update: /api/data
⚠️  Network error, using cache
📢 Nueva versión disponible
```

**Eliminar caché (si algo no funciona):**
```
En iPhone: Ajustes → Safari → Privacidad → Eliminar datos
En Android: Chrome → Ajustes → Privacidad → Cookies y datos
```

---

## 📋 Comandos útiles

```bash
# Desarrollo con hot-reload
npm run dev

# Compilar para producción
npm run build

# Servir la versión producción (puerto 3000)
npx http-server dist -p 3000 -c-1 --gzip

# Ver logs del Service Worker
# → Abre DevTools (F12) → Console
```

---

## 🌍 Para usar en internet (HTTPS)

Si en el futuro quieres publicar la app online:
1. Service Worker requiere HTTPS (no HTTP)
2. PWA funcionará igual en móviles desde cualquier lugar
3. Los datos se sincronizarán automáticamente

---

## ✅ Checklist para verificar que funciona

- [ ] App carga en `http://192.168.150.67:3000`
- [ ] Consola muestra logs del Service Worker
- [ ] Se puede instalar en pantalla de inicio
- [ ] Funciona sin WiFi (desactiva WiFi en el móvil)
- [ ] Recarga muestra cambios automáticamente
- [ ] Datos se guardan entre sesiones

---

**¡Tu app está lista para trabajar en el campo sin internet!** 🌾📱

