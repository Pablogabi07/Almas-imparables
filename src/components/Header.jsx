import React, { useState, useEffect, useRef } from "react";
import logo from "../assets/ohmlogo1.png";

export default function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const navRef = useRef(null);
  const toggleRef = useRef(null);

  // Cerrar al hacer scroll
  useEffect(() => {
    const cerrarMenu = () => setMenuAbierto(false);
    window.addEventListener("scroll", cerrarMenu, { passive: true });
    return () => window.removeEventListener("scroll", cerrarMenu);
  }, []);

  // Cerrar al hacer clic fuera del menú
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuAbierto &&
        navRef.current &&
        !navRef.current.contains(e.target) &&
        toggleRef.current &&
        !toggleRef.current.contains(e.target)
      ) {
        setMenuAbierto(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuAbierto]);

  // Evita body scroll cuando el menú está abierto (mejor UX en móvil)
  useEffect(() => {
    document.body.style.overflow = menuAbierto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuAbierto]);

  return (
    <header className="site-header" role="banner">
      <div className="header-inner">
        <div className="header-left">
          <a href="#inicio" className="logo-link" aria-label="Ir al inicio">
            <img src={logo} alt="Almas Imparables" className="logo" />
          </a>
        </div>

        <div className="header-center">
          <a href="#inicio" className="site-title-link">
            <h1 className="site-title">Almas Imparables</h1>
          </a>
        </div>

        <div className="header-right">
          {/* MENÚ DESPLEGABLE (usamos la misma clase que tu CSS .menu-desplegable) */}
          <nav
            id="main-navigation"
            ref={navRef}
            className={`menu-desplegable ${menuAbierto ? "activo" : ""}`}
            aria-label="Navegación principal"
          >
            <a href="#inicio" onClick={() => setMenuAbierto(false)}>
              Inicio
            </a>
            <a href="#productos" onClick={() => setMenuAbierto(false)}>
              Productos
            </a>
            <a href="#contacto" onClick={() => setMenuAbierto(false)}>
              Contacto
            </a>
          </nav>

          <button
            ref={toggleRef}
            className="menu-toggle"
            aria-controls="main-navigation"
            aria-expanded={menuAbierto}
            aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setMenuAbierto((v) => !v)}
            type="button"
          >
            {/* Aquí puedes reemplazar por un icon SVG si querés */}☰
          </button>
        </div>
      </div>
    </header>
  );
}
