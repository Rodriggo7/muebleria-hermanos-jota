import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ProductForm from '../../components/forms/ProductForm.jsx';
import {
  getProductById,
  updateProduct,
} from '../../services/productService.js';

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    getProductById(id)
      .then((data) => {
        if (!ignore) setProduct(data);
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.message || 'No pudimos cargar el producto.');
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  const handleUpdate = async (productData) => {
    setSaving(true);
    setError('');

    try {
      await updateProduct(id, productData);
      navigate('/admin/productos', {
        replace: true,
        state: { message: 'Producto actualizado correctamente.' },
      });
    } catch (err) {
      setError(err.message || 'No pudimos actualizar el producto.');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <header>
        <h1>Editar producto</h1>
        <Link to="/admin/productos">Volver a productos</Link>
      </header>

      {loading && <p role="status">Cargando producto...</p>}

      {!loading && error && <p role="alert">{error}</p>}

      {!loading && product && (
        <ProductForm
          initialProduct={product}
          onSubmit={handleUpdate}
          submitLabel="Guardar cambios"
          loading={saving}
        />
      )}
    </section>
  );
}

export default EditProduct;