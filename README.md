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



### Shows

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


## 📝 Notas de mantenimiento

- **Cambiar color de acento:** `css/main.css` → buscar `--color-accent: #c996e3`
- **Cambiar bio:** `index.html` → sección `#noctilunio` → párrafo `.bio-text`
- **Agregar producto merch:** copiar un bloque `<div class="product-card">` existente
- **Agregar video YouTube:** copiar un `.video-card` y actualizar el ID de YouTube en la URL de la imagen y el onclick
- **Agregar página fanzine:** cambiar `const FANZINE_TOTAL = 16` en `js/main.js`

