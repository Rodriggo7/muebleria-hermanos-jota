import { useState, useEffect } from 'react';
import { getProductos } from '../services/productService.js';
import ProductList from '../components/ProductList';
import './Catalogo.css';

export default function Catalogo({ onAddToCart }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargarCatalogo() {
      try {
        const data = await getProductos();
        setProductos(data);
      } catch (err) {
        console.error('Error al cargar catálogo:', err);
        setError('No pudimos conectar con la casa taller. Por favor, reintenta en unos momentos.');
      } finally {
        setCargando(false);
      }
    }

    cargarCatalogo();
  }, []);

  return (
    <main className="page-container">
      <section className="catalogo-header">
        <span className="catalogo-badge">Atelier Artesanal · Buenos Aires</span>
        <h1 className="catalogo-title">Piezas con Alma y Tradición</h1>
        <p className="catalogo-description">
          Mobiliario creado en maderas nobles y fibras naturales con certificación ecológica FSC®.
        </p>
      </section>

      {/* Manejo de estados de interfaz */}
      {cargando && (
        <div className="state-container">
          <span className="material-symbols-outlined state-icon">eco</span>
          <p className="state-message">Nuestros artesanos están preparando el catálogo...</p>
        </div>
      )}

      {error && (
        <div className="state-container error-state">
          <span className="material-symbols-outlined state-icon">warning</span>
          <p className="state-message">{error}</p>
        </div>
      )}

      {!cargando && !error && (
        <ProductList productos={productos} onAddToCart={onAddToCart} />
      )}
    </main>
  );
}