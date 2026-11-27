import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

import styles from './ProductCard.module.css';

function ProductCard({ product }) {
  const { addItem } = useCart();
  const { _id, name, price, category, stock, images } = product;

  const isSoldOut = stock === 0;
  const detailUrl = `/productos/${_id}`;

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        {/* Fuera del orden de tabulación: el link del nombre ya lleva al mismo lugar. */}
        <Link to={detailUrl} tabIndex={-1} aria-hidden="true">
          <img
            className={styles.image}
            src={images?.[0]}
            alt={name}
            loading="lazy"
            width="600"
            height="450"
          />
        </Link>
        {isSoldOut && <p className={styles.soldOut}>Sin stock</p>}
      </div>

      <div className={styles.body}>
        <p className={styles.category}>{category}</p>
        <h3 className={styles.name}>
          <Link to={detailUrl} className={styles.nameLink}>
            {name}
          </Link>
        </h3>
        <div className={styles.priceRow}>
          <span className={styles.price}>{formatCurrency(price)}</span>
        </div>
      </div>

      <div className={styles.actions}>
        <button type="button" onClick={() => addItem(product, 1)} disabled={isSoldOut}>
          {isSoldOut ? 'Sin stock' : 'Agregar al carrito'}
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
