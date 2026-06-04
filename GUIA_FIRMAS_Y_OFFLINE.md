# 🔐 Selección de Firmas + Offline Completo

## ✅ CAMBIOS IMPLEMENTADOS

### 1️⃣ **Sistema de Selección de Firmas**
- Dropdown con dos opciones precargadas:
  - 📝 **Johanna López**
  - 📝 **Nicolas Acosta TR**
- Al seleccionar, la firma aparece **automáticamente**
- Opción de cargar imagen personalizada o dibujar

### 2️⃣ **Service Worker v4 - Offline Completo**
- ✅ Cachea todo al primer acceso
- ✅ Funciona 100% sin internet
- ✅ Timeout de 5 segundos en peticiones (no espera eternamente)
- ✅ Página de offline amigable
- ✅ Mejor detección de conexión

---

## 📱 PASO 1: LIMPIAR EL NAVEGADOR (importante!)

Esto es **MUY IMPORTANTE** para que el Service Worker v4 funcione:

### **En iPhone (Safari):**
1. **Ajustes** → **Safari**
2. **Privacidad** → **Eliminar historial y datos**
3. Selecciona:
   - ☑️ Historial
   - ☑️ Cookies y datos
4. Toca **"Eliminar historial y datos"**
5. Cierra Safari completamente

### **En Android (Chrome):**
1. **Chrome** → Menú ⋮
2. **Ajustes** → **Privacidad y seguridad**
3. **Borrar datos de navegación**
4. Selecciona:
   - ☑️ Cookies, datos del sitio
   - ☑️ Imágenes en caché
5. Toca **"Borrar datos"**

### **En PC (Chrome/Firefox):**
- **Ctrl + Shift + Delete** (Windows)
- **Cmd + Shift + Delete** (Mac)
- Selecciona **"Cookies y otros datos del sitio"**
- Toca **"Borrar datos"**

---

## 🚀 PASO 2: ACCEDER A LA APP CON EL SERVICE WORKER NUEVO

1. **Abre un navegador** y ve a:
   ```
   http://192.168.150.67:3000
   ```

2. **ESPERA 5-10 segundos** mientras el navegador:
   - Descarga los archivos
   - Registra el Service Worker v4
   - Cachea todo

3. **Abre la Consola del Navegador** (F12) para verificar:
   ```
   ✅ Service Worker registrado
   🔧 Service Worker v4 instalándose...
   ✅ Archivos críticos cacheados
   🚀 Service Worker v4 activo
   💾 Cacheado: /assets/...
   📡 App lista para funcionar sin internet
   ```

---

## 📝 PASO 3: USAR EL SELECTOR DE FIRMAS

### **Primera vez que usas:**

1. **Completa el formulario** (datos de la auditoría)
2. **Baja hasta las firmas** (al final)
3. Verás dos botones:
   - 📝 **Johanna López**
   - 📝 **Nicolas Acosta TR**

4. **Selecciona una firma:**
   - Haz clic en el nombre
   - La firma aparecerá automáticamente
   - Se guardará en la app

5. **Repite para la otra firma**

### **Opciones adicionales:**

Si quieres cambiar la firma:
- Haz clic en la **X roja** para borrar
- Puedes seleccionar otra, cargar una imagen, o dibujar

---

## 🌐 PASO 4: VERIFICAR QUE FUNCIONA OFFLINE

### **Prueba 1: En la app (conectado)**
1. **Carga la página completamente**
2. **Abre DevTools** (F12)
3. **Verifica en Console:**
   - Deberías ver: `📡 App lista para funcionar sin internet`

### **Prueba 2: Simular offline en PC**
1. **DevTools abierto** (F12)
2. **Network tab**
3. **Busca "Offline"** (dropdown que dice "No throttling")
4. **Selecciona "Offline"**
5. **Recarga la página** (F5)
6. ✅ **La app sigue funcionando** (sin internet)

### **Prueba 3: En el iPhone (real)**
1. **Abre la app** (ya cargada)
2. **Desactiva WiFi** desde Control Center
3. ✅ **La app sigue funcionando**
4. **Prueba escribir datos** → Se guardan localmente
5. **Vuelve a activar WiFi** → Los datos se sincronizan

---

## 🔧 PASO 5: SI EL OFFLINE NO FUNCIONA

