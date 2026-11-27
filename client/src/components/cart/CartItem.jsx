import { Link } from 'react-router-dom';
import Quantity from '../common/Quantity.jsx';
import { useCart } from '../../hooks/useCart.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

import styles from './Cart.module.css';

function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();
  const { _id, name, price, images, stock, quantity } = item;
  const detailUrl = `/productos/${_id}`;

  return (
    <li className={styles.item}>
      <div className={styles.itemMedia}>
        <img className={styles.itemImage} src={images?.[0]} alt={name} width="80" height="80" loading="lazy" />
      </div>

      <div className={styles.itemInfo}>
        <Link to={detailUrl} className={styles.itemName}>
          {name}
        </Link>
        <p className={styles.itemMeta}>{formatCurrency(price)} c/u</p>
      </div>

      <div className={styles.itemControls}>
        {/* El contexto limita la cantidad entre 1 y el stock. */}
        <Quantity
          value={quantity}
          min={1}
          max={stock ?? Infinity}
          onChange={(value) => updateQuantity(_id, value)}
          compact
          label={`Cantidad de ${name}`}
        />
        {/* Único cálculo del componente: subtotal visual de la fila. */}
        <span className={styles.itemTotal}>{formatCurrency(price * quantity)}</span>
        <button type="button" className={styles.remove} onClick={() => removeItem(_id)} aria-label={`Quitar ${name}`}>
          Quitar
        </button>
      </div>
    </li>
  );
}

export default CartItem;
