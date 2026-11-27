import { Fragment, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Quantity from '../components/common/Quantity.jsx';
import { useCart } from '../hooks/useCart.js';
import { getProductById } from '../services/productService.js';
import { formatCurrency } from '../utils/formatCurrency.js';

// TODO: reemplazar por: import styles from './ProductDetail.module.css';
const styles = {};

function ProductDetail() {
  const { id } = useParams();

  // Resultado marcado con el id que lo generó: si no coincide, se está cargando.
  const [result, setResult] = useState({ id: null, product: null, error: null });
  const isLoading = result.id !== id;

  useEffect(() => {
    let ignore = false;

    getProductById(id)
      .then((product) => {
        if (!ignore) setResult({ id, product, error: null });
      })
      .catch((err) => {
        if (!ignore) setResult({ id, product: null, error: err.message || 'Producto no encontrado' });
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  return (
    <section className={styles.page}>
      <nav className={styles.breadcrumb} aria-label="Navegación">
        <Link to="/productos">← Volver al catálogo</Link>
      </nav>

      {isLoading && (
        <div className={styles.loading} role="status">
          Cargando producto…
        </div>
      )}

      {!isLoading && result.error && (
        <div className={styles.error} role="alert">
          <p>{result.error}</p>
          <Link to="/productos">Ver el catálogo</Link>
        </div>
      )}

      {!isLoading && result.product && <ProductView key={result.product._id} product={result.product} />}
    </section>
  );
}

// Separado y con key: al cambiar de producto, la cantidad y el aviso "Agregado" arrancan de cero.
function ProductView({ product }) {
  const { addItem, getQuantity } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const { _id, name, description, price, category, stock, images, specs } = product;

  const inCart = getQuantity(_id);
  const available = Math.max(0, (Number(stock) || 0) - inCart);
  const isSoldOut = available === 0;
  // Si el disponible bajó (por ejemplo, se agregó al carrito), la cantidad no lo supera.
  const selected = Math.min(Math.max(quantity, 1), Math.max(available, 1));

  const handleAdd = () => {
    addItem(product, selected);
    setQuantity(1);
    setAdded(true);
  };

  const handleQuantityChange = (value) => {
    setQuantity(value);
    setAdded(false);
  };

  return (
    <div className={styles.layout}>
      <div className={styles.gallery}>
        <img className={styles.mainImage} src={images?.[0]} alt={name} width="800" height="600" />
      </div>

      <div className={styles.info}>
        <p className={styles.category}>{category}</p>
        <h1 className={styles.title}>{name}</h1>
        <p className={styles.price}>{formatCurrency(price)}</p>
        <p className={styles.description}>{description}</p>

        <p className={isSoldOut ? `${styles.stock} ${styles.outOfStock}` : styles.stock}>
          {isSoldOut ? 'Sin stock' : `${available} ${available === 1 ? 'disponible' : 'disponibles'}`}
          {inCart > 0 && ` (ya tenés ${inCart} en el carrito)`}
        </p>

        {Array.isArray(specs) && specs.length > 0 && (
          <dl className={styles.specs}>
            {specs.map(({ label, value }) => (
              <Fragment key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </Fragment>
            ))}
          </dl>
        )}

        <div className={styles.actions}>
          <Quantity
            value={selected}
            min={1}
            max={Math.max(available, 1)}
            onChange={handleQuantityChange}
            disabled={isSoldOut}
          />
          <button type="button" onClick={handleAdd} disabled={isSoldOut}>
            {isSoldOut ? 'Sin stock' : 'Agregar al carrito'}
          </button>
        </div>

        {added && (
          <p role="status">
            Agregado. <Link to="/carrito">Ver carrito</Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;
