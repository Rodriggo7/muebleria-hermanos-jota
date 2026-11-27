// TODO: reemplazar por: import styles from './Quantity.module.css';
const styles = {};

// Selector de cantidad: solo dibuja y avisa cambios. Los límites los decide quien lo usa.
function Quantity({ value, min = 1, max = Infinity, onChange, compact = false, disabled = false, limit, label = 'Cantidad' }) {
  const className = compact ? `${styles.quantity} ${styles.compact}` : styles.quantity;

  return (
    <>
      <div className={className} role="group" aria-label={label}>
        <button
          type="button"
          className={styles.button}
          onClick={() => onChange(value - 1)}
          disabled={disabled || value <= min}
          aria-label="Restar uno"
        >
          −
        </button>
        <span className={styles.value} aria-live="polite">
          {value}
        </span>
        <button
          type="button"
          className={styles.button}
          onClick={() => onChange(value + 1)}
          disabled={disabled || value >= max}
          aria-label="Sumar uno"
        >
          +
        </button>
      </div>
      {limit && <p className={styles.limit}>{limit}</p>}
    </>
  );
}

export default Quantity;
