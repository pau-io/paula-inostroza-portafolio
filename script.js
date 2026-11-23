/* =========================================================
   PIO · script.js
   Solo lo que CSS no puede hacer por sí solo. Sirve para
   index.html y galeria.html (cada bloque se activa si existe
   su elemento en la página).
   ========================================================= */

const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------------------------------------------------------
   1. Tarjetas de proyecto: abrir / cerrar con el número grande
   --------------------------------------------------------- */
const tarjetas = document.querySelectorAll(".proyectos > article");

function cambiarTarjeta(tarjeta, abrir) {
  const numero = tarjeta.querySelector(".titulo-proyecto .numero");
  const abierta = abrir === undefined ? !tarjeta.classList.contains("abierto") : abrir;

  tarjeta.classList.toggle("abierto", abierta);
  numero.setAttribute("aria-expanded", abierta);
}

tarjetas.forEach((tarjeta) => {
  const numero = tarjeta.querySelector(".titulo-proyecto .numero");

  // El número se comporta como botón (también con teclado)
  numero.setAttribute("role", "button");
  numero.setAttribute("tabindex", "0");
  numero.setAttribute("aria-expanded", "false");

  numero.addEventListener("click", () => cambiarTarjeta(tarjeta));

  numero.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter" || evento.key === " ") {
      evento.preventDefault();
      cambiarTarjeta(tarjeta);
    }
  });
});

// Al llegar desde una miniatura (o con un enlace #proyecto-0X) la tarjeta se abre sola
function abrirDesdeEnlace() {
  const id = decodeURIComponent(window.location.hash.slice(1));
  const tarjeta = id ? document.getElementById(id) : null;

  if (tarjeta && tarjeta.matches(".proyectos > article")) {
    cambiarTarjeta(tarjeta, true);
  }
}

window.addEventListener("hashchange", abrirDesdeEnlace);
abrirDesdeEnlace();

/* ---------------------------------------------------------
   2. Contacto: cada carácter de "Hablemos!" rebota al pasar el cursor
   --------------------------------------------------------- */
const tituloContacto = document.querySelector(".contacto h2");

if (tituloContacto && !sinMovimiento) {
  const texto = tituloContacto.textContent.trim();

  // El lector de pantalla lee la palabra completa, no letra por letra
  tituloContacto.setAttribute("aria-label", texto);
  tituloContacto.textContent = "";

  for (const caracter of texto) {
    const letra = document.createElement("span");

    letra.className = "letra";
    letra.textContent = caracter;
    letra.setAttribute("aria-hidden", "true");

    // El rebote siempre se completa, aunque el cursor salga antes
    letra.addEventListener("mouseenter", () => letra.classList.add("rebotando"));
    letra.addEventListener("animationend", () => letra.classList.remove("rebotando"));

    tituloContacto.append(letra);
  }
}

/* ---------------------------------------------------------
   3. Galería: duplica las fotos de cada columna para que
      el desplazamiento hacia arriba sea un loop infinito
   --------------------------------------------------------- */
const columnasGaleria = document.querySelector(".galeria-columnas");

if (columnasGaleria && !sinMovimiento) {
  columnasGaleria.querySelectorAll(":scope > div").forEach((columna) => {
    [...columna.children].forEach((foto) => {
      const copia = foto.cloneNode(true);

      copia.alt = ""; // la copia es decorativa
      copia.setAttribute("aria-hidden", "true");
      columna.append(copia);
    });
  });

  columnasGaleria.classList.add("en-bucle");
}
