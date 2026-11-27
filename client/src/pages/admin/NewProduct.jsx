import { useNavigate } from 'react-router-dom';
import ProductForm from '../../components/products/ProductForm.jsx';
import { createProduct } from '../../services/productService.js';

function NewProduct() {
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    await createProduct(data);
    navigate('/admin/productos', { state: { toast: 'Producto creado' } });
  };

  return (
    <div className="u-stack u-gap-4">
      <h2>Nuevo producto</h2>
      <ProductForm onSubmit={handleSubmit} submitLabel="Crear producto" submittingLabel="Creando..." />
    </div>
  );
}

export default NewProduct;
