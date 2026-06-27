/* =============================================
   NOCTILUNIO — JS PRINCIPAL
   ============================================= */

/* ============================================
   NAVEGACIÓN (SPA)
   ============================================ */
const sections     = document.querySelectorAll('.page-section');
const navLinks     = document.querySelectorAll('[data-section]');
const bgSlideshow  = document.querySelector('.bg-slideshow');
const mainContainer = document.querySelector('.main-container');

function irA(seccionId) {
  // Ocultar todas
  sections.forEach(s => s.classList.remove('active'));
  navLinks.forEach(a => a.classList.remove('active'));

  // Mostrar sección target
  const target = document.getElementById(seccionId);
  if (target) {
    target.classList.add('active');
    mainContainer.scrollTop = 0;
  }

  // Marcar links activos
  document.querySelectorAll(`[data-section="${seccionId}"]`).forEach(a => a.classList.add('active'));

  // Fondo más oscuro cuando no estamos en inicio
  bgSlideshow.classList.toggle('dim', seccionId !== 'inicio');

  // Cerrar menú mobile si está abierto
  closeMobileMenu();
}

// Navegación por URL hash al cargar
function handleHash() {
  const hash = window.location.hash.replace('#', '') || 'inicio';
  irA(hash);
}

window.addEventListener('hashchange', handleHash);

// Wiring de todos los links de navegación
document.addEventListener('click', e => {
  const link = e.target.closest('[data-section]');
  if (!link) return;
  e.preventDefault();
  const sec = link.dataset.section;
  history.pushState(null, '', `#${sec}`);
  irA(sec);
});

/* ============================================
   MENÚ MOBILE (HAMBURGER)
   ============================================ */
const hamburger  = document.getElementById('hamburger');
const navMobile  = document.getElementById('navMobile');

function closeMobileMenu() {
  hamburger.classList.remove('open');
  navMobile.classList.remove('open');
}

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMobile.classList.toggle('open');
});

/* ============================================
   GALERÍA DE FOTOS
   ============================================ */
let fotosActuales = [];
let indiceActual  = 0;

const modalGaleria = document.getElementById('modalGaleria');
const gridFotos    = document.getElementById('gridFotos');
const tituloGal    = document.getElementById('tituloGaleria');
const visorGrande  = document.getElementById('visorGrande');
const imgEnVisor   = document.getElementById('imgEnVisor');

