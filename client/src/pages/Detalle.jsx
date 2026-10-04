// client/src/pages/Detalle.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductoById } from '../services/productService';
import ProductDetail from '../components/ProductDetail';
import './Detalle.css';

export default function Detalle({ onAddToCart }) {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargarProducto() {
      try {
        const data = await getProductoById(id);
        setProducto(data);
      } catch (err) {
        console.error('Error al cargar detalle:', err);
        setError('Ocurrió un inconveniente al consultar la pieza.');
      } finally {
        setCargando(false);
      }
    }

    cargarProducto();
  }, [id]);

  return (
    <main className="page-container">
      {/* Botón de volver */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/productos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none', color: 'var(--siena-tostado)', fontWeight: 600, fontSize: '0.9rem' }}>
          <span className="material-symbols-outlined">arrow_back</span>
          Volver al Catálogo
        </Link>
      </div>

      {cargando && (
        <div className="state-container">
          <p className="state-message">Consultando los registros del taller...</p>
        </div>
      )}

      {error && (
        <div className="state-container error-state">
          <p className="state-message">{error}</p>
        </div>
      )}

      {/* Manejo de 404 - Producto Inexistente */}
      {!cargando && !error && !producto && (
        <div className="state-container">
          <span className="material-symbols-outlined state-icon" style={{ fontSize: '40px' }}>search_off</span>
          <h2 style={{ fontFamily: 'var(--font-editorial)', color: 'var(--siena-tostado)', marginTop: '0.5rem' }}>
            Pieza no encontrada
          </h2>
          <p className="state-message" style={{ marginTop: '0.5rem' }}>
            El mueble solicitado con el código ID {id} no existe en nuestro catálogo actual.
          </p>
          <Link to="/productos" className="btn-detail" style={{ display: 'inline-block', marginTop: '1.5rem', width: 'auto', padding: '0.8rem 1.5rem' }}>
            Explorar otras piezas
          </Link>
        </div>
      )}

      {!cargando && !error && producto && (
        <ProductDetail producto={producto} onAddToCart={onAddToCart} />
      )}
    </main>
  );
}