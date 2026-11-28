
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../../hooks/useCart.js";
import { useAuth } from "../../hooks/useAuth.js";
import "./Navbar.css";

const navLinkClass = ({ isActive }) =>
  isActive ? "navLink active" : "navLink";

const NAV_LINKS = [
  { to: "/", label: "Inicio", end: true },
  { to: "/productos", label: "Productos" },
  { to: "/contacto", label: "Contacto" },
];

function UserIcon() {
  return (
    <svg className="actionIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg className="actionIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg className="actionIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <circle cx="9" cy="20" r="1.25" />
      <circle cx="18" cy="20" r="1.25" />
      <path d="M2 3h3l2.6 12.4a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L22 7H6" />
    </svg>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems = 0 } = useCart() ?? {};
  const { user, logout } = useAuth() ?? {};

  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    closeMenu();
    logout?.();
  };

  return (
    <>
      <header className="header">
        <div className="container inner">
          <Link to="/" className="brand" onClick={closeMenu}>
            <span className="brandName">Hermanos Jota</span>
          </Link>

          <nav
            id="navbar-menu"
            className={`nav${isOpen ? " navOpen" : ""}`}
            aria-label="Navegación principal"
          >
            <ul className="navList">
              {NAV_LINKS.map(({ to, label, end }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={end}
                    className={navLinkClass}
                    onClick={closeMenu}
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <button
            type="button"
            className={`toggle${isOpen ? " toggleOpen" : ""}`}
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isOpen}
            aria-controls="navbar-menu"
            onClick={() => setIsOpen((open) => !open)}
          >
            <span className="toggleBar" aria-hidden="true" />
          </button>

          <div className="actions">
            {user ? (
              <>
                <NavLink
                  to="/perfil"
                  className="actionLink"
                  onClick={closeMenu}
                  aria-label="Mi cuenta"
                >
                  <UserIcon />
                  <span className="actionText">Mi cuenta</span>
                </NavLink>

                <button
                  type="button"
                  className="actionLink"
                  onClick={handleLogout}
                  aria-label="Salir"
                >
                  <LogoutIcon />
                  <span className="actionText">Salir</span>
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                className="actionLink"
                onClick={closeMenu}
                aria-label="Ingresar"
              >
                <UserIcon />
                <span className="actionText">Ingresar</span>
              </NavLink>
            )}

            <NavLink
              to="/carrito"
              className="actionLink"
              onClick={closeMenu}
              aria-label={`Carrito, ${totalItems} ${totalItems === 1 ? "producto" : "productos"}`}
            >
              <CartIcon />
              <span className={`cartCount${totalItems === 0 ? " cartCountEmpty" : ""}`} aria-hidden="true">
                {totalItems}
              </span>
            </NavLink>
          </div>
        </div>
      </header>

      {isOpen && (
        <div className="backdrop" onClick={closeMenu} aria-hidden="true" />
      )}
    </>
  );
}
