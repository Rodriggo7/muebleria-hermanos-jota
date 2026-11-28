import styles from "./ProductList.module.css";
import ProductCard from "./ProductCard";

/**
 * Grilla de productos (solo presentación).
 * Props:
 *  - products: [{ id, name, href, image, imageAlt, category, description, price, oldPrice, badge, unavailable }]
 *  - onAddToCart(product)   (opcional: muestra el botón en cada tarjeta)
 *  - addingId               (id del producto que se está agregando, para mostrar el estado de carga)
 * Los estados de carga, error y vacío los resuelve la página <Products />.
 */
export default function ProductList({ products = [], onAddToCart, addingId }) {
  return (
    <ul className={styles.grid}>
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard
            {...product}
            adding={addingId !== undefined && addingId === product.id}
            onAddToCart={onAddToCart ? () => onAddToCart(product) : undefined}
          />
        </li>
      ))}
    </ul>
  );
}
