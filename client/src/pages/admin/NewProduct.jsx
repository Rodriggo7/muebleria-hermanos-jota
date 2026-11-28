import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductForm from '../../components/forms/ProductForm.jsx';
import { createProduct } from '../../services/productService.js';

function NewProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async (productData) => {
    setLoading(true);
    setError('');

    try {
      await createProduct(productData);
      navigate('/admin/productos', {
        replace: true,
        state: { message: 'Producto creado correctamente.' },
      });
    } catch (err) {
      setError(err.message || 'No pudimos crear el producto.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <header>
        <h1>Nuevo producto</h1>
        <Link to="/admin/productos">Volver a productos</Link>
      </header>

      {error && <p role="alert">{error}</p>}

      <ProductForm
        onSubmit={handleCreate}
        submitLabel="Crear producto"
        loading={loading}
      />
    </section>
  );
}

export default NewProduct;