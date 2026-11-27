import { useState } from 'react';
import Button from '../components/common/Button.jsx';
import Field from '../components/common/Field.jsx';
import { sendContact } from '../services/contactService.js';

import formStyles from '../components/forms/Form.module.css';
import alertStyles from '../components/common/Alert.module.css';

const EMPTY_FORM = { name: '', email: '', phone: '', subject: '', message: '' };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Límites máximos: los mismos que backend/src/validators/contactValidator.js.
const MAX = { name: 100, email: 150, phone: 30, subject: 150, message: 3000 };

function validate(form) {
  const errors = {};
  const name = form.name.trim();
  const email = form.email.trim();
  const subject = form.subject.trim();
  const message = form.message.trim();

  if (name.length < 2) errors.name = 'El nombre debe tener al menos 2 caracteres.';
  else if (name.length > MAX.name) errors.name = `El nombre no puede superar los ${MAX.name} caracteres.`;

  if (!EMAIL_PATTERN.test(email)) errors.email = 'Ingresá un email válido.';
  else if (email.length > MAX.email) errors.email = `El email no puede superar los ${MAX.email} caracteres.`;

  if (form.phone.trim().length > MAX.phone) errors.phone = `El teléfono no puede superar los ${MAX.phone} caracteres.`;

  if (!subject) errors.subject = 'El asunto es obligatorio.';
  else if (subject.length > MAX.subject) errors.subject = `El asunto no puede superar los ${MAX.subject} caracteres.`;

  if (message.length < 10) errors.message = 'El mensaje debe tener al menos 10 caracteres.';
  else if (message.length > MAX.message) errors.message = `El mensaje no puede superar los ${MAX.message} caracteres.`;

  return errors;
}

function Contact() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState(null);
  const [sent, setSent] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Al corregir un campo se borra su error.
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    setSent(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSendError(null);
    setSent(false);

    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
      ...(form.phone.trim() ? { phone: form.phone.trim() } : {}),
    };

    setIsSending(true);
    try {
      await sendContact(payload);
      setForm(EMPTY_FORM);
      setSent(true);
    } catch (err) {
      setSendError(err.message || 'No pudimos enviar el mensaje. Probá de nuevo.');
    } finally {
      setIsSending(false);
    }
  };

  // Props comunes a cada control; id, clases y accesibilidad los agrega Field.
  const controlProps = (name) => ({
    name,
    maxLength: MAX[name],
    value: form[name],
    onChange: handleChange,
    disabled: isSending,
  });

  const formClassName = isSending ? `${formStyles.form} ${formStyles.submitting}` : formStyles.form;

  return (
    <section>
      <h1>Contacto</h1>

      <form className={formClassName} onSubmit={handleSubmit} noValidate>
        <div className={formStyles.row}>
          <Field id="contact-name" label="Nombre" required error={errors.name}>
            <input type="text" autoComplete="name" {...controlProps('name')} />
          </Field>
          <Field id="contact-email" label="Email" required error={errors.email}>
            <input type="email" autoComplete="email" {...controlProps('email')} />
          </Field>
        </div>

        <div className={formStyles.row}>
          <Field id="contact-phone" label="Teléfono" hint="Opcional" error={errors.phone}>
            <input type="tel" autoComplete="tel" {...controlProps('phone')} />
          </Field>
          <Field id="contact-subject" label="Asunto" required error={errors.subject}>
            <input type="text" {...controlProps('subject')} />
          </Field>
        </div>

        <Field id="contact-message" label="Mensaje" required error={errors.message}>
          <textarea rows="6" {...controlProps('message')} />
        </Field>

        {sendError && (
          <p className={`${formStyles.formAlert} ${alertStyles.alert} ${alertStyles.error}`} role="alert">
            {sendError}
          </p>
        )}
        {sent && (
          <p className={`${alertStyles.alert} ${alertStyles.success}`} role="status">
            ¡Gracias! Recibimos tu mensaje y te vamos a responder a la brevedad.
          </p>
        )}

        <div className={formStyles.actions}>
          <Button type="submit" disabled={isSending}>
            {isSending ? 'Enviando...' : 'Enviar'}
          </Button>
        </div>
      </form>
    </section>
  );
}

export default Contact;
