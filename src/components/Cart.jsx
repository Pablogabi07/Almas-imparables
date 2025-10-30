import React from "react";

export default function Cart({
  carrito,
  eliminarDelCarrito,
  vaciarCarrito,
  incrementarCantidad,
  decrementarCantidad,
  enviarPedido,
  cerrar,
}) {
  const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  return (
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-label="Carrito de compras"
    >
      <div className="modal-contenido">
        <button
          className="cerrar-modal"
          onClick={cerrar}
          aria-label="Cerrar carrito"
        >
          ✕
        </button>
        <h3>🛒 Tu carrito</h3>

        {carrito.length === 0 ? (
          <>
            <p>El carrito está vacío.</p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "0.5rem",
              }}
            >
              <button
                onClick={cerrar}
                style={{ padding: "0.35rem 0.7rem", fontSize: "0.85rem" }}
              >
                🔙 Cerrar
              </button>
            </div>
          </>
        ) : (
          <>
            <ul className="carrito-lista">
              {carrito.map((p, index) => (
                <li key={index} className="carrito-item">
                  <div
                    style={{
                      display: "flex",
                      gap: "0.6rem",
                      alignItems: "center",
                    }}
                  >
                    {p.imagen && (
                      <img
                        src={p.imagen}
                        alt={p.nombre}
                        style={{
                          width: 48,
                          height: 48,
                          objectFit: "cover",
                          borderRadius: 6,
                        }}
                      />
                    )}
                    <div>
                      <strong>{p.nombre}</strong>
                      <p style={{ margin: 0, fontSize: "0.9rem" }}>
                        Subtotal: ${p.precio * p.cantidad}
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                  >
                    <button
                      onClick={() => decrementarCantidad(index)}
                      aria-label={`Disminuir ${p.nombre}`}
                      style={{
                        padding: "0.25rem 0.45rem",
                        fontSize: "0.95rem",
                        borderRadius: 6,
                        border: "1px solid #ccc",
                        background: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      −
                    </button>

                    <span
                      style={{
                        minWidth: 26,
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      {p.cantidad}
                    </span>

                    <button
                      onClick={() => incrementarCantidad(index)}
                      aria-label={`Aumentar ${p.nombre}`}
                      style={{
                        padding: "0.25rem 0.45rem",
                        fontSize: "0.95rem",
                        borderRadius: 6,
                        border: "1px solid #ccc",
                        background: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      +
                    </button>

                    <button
                      onClick={() => eliminarDelCarrito(index)}
                      aria-label={`Eliminar ${p.nombre}`}
                      style={{
                        padding: "0.3rem 0.5rem",
                        marginLeft: 6,
                        backgroundColor: "#ff5252",
                        color: "white",
                        borderRadius: 6,
                        border: "none",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                      }}
                    >
                      ❌
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <p className="carrito-total">
              <strong>Total:</strong> ${total}
            </p>

            <div className="botones-carrito">
              <button onClick={enviarPedido}>📦 Enviar pedido</button>
              <button onClick={vaciarCarrito}>🧹 Vaciar</button>
              <button onClick={cerrar}>🔙 Cerrar</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
