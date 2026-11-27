import { useState } from 'react';
import Button from '../common/Button.jsx';
import Field from '../common/Field.jsx';
import { useAuth } from '../../hooks/useAuth.js';

import formStyles from './Form.module.css';
import alertStyles from '../common/Alert.module.css';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMPTY_FORM = { name: '', email: '', phone: '', password: '', confirmPassword: '' };

// Mismas reglas que backend/src/validators/authValidator.js (validateRegister),
// más la confirmación de contraseña, que solo existe en el frontend.
function validate(form) {
  const errors = {};
  const name = form.name.trim();
  if (name.length < 2) errors.name = 'El nombre debe tener al menos 2 caracteres.';
  else if (name.length > 100) errors.name = 'El nombre no puede superar los 100 caracteres.';
  if (!EMAIL_PATTERN.test(form.email.trim())) errors.email = 'Ingresá un email válido.';
  if (form.phone.trim().length > 30) errors.phone = 'El teléfono no puede superar los 30 caracteres.';
  if (form.password.length < 8) errors.password = 'La contraseña debe tener al menos 8 caracteres.';
  else if (form.password.length > 72) errors.password = 'La contraseña no puede superar los 72 caracteres.';
  if (form.confirmPassword !== form.password) errors.confirmPassword = 'Las contraseñas no coinciden.';
  return errors;
}

function RegisterForm() {
  const { register } = useAuth();
  const [form, setForm] = useState(EMPTY_FORM);
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
      // El backend devuelve { user, token }: el usuario queda logueado y la página redirige.
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        ...(form.phone.trim() ? { phone: form.phone.trim() } : {}),
      });
    } catch (err) {
      setSubmitError(err.message || 'No pudimos crear la cuenta.');
      setIsSubmitting(false);
    }
  };

  const fieldProps = (name) => ({
    name,
    value: form[name],
    onChange: handleChange,
    disabled: isSubmitting,
  });

  const formClassName = isSubmitting ? `${formStyles.form} ${formStyles.submitting}` : formStyles.form;

  return (
    <form className={formClassName} onSubmit={handleSubmit} noValidate>
      <div className={formStyles.row}>
        <Field id="register-name" label="Nombre" required error={errors.name}>
          <input type="text" autoComplete="name" {...fieldProps('name')} />
        </Field>
        <Field id="register-phone" label="Teléfono" hint="Opcional" error={errors.phone}>
          <input type="tel" autoComplete="tel" {...fieldProps('phone')} />
        </Field>
      </div>

      <Field id="register-email" label="Email" required error={errors.email}>
        <input type="email" autoComplete="email" {...fieldProps('email')} />
      </Field>

      <div className={formStyles.row}>
        <Field id="register-password" label="Contraseña" required hint="Mínimo 8 caracteres" error={errors.password}>
          <input type="password" autoComplete="new-password" {...fieldProps('password')} />
        </Field>
        <Field id="register-confirm" label="Repetí la contraseña" required error={errors.confirmPassword}>
          <input type="password" autoComplete="new-password" {...fieldProps('confirmPassword')} />
        </Field>
      </div>

      {submitError && (
        <p className={`${formStyles.formAlert} ${alertStyles.alert} ${alertStyles.error}`} role="alert">
          {submitError}
        </p>
      )}

      <div className={formStyles.actions}>
        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
        </Button>
      </div>
    </form>
  );
}

export default RegisterForm;
