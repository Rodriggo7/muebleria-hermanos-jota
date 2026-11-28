import styles from "./Badge.module.css";
import cx from "../../utils/cx";

/**
 * Etiqueta. variant: neutral | new | sale | featured | pending | processing | shipped | delivered | cancelled.
 */
export default function Badge({ variant = "neutral", size, dot = false, className, children }) {
  return (
    <span className={cx(styles.badge, styles[variant], size === "lg" && styles.lg, dot && styles.dot, className)}>
      {children}
    </span>
  );
}

// Equivalencia estado de pedido -> variante visual y texto.
// TODO (Maxi): confirmar que las claves coincidan con los estados reales de Order.js.
const ORDER_STATUS = {
  pending: { variant: "pending", label: "Pendiente" },
  processing: { variant: "processing", label: "En preparación" },
  shipped: { variant: "shipped", label: "Enviado" },
  delivered: { variant: "delivered", label: "Entregado" },
  cancelled: { variant: "cancelled", label: "Cancelado" },
};

/** Badge de estado de pedido; si el estado no se conoce, se muestra neutro con su texto original. */
export function OrderStatusBadge({ status, size = "lg" }) {
  const known = ORDER_STATUS[status];
  return (
    <Badge variant={known ? known.variant : "neutral"} size={size} dot>
      {known ? known.label : status}
    </Badge>
  );
}
