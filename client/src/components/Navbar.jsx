import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Navbar.css';

export default function Navbar({ cartCount = 0 }) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const toggleMenu = () => setMenuAbierto(!menuAbierto);
  const cerrarMenu = () => setMenuAbierto(false);

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Logo de la Marca */}
        <Link to="/" className="navbar-logo" onClick={cerrarMenu}>
          <img src="/public/assets/logo.svg" alt="Logo Hermanos Jota" className="navbar-logo-img" />
          <span className="navbar-brand">Hermanos Jota</span>
        </Link>

        {/* Menú de Navegación Responsivo */}
        <nav className={`navbar-nav ${menuAbierto ? 'menu-abierto' : ''}`}>
          <NavLink to="/" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`} onClick={cerrarMenu}>
            Inicio
          </NavLink>
          <NavLink to="/productos" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`} onClick={cerrarMenu}>
            Catálogo
          </NavLink>
          <NavLink to="/contacto" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`} onClick={cerrarMenu}>
            Contacto
          </NavLink>
        </nav>

        {/* Carrito y Botón Hamburguesa Móvil */}
        <div className="navbar-actions">
          <div className="cart-icon-wrapper" title="Carrito de compras">
            <span className="material-symbols-outlined">shopping_bag</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </div>

          <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Abrir menú">
            <span className="material-symbols-outlined">{menuAbierto ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}