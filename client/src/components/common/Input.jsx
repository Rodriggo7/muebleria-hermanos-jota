
import { useId, useState } from "react";
import styles from "./Input.module.css";
import Icon from "./Icon";
import cx from "../../utils/cx";

/**
 * Campo de formulario completo (label + control + ayuda + error/éxito).
 * type: text | email | password | number | tel | textarea | select | checkbox | radio.
 * - select: pasar <option> como children.
 * - Todo lo demás (name, value, onChange, onBlur, autoComplete, placeholder…) pasa directo al control.
 * - Los mensajes (error, success, hint) llegan por props: este componente no valida nada.
 */
export default function Input({
  id,
  label,
  type = "text",
  required = false,
  hint,
  error,
  success,
  loading = false,
  disabled = false,
  className,
  children,
  ...rest
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const hintId = `${fieldId}-hint`;
  const messageId = `${fieldId}-message`;
  const [showPassword, setShowPassword] = useState(false);

  const describedBy = cx(hint && hintId, (error || success) && messageId) || undefined;
  const common = {
    id: fieldId,
    disabled,
    required,
    "aria-invalid": error ? "true" : undefined,
    "aria-describedby": describedBy,
  };

  const state = cx(
    error && styles.isError,
    !error && success && styles.isSuccess,
    loading && styles.isLoading,
    disabled && styles.isDisabled
  );

  // Checkbox y radio: fila con control + texto
  if (type === "checkbox" || type === "radio") {
    return (
      <div className={cx(styles.field, state, className)}>
        <label className={styles.check} htmlFor={fieldId}>
          <input
            type={type}
            className={cx(styles.checkInput, type === "radio" && styles.radio)}
            {...common}
            {...rest}
          />
          <span className={styles.checkLabel}>{label}</span>
        </label>
        {error ? (
          <p id={messageId} className={styles.errorMessage}>
            {error}
          </p>
        ) : null}
      </div>
    );
  }

  const isPassword = type === "password";
  const controlClass = cx(
    styles.control,
    type === "textarea" && styles.textarea,
    type === "select" && styles.select,
    isPassword && styles.hasAddon
  );

  let control;
  if (type === "textarea") {
    control = <textarea className={controlClass} {...common} {...rest} />;
  } else if (type === "select") {
    control = (
      <select className={controlClass} {...common} {...rest}>
        {children}
      </select>
    );
  } else {
    control = (
      <input
        type={isPassword && showPassword ? "text" : type}
        className={controlClass}
        {...common}
        {...rest}
      />
    );
  }

  return (
    <div className={cx(styles.field, state, className)}>
      {label ? (
        <label className={styles.label} htmlFor={fieldId}>
          {label}
          {required ? (
            <span className={styles.required} aria-hidden="true">*</span>
          ) : null}
        </label>
      ) : null}
      <div className={styles.inputWrap}>
        {control}
        {isPassword ? (
          <button
            type="button"
            className={styles.addon}
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            aria-pressed={showPassword}
          >
            <Icon name={showPassword ? "eye-off" : "eye"} />
          </button>
        ) : null}
      </div>
      {hint ? (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={messageId} className={styles.errorMessage}>
          {error}
        </p>
      ) : success ? (
        <p id={messageId} className={styles.successMessage}>
          {success}
        </p>
      ) : null}
    </div>
  );
}
