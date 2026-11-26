import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../../hooks/useCart.js';
// Import de namespace: si useAuth.js todavía no exporta nada, no rompe el build.
import * as authModule from '../../hooks/useAuth.js';

const noAuth = () => ({ user: null, logout: () => {} });
const useAuth = authModule.useAuth ?? authModule.default ?? noAuth;

const linkClass = ({ isActive }) => (isActive ? 'navbar__link is-active' : 'navbar__link');

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems = 0 } = useCart() ?? {};
  const { user, logout } = useAuth() ?? {};

  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    closeMenu();
    logout?.();
  };

  return (
    <header className="navbar">
      <Link to="/" className="navbar__brand" onClick={closeMenu}>
        Hermanos Jota
      </Link>

      <button
        type="button"
        className="navbar__toggle"
        aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={isOpen}
        aria-controls="navbar-menu"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="navbar__toggle-bar" />
        <span className="navbar__toggle-bar" />
        <span className="navbar__toggle-bar" />
      </button>

      <nav id="navbar-menu" className={`navbar__menu${isOpen ? ' is-open' : ''}`}>
        <NavLink to="/" end className={linkClass} onClick={closeMenu}>
          Inicio
        </NavLink>
        <NavLink to="/productos" className={linkClass} onClick={closeMenu}>
          Productos
        </NavLink>
        <NavLink to="/contacto" className={linkClass} onClick={closeMenu}>
          Contacto
        </NavLink>

        {user ? (
          <>
            <NavLink to="/perfil" className={linkClass} onClick={closeMenu}>
              Mi cuenta
            </NavLink>
            <button type="button" className="navbar__link navbar__logout" onClick={handleLogout}>
              Salir
            </button>
          </>
        ) : (
          <NavLink to="/login" className={linkClass} onClick={closeMenu}>
            Ingresar
          </NavLink>
        )}

        <NavLink to="/carrito" className={linkClass} onClick={closeMenu}>
          Carrito <span className="badge">{totalItems}</span>
        </NavLink>
      </nav>
    </header>
  );
}

export default Navbar;
