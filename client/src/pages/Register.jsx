
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/forms/RegisterForm.jsx';
import { useAuth } from '../hooks/useAuth.js';

const INITIAL_VALUES = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values) {
  const errors = {};

  if (values.name.trim().length < 2) {
    errors.name = 'El nombre debe tener al menos 2 caracteres.';
  }

  if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Ingresá un correo electrónico válido.';
  }

  if (values.password.length < 8 || values.password.length > 72) {
    errors.password = 'La contraseña debe tener entre 8 y 72 caracteres.';
  }

  if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Las contraseñas no coinciden.';
  }

  return errors;
}

function Register() {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: undefined,
      ...(name === 'password' ? { confirmPassword: undefined } : {}),
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
      await register({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
      });

      navigate('/productos', { replace: true });
    } catch (error) {
      setFormError(error.message || 'No pudimos crear tu cuenta. Intentá nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <RegisterForm
        values={values}
        errors={errors}
        formError={formError}
        loading={loading}
        loginHref="/login"
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </section>
  );
}

export default Register;
