import { Link, NavLink } from 'react-router-dom';
import './Navbar.css';

export default function Navbar({ cartCount = 0 }) {
  return (
    <header className="navbar-header">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="material-symbols-outlined">chair</span>
          <span className="navbar-brand">Hermanos Jota</span>
        </Link>

        <nav className="navbar-nav">
          <NavLink to="/" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
            Inicio
          </NavLink>
          <NavLink to="/productos" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
            Catálogo
          </NavLink>
          <NavLink to="/contacto" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
            Contacto
          </NavLink>
        </nav>

        <div className="cart-icon-wrapper">
          <span className="material-symbols-outlined">shopping_bag</span>
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </div>
      </div>
    </header>
  );
}