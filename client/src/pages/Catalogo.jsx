import { useState, useEffect } from 'react';
import ProductList from '../components/ProductList';
import './Catalogo.css';

export default function Catalogo({ onAddToCart }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Tarea 9 / RF1: Petición a la API REST backend
    fetch('http://localhost:3001/api/productos')
      .then((res) => {
        if (!res.ok) {
          throw new Error('No se pudo conectar con el servidor de productos.');
        }
        return res.json();
      })
      .then((data) => {
        setProductos(data);
        setCargando(false);
      })
      .catch((err) => {
        console.error('Error al obtener catálogo:', err);
        setError(err.message);
        setCargando(false);
      });
  }, []);

  return (
    <main className="page-container">
      <section className="catalogo-header">
        <span className="catalogo-badge">Diseño Sustentable & Herencia Artesanal</span>
        <h1 className="catalogo-title">Catálogo Hermanos Jota</h1>
        <p className="catalogo-description">
          Mobiliario creado en maderas nobles y fibras naturales con certificación ecológica.
        </p>
      </section>

      {/* Manejo de estados de carga y error */}
      {cargando && (
        <div className="state-container">
          <p className="state-message">Nuestros artesanos están preparando el catálogo...</p>
        </div>
      )}

      {error && (
        <div className="state-container">
          <p className="state-message" style={{ color: '#ba1a1a' }}>{error}</p>
        </div>
      )}

      {!cargando && !error && (
        <ProductList productos={productos} onAddToCart={onAddToCart} />
      )}
    </main>
  );
}