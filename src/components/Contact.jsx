import React, { useState } from "react";

export default function Contact() {
  const telefono = "11-2756-1868";
  const direccionTexto =
    "Asuncion 1600, Francisco Alvarez, Moreno, Buenos Aires, Argentina";

  // Coordenadas extraídas del embed que pegaste
  const lat = -34.63464695913112;
  const lng = -58.85592472489751;
  const coords = `${lat},${lng}`;

  // Usamos exactamente el src del iframe que pegaste (mejor precisión/marker)
  const mapaIframeSrc =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3282.7939506753905!2d-58.85592472489751!3d-34.63464695913112!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bc935f3e134133%3A0x35a185acac411a75!2sAlmas%20Imparables!5e0!3m2!1ses!2sar!4v1761756317704!5m2!1ses!2sar";

  // Link para abrir direcciones en Google Maps (abre app en móvil o web en desktop)
  const urlIr = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    coords
  )}`;

  // WhatsApp (añadí prefijo internacional 54)
  const waUrl = `https://wa.me/549${telefono.replace(/\D/g, "")}`;

  const [copiado, setCopiado] = useState(false);
  const copiarDireccion = async () => {
    try {
      await navigator.clipboard.writeText(direccionTexto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      alert(
        "No se pudo copiar la dirección. Seleccionála y cópiala manualmente."
      );
    }
  };

  return (
    <div className="contacto-wrapper">
      <h2>Contacto</h2>

      <div className="contacto-detalle">
        <p>
          <strong>📞 Teléfono:</strong>{" "}
          <a href={waUrl} target="_blank" rel="noreferrer">
            +54 {telefono}
          </a>
        </p>
        <p>
          <strong>📍 Dirección:</strong> {direccionTexto}
        </p>
      </div>

      <div
        className="mapa-embed"
        style={{
          marginTop: 12,
          borderRadius: 8,
          overflow: "hidden",
          boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
        }}
      >
        <iframe
          title="Mapa - Almas Imparables"
          src={mapaIframeSrc}
          width="100%"
          height="320"
          style={{ border: 0, display: "block" }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div
        className="mapa-acciones"
        style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap" }}
      >
        <a
          className="btn-mapa"
          href={urlIr}
          target="_blank"
          rel="noreferrer"
          style={{
            background: "var(--color-secundario)",
            color: "black",
            padding: "0.55rem 0.9rem",
            borderRadius: 8,
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          ¿Querés ir? Abrir direcciones
        </a>

        <button
          className="btn-mapa-clipboard"
          onClick={copiarDireccion}
          style={{
            background: "transparent",
            color: "var(--color-texto)",
            border: "1px solid rgba(255,255,255,0.12)",
            padding: "0.45rem 0.8rem",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          {copiado ? "Dirección copiada" : "Copiar dirección"}
        </button>
      </div>
    </div>
  );
}
