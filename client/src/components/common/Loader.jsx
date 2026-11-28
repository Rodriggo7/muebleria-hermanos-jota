import styles from "./Loader.module.css";
import cx from "../../utils/cx";

/**
 * Spinner accesible.
 * layout: "inline" (por defecto) | "center" (dentro de una sección) | "overlay" (sobre un contenedor relativo) | "fullPage"
 */
export default function Loader({ size = "md", layout = "inline", text, label = "Cargando", className }) {
  const spinner = (
    <span className={cx(styles.loader, size !== "md" && styles[size])} aria-hidden="true" />
  );

  return (
    <div
      role="status"
      aria-live="polite"
      className={cx(layout !== "inline" && styles[layout], layout === "inline" && "u-cluster", className)}
    >
      {spinner}
      {text ? <span>{text}</span> : <span className="u-sr-only">{label}</span>}
    </div>
  );
}

/** Bloque esqueleto. variant: "block" | "text" | "image". */
export function Skeleton({ variant = "block", short = false, className, style }) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        styles.skeleton,
        variant === "text" && styles.skeletonText,
        variant === "text" && short && styles.skeletonTextShort,
        variant === "image" && styles.skeletonImage,
        className
      )}
      style={style}
    />
  );
}
