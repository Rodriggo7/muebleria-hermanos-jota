import { useEffect } from 'react';
import styles from './Toast.module.css';

// Aviso flotante. Se muestra mientras haya `message` y se cierra solo a los `duration` ms.
// type: success, error, warning, info.
function Toast({ message, type = 'info', onClose, duration = 4000 }) {
  useEffect(() => {
    if (!message || !duration) return undefined;
    const timer = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  return (
    <div className={styles.container} aria-live="polite">
      {message && (
        <div className={`${styles.toast} ${styles[type] ?? ''}`} role={type === 'error' ? 'alert' : 'status'}>
          <span className={styles.message}>{message}</span>
          {onClose && (
            <button type="button" className={styles.close} onClick={onClose} aria-label="Cerrar aviso">
              ×
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default Toast;
