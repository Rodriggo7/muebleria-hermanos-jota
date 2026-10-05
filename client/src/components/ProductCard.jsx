import { Link } from 'react-router-dom';
import './ProductCard.css';

export default function ProductCard({ producto, onAddToCart }) {
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(producto);
    }
  };

  return (
    <article className="product-card">
      <div className="card-image-container">
        <img 
          src={`/${producto.imagen}`} 
          alt={producto.nombre} 
          className="card-image"
        />
        <span className="card-category-badge">{producto.categoria}</span>
      </div>

      <div className="card-body">
        <div className="card-header-row">
          <h2 className="card-title">{producto.nombre}</h2>
          <span className="card-price">${producto.precio} USD</span>
        </div>
        <p className="card-subtitle">{producto.materiales}</p>
      </div>

      <div className="card-actions">
        <Link to={`/productos/${producto.id}`} className="btn-detail">
          Ver Detalle
        </Link>
        <button className="btn-add-cart" onClick={handleAddToCart}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>shopping_bag</span>
          Añadir
        </button>
      </div>
    </article>
  );
}