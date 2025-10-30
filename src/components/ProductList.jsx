import React from "react";
import polloImg1 from "../assets/pollo.png";
import polloImg2 from "../assets/alitas.png";
import polloImg3 from "../assets/carcasa.webp";
import polloImg4 from "../assets/menudos.png";
import polloImg5 from "../assets/mila.png";
import polloImg6 from "../assets/pataymuslo.png";
import polloImg7 from "../assets/pecgugas.png";
import polloImg9 from "../assets/pollotrozado.png";
import cerdoImg1 from "../assets/costilladecerdo.png";
import cerdoImg2 from "../assets/pechitodecerdo.png";
import cerdoImg3 from "../assets/morcilla.png";
import cerdoImg4 from "../assets/chorizo.png";
import otrosImg1 from "../assets/quesosardo.webp";
import otrosImg2 from "../assets/quesocampo.jfif";
import otrosImg3 from "../assets/salamin.png";
import congeladoImg1 from "../assets/minicroquetasdeespinaca.png";
import congeladoImg2 from "../assets/bastonmuza.png";
import congeladoImg3 from "../assets/merluzarebozada.png";
import congeladoImg4 from "../assets/merluzaalaromana.png";
import congeladoImg5 from "../assets/rabas.png";
import congeladoImg6 from "../assets/bocaditocalabaza.jpeg";
import congeladoImg7 from "../assets/medallondepollo.png";
import congeladoImg8 from "../assets/medallonpollojyq.png";
import congeladoImg9 from "../assets/medallondesoja.jpg";
import congeladoImg10 from "../assets/nuggetsdepollo.png";
import congeladoImg11 from "../assets/Croquetapapa.png";
import congeladoImg12 from "../assets/ricosaurios.jpg";
import congeladoImg13 from "../assets/caritaspapa.png";
import congeladoImg14 from "../assets/papabaston.png";
import congeladoImg15 from "../assets/papanoiset.png";

// Imagen por defecto (fallback)
const imagenFallback = otrosImg3;

// Mapeo de imágenes por nombre de archivo (usa los nombres que pones en tus objetos producto.imagen)
const imagenes = {
  // Pollo (mapeá los nombres que usás en App.jsx)
  "pollo.png": polloImg1,
  "pollo.jpg": polloImg1,
  "alitas.png": polloImg2,
  "carcasa.webp": polloImg3,
  "menudos.png": polloImg4,
  "mila.png": polloImg5,
  "pataymuslo.png": polloImg6,
  "pecgugas.png": polloImg7,
  "pollotrozado.png": polloImg9,

  // Cerdo
  "costilladecerdo.png": cerdoImg1,
  "pechitodecerdo.png": cerdoImg2,
  "morcilla.png": cerdoImg3,
  "chorizo.png": cerdoImg4,
  "cerdo.jpg": cerdoImg1,

  // otros
  "otros.jpg": otrosImg1,
  "quesosardo.webp": otrosImg1,
  "quesocampo.jfif": otrosImg2,
  "salamin.png": otrosImg3,

  // Congelados
  "minicroquetasdeespinaca.png": congeladoImg1,
  "bastonmuza.png": congeladoImg2,
  "merluzarebozada.png": congeladoImg3,
  "merluzaalaromana.png": congeladoImg4,
  "rabas.png": congeladoImg5,
  "bocaditocalabaza.jpeg": congeladoImg6,
  "medallondepollo.png": congeladoImg7,
  "medallonpollojyq.png": congeladoImg8,
  "medallondesoja.jpg": congeladoImg9,
  "nuggetsdepollo.png": congeladoImg10,
  "Croquetapapa.png": congeladoImg11,
  "ricosaurios.jpg": congeladoImg12,
  "caritaspapa.png": congeladoImg13,
  "papabaston.png": congeladoImg14,
  "papanoiset.png": congeladoImg15,
};

export default function ProductList({ productos = [], agregarAlCarrito }) {
  return (
    <div className="productos-lista">
      {productos.map((producto, index) => {
        // Resuelve la imagen según producto.imagen; usa fallback si no existe
        const imagenSrc = imagenes[producto.imagen] || imagenFallback;

        return (
          <div key={producto.nombre + "-" + index} className="producto">
            <img
              src={imagenSrc}
              alt={producto.nombre}
              style={{ width: "100%", borderRadius: "8px" }}
            />
            <h4>{producto.nombre}</h4>
            <p>Precio: ${producto.precio}</p>
            <button onClick={() => agregarAlCarrito(producto)}>
              Agregar al carrito
            </button>
          </div>
        );
      })}
    </div>
  );
}