function abrirGaleria(titulo, carpeta, cantidad) {
  tituloGal.textContent = titulo;
  gridFotos.innerHTML = '';
  fotosActuales = [];

  for (let i = 1; i <= cantidad; i++) {
    const ruta = `${carpeta}${i}.webp`;
    fotosActuales.push(ruta);

    const img = document.createElement('img');
    img.src     = ruta;
    img.loading = 'lazy';
    img.alt     = `${titulo} — foto ${i}`;
    img.onclick = () => abrirVisor(i - 1);
    gridFotos.appendChild(img);
  }

  modalGaleria.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function cerrarGaleria() {
  modalGaleria.classList.remove('open');
  document.body.style.overflow = '';
}

function abrirVisor(indice) {
  indiceActual = indice;
  imgEnVisor.src = fotosActuales[indiceActual];
  visorGrande.classList.add('open');
}

function cerrarVisor() {
  visorGrande.classList.remove('open');
}

function cambiarFoto(dir) {
  indiceActual = (indiceActual + dir + fotosActuales.length) % fotosActuales.length;
  imgEnVisor.src = fotosActuales[indiceActual];
}

// Teclado para el visor
document.addEventListener('keydown', e => {
  if (!visorGrande.classList.contains('open')) return;
  if (e.key === 'Escape')      cerrarVisor();
  if (e.key === 'ArrowRight')  cambiarFoto(1);
  if (e.key === 'ArrowLeft')   cambiarFoto(-1);
});

// Exponer funciones globalmente para onclick en HTML
window.abrirGaleria = abrirGaleria;
window.cerrarGaleria = cerrarGaleria;
window.cerrarVisor   = cerrarVisor;
window.cambiarFoto   = cambiarFoto;

/* ============================================
   MERCH — MODAL DE PEDIDO
   ============================================ */
const modalMerch      = document.getElementById('modalMerch');
const modalMerchTitle = document.getElementById('modalMerchTitle');
const modalMerchProduct = document.getElementById('modalMerchProduct');
const modalMerchPrice = document.getElementById('modalMerchPrice');
const formMerch       = document.getElementById('formMerch');
const formSuccessMsg  = document.getElementById('formSuccessMsg');

let productoActual = {};

function abrirPedido(nombre, precio) {
  productoActual = { nombre, precio };
  modalMerchTitle.textContent = 'PEDIDO';
  modalMerchProduct.textContent = nombre;
  modalMerchPrice.textContent = `$${precio.toLocaleString('es-AR')}`;
  formMerch.reset();
  formMerch.style.display = 'block';
  formSuccessMsg.style.display = 'none';
  modalMerch.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function cerrarModalMerch() {
  modalMerch.classList.remove('open');
  document.body.style.overflow = '';
}

window.abrirPedido     = abrirPedido;
window.cerrarModalMerch = cerrarModalMerch;

// Submit del formulario de merch — EmailJS
formMerch.addEventListener('submit', async e => {
  e.preventDefault();
  const btn = formMerch.querySelector('.btn-enviar');
  btn.disabled    = true;
  btn.textContent = 'ENVIANDO...';

  const datos = {
    nombre:    formMerch.nombre.value.trim(),
    email:     formMerch.email.value.trim(),
    tel:       formMerch.tel.value.trim(),
    talle:     formMerch.talle ? formMerch.talle.value : '—',
    producto:  productoActual.nombre,
    precio:    `$${productoActual.precio.toLocaleString('es-AR')}`,
    notas:     formMerch.notas.value.trim() || 'Sin notas',
  };

  try {
      await emailjs.send(
        'service_ix7jebq',
        'template_2g50y4b',  // ← tu ID real
        { ...datos, alias: 'noctilunio' }
      );

      // éxito
      formMerch.style.display = 'none';
      formSuccessMsg.style.display = 'block';

    // Éxito
    formMerch.style.display   = 'none';
    formSuccessMsg.style.display = 'block';

  } catch (err) {
    console.error('Error al enviar:', err);
    alert('Hubo un error al enviar el pedido. Por favor, intentá de nuevo o contactanos por Instagram.');
    btn.disabled    = false;
    btn.textContent = 'CONFIRMAR PEDIDO';
  }
});

/* ============================================
   FANZINE — VISOR PDF (PDF.js canvas)
   ============================================ */
const FANZINE_TOTAL = 16;
let fanzinePagina   = 1;
let fanzinePdfDoc   = null;
let fanzineRendering = false;

const fanzineCover   = document.getElementById('fanzineCover');
const fanzineReader  = document.getElementById('fanzineReader');
const fanzineCanvas  = document.getElementById('fanzineCanvas');
const fanzineLoading = document.getElementById('fanzineLoading');
const fanzinePageNum = document.getElementById('fanzinePageNum');
const btnPagePrev    = document.getElementById('btnPagePrev');
const btnPageNext    = document.getElementById('btnPageNext');
const btnFanzineOpen  = document.getElementById('btnFanzineOpen');
const btnFanzineClose = document.getElementById('btnFanzineClose');

// Cargar PDF.js dinámicamente cuando el usuario abre el visor
async function iniciarFanzine() {
  fanzineCover.style.display  = 'none';
  fanzineReader.style.display = 'block';

  if (!fanzinePdfDoc) {
    // Cargar PDF.js desde CDN si no está cargado
    if (!window.pdfjsLib) {
      await cargarScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }
    await cargarPaginaFanzine(1);
  }
}

function cargarScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

async function cargarPaginaFanzine(n) {
  if (fanzineRendering) return;
  fanzineRendering = true;
  fanzinePagina = n;

  fanzineLoading.classList.remove('hidden');
  fanzinePageNum.textContent = `Pág. ${n} / ${FANZINE_TOTAL}`;
  btnPagePrev.disabled = (n <= 1);
  btnPageNext.disabled = (n >= FANZINE_TOTAL);

  try {
    // Cada página del fanzine es un PDF separado
    const loadingTask = pdfjsLib.getDocument(`fanzine/${n}.pdf`);
    fanzinePdfDoc = await loadingTask.promise;

    const page = await fanzinePdfDoc.getPage(1);
    const ctx  = fanzineCanvas.getContext('2d');

    // Escalar al ancho disponible del contenedor
    const containerW = fanzineCanvas.parentElement.clientWidth || 680;
    const viewport0  = page.getViewport({ scale: 1 });
    const scale      = containerW / viewport0.width;
    const viewport   = page.getViewport({ scale });

    fanzineCanvas.width  = viewport.width;
    fanzineCanvas.height = viewport.height;

    await page.render({ canvasContext: ctx, viewport }).promise;

    fanzineLoading.classList.add('hidden');
  } catch (err) {
    console.error('Error al cargar PDF:', err);
    fanzineLoading.querySelector('span').textContent = 'Error al cargar la página.';
  }

  fanzineRendering = false;
}

function cerrarFanzine() {
  fanzineReader.style.display = 'none';
  fanzineCover.style.display  = 'flex';
}

btnFanzineOpen?.addEventListener('click', iniciarFanzine);
btnFanzineClose?.addEventListener('click', cerrarFanzine);

btnPagePrev?.addEventListener('click', () => {
  if (fanzinePagina > 1) cargarPaginaFanzine(fanzinePagina - 1);
});
btnPageNext?.addEventListener('click', () => {
  if (fanzinePagina < FANZINE_TOTAL) cargarPaginaFanzine(fanzinePagina + 1);
});

// Teclado en el fanzine
document.addEventListener('keydown', e => {
  if (fanzineReader?.style.display === 'none') return;
  if (e.key === 'ArrowRight' && fanzinePagina < FANZINE_TOTAL) cargarPaginaFanzine(fanzinePagina + 1);
  if (e.key === 'ArrowLeft'  && fanzinePagina > 1)             cargarPaginaFanzine(fanzinePagina - 1);
  if (e.key === 'Escape') cerrarFanzine();
});

// Anti-descarga
document.getElementById('fanzineViewer')?.addEventListener('contextmenu', e => e.preventDefault());

/* ============================================
   FORMULARIO DE CONTACTO (Formspree)
   ============================================ */
const formContacto   = document.getElementById('formContacto');
const formContactMsg = document.getElementById('formContactMsg');

if (formContacto) {
  formContacto.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = formContacto.querySelector('.btn-enviar');
    btn.disabled    = true;
    btn.textContent = 'ENVIANDO...';

    const data = new FormData(formContacto);

    try {
      const resp = await fetch(formContacto.action, {
        method:  'POST',
        body:    data,
        headers: { 'Accept': 'application/json' },
      });

      if (resp.ok) {
        formContacto.style.display  = 'none';
        formContactMsg.style.display = 'block';
      } else {
        throw new Error('Error en el envío');
      }
    } catch {
      alert('Hubo un error al enviar el mensaje. Podés escribirnos directamente a noctilunio@gmail.com');
      btn.disabled    = false;
      btn.textContent = 'ENVIAR MENSAJE';
    }
  });
}

/* ============================================
   INIT
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Cargar EmailJS (solo necesario si usás el form de merch)
  // La librería se carga en el HTML con un script tag

  // Inicializar navegación
  handleHash();

  // Lazy load imágenes del fondo (ya están en CSS, no hace falta más)
});
