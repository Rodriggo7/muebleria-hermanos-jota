import { useEffect, useState } from 'react';
import Input from '../common/Input.jsx';
import Button from '../common/Button.jsx';
import { getCategories } from '../../services/productService.js';
import styles from './Form.module.css';

const INITIAL_VALUES = {
  name: '',
  description: '',
  price: '',
  category: '',
  stock: '0',
  images: '',
};

function ProductForm({
  initialProduct,
  onSubmit,
  submitLabel = 'Guardar producto',
  loading = false,
}) {
  const [form, setForm] = useState(INITIAL_VALUES);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    getCategories()
      .then((data) => {
        if (ignore) return;

        const normalized = data.map((category) =>
          typeof category === 'string'
            ? {
                value: category,
                label: category.charAt(0).toUpperCase() + category.slice(1),
              }
            : category
        );

        setCategories(normalized);
      })
      .catch(() => {
        if (!ignore) setError('No pudimos cargar las categorías.');
      });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!initialProduct) return;

    setForm({
      name: initialProduct.name ?? '',
      description: initialProduct.description ?? '',
      price: String(initialProduct.price ?? ''),
      category: initialProduct.category ?? '',
      stock: String(initialProduct.stock ?? 0),
      images: Array.isArray(initialProduct.images)
        ? initialProduct.images.join('\n')
        : '',
    });
  }, [initialProduct]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const name = form.name.trim();
    const description = form.description.trim();
    const price = Number(form.price);
    const stock = Number(form.stock);

    if (!name || name.length > 120) {
      setError('El nombre es obligatorio y no puede superar los 120 caracteres.');
      return;
    }

    if (!description || description.length > 2000) {
      setError('La descripción es obligatoria y no puede superar los 2000 caracteres.');
      return;
    }

    if (form.price === '' || !Number.isFinite(price) || price < 0) {
      setError('Ingresá un precio válido mayor o igual a cero.');
      return;
    }

    if (!form.category) {
      setError('Seleccioná una categoría.');
      return;
    }

    if (
      form.stock === '' ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      setError('El stock debe ser un número entero mayor o igual a cero.');
      return;
    }

    const productData = {
      name,
      description,
      price,
      category: form.category,
      stock,
      images: form.images
        .split('\n')
        .map((image) => image.trim())
        .filter(Boolean),
    };

    try {
      await onSubmit(productData);
    } catch (err) {
      setError(err.message || 'No pudimos guardar el producto.');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && (
        <div className={styles.formAlert} role="alert">
          {error}
        </div>
      )}

      <fieldset className={styles.fieldset} disabled={loading}>
        <legend className={styles.legend}>Información del producto</legend>

        <Input
          label="Nombre"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          maxLength={120}
          placeholder="Nombre del producto"
        />

        <Input
          label="Descripción"
          name="description"
          type="textarea"
          value={form.description}
          onChange={handleChange}
          required
          maxLength={2000}
          placeholder="Descripción del producto"
        />

        <div className={styles.grid}>
          <Input
            label="Precio"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            placeholder="0"
          />

          <Input
            label="Stock"
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            required
            min="0"
            step="1"
            placeholder="0"
          />
        </div>

        <Input
          label="Categoría"
          name="category"
          type="select"
          value={form.category}
          onChange={handleChange}
          required
        >
          <option value="">Seleccioná una categoría</option>
          {categories.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Input>

        <Input
          label="Imágenes"
          name="images"
          type="textarea"
          value={form.images}
          onChange={handleChange}
          placeholder="Una URL o ruta de imagen por línea"
          hint="Podés ingresar varias imágenes, una por línea."
        />
      </fieldset>

      <div className={styles.actions}>
        <Button type="submit" loading={loading} disabled={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

export default ProductForm;