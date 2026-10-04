import ProductCard from './ProductCard';
import './ProductList.css';

export default function ProductList({ productos, onAddToCart }) {
  return (
    <div className="product-grid">
      {productos.map((producto) => (
        <ProductCard 
          key={producto.id} 
          producto={producto} 
          onAddToCart={onAddToCart} 
        />
      ))}
    </div>
  );
}