import { useEffect, useState } from 'react';
import Button from '../common/Button.jsx';
import Field from '../common/Field.jsx';
import { getCategories } from '../../services/productService.js';

import formStyles from '../forms/Form.module.css';
import alertStyles from '../common/Alert.module.css';

const toFormValues = (product = {}) => ({
  name: product.name ?? '',
  description: product.description ?? '',
  price: product.price != null ? String(product.price) : '',
  category: product.category ?? '',
  stock: product.stock != null ? String(product.stock) : '',
  images: (product.images ?? []).join('\n'),
});

// Mismas reglas que backend/src/validators/productValidator.js.
function validate(values, categories) {
  const errors = {};
  const name = values.name.trim();
  const description = values.description.trim();
  const price = Number(values.price);
  const stock = Number(values.stock);

  if (!name) errors.name = 'El nombre es obligatorio.';
  else if (name.length > 120) errors.name = 'El nombre no puede superar los 120 caracteres.';

  if (!description) errors.description = 'La descripción es obligatoria.';
  else if (description.length > 2000) errors.description = 'La descripción no puede superar los 2000 caracteres.';

  if (values.price.trim() === '' || !Number.isFinite(price) || price < 0) {
    errors.price = 'El precio debe ser un número mayor o igual a cero.';
  }

  if (!categories.some((c) => c.value === values.category)) errors.category = 'Elegí una categoría.';

  if (values.stock.trim() === '' || !Number.isInteger(stock) || stock < 0) {
    errors.stock = 'El stock debe ser un número entero mayor o igual a cero.';
  }

  return errors;
}

// Arma el cuerpo que acepta la API: solo los campos permitidos, con los tipos correctos.
const toPayload = (values) => ({
  name: values.name.trim(),
  description: values.description.trim(),
  price: Number(values.price),
  category: values.category,
  stock: Number(values.stock),
  images: values.images
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean),
});

// Formulario de alta y edición. `onSubmit(payload)` es async; si tira error, se muestra arriba del botón.
function ProductForm({ initialProduct, onSubmit, submitLabel = 'Guardar', submittingLabel = 'Guardando...' }) {
  const [values, setValues] = useState(() => toFormValues(initialProduct));
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let ignore = false;
    getCategories()
      .then((data) => {
        if (!ignore) setCategories(data);
      })
      .catch(() => {
        if (!ignore) setSubmitError('No pudimos cargar las categorías.');
      });
    return () => {
      ignore = true;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError(null);

    const validationErrors = validate(values, categories);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit(toPayload(values));
    } catch (err) {
      setSubmitError(err.message || 'No pudimos guardar el producto.');
      setIsSubmitting(false);
    }
  };

  const fieldProps = (name) => ({ name, value: values[name], onChange: handleChange, disabled: isSubmitting });
  const formClassName = isSubmitting ? `${formStyles.form} ${formStyles.submitting}` : formStyles.form;

  return (
    <form className={formClassName} onSubmit={handleSubmit} noValidate>
      <Field id="product-name" label="Nombre" required error={errors.name}>
        <input type="text" maxLength={120} {...fieldProps('name')} />
      </Field>

      <Field id="product-description" label="Descripción" required error={errors.description}>
        <textarea rows="5" maxLength={2000} {...fieldProps('description')} />
      </Field>

      <div className={formStyles.row}>
        <Field id="product-price" label="Precio (ARS)" required error={errors.price}>
          <input type="number" min="0" step="any" inputMode="decimal" {...fieldProps('price')} />
        </Field>
        <Field id="product-stock" label="Stock" required error={errors.stock}>
          <input type="number" min="0" step="1" inputMode="numeric" {...fieldProps('stock')} />
        </Field>
      </div>

      <Field id="product-category" label="Categoría" required error={errors.category}>
        <select {...fieldProps('category')}>
          <option value="">Elegí una categoría</option>
          {categories.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </Field>

      <Field id="product-images" label="Imágenes" hint="Una URL o ruta por línea, por ejemplo /images/sofa-patagonia.png">
        <textarea rows="3" {...fieldProps('images')} />
      </Field>

      {submitError && (
        <p className={`${formStyles.formAlert} ${alertStyles.alert} ${alertStyles.error}`} role="alert">
          {submitError}
        </p>
      )}

      <div className={formStyles.actions}>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? submittingLabel : submitLabel}
        </Button>
        <Button variant="outline" to="/admin/productos">
          Cancelar
        </Button>
      </div>
    </form>
  );
}

export default ProductForm;
