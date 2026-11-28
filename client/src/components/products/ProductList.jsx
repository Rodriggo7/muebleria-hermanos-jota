import ProductCard from "./ProductCard.jsx";

export default function ProductList({
  products = [],
  className,
  emptyClassName,
}) {
  if (products.length === 0) {
    return (
      <p className={emptyClassName}>
        No encontramos productos
      </p>
    );
  }

  return (
    <div className={className}>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}