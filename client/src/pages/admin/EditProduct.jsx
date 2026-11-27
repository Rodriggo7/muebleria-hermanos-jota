import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Loader from '../../components/common/Loader.jsx';
import ProductForm from '../../components/products/ProductForm.jsx';
import { getProductById, updateProduct } from '../../services/productService.js';

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Resultado marcado con el id: si no coincide con la URL, se está cargando.
  const [result, setResult] = useState({ id: null, product: null, error: null });
  const isLoading = result.id !== id;

  useEffect(() => {
    let ignore = false;
    getProductById(id)
      .then((product) => {
        if (!ignore) setResult({ id, product, error: null });
      })
      .catch((err) => {
        if (!ignore) setResult({ id, product: null, error: err.message || 'Producto no encontrado' });
      });
    return () => {
      ignore = true;
    };
  }, [id]);

  const handleSubmit = async (data) => {
    await updateProduct(id, data);
    navigate('/admin/productos', { state: { toast: 'Producto actualizado' } });
  };

  if (isLoading) return <Loader center label="Cargando producto…" />;

  if (result.error) {
    return (
      <div role="alert">
        <p>{result.error}</p>
        <Link to="/admin/productos">Volver al listado</Link>
      </div>
    );
  }

  return (
    <div className="u-stack u-gap-4">
      <h2>Editar: {result.product.name}</h2>
      <ProductForm
        key={result.product._id}
        initialProduct={result.product}
        onSubmit={handleSubmit}
        submitLabel="Guardar cambios"
      />
    </div>
  );
}

export default EditProduct;
