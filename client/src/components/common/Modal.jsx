import { useEffect, useRef } from "react";
import styles from "./Modal.module.css";
import Icon from "./Icon";
import cx from "../../utils/cx";

/**
 * Diálogo modal. size: sm | md | lg. `footer` recibe los botones de acción.
 * Se cierra con la X, con Escape o al hacer clic en el fondo (siempre vía onClose).
 */
export default function Modal({ open, onClose, title, size = "md", footer, children }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.activeElement;
    document.body.classList.add("is-scroll-locked");
    dialogRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape" && onClose) onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.classList.remove("is-scroll-locked");
      document.removeEventListener("keydown", onKeyDown);
      if (previous && previous.focus) previous.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={styles.overlay}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && onClose) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className={cx(styles.modal, styles[size])}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
      >
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Cerrar">
            <Icon name="close" />
          </button>
        </div>
        <div className={styles.body}>{children}</div>
        {footer ? <div className={styles.footer}>{footer}</div> : null}
      </div>
    </div>
  );
}
