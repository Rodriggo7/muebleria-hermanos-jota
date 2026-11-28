import styles from "./EmptyState.module.css";
import Icon from "./Icon";
import cx from "../../utils/cx";

/** Estado vacío o de error de carga. Dice qué pasó (title) y qué hacer (text / actions). */
export default function EmptyState({ icon = "info", title, text, actions, variant = "default", compact = false, className }) {
  const isError = variant === "error";
  return (
    <div className={cx(styles.empty, isError && styles.error, compact && styles.compact, className)} role={isError ? "alert" : undefined}>
      <span className={styles.icon}>
        <Icon name={isError ? "alert" : icon} />
      </span>
      <h2 className={styles.title}>{title}</h2>
      {text ? <p className={styles.text}>{text}</p> : null}
      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </div>
  );
}
