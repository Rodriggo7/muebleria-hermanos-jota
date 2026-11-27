import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import Loader from '../components/common/Loader.jsx';
import { useAuth } from '../hooks/useAuth.js';

// Igual que ProtectedRoute, pero además exige rol admin.
// Es solo una ayuda de interfaz: la seguridad real la hace el backend con requireAdmin.
function AdminRoute() {
  const { user, isAdmin, isChecking } = useAuth();
  const location = useLocation();

  if (isChecking) return <Loader center label="Verificando sesión…" />;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }

  if (!isAdmin) {
    return (
      <section className="section" role="alert">
        <h1>Acceso restringido</h1>
        <p>Esta sección es solo para administradores.</p>
        <Link to="/">Volver al inicio</Link>
      </section>
    );
  }

  return <Outlet />;
}

export default AdminRoute;
