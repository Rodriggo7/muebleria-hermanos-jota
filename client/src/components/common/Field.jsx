import { Children, cloneElement, isValidElement } from 'react';
import styles from './Input.module.css';

// Campo de formulario con la estructura de Input.module.css:
// .field > label.label (+ .required) > control > .hint | .errorMessage
// Recibe un único control (input, textarea o select) y le agrega id, clases y atributos de accesibilidad.
function Field({ id, label, required = false, error, hint, children }) {
  const control = Children.only(children);
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  const controlClasses = [
    styles.control,
    control.type === 'textarea' && styles.textarea,
    control.type === 'select' && styles.select,
    control.props.className,
  ]
    .filter(Boolean)
    .join(' ');

  const enhancedControl = isValidElement(control)
    ? cloneElement(control, {
        id,
        className: controlClasses,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': describedBy,
        'aria-required': required || undefined,
      })
    : control;

  return (
    <div className={error ? `${styles.field} ${styles.isError}` : styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && (
          <span className={styles.required} aria-hidden="true">
            *
          </span>
        )}
      </label>
      {enhancedControl}
      {hint && !error && (
        <p id={`${id}-hint`} className={styles.hint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className={styles.errorMessage}>
          {error}
        </p>
      )}
    </div>
  );
}

export default Field;
