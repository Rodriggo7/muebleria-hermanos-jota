import { useCart } from '../../hooks/useCart.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

import styles from './Cart.module.css';

// Totales y vaciado salen del contexto; finalizar la compra lo resuelve la página.
function CartSummary({ onCheckout, isProcessing = false, error = null }) {
  const { totalItems, totalPrice, clearCart } = useCart();

  return (
    <aside className={styles.summary} aria-labelledby="cart-summary-title">
      <h2 id="cart-summary-title" className={styles.summaryTitle}>
        Resumen
      </h2>

      <div className={styles.summaryRow}>
        <span>Productos</span>
        <span className={styles.summaryValue}>{totalItems}</span>
      </div>

      <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
        <span>Total</span>
        <span className={styles.summaryValue}>{formatCurrency(totalPrice)}</span>
      </div>

      <div className={styles.checkout}>
        <button type="button" onClick={onCheckout} disabled={isProcessing}>
          {isProcessing ? 'Procesando...' : 'Finalizar compra'}
        </button>
        <button type="button" onClick={clearCart} disabled={isProcessing}>
          Vaciar carrito
        </button>
        {error && <p role="alert">{error}</p>}
      </div>
    </aside>
  );
}

export default CartSummary;
