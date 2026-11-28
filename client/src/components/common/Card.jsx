import styles from "./Card.module.css";
import cx from "../../utils/cx";

/** Tarjeta contenedora. variant: default | flat | elevated. */
export default function Card({
  as: Tag = "div",
  variant = "default",
  interactive = false,
  selected = false,
  loading = false,
  header,
  footer,
  className,
  children,
  ...rest
}) {
  return (
    <Tag
      className={cx(
        styles.card,
        variant !== "default" && styles[variant],
        interactive && styles.interactive,
        selected && styles.selected,
        loading && styles.loading,
        className
      )}
      aria-busy={loading || undefined}
      {...rest}
    >
      {header ? <div className={styles.header}>{header}</div> : null}
      <div className={styles.body}>{children}</div>
      {footer ? <div className={styles.footer}>{footer}</div> : null}
    </Tag>
  );
}
