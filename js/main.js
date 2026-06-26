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
    // EmailJS — reemplazá estas IDs con las tuyas en emailjs.com
    await emailjs.send(
      'service_ix7jebq',      // ← tu Service ID de EmailJS
      'template_2g50y4b',  // ← template para la banda
      { ...datos, alias: 'noctilunio' }
    );

    await emailjs.send(
      'service_ix7jebq',
      'TEMPLATE_CLIENTE', // ← template de confirmación para el cliente
      datos
    );

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
   FANZINE — VISOR PDF
   ============================================ */
const FANZINE_TOTAL = 16;
let paginaActual = 1;

const fanzineFrame   = document.getElementById('fanzineFrame');
const fanzinePageNum = document.getElementById('fanzinePageNum');
const btnPagePrev    = document.getElementById('btnPagePrev');
const btnPageNext    = document.getElementById('btnPageNext');

function cargarPaginaFanzine(n) {
  paginaActual = n;
  // Usamos #toolbar=0&navpanes=0 para ocultar la barra de herramientas del PDF
  fanzineFrame.src = `fanzine/${n}.pdf#toolbar=0&navpanes=0&scrollbar=0&view=FitH`;
  fanzinePageNum.textContent = `Pág. ${n} / ${FANZINE_TOTAL}`;
  btnPagePrev.disabled = (n <= 1);
  btnPageNext.disabled = (n >= FANZINE_TOTAL);
}

btnPagePrev.addEventListener('click', () => {
  if (paginaActual > 1) cargarPaginaFanzine(paginaActual - 1);
});

btnPageNext.addEventListener('click', () => {
  if (paginaActual < FANZINE_TOTAL) cargarPaginaFanzine(paginaActual + 1);
});

// Inicializar el fanzine al activar la sección
document.querySelector('[data-section="fanzine"]')?.addEventListener('click', () => {
  setTimeout(() => cargarPaginaFanzine(1), 100);
});

// Prevenir clic derecho en el área del fanzine (anti-descarga)
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
