import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';
import Loader from '../../components/common/Loader.jsx';
import Toast from '../../components/common/Toast.jsx';
import { deactivateProduct, getProducts } from '../../services/productService.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

function AdminProducts() {
  const location = useLocation();
  const navigate = useNavigate();

  const [result, setResult] = useState({ status: 'loading', products: [], error: null });
  const [pendingId, setPendingId] = useState(null);
  // NewProduct y EditProduct vuelven acá con { toast } en el state de la navegación.
  const [toast, setToast] = useState(() =>
    location.state?.toast ? { message: location.state.toast, type: 'success' } : null
  );

  useEffect(() => {
    let ignore = false;
    getProducts()
      .then((products) => {
        if (!ignore) setResult({ status: 'ready', products, error: null });
      })
      .catch((err) => {
        if (!ignore) setResult({ status: 'error', products: [], error: err.message || 'No pudimos cargar los productos' });
      });
    return () => {
      ignore = true;
    };
  }, []);

  // Limpia el aviso del historial para que no reaparezca al recargar.
  useEffect(() => {
    if (location.state?.toast) navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  const closeToast = useCallback(() => setToast(null), []);

  const handleDeactivate = async (product) => {
    const confirmed = window.confirm(`¿Desactivar "${product.name}"? Va a dejar de mostrarse en la tienda.`);
    if (!confirmed) return;

    setPendingId(product._id);
    try {
      await deactivateProduct(product._id);
      setResult((prev) => ({ ...prev, products: prev.products.filter((p) => p._id !== product._id) }));
      setToast({ message: `"${product.name}" se desactivó`, type: 'success' });
    } catch (err) {
      setToast({ message: err.message || 'No pudimos desactivar el producto', type: 'error' });
    } finally {
      setPendingId(null);
    }
  };

  const { status, products, error } = result;

  return (
    <div className="u-stack u-gap-4">
      <div className="u-cluster u-between u-items-center">
        <h2>Productos</h2>
        <Button to="/admin/productos/nuevo">Nuevo producto</Button>
      </div>

      {status === 'loading' && <Loader center label="Cargando productos…" />}

      {status === 'error' && <p role="alert">{error}</p>}

      {status === 'ready' && products.length === 0 && <p className="u-text-muted">No hay productos activos.</p>}

      {status === 'ready' && products.length > 0 && (
        <ul className="u-stack u-gap-3" role="list">
          {products.map((product) => (
            <li key={product._id} className="u-surface u-p-4 u-cluster u-between u-items-center u-gap-4">
              <div className="u-cluster u-items-center u-gap-4">
                {product.images?.[0] && (
                  <img
                    src={product.images[0]}
                    alt=""
                    width="64"
                    height="64"
                    loading="lazy"
                    style={{ width: 64, height: 64, objectFit: 'cover' }}
                  />
                )}
                <div>
                  <Link to={`/productos/${product._id}`} className="u-font-semibold">
                    {product.name}
                  </Link>
                  <p className="u-text-sm u-text-muted">
                    {product.category} · {formatCurrency(product.price)} ·{' '}
                    {product.stock > 0 ? `${product.stock} en stock` : 'Sin stock'}
                  </p>
                </div>
              </div>
              <div className="u-cluster u-gap-2">
                <Button size="sm" variant="outline" to={`/admin/productos/${product._id}/editar`}>
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDeactivate(product)}
                  disabled={pendingId !== null}
                  aria-label={`Desactivar ${product.name}`}
                >
                  {pendingId === product._id ? 'Desactivando...' : 'Desactivar'}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Toast message={toast?.message} type={toast?.type} onClose={closeToast} />
    </div>
  );
}

export default AdminProducts;
