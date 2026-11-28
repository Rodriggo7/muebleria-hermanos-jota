
import styles from "./Form.module.css";
import Input from "../common/Input";
import Button from "../common/Button";

/**
 * Formulario de ingreso (solo presentación, campos controlados desde afuera).
 * Props:
 *  - values: { email, password }       onChange(event)      onSubmit(event)
 *  - errors: { email, password }       formError (texto general)
 *  - loading, registerHref, forgotHref (opcional)
 * Usa noValidate: los mensajes de error se muestran desde las props, no desde el navegador.
 */
export default function LoginForm({
  values = { email: "", password: "" },
  errors = {},
  formError,
  loading = false,
  registerHref = "#",
  forgotHref,
  onChange,
  onSubmit,
}) {
  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.header}>
        <h1 className={styles.title}>Ingresar</h1>
        <p className={styles.subtitle}>
          Entrá a tu cuenta para ver tus pedidos y comprar más rápido.
        </p>
      </div>

      {formError ? (
        <p className={styles.summaryError} role="alert">
          {formError}
        </p>
      ) : null}

      <Input
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
        autoComplete="current-password"
        required
        value={values.password}
        onChange={onChange}
        error={errors.password}
        disabled={loading}
      />

      {forgotHref ? (
        <a className={styles.helperLink} href={forgotHref}>
          ¿Olvidaste tu contraseña?
        </a>
      ) : null}

      <div className={`${styles.actions} ${styles.actionsStacked}`}>
        <Button type="submit" size="lg" fullWidth loading={loading}>
          Ingresar
        </Button>
      </div>

      <p className={styles.footnote}>
        ¿No tenés cuenta? <a href={registerHref}>Registrate</a>
      </p>
    </form>
  );
}
