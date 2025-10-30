import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import Contact from "./components/Contact";

export default function App() {
  const [carrito, setCarrito] = useState([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    try {
      const guardado = localStorage.getItem("carrito");
      if (guardado) {
        setCarrito(JSON.parse(guardado));
      }
    } catch (e) {
      console.error("Error leyendo carrito desde localStorage:", e);
    }
  }, []);

  // Sincronizar carrito con localStorage cuando cambie
  useEffect(() => {
    try {
      localStorage.setItem("carrito", JSON.stringify(carrito));
    } catch (e) {
      console.error("Error guardando carrito en localStorage:", e);
    }
  }, [carrito]);

  const mostrarMensaje = (texto) => {
    setMensaje(texto);
    setTimeout(() => setMensaje(""), 2500);
  };

  const eliminarDelCarrito = (index) => {
    setCarrito((prev) => {
      const copia = [...prev];
      const producto = copia[index];
      if (!producto) return prev;
      if (producto.cantidad > 1) {
        copia[index] = { ...producto, cantidad: producto.cantidad - 1 };
        mostrarMensaje(`➖ 1 unidad de ${producto.nombre} eliminada`);
      } else {
        copia.splice(index, 1);
        mostrarMensaje(`🗑️ ${producto.nombre} eliminado del carrito`);
      }
      return copia;
    });
  };

  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const existenteIndex = prev.findIndex(
        (p) => p.nombre === producto.nombre
      );
      if (existenteIndex !== -1) {
        const copia = [...prev];
        copia[existenteIndex] = {
          ...copia[existenteIndex],
          cantidad: copia[existenteIndex].cantidad + 1,
        };
        return copia;
      } else {
        return [...prev, { ...producto, cantidad: 1 }];
      }
    });
    mostrarMensaje(`✅ ${producto.nombre} agregado al carrito`);
  };

  const vaciarCarrito = () => {
    setCarrito([]);
    mostrarMensaje("🧹 Carrito vaciado");
  };

  const incrementarCantidad = (index) => {
    setCarrito((prev) => {
      const copia = [...prev];
      if (!copia[index]) return prev;
      copia[index] = { ...copia[index], cantidad: copia[index].cantidad + 1 };
      return copia;
    });
  };

  const decrementarCantidad = (index) => {
    setCarrito((prev) => {
      const copia = [...prev];
      if (!copia[index]) return prev;
      if (copia[index].cantidad > 1) {
        copia[index] = { ...copia[index], cantidad: copia[index].cantidad - 1 };
      } else {
        copia.splice(index, 1);
      }
      return copia;
    });
  };

  // URL deploy de tu Google Apps Script (web app)
  const GOOGLE_SHEETS_WEBHOOK =
    "https://script.google.com/macros/s/AKfycbxqDKet3jlJIq436kjuAvsi_VBl8w3cWOtyWycjk4rYFB0zAsgcke2JSo1lUO7HUaWezw/exec";

  // Copiar resumen al portapapeles, guardar en Google Sheets y abrir WhatsApp
  const enviarPedido = async () => {
    if (!carrito || carrito.length === 0) {
      mostrarMensaje("El carrito está vacío");
      return;
    }

    // Construir líneas detalladas: nombre xcantidad - $subtotal
    const lineas = carrito.map(
      (p) => `${p.nombre} x${p.cantidad} - $${p.precio * p.cantidad}`
    );
    const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

    const textoPedido = [
      "Pedido desde Almas Imparables:",
      ...lineas,
      `Total: $${total}`,
      "",
      "Datos de contacto / aclaraciones:",
    ].join("\n");

    // Intentar copiar al portapapeles (no fatal si falla)
    try {
      await navigator.clipboard.writeText(textoPedido);
      mostrarMensaje("✅ Resumen copiado al portapapeles");
    } catch (err) {
      console.warn("No se pudo copiar al portapapeles:", err);
      mostrarMensaje("⚠️ No se pudo copiar al portapapeles");
    }

    // Guardar pedido en Google Sheets (no bloqueante para la apertura de WhatsApp)
    (async () => {
      try {
        const pedidoPayload = {
          items: carrito.map((p) => ({
            nombre: p.nombre,
            cantidad: p.cantidad,
            subtotal: p.precio * p.cantidad,
          })),
          total,
          nombreContacto: "",
          telefono: "",
          notas: "",
        };

        const res = await fetch(GOOGLE_SHEETS_WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(pedidoPayload),
        });

        const json = await res.json();
        if (json && json.ok) {
          mostrarMensaje("✅ Pedido guardado en historial");
        } else {
          console.warn("Respuesta webhook:", json);
          mostrarMensaje("⚠️ No se pudo guardar el pedido en el historial");
        }
      } catch (err) {
        console.error("Error guardando pedido en Sheets:", err);
        mostrarMensaje("⚠️ Error guardando pedido en historial");
      }
    })();

    // Reemplazá por tu número en formato internacional (ej: 54911xxxxxxxx)
    const numero = "5491127561868";

    // Codificar texto para la URL
    const textoUrl = encodeURIComponent(
      `Hola! Quiero hacer este pedido:\n\n${lineas.join(
        "\n"
      )}\n\nTotal: $${total}`
    );

    // Intento principal con wa.me
    const url = `https://wa.me/${numero}?text=${textoUrl}`;

    // Abrir en nueva pestaña/ventana
    const win = window.open(url, "_blank", "noopener,noreferrer");
    if (!win) {
      // Si popup bloqueado o falla, intentar otros endpoints
      const fallbackUrls = [
        `https://api.whatsapp.com/send?phone=${numero}&text=${textoUrl}`,
        `https://web.whatsapp.com/send?phone=${numero}&text=${textoUrl}`,
      ];
      let opened = false;
      for (const u of fallbackUrls) {
        try {
          const w = window.open(u, "_blank", "noopener,noreferrer");
          if (w) {
            try {
              w.focus();
            } catch {}
            opened = true;
            break;
          }
        } catch (e) {
          console.warn("Error abriendo fallback", u, e);
        }
      }
      if (!opened) {
        mostrarMensaje(
          "⚠️ No se pudo abrir WhatsApp. El pedido quedó copiado; pegalo manualmente."
        );
      } else {
        mostrarMensaje("Abriendo WhatsApp...");
      }
    } else {
      try {
        win.focus();
      } catch {}
      mostrarMensaje("Abriendo WhatsApp...");
    }
  };

  // Contar cantidad total de unidades para mostrar en el botón flotante
  const totalUnidades = carrito.reduce((s, p) => s + (p.cantidad || 0), 0);

  const productos = [
    {
      nombre: "Mini croquetas de espinaca",
      precio: 8560,
      imagen: "minicroquetasdeespinaca.png",
      categoria: "Congelados",
    },
    {
      nombre: "Bastones de Muza",
      precio: 13650,
      imagen: "bastonmuza.png",
      categoria: "Congelados",
    },
    {
      nombre: "Filet de merluza rebosada",
      precio: 15300,
      imagen: "merluzarebozada.png",
      categoria: "Congelados",
    },
    {
      nombre: "Filet de merluza a la romana",
      precio: 15300,
      imagen: "merluzaalaromana.png",
      categoria: "Congelados",
    },
    {
      nombre: "Rabas",
      precio: 19100,
      imagen: "rabas.png",
      categoria: "Congelados",
    },
    {
      nombre: "Bocaditos de calabaza",
      precio: 7500,
      imagen: "bocaditocalabaza.jpeg",
      categoria: "Congelados",
    },
    {
      nombre: "Medallones de pollo",
      precio: 8300,
      imagen: "medallondepollo.png",
      categoria: "Congelados",
    },
    {
      nombre: "Medallones de pollo y jamon y queso",
      precio: 8450,
      imagen: "medallonpollojyq.png",
      categoria: "Congelados",
    },
    {
      nombre: "Medallones de soja",
      precio: 7330,
      imagen: "medallondesoja.jpg",
      categoria: "Congelados",
    },
    {
      nombre: "Nugget de pollo",
      precio: 8500,
      imagen: "nuggetsdepollo.png",
      categoria: "Congelados",
    },
    {
      nombre: "Croquetas de papa",
      precio: 8000,
      imagen: "Croquetapapa.png",
      categoria: "Congelados",
    },
    {
      nombre: "Ricoraurios",
      precio: 8150,
      imagen: "ricosaurios.jpg",
      categoria: "Congelados",
    },
    {
      nombre: "Caritas de papa",
      precio: 8550,
      imagen: "caritaspapa.png",
      categoria: "Congelados",
    },
    {
      nombre: "Papas baston",
      precio: 6500,
      imagen: "papabaston.png",
      categoria: "Congelados",
    },
    {
      nombre: "Papas Noisset",
      precio: 8450,
      imagen: "papanoiset.png",
      categoria: "Congelados",
    },

    {
      nombre: "Pechugas",
      precio: 1200,
      imagen: "pecgugas.png",
      categoria: "Pollo",
    },
    {
      nombre: "Pollo entero",
      precio: 1300,
      imagen: "pollo.jpg",
      categoria: "Pollo",
    },
    {
      nombre: "Alitas",
      precio: 1500,
      imagen: "alitas.png",
      categoria: "Pollo",
    },
    {
      nombre: "carcasa",
      precio: 1600,
      imagen: "carcasa.webp",
      categoria: "Pollo",
    },
    {
      nombre: "Menudos",
      precio: 900,
      imagen: "menudos.png",
      categoria: "Pollo",
    },
    {
      nombre: "Milanesas de pollo",
      precio: 850,
      imagen: "mila.png",
      categoria: "Pollo",
    },
    {
      nombre: "Pata y muslo",
      precio: 800,
      imagen: "pataymuslo.png",
      categoria: "Pollo",
    },
    {
      nombre: "Pollo trozado",
      precio: 800,
      imagen: "pollotrozado.png",
      categoria: "Pollo",
    },

    {
      nombre: "Costilla de cerdo",
      precio: 800,
      imagen: "costilladecerdo.png",
      categoria: "Cerdo",
    },
    {
      nombre: "Pechito de cerdo",
      precio: 800,
      imagen: "pechitodecerdo.png",
      categoria: "Cerdo",
    },
    {
      nombre: "Morcilla de cerdo",
      precio: 800,
      imagen: "morcilla.png",
      categoria: "Cerdo",
    },
    {
      nombre: "Chorizo de cerdo",
      precio: 800,
      imagen: "chorizo.png",
      categoria: "Cerdo",
    },
    {
      nombre: "Queso sardo",
      precio: 900,
      imagen: "quesosardo.webp",
      categoria: "Otros",
    },
    {
      nombre: "Queso de campo",
      precio: 900,
      imagen: "quesocampo.jfif",
      categoria: "Otros",
    },
    {
      nombre: "Salamin",
      precio: 900,
      imagen: "salamin.png",
      categoria: "Otros",
    },
  ];

  const categorias = ["Congelados", "Pollo", "Cerdo", "Otros"];

  return (
    <div>
      <Header />

      {mensaje && <div className="notificacion">{mensaje}</div>}

      <section id="inicio">
        <h2>Bienvenidos</h2>
        <p>Venta de congelados, pollo, cerdo, queso, salamin y más.</p>
      </section>

      <section id="productos">
        <h2>Productos</h2>
        {categorias.map((cat) => (
          <div key={cat}>
            <h3>{cat}</h3>
            <ProductList
              productos={productos.filter((p) => p.categoria === cat)}
              agregarAlCarrito={agregarAlCarrito}
            />
          </div>
        ))}
      </section>

      <section id="contacto">
        <Contact />
      </section>

      <div className="carrito-flotante">
        <button onClick={() => setMostrarCarrito(true)}>
          🛒 Ver Carrito ({totalUnidades})
        </button>
      </div>

      {mostrarCarrito && (
        <Cart
          carrito={carrito}
          eliminarDelCarrito={eliminarDelCarrito}
          vaciarCarrito={vaciarCarrito}
          incrementarCantidad={incrementarCantidad}
          decrementarCantidad={decrementarCantidad}
          enviarPedido={enviarPedido}
          cerrar={() => setMostrarCarrito(false)}
        />
      )}
    </div>
  );
}
