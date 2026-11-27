import { useState } from 'react';
import Button from '../common/Button.jsx';
import Field from '../common/Field.jsx';
import { useAuth } from '../../hooks/useAuth.js';

import formStyles from './Form.module.css';
import alertStyles from '../common/Alert.module.css';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Mismas reglas que backend/src/validators/authValidator.js (validateLogin).
function validate({ email, password }) {
  const errors = {};
  if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Ingresá un email válido.';
  if (!password) errors.password = 'Ingresá tu contraseña.';
  else if (password.length > 72) errors.password = 'La contraseña no puede superar los 72 caracteres.';
  return errors;
}

function LoginForm() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError(null);

    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      // Si sale bien, AuthContext guarda la sesión y la página Login redirige.
      await login({ email: form.email.trim(), password: form.password });
    } catch (err) {
      setSubmitError(err.message || 'No pudimos iniciar sesión.');
      setIsSubmitting(false);
    }
  };

  const formClassName = isSubmitting ? `${formStyles.form} ${formStyles.submitting}` : formStyles.form;

  return (
    <form className={formClassName} onSubmit={handleSubmit} noValidate>
      <Field id="login-email" label="Email" required error={errors.email}>
        <input
          type="email"
          name="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          disabled={isSubmitting}
        />
      </Field>

      <Field id="login-password" label="Contraseña" required error={errors.password}>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          value={form.password}
          onChange={handleChange}
          disabled={isSubmitting}
        />
      </Field>

      {submitError && (
        <p className={`${formStyles.formAlert} ${alertStyles.alert} ${alertStyles.error}`} role="alert">
          {submitError}
        </p>
      )}

      <div className={formStyles.actions}>
        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? 'Ingresando...' : 'Ingresar'}
        </Button>
      </div>
    </form>
  );
}

export default LoginForm;
