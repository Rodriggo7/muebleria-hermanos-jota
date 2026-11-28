
import styles from "./Form.module.css";
import Input from "../common/Input";
import Button from "../common/Button";

/**
 * Formulario de registro.
 * Campos: name, email, password, confirmPassword (ajustar si el modelo de usuario pide otros).
 * Props: values, errors, formError, loading, loginHref, onChange, onSubmit
 */
export default function RegisterForm({
  values = { name: "", email: "", password: "", confirmPassword: "" },
  errors = {},
  formError,
  loading = false,
  loginHref = "#",
  onChange,
  onSubmit,
}) {
  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.header}>
        <h1 className={styles.title}>Crear cuenta</h1>
        <p className={styles.subtitle}>
          Registrate para seguir tus pedidos y guardar tus datos.
        </p>
      </div>

      {formError ? (
        <p className={styles.summaryError} role="alert">
          {formError}
        </p>
      ) : null}

      <div className={styles.grid}>
        <Input
          className={styles.fullRow}
          label="Nombre completo"
          name="name"
          autoComplete="name"
          required
          value={values.name}
          onChange={onChange}
          error={errors.name}
          disabled={loading}
        />
        <Input
          className={styles.fullRow}
          label="Correo electrónico"
          type="email"
          name="email"
          autoComplete="email"
          required
          value={values.email}
          onChange={onChange}
          error={errors.email}
          disabled={loading}
        />
        <Input
          label="Contraseña"
          type="password"
          name="password"
          autoComplete="new-password"
          required
          value={values.password}
          onChange={onChange}
          error={errors.password}
          hint={errors.password ? undefined : "Elegí una contraseña segura."}
          disabled={loading}
        />
        <Input
          label="Repetir contraseña"
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          required
          value={values.confirmPassword}
          onChange={onChange}
          error={errors.confirmPassword}
          disabled={loading}
        />
      </div>

      <div className={`${styles.actions} ${styles.actionsStacked}`}>
        <Button type="submit" size="lg" fullWidth loading={loading}>
          Crear cuenta
        </Button>
      </div>

      <p className={styles.footnote}>
        ¿Ya tenés cuenta? <a href={loginHref}>Ingresá</a>
      </p>
    </form>
  );
}
