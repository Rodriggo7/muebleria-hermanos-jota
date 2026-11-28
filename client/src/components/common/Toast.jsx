import styles from "./Toast.module.css";
import Icon from "./Icon";
import cx from "../../utils/cx";

const ICON_BY_TYPE = { success: "success", error: "alert", warning: "warning", info: "info" };

/** Contenedor fijo donde se apilan los toasts. */
export function ToastContainer({ children }) {
  return <div className={styles.container}>{children}</div>;
}

/**
 * Notificación. type: success | error | warning | info.
 * `leaving` agrega la animación de salida; el temporizador y el cierre los maneja quien lo use.
 */
export default function Toast({ type = "info", message, actionLabel, onAction, onClose, leaving = false }) {
  return (
    <div
      className={cx(styles.toast, styles[type], leaving && styles.leaving)}
      role={type === "error" ? "alert" : "status"}
    >
      <Icon name={ICON_BY_TYPE[type]} className={styles.icon} />
      <p className={styles.message}>{message}</p>
      {actionLabel ? (
        <button type="button" className={styles.action} onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
      {onClose ? (
        <button type="button" className={styles.close} onClick={onClose} aria-label="Cerrar notificación">
          <Icon name="close" />
        </button>
      ) : null}
    </div>
  );
}
