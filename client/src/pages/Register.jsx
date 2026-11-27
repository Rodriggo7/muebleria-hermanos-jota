import { Link, Navigate, useLocation } from 'react-router-dom';
import Loader from '../components/common/Loader.jsx';
import RegisterForm from '../components/forms/RegisterForm.jsx';
import { useAuth } from '../hooks/useAuth.js';

import formStyles from '../components/forms/Form.module.css';

function Register() {
  const { user, isChecking } = useAuth();
  const location = useLocation();
  const from = location.state?.from || '/';

  if (isChecking) return <Loader center label="Verificando sesión…" />;
  if (user) return <Navigate to={from} replace />;

  return (
    <section className="section container container--narrow">
      <h1>Crear cuenta</h1>
      <RegisterForm />
      <p className={formStyles.footerText}>
        ¿Ya tenés cuenta?{' '}
        <Link to="/login" state={{ from }} className={formStyles.link}>
          Ingresá
        </Link>
      </p>
    </section>
  );
}

export default Register;
