import { useEffect, useState } from 'react';
import { getMyOrders } from '../services/orderService.js';
import styles from './MyOrders.module.css';

const CURRENCY_FORMATTER = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
});

const DATE_FORMATTER = new Intl.DateTimeFormat('es-AR', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

const STATUS_LABELS = {
  pending: 'Pendiente',
  processing: 'En preparación',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

const STATUS_CLASSES = {
  pending: styles.statusPending,
  processing: styles.statusProcessing,
  shipped: styles.statusProcessing,
  delivered: styles.statusDelivered,
  cancelled: styles.statusCancelled,
};

function formatCurrency(value) {
  return CURRENCY_FORMATTER.format(Number(value) || 0);
}

function formatDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Fecha no disponible';
  }

  return DATE_FORMATTER.format(date);
}

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadOrders() {
      try {
        setLoading(true);
        setError('');

        const result = await getMyOrders();

        if (!ignore) {
          setOrders(Array.isArray(result) ? result : []);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || 'No pudimos cargar tus pedidos.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadOrders();

    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return (
      <section className={styles.page}>
        <p className={styles.loading} role="status">
          Cargando tus pedidos...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.page}>
        <h1>Mis pedidos</h1>
        <p className={styles.error} role="alert">
          {error}
        </p>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <h1>Mis pedidos</h1>

      {orders.length === 0 ? (
        <p className={styles.empty}>
          Todavía no realizaste ningún pedido.
        </p>
      ) : (
        <ul className={styles.list}>
          {orders.map((order) => {
            const status = order.status || 'pending';
            const statusClass =
              STATUS_CLASSES[status] || '';

            return (
              <li className={styles.order} key={order._id}>
                <div className={styles.orderHeader}>
                  <div>
                    <h2 className={styles.orderId}>
                      Pedido #{order._id}
                    </h2>

                    <p className={styles.date}>
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <span
                    className={`${styles.status} ${statusClass}`}
                  >
                    {STATUS_LABELS[status] || status}
                  </span>
                </div>

                <ul className={styles.items}>
                  {(order.items || []).map((item, index) => (
                    <li
                      className={styles.itemRow}
                      key={`${order._id}-${item.product || index}`}
                    >
                      <span className={styles.itemName}>
                        {item.productName || 'Producto'}
                      </span>

                      <span className={styles.itemQty}>
                        {item.quantity} × {formatCurrency(item.unitPrice)}
                      </span>
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