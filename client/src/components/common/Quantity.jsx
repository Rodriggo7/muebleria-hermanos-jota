
import styles from "./Quantity.module.css";
import Icon from "./Icon";
import cx from "../../utils/cx";

export default function Quantity({
  value,
  min = 1,
  max = Infinity,
  onChange,
  onDecrement,
  onIncrement,
  compact = false,
  disabled = false,
  error = false,
  loading = false,
  limit,
  limitText,
  label = "Cantidad",
}) {
  const atMin = value <= min;
  const atMax = value >= max;

  const decrement = onDecrement ?? (() => onChange?.(value - 1));
  const increment = onIncrement ?? (() => onChange?.(value + 1));

  return (
    <div>
      <div
        className={cx(
          styles.quantity,
          compact && styles.compact,
          error && styles.error,
          loading && styles.loading
        )}
        role="group"
        aria-label={label}
      >
        <button
          type="button"
          className={styles.button}
          onClick={decrement}
          disabled={disabled || loading || atMin}
          aria-label="Disminuir cantidad"
        >
          <Icon name="minus" />
        </button>

        <span className={styles.value} aria-live="polite">
          {value}
        </span>

        <button
          type="button"
          className={styles.button}
          onClick={increment}
          disabled={disabled || loading || atMax}
          aria-label="Aumentar cantidad"
        >
          <Icon name="plus" />
        </button>
      </div>

      {(limitText || limit) && (
        <p className={styles.limit}>{limitText || limit}</p>
      )}
    </div>
  );
}
