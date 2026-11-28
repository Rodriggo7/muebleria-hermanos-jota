
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginForm from '../components/forms/LoginForm.jsx';
import { useAuth } from '../hooks/useAuth.js';

const INITIAL_VALUES = {
  email: '',
  password: '',
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values) {
  const errors = {};

  if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Ingresá un correo electrónico válido.';
  }

  if (!values.password) {
    errors.password = 'La contraseña es obligatoria.';
  }

  return errors;
}

function Login() {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: undefined,
    }));

    setFormError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validate(values);
    setErrors(validationErrors);
    setFormError('');

    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);

    try {
      await login({
        email: values.email.trim(),
        password: values.password,
      });

      const destination = location.state?.from?.pathname || '/productos';
      navigate(destination, { replace: true });
    } catch (error) {
      setFormError(error.message || 'No pudimos iniciar sesión. Revisá tus datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <LoginForm
        values={values}
        errors={errors}
        formError={formError}
        loading={loading}
        registerHref="/registro"
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </section>
  );
}

export default Login;
