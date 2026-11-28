import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';

// Control de acceso administrativo.
// Mantiene la estructura de autorización prevista originalmente por Rodri.

function AdminRoute() {
  const { isAuthenticated, isAdmin, isChecking } = useAuth();
  const location = useLocation();

  if (isChecking) {
    return <p role="status">Verificando permisos...</p>;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default AdminRoute;