import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Loader from '../components/common/Loader.jsx';
import { useAuth } from '../hooks/useAuth.js';

// Ruta "layout": envuelve rutas hijas y solo las muestra con sesión iniciada.
// Uso: <Route element={<ProtectedRoute />}> <Route path="/perfil" … /> </Route>
function ProtectedRoute() {
  const { user, isChecking } = useAuth();
  const location = useLocation();

  // Recarga con token guardado: esperar a /auth/me antes de decidir.
  if (isChecking) return <Loader center label="Verificando sesión…" />;

  // Sin sesión: al login, recordando a dónde quería ir para volver después.
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
