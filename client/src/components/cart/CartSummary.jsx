import Button from '../common/Button.jsx';
import { useCart } from '../../hooks/useCart.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

import styles from './Cart.module.css';

// Totales y vaciado salen del contexto. "Finalizar compra" lleva a /checkout (ruta protegida).
function CartSummary() {
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
        <Button to="/checkout" fullWidth>
          Finalizar compra
        </Button>
        <Button variant="ghost" onClick={clearCart} fullWidth>
          Vaciar carrito
        </Button>
      </div>
    </aside>
  );
}

export default CartSummary;
