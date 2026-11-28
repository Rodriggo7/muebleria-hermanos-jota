
import styles from "./ProductList.module.css";
import ProductCard from "./ProductCard";

/**
 * Grilla de productos.
 *
 * Props:
 * - products: lista de productos.
 * - onAddToCart(product): función opcional para agregar al carrito.
 * - addingId: ID del producto que se está agregando.
 *
 * Los estados de carga, error y vacío los resuelve la página Products.
 */

export default function ProductList({
  products = [],
  onAddToCart,
  addingId,
}) {
  return (
    <ul className={styles.grid}>
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard
            {...product}
            adding={addingId === product.id}
            onAddToCart={
              typeof onAddToCart === "function"
                ? () => onAddToCart(product)
                : undefined
            }
          />
        </li>
      ))}
    </ul>
  );
}