**Problema:** Aparece "Offline - No hay conexión"

**Soluciones:**

### **A. El Service Worker no está registrado**
- [ ] Limpia el caché (paso 1)
- [ ] Recarga la página (Ctrl+F5 o ⌘+Shift+R)
- [ ] Espera 10 segundos
- [ ] Verifica DevTools → Console

### **B. Service Worker está pero no cachea**
- [ ] Abre **DevTools** → **Application**
- [ ] Ve a **Service Workers**
- [ ] Verifica que diga: `running` (no "stopped")
- [ ] Si está rojo/stopped:
  - Haz clic en **"Unregister"**
  - Recarga la página
  - Espera a que se registre de nuevo

### **C. El caché está dañado**
- [ ] En **DevTools** → **Application** → **Cache Storage**
- [ ] Busca **"poes-v4"**
- [ ] Haz clic derecho → **Delete**
- [ ] Recarga la página (la app recacheará todo)

---

## 📋 PASO 6: VERIFICAR QUE ESTÁ GUARDADO

Para asegurarte de que todo se está guardando correctamente:

### **En DevTools:**
1. **Application** tab
2. **Local Storage**
3. Busca: `audit_master_final_v110`
4. Deberías ver tus datos guardados (JSON)

### **En DevTools Console:**
Escribe:
```javascript
JSON.parse(localStorage.getItem('audit_master_final_v110'))
```

Deberías ver tu información de auditoría.

---

## ✅ CHECKLIST: OFFLINE FUNCIONA

- [ ] Service Worker está registrado (console: ✅ Service Worker registrado)
- [ ] Aparece: `📡 App lista para funcionar sin internet`
- [ ] Puedo desactivar WiFi y la app funciona
- [ ] Las firmas aparecen sin problemas
- [ ] Los datos se guardan localmente
- [ ] Cuando reactivo WiFi, los datos persisten

---

## 🐛 TROUBLESHOOTING OFFLINE

### **P: ¿Por qué sigue diciendo "sin conexión" en offline?**
R: Es normal. Solo significa que no hay red. Los datos se guardan igual en localStorage.

### **P: ¿Dónde se guardan los datos offline?**
R: En **localStorage** del navegador (incluye firmas, datos de auditoría, etc.)

### **P: ¿Se sincroniza cuando vuelve internet?**
R: No automáticamente. Pero los datos persisten. Cuando conectes nuevamente, los datos siguen ahí.

### **P: ¿Cuánto espacio tengo offline?**
R: Típicamente 5-50 MB dependiendo del navegador. Para esta app, es más que suficiente.

### **P: ¿Si borro los datos del navegador, pierdo todo?**
R: Sí, se pierde lo que estaba en localStorage. Por eso: **Guarda al historial ANTES de borrar datos.**

### **P: ¿Cómo hago backup de mis auditorías?**
R: Guarda al historial → Imprime como PDF → Guarda el PDF

---

## 🎯 FLUJO COMPLETO (paso a paso)

```
1. Limpia caché del navegador
   ↓
2. Carga http://192.168.150.67:3000
   ↓
3. Espera 10 segundos (registrando SW)
   ↓
4. Completa formulario + selecciona firma
   ↓
5. Desactiva WiFi (prueba offline)
   ↓
6. App sigue funcionando ✅
   ↓
7. Vuelve a activar WiFi
   ↓
8. Los datos persisten ✅
```

---

## 📞 DEBUGGING AVANZADO

Si necesitas ver qué está pasando:

**En DevTools → Console, escribe:**

```javascript
// Ver si SW está registrado
navigator.serviceWorker.controller

// Ver versión del SW
navigator.serviceWorker.controller?.scriptURL

// Limpiar caché manualmente
caches.keys().then(names => names.forEach(n => caches.delete(n)))

// Ver localStorage
Object.keys(localStorage)
```

---

## ✨ DESPUÉS DE ESTO

Una vez que el offline funcione:
1. ✅ La app es 100% funcional sin internet
2. ✅ Las firmas se cargan con un clic
3. ✅ Todo se cachea automáticamente
4. ✅ Puedes trabajar en el campo sin WiFi
5. ✅ Los datos se guardan localmente

¡Tu app está lista para producción! 🚀

