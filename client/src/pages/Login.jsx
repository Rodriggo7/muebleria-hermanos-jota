import { Link, Navigate, useLocation } from 'react-router-dom';
import Loader from '../components/common/Loader.jsx';
import LoginForm from '../components/forms/LoginForm.jsx';
import { useAuth } from '../hooks/useAuth.js';

import formStyles from '../components/forms/Form.module.css';

function Login() {
  const { user, isChecking } = useAuth();
  const location = useLocation();
  // ProtectedRoute y el carrito mandan { from } para volver adonde estaba.
  const from = location.state?.from || '/';

  if (isChecking) return <Loader center label="Verificando sesión…" />;
  // Con sesión (ya logueado o recién ingresado): volver a la página de origen.
  if (user) return <Navigate to={from} replace />;

  return (
    <section className="section container container--narrow">
      <h1>Ingresar</h1>
      <LoginForm />
      <p className={formStyles.footerText}>
        ¿No tenés cuenta?{' '}
        <Link to="/registro" state={{ from }} className={formStyles.link}>
          Registrate
        </Link>
      </p>
    </section>
  );
}

export default Login;
