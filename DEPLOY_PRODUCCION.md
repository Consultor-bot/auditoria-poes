# 📱 Guía de Uso - App POES en Producción (Campo)

## ✅ Lo que está configurado

Tu app ahora está lista para usarse **sin depender del PC**:
- ✅ Archivos optimizados para producción (carpeta `dist`)
- ✅ Service Worker para trabajar sin internet
- ✅ PWA (Progressive Web App) instalable en el celular
- ✅ Firewall configurado para conexión desde la red

---

## 🚀 Cómo usar en el campo

### **Opción 1: Desde la red WiFi (SIN internet)**

1. **Asegurate que el servidor está corriendo** (debe estar viendo):
   ```
   Available on:
   http://192.168.150.67:3000
   ```

2. **En tu celular (iPhone/Android)**, abre Safari o Chrome y ve a:
   ```
   http://192.168.150.67:3000
   ```

3. **Descarga la app** (solo la primera vez):
   - iPhone: Toca el icono de compartir → "Agregar a pantalla de inicio"
   - Android: Toca el menú ⋮ → "Instalar app"

4. **Listo!** Abrirás la app como si fuera nativa

### **Opción 2: Después de descargarla**

Una vez descargada, **la app funciona SIN internet**:
- El Service Worker guarda los datos en caché
- Puedes trabajar en el campo sin WiFi
- Cuando regreses al WiFi, se sincroniza automáticamente

---

## 💾 Comando para servir la app

Si necesitas reiniciar el servidor:

```cmd
cd c:\Users\Nicolas Acosta\auditoria-poes
cmd.exe /c "cd c:\Users\Nicolas Acosta\auditoria-poes && npx http-server dist -p 3000 -c-1 --gzip"
```

O simplemente (si está en la terminal):
```
npm run serve  # Nota: esto usa puerto 5173
```

---

## 🔧 Si necesitas hacer cambios

1. **Modifica el código** en la carpeta `src/`
2. **Reconstruye la app**:
   ```cmd
   npm run build
   ```
3. **Reinicia el servidor** (Ctrl+C y ejecuta el comando anterior)
4. **Actualiza en el celular** (F5 o desliza hacia abajo)

---

## 🛡️ Cortafuegos

Ya está configurado para permitir conexiones desde la red. Si alguien más no puede acceder:
- Verifica que esté en la **misma WiFi**
- Usa la IP **192.168.150.67:3000**
- Si sigue sin funcionar, ejecuta en PowerShell como Admin:
  ```powershell
  New-NetFirewallRule -DisplayName "App POES" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 3000
  ```

---

## 📊 Estado de la app

- **Versión**: 0.1.0
- **Build**: Producción (optimizado)
- **Puerto**: 3000
- **Cache**: Habilitado (funciona sin internet)
- **PWA**: Instalable ✅

---

¡Listo para llevar a campo! 🌾

