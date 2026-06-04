# 📝 Guía Paso a Paso: Firmas e Impresión

## ✅ CAMBIOS IMPLEMENTADOS

Tu app ahora tiene:
- ✅ Dos espacios para firmas: **Johanna López** y **Nicolas Acosta TR**
- ✅ Opción de cargar imágenes de firmas (no solo dibujar)
- ✅ CSS mejorado para impresión (sin cortes)
- ✅ Imágenes optimizadas para impresión

---

## 📱 PASO 1: Preparar las imágenes de firmas

**Tienes las firmas que compartiste. Aquí está cómo procesarlas:**

### **Opción A: En Windows (recomendado)**
1. Busca las imágenes en tu escritorio o carpeta de descargas
2. Si son fotos de un papel: 
   - Abre **Paint** (Inicio → Paint)
   - Abre la imagen
   - Recorta solo la firma (sin mucho fondo blanco)
   - Guarda como PNG (Archivo → Guardar como → PNG)
3. Mueve las imágenes a:
   ```
   C:\Users\Nicolas Acosta\auditoria-poes\src\assets\
   ```
   - Nómbralas: `firma_johanna.png` y `firma_nicolas.png`

### **Opción B: Usar Online (si no tienes las imágenes)**
1. Abre un editor online como: **https://pixlr.com/editor**
2. Crea una imagen nueva (200x100 px)
3. Escribe la firma (o pega la imagen)
4. Descarga como PNG
5. Mueve a `src/assets/`

---

## 🖼️ PASO 2: Cargar las firmas en la APP

### **Primera vez en la app:**

1. **Abre la app en tu navegador:**
   ```
   http://192.168.150.67:3000
   ```

2. **Ve a la sección de firmas** (al final del formulario)

3. **Para cada firma:**
   - Verás dos espacios: "Firma: Johanna López" y "Firma: Nicolas Acosta TR"
   - Si quieres dibujar:
     - Dibuja en el canvas (pantalla en blanco)
     - Toca "Guardar" automáticamente
   - Si quieres cargar una imagen:
     - Haz clic en **"O cargar imagen de firma"** (botón azul)
     - Selecciona la imagen del archivo
     - ¡Listo! Se mostrará la imagen

4. **Guardado automático:**
   - La app guarda las firmas automáticamente en el navegador

---

## 🖨️ PASO 3: Imprimir SIN CORTES

### **En iPhone:**

1. **Abre la app**
2. **Completa todos los datos y firmas**
3. **Botón Compartir** (abajo) → **Imprimir**
4. **Selecciona:**
   - Orientación: **Horizontal** (mejor para tablas)
   - Escala: **Automática**
   - Márgenes: **Mínimos** (Settings)

5. **Vista previa:** Verifica que TODO se vea completo
6. **Imprime o guarda como PDF**

### **En Android (Chrome):**

1. **Abre la app**
2. **Menú ⋮ → Imprimir**
3. **Selecciona:**
   - Orientación: **Horizontal**
   - Papel: **Tamaño personalizado**
   - Márgenes: **Mínimos**

4. **Vista previa:** Verifica que TODO se vea
5. **Imprime o guarda como PDF**

### **En PC (Chrome/Firefox):**

1. **Presiona:** `Ctrl + P` (Windows) o `Cmd + P` (Mac)
2. **Destino:** "Imprimir a archivo" o PDF
3. **Orientación:** Horizontal
4. **Márgenes:** Mínimos
5. **Escala:** 100% (no ajustar)
6. **Imprime** ✅

---

## 🔧 PASO 4: Si las firmas siguen cortadas

**Problema:** Las imágenes se cortan en la impresión

**Solución:**

1. **Abre DevTools:** F12 en el PC
2. **Vuelve a imprimir:** Ctrl + P
3. **Aumenta los márgenes levemente** si es necesario
4. **Cambia a Horizontal** si estaba en Vertical

Si sigue cortándose:
- Las imágenes son muy grandes
- Vuelve a redimensionarlas a 400x150 píxeles máximo
- Prueba guardándolas en formato PNG (más comprimido)

---

## 📋 PASO 5: Verificar antes de Guardar

Antes de guardar al historial, verifica que:

- [ ] Firma Johanna López: Visible y completa
- [ ] Firma Nicolas Acosta: Visible y completa
- [ ] Tabla de criterios: No tiene saltos de página raros
- [ ] Todas las observaciones se ven al imprimir
- [ ] Las imágenes de fotos NO se cortan

---

## 💾 PASO 6: Guardar y Subir Cambios

Una vez que todo esté funcionando:

```cmd
cd C:\Users\Nicolas Acosta\auditoria-poes
git add .
git commit -m "feat: Agregar firmas de Johanna López y Nicolas Acosta"
git push
```

---

## 🆘 TROUBLESHOOTING

### **P: Las firmas no se guardan**
R: Borra el caché del navegador (Safari → Ajustes → Privacidad → Eliminar datos) o prueba en modo privado

### **P: La impresión sale borrosa**
R: Las imágenes están comprimidas. Aumenta la resolución (300 DPI en Print Settings)

### **P: Se corta en la impresión**
R: Cambia a Horizontal, márgenes mínimos, y 100% escala

### **P: ¿Cómo edito las firmas después?**
R: Haz clic en la firma guardada → botón rojo (❌) para borrar → carga una nueva

### **P: ¿Dónde se guardan las firmas?**
R: En el navegador (localStorage). Se pierden si borras datos del navegador.

---

## ✨ Tips Avanzados

### **Para mejor calidad de firma:**
- Usa PNG (mejor que JPG)
- Fondo blanco y firma negra
- Tamaño: 400x150 píxeles
- Sin mucho borde blanco alrededor

### **Para imprimir profesional:**
- Descarga como PDF desde el navegador
- Abre el PDF en **Acrobat Reader**
- Imprime desde Acrobat (mantiene mejor la calidad)

### **Sincronizar firmas entre dispositivos:**
- Descarga PDF del PC
- Envía por WhatsApp o email
- Abre en el iPhone para comparar

---

## 📞 Si necesitas ayuda:

1. Comparte un screenshot del problema
2. Dime qué sale cortado exactamente
3. Cuéntame qué dispositivo usas (iPhone/Android/PC)
4. Qué navegador (Safari/Chrome)

---

¡Listo! Tu app está completa con firmas e impresión profesional. 🎉

