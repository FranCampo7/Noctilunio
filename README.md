# NOCTILUNIO — Sitio Oficial

## Estructura del proyecto

```
noctilunio/
├── index.html          ← SPA principal (única página)
├── css/
│   └── main.css        ← TODO el CSS centralizado (variables, secciones, responsive)
├── js/
│   └── main.js         ← TODO el JS (nav, galería, merch, fanzine, formularios)
├── fotos fondo/        ← Imágenes del slideshow del fondo (fondo1.webp, fondo2.webp, fondo3.webp)
├── fotos-shows/        ← Carpetas por show, cada una con portada.webp + 1.webp, 2.webp...
│   ├── chili/
│   ├── terraza/
│   ├── grabacion/
│   ├── bela/
│   ├── sesion/
│   ├── petalos/
│   ├── aparece/
│   ├── mundo-feliz/
│   ├── alejandria/
│   └── casi-cultural/
├── remeras/            ← Imágenes de remeras (PNG o WebP)
├── totebags/           ← Imágenes de totebags (PNG o WebP)
├── fanzine/            ← PDFs del fanzine (1.pdf, 2.pdf ... 16.pdf)
├── assets/
│   └── integrantes/    ← Fotos individuales (camila.webp, francisco.webp, maciel.webp)
└── logo.PNG
```

---

## ⚙️ Configuraciones necesarias antes de publicar

### 1. Formulario de contacto — Formspree (GRATIS)

1. Creá una cuenta en https://formspree.io
2. Creá un nuevo formulario
3. Copiá tu endpoint (ej: `https://formspree.io/f/xpwzabcd`)
4. En `index.html`, buscá la línea:
   ```html
   <form id="formContacto" action="https://formspree.io/f/TU_FORM_ID"
   ```
   Reemplazá `TU_FORM_ID` por tu ID real.

---

### 2. Emails del Merch — EmailJS (GRATIS hasta 200 emails/mes)

1. Creá una cuenta en https://emailjs.com
2. Conectá tu cuenta de Gmail (`noctilunio@gmail.com`)
3. Creá **dos templates**:

   **Template 1 — para la banda** (`TEMPLATE_BANDA`):
   ```
   Nuevo pedido de {{nombre}}
   Producto: {{producto}}
   Precio: {{precio}}
   Talle: {{talle}}
   Email: {{email}}
   Tel/WA: {{tel}}
   Notas: {{notas}}
   Alias de pago: {{alias}}
   ```

   **Template 2 — para el cliente** (`TEMPLATE_CLIENTE`):
   ```
   Hola {{nombre}}, ¡gracias por tu compra!
   Recibimos tu pedido: {{producto}} — {{precio}}
   Realizá el pago al ALIAS: NOCTILUNIO
   Te contactamos en 24hs para coordinar la entrega.
   — Noctilunio
   ```

4. En `index.html` reemplazá `TU_PUBLIC_KEY` con tu Public Key de EmailJS:
   ```html
   emailjs.init('TU_PUBLIC_KEY');
   ```

5. En `js/main.js` reemplazá los placeholders:
   ```js
   'SERVICE_ID'       → tu Service ID de EmailJS
   'TEMPLATE_BANDA'   → ID del template para la banda
   'TEMPLATE_CLIENTE' → ID del template de confirmación
   ```

---

### 3. Audio — Convertir WAV a MP3

El archivo `Vamos a Jugar.wav` pesa 83MB. **No subir el WAV a producción.**

Convertir con ffmpeg (recomendado):
```bash
ffmpeg -i "Vamos a Jugar.wav" -q:a 2 "vamos-a-jugar.mp3"
```
O usar un conversor online: https://cloudconvert.com/wav-to-mp3

Luego en `index.html` actualizá:
```html
<source src="vamos-a-jugar.mp3" type="audio/mpeg">
```

---

### 4. Fotos de integrantes

Cuando tengan las fotos actualizadas de Cami, reemplazar en `index.html` el bloque:
```html
<div class="member-photo-placeholder">...</div>
```
Por:
```html
<img class="member-photo" src="assets/integrantes/camila.webp" alt="Camila Campodonico — Bajista y Vocalista">
```

Hacer lo mismo para Francisco y Maciel con sus respectivas rutas.

---

### 5. Galerías de fotos

Cada álbum necesita:
- Una imagen `portada.webp` en su carpeta
- Fotos numeradas: `1.webp`, `2.webp`, etc.

En `index.html`, en la sección `#fotos`, el tercer parámetro del `onclick` es la **cantidad de fotos**:
```html
onclick="abrirGaleria('CHILI', 'fotos-shows/chili/', 45)"
                                                       ↑ cantidad real de fotos
```
Actualizá ese número para cada álbum.

---

### 6. Shows

Cuando haya fechas confirmadas, en la sección `#shows` de `index.html`:

```html
<!-- Con entrada por PassLine -->
<div class="show-card">
  <div class="show-date-block">
    <div class="show-day">15</div>
    <div class="show-month">AGO</div>
  </div>
  <div class="show-info">
    <h3 class="show-venue">NOMBRE DEL LUGAR</h3>
    <p class="show-city">Córdoba · Puertas: 21:00 hs</p>
    <div class="show-actions">
      <a href="https://passline.com/..." target="_blank" class="btn-show btn-show--primary">ENTRADAS</a>
    </div>
  </div>
</div>

<!-- Entrada libre -->
<div class="show-card">
  ...
  <span class="btn-show btn-show--ghost" style="cursor:default;">ENTRADA LIBRE</span>
</div>

<!-- A la gorra / en puerta -->
<span class="btn-show btn-show--ghost" style="cursor:default;">EN PUERTA</span>
```

---

### 7. Prensa

En la sección `#prensa`, reemplazá los 3 cards placeholder con los datos reales:
```html
<div class="prensa-card">
  <p class="prensa-medio">NOMBRE DEL MEDIO</p>
  <p class="prensa-titulo">Titular de la nota</p>
  <div class="prensa-footer">
    <span class="prensa-fecha">Marzo 2025</span>
    <a href="https://link-a-la-nota.com" target="_blank" class="btn-prensa">LEER NOTA</a>
  </div>
</div>
```

---

## 🚀 Publicar en Netlify

1. Subí toda la carpeta del proyecto a GitHub (repo privado o público)
2. En https://netlify.com → "Add new site" → "Import from Git"
3. Seleccioná el repo, build command vacío, publish directory: `.` (raíz)
4. Deploy → listo.

No necesita build pipeline. Netlify sirve los archivos HTML/CSS/JS directamente.

---

## 📝 Notas de mantenimiento

- **Cambiar color de acento:** `css/main.css` → buscar `--color-accent: #c996e3`
- **Cambiar bio:** `index.html` → sección `#noctilunio` → párrafo `.bio-text`
- **Agregar producto merch:** copiar un bloque `<div class="product-card">` existente
- **Agregar video YouTube:** copiar un `.video-card` y actualizar el ID de YouTube en la URL de la imagen y el onclick
- **Agregar página fanzine:** cambiar `const FANZINE_TOTAL = 16` en `js/main.js`

