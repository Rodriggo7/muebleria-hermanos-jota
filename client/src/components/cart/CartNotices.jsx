import Button from '../common/Button.jsx';
import Loader from '../common/Loader.jsx';
import { useCart } from '../../hooks/useCart.js';

import alertStyles from '../common/Alert.module.css';

// Estado de la verificación del carrito contra la API y avisos de cambios.
function CartNotices() {
  const { syncStatus, notices, dismissNotices, refreshCart } = useCart();

  return (
    <>
      {syncStatus === 'syncing' && <Loader size="sm" label="Verificando precios y stock…" />}

      {syncStatus === 'error' && (
        <div className={`${alertStyles.alert} ${alertStyles.warning}`} role="alert">
          <p className={alertStyles.message}>No pudimos verificar precios y stock. Revisá tu conexión.</p>
          <Button size="sm" variant="outline" onClick={refreshCart}>
            Reintentar
          </Button>
        </div>
      )}

      {notices.length > 0 && (
        <div className={`${alertStyles.alert} ${alertStyles.info}`} role="status">
          <ul className={alertStyles.content}>
            {notices.map((notice) => (
              <li key={notice} className={alertStyles.message}>
                {notice}
              </li>
            ))}
          </ul>
          <button type="button" className={alertStyles.close} onClick={dismissNotices} aria-label="Cerrar avisos">
            ×
          </button>
        </div>
      )}
    </>
  );
}

export default CartNotices;
