import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button.jsx';
import { useCart } from '../hooks/useCart.js';
import { formatCurrency } from '../utils/formatCurrency.js';

import pageStyles from './Cart.module.css';
import cartStyles from '../components/cart/Cart.module.css';
import alertStyles from '../components/common/Alert.module.css';

// Ruta protegida (ver AppRouter): sin sesión, ProtectedRoute manda a /login
// con state.from = '/checkout' y Login vuelve acá después de ingresar.
function Checkout() {
  const { items, isEmpty, totalItems, totalPrice, checkout } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);

  const handleConfirm = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      // POST /orders con { items: [{ productId, quantity }] }. El contexto vacía el carrito solo si sale bien.
      setOrder(await checkout());
    } catch (err) {
      setError(err.message || 'No pudimos confirmar el pedido. Probá de nuevo.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Éxito: se muestra aunque el carrito ya esté vacío.
  if (order) {
    return (
      <section className="section u-stack u-gap-4" role="status">
        <h1>¡Pedido confirmado!</h1>
        <p>
          Tu número de pedido es <strong>#{String(order._id).slice(-6).toUpperCase()}</strong> por un total de{' '}
          <strong>{formatCurrency(order.total)}</strong>.
        </p>
        <div className="u-cluster u-gap-3">
          <Button to="/mis-pedidos">Ver mis pedidos</Button>
          <Button variant="outline" to="/productos">
            Seguir comprando
          </Button>
        </div>
      </section>
    );
  }

  if (isEmpty) {
    return (
      <section className={pageStyles.cart}>
        <header className={pageStyles.cartHeader}>
          <h1 className={pageStyles.title}>Finalizar compra</h1>
        </header>
        <div className={pageStyles.empty}>
          <p>No hay productos para comprar.</p>
          <Link to="/productos">Ver el catálogo</Link>
        </div>
      </section>
    );
  }

  return (
    <section className={pageStyles.cart}>
      <header className={pageStyles.cartHeader}>
        <h1 className={pageStyles.title}>Finalizar compra</h1>
      </header>

      <ul className={cartStyles.list} role="list">
        {items.map((item) => (
          <li key={item._id} className={cartStyles.item}>
            <div className={cartStyles.itemMedia}>
              {item.images?.[0] && (
                <img className={cartStyles.itemImage} src={item.images[0]} alt={item.name} width="80" height="80" />
              )}
            </div>
            <div className={cartStyles.itemInfo}>
              <span className={cartStyles.itemName}>{item.name}</span>
              <span className={cartStyles.itemMeta}>
                {item.quantity} × {formatCurrency(item.price)}
              </span>
            </div>
            <div className={cartStyles.itemControls}>
              <span className={cartStyles.itemTotal}>{formatCurrency(item.price * item.quantity)}</span>
            </div>
          </li>
        ))}
      </ul>

      <aside className={cartStyles.summary} aria-labelledby="checkout-summary-title">
        <h2 id="checkout-summary-title" className={cartStyles.summaryTitle}>
          Resumen
        </h2>
        <div className={cartStyles.summaryRow}>
          <span>Productos</span>
          <span className={cartStyles.summaryValue}>{totalItems}</span>
        </div>
        <div className={`${cartStyles.summaryRow} ${cartStyles.summaryTotal}`}>
          <span>Total</span>
          <span className={cartStyles.summaryValue}>{formatCurrency(totalPrice)}</span>
        </div>

        <div className={cartStyles.checkout}>
          <Button onClick={handleConfirm} disabled={isProcessing} fullWidth>
            {isProcessing ? 'Procesando...' : 'Confirmar pedido'}
          </Button>
          <Button variant="outline" to="/carrito" fullWidth>
            Volver al carrito
          </Button>
          {error && (
            <p className={`${alertStyles.alert} ${alertStyles.error}`} role="alert">
              {error}
            </p>
          )}
        </div>
      </aside>
    </section>
  );
}

export default Checkout;
