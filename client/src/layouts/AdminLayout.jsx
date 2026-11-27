import { NavLink, Outlet } from 'react-router-dom';

// Pam todavía no tiene CSS para el panel: se arma con las utilidades globales (utilities.css).
const linkClass = ({ isActive }) => (isActive ? 'u-font-semibold' : undefined);

function AdminLayout() {
  return (
    <section className="section u-stack u-gap-6">
      <header className="u-cluster u-between u-items-center u-gap-4">
        <h1>Panel de administración</h1>
        <nav aria-label="Administración">
          <ul className="u-cluster u-gap-4" role="list">
            <li>
              <NavLink to="/admin/productos" end className={linkClass}>
                Productos
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/productos/nuevo" className={linkClass}>
                Nuevo producto
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>

      <Outlet />
    </section>
  );
}

export default AdminLayout;
