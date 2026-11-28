import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';
import {
  deactivateProduct,
  getProducts,
} from '../../services/productService.js';

function AdminProducts() {
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState(location.state?.message || '');
  const [deactivatingId, setDeactivatingId] = useState(null);

  const loadProducts = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message || 'No pudimos cargar los productos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDeactivate = async (product) => {
    const confirmed = window.confirm(
      `¿Querés desactivar el producto "${product.name}"?`
    );

    if (!confirmed) return;

    setDeactivatingId(product._id);
    setError('');
    setMessage('');

    try {
      await deactivateProduct(product._id);
      setMessage('Producto desactivado correctamente.');
      await loadProducts();
    } catch (err) {
      setError(err.message || 'No pudimos desactivar el producto.');
    } finally {
      setDeactivatingId(null);
    }
  };

  return (
    <section>
      <header>
        <h1>Administrar productos</h1>
        <Link to="/admin/productos/nuevo">Crear producto</Link>
      </header>

      {message && <p role="status">{message}</p>}
      {error && <p role="alert">{error}</p>}

      {loading ? (
        <p role="status">Cargando productos...</p>
      ) : products.length === 0 ? (
        <p>No hay productos disponibles.</p>
      ) : (
        <div>
          <p>{products.length} productos</p>

          <ul>
            {products.map((product) => (
              <li key={product._id}>
                <h2>{product.name}</h2>
                <p>Categoría: {product.category}</p>
                <p>Precio: ${Number(product.price).toLocaleString('es-AR')}</p>
                <p>Stock: {product.stock}</p>

                <Link to={`/admin/productos/${product._id}/editar`}>
                  Editar
                </Link>

                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  disabled={deactivatingId === product._id}
                  loading={deactivatingId === product._id}
                  onClick={() => handleDeactivate(product)}
                >
                  Desactivar
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export default AdminProducts;