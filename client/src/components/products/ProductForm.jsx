import styles from "../forms/Form.module.css";
import Input from "../common/Input";
import Button from "../common/Button";

/**
 * Formulario de producto para crear o editar (solo presentación, campos controlados desde afuera).
 * Campos: name, category, price, stock, image, description (ajustar si el modelo Product pide otros).
 * Props:
 *  - title, submitLabel
 *  - values, errors, formError, successMessage, loading
 *  - categories: [{ value, label }]
 *  - onChange, onSubmit, onCancel
 */
export default function ProductForm({
  title = "Producto",
  submitLabel = "Guardar producto",
  values = { name: "", category: "", price: "", stock: "", image: "", description: "" },
  errors = {},
  formError,
  successMessage,
  loading = false,
  categories = [],
  onChange,
  onSubmit,
  onCancel,
}) {
  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
      </div>

      {formError ? (
        <p className={styles.summaryError} role="alert">
          {formError}
        </p>
      ) : null}
      {successMessage ? (
        <p className={styles.summarySuccess} role="status">
          {successMessage}
        </p>
      ) : null}

      <div className={styles.grid}>
        <Input
          className={styles.fullRow}
          label="Nombre"
          name="name"
          required
          value={values.name}
          onChange={onChange}
          error={errors.name}
          disabled={loading}
        />
        <Input
          label="Categoría"
          type="select"
          name="category"
          required
          value={values.category}
          onChange={onChange}
          error={errors.category}
          disabled={loading}
        >
          <option value="">Elegí una categoría</option>
           {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </Input>
        <Input
          label="Precio"
          type="number"
          name="price"
          inputMode="decimal"
          min="0"
          required
          value={values.price}
          onChange={onChange}
          error={errors.price}
          disabled={loading}
        />
        <Input
          label="Stock"
          type="number"
          name="stock"
          inputMode="numeric"
          min="0"
          required
          value={values.stock}
          onChange={onChange}
          error={errors.stock}
          disabled={loading}
        />
        <Input
          label="URL de la imagen"
          type="text"
          name="image"
          inputMode="url"
          value={values.image}
          onChange={onChange}
          error={errors.image}
          disabled={loading}
        />
        <Input
          className={styles.fullRow}
          label="Descripción"
          type="textarea"
          name="description"
          value={values.description}
          onChange={onChange}
          error={errors.description}
          disabled={loading}
        />
      </div>

      <div className={styles.actions}>
        {onCancel ? (
          <Button variant="ghost" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
        ) : null}
        <Button type="submit" loading={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
