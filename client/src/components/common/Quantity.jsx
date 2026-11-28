import styles from "./Quantity.module.css";
import Icon from "./Icon";
import cx from "../../utils/cx";

/** Selector de cantidad − / + . El valor y los cambios los maneja quien lo use. */
export default function Quantity({
  value,
  min = 1,
  max,
  onDecrement,
  onIncrement,
  compact = false,
  error = false,
  loading = false,
  limitText,
  label = "Cantidad",
}) {
  const atMin = value <= min;
  const atMax = typeof max === "number" && value >= max;

  return (
    <div>
      <div
        className={cx(styles.quantity, compact && styles.compact, error && styles.error, loading && styles.loading)}
        role="group"
        aria-label={label}
      >
        <button type="button" className={styles.button} onClick={onDecrement} disabled={atMin} aria-label="Disminuir cantidad">
          <Icon name="minus" />
        </button>
        <span className={styles.value} aria-live="polite">
          {value}
        </span>
        <button type="button" className={styles.button} onClick={onIncrement} disabled={atMax} aria-label="Aumentar cantidad">
          <Icon name="plus" />
        </button>
      </div>
      {limitText ? <p className={styles.limit}>{limitText}</p> : null}
    </div>
  );
}
