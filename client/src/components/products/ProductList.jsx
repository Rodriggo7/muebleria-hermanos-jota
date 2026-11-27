import ProductCard from './ProductCard.jsx';

// Las clases de la grilla y del estado vacío viven en el CSS de la página
// (Products.module.css), por eso llegan como props.
function ProductList({ products = [], className, emptyClassName }) {
  if (products.length === 0) {
    return <p className={emptyClassName}>No encontramos productos</p>;
  }

  return (
    <div className={className}>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}

export default ProductList;
