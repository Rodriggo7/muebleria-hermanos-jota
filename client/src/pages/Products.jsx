import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductList from '../components/products/ProductList.jsx';
import { getCategories, getProducts } from '../services/productService.js';

// TODO: reemplazar por: import styles from './Products.module.css';
const styles = {};

const SEARCH_DEBOUNCE_MS = 300;

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') ?? '';
  const search = searchParams.get('search') ?? '';

  const [categories, setCategories] = useState([]);

  // Resultado de la última búsqueda, marcado con los filtros que lo generaron.
  // Mientras no coincida con los filtros actuales, se está cargando.
  const queryKey = `${category}|${search}`;
  const [result, setResult] = useState({ key: null, products: [], error: null });
  const isLoading = result.key !== queryKey;
  const { products, error } = result;

  // Texto del input. Se pasa a la URL con un pequeño retardo para no
  // pedir productos en cada tecla.
  const [searchInput, setSearchInput] = useState(search);

  // Si la URL cambia desde afuera (atrás/adelante), el input la acompaña.
  const [lastUrlSearch, setLastUrlSearch] = useState(search);
  if (search !== lastUrlSearch) {
    setLastUrlSearch(search);
    setSearchInput(search);
  }

  const updateParam = (key, value, options) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set(key, value);
      else next.delete(key);
      return next;
    }, options);
  };

  // Categorías: una sola vez.
  useEffect(() => {
    let ignore = false;
    getCategories()
      .then((data) => {
        if (!ignore) setCategories(data);
      })
      .catch(() => {
        // Sin categorías solo aparece el chip "Todas"; la lista sigue funcionando.
      });
    return () => {
      ignore = true;
    };
  }, []);

  // Productos: cada vez que cambian los filtros de la URL.
  useEffect(() => {
    let ignore = false;
    const key = `${category}|${search}`;

    getProducts({ category: category || undefined, search: search || undefined })
      .then((data) => {
        if (!ignore) setResult({ key, products: data, error: null });
      })
      .catch((err) => {
        if (!ignore) {
          setResult({ key, products: [], error: err.message || 'No pudimos cargar los productos' });
        }
      });

    return () => {
      ignore = true;
    };
  }, [category, search]);

  // Del input a la URL, con retardo. replace: no llena el historial con cada letra.
  useEffect(() => {
    const term = searchInput.trim();
    if (term === search) return undefined;

    const timer = setTimeout(() => updateParam('search', term, { replace: true }), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput, search]);

  let content;
  if (isLoading) {
    content = (
      <div className={styles.loading} role="status">
        Cargando productos…
      </div>
    );
  } else if (error) {
    content = (
      <div className={styles.error} role="alert">
        {error}
      </div>
    );
  } else {
    content = <ProductList products={products} className={styles.grid} emptyClassName={styles.empty} />;
  }

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <h1>Productos</h1>
        {!isLoading && !error && (
          <p className={styles.count}>
            {products.length} {products.length === 1 ? 'producto' : 'productos'}
          </p>
        )}
      </header>

      <div className={styles.toolbar}>
        <input
          type="search"
          placeholder="Buscar productos"
          aria-label="Buscar productos"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
        />
        <div className={styles.filters} role="group" aria-label="Filtrar por categoría">
          {[{ value: '', label: 'Todas' }, ...categories].map(
            ({ value, label }) => {
              const isActive = value === category;
              return (
                <button
                  key={value || 'todas'}
                  type="button"
                  className={isActive ? `${styles.chip} ${styles.chipActive}` : styles.chip}
                  aria-pressed={isActive}
                  onClick={() => updateParam('category', value)}
                >
                  {label}
                </button>
              );
            }
          )}
        </div>
      </div>

      {content}
    </section>
  );
}

export default Products;
