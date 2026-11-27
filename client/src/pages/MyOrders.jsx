import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../components/common/Loader.jsx';
import { getMyOrders } from '../services/orderService.js';
import { formatCurrency } from '../utils/formatCurrency.js';

import styles from './MyOrders.module.css';

// Estados del modelo Order (backend/src/models/Order.js).
const STATUS = {
  pending: { label: 'Pendiente', className: styles.statusPending },
  processing: { label: 'En preparación', className: styles.statusProcessing },
  shipped: { label: 'Enviado', className: null }, // Pam no definió un color propio para "enviado".
  delivered: { label: 'Entregado', className: styles.statusDelivered },
  cancelled: { label: 'Cancelado', className: styles.statusCancelled },
};

const formatDate = (value) =>
  new Date(value).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });

function MyOrders() {
  const [result, setResult] = useState({ status: 'loading', orders: [], error: null });

  useEffect(() => {
    let ignore = false;
    getMyOrders()
      .then((orders) => {
        if (!ignore) setResult({ status: 'ready', orders, error: null });
      })
      .catch((err) => {
        if (!ignore) setResult({ status: 'error', orders: [], error: err.message || 'No pudimos cargar tus pedidos' });
      });
    return () => {
      ignore = true;
    };
  }, []);

  const { status, orders, error } = result;

  return (
    <section className={styles.page}>
      <h1>Mis pedidos</h1>

      {status === 'loading' && (
        <div className={styles.loading}>
          <Loader label="Cargando pedidos…" />
        </div>
      )}

      {status === 'error' && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      {status === 'ready' && orders.length === 0 && (
        <div className={styles.empty}>
          <p>Todavía no hiciste ningún pedido.</p>
          <Link to="/productos">Ver el catálogo</Link>
        </div>
      )}

      {status === 'ready' && orders.length > 0 && (
        <ul className={styles.list} role="list">
          {orders.map((order) => {
            const orderStatus = STATUS[order.status] ?? { label: order.status, className: null };
            return (
              <li key={order._id} className={styles.order}>
                <div className={styles.orderHeader}>
                  <div>
                    <p className={styles.orderId}>Pedido #{order._id.slice(-6).toUpperCase()}</p>
                    {order.createdAt && <p className={styles.date}>{formatDate(order.createdAt)}</p>}
                  </div>
                  <span className={[styles.status, orderStatus.className].filter(Boolean).join(' ')}>
                    {orderStatus.label}
                  </span>
                </div>

                <ul className={styles.items} role="list">
                  {order.items.map((item, index) => (
                    <li key={`${item.product}-${index}`} className={styles.itemRow}>
                      <span className={styles.itemName}>
                        {item.productName} <span className={styles.itemQty}>× {item.quantity}</span>
                      </span>
                      <span>{formatCurrency(item.subtotal)}</span>
                    </li>
                  ))}
                </ul>

                <div className={styles.total}>
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default MyOrders;
