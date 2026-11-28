import { NavLink, Outlet } from 'react-router-dom';

function AdminLayout() {
  return (
    <main>
      <header>
        <h1>Panel de administración</h1>

        <nav aria-label="Navegación de administración">
          <NavLink to="/admin/productos">
            Productos
          </NavLink>
          {' | '}
          <NavLink to="/admin/productos/nuevo">
            Nuevo producto
          </NavLink>
        </nav>
      </header>

      <Outlet />
    </main>
  );
}

export default AdminLayout;