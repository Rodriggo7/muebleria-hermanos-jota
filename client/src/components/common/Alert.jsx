import styles from "./Alert.module.css";
import Icon from "./Icon";
import cx from "../../utils/cx";

const ICON_BY_TYPE = { success: "success", error: "alert", warning: "warning", info: "info" };

/** Mensaje en línea. type: info (por defecto) | success | error | warning. */
export default function Alert({ type = "info", title, children, onClose, className }) {
  return (
    <div
      className={cx(styles.alert, styles[type], className)}
      role={type === "error" || type === "warning" ? "alert" : "status"}
    >
      <Icon name={ICON_BY_TYPE[type]} className={styles.icon} />
      <div className={styles.content}>
        {title ? <p className={styles.title}>{title}</p> : null}
        <div className={styles.message}>{children}</div>
      </div>
      {onClose ? (
        <button type="button" className={styles.close} onClick={onClose} aria-label="Cerrar mensaje">
          <Icon name="close" />
        </button>
      ) : null}
    </div>
  );
}
