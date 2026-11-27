import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductList from '../components/products/ProductList.jsx';
import { getCategories, getProducts } from '../services/productService.js';

import styles from './Home.module.css';

// Destacados: un producto con stock por categoría (hasta 4), elegidos de los datos de la API.
// No se usan ids fijos: los del mock no existen en la base real.
const FEATURED_COUNT = 4;

function pickFeatured(products, categories) {
  const available = products.filter((p) => p.stock > 0);
  const picked = [];
  for (const { value } of categories) {
    const product = available.find((p) => p.category === value);
    if (product) picked.push(product);
    if (picked.length === FEATURED_COUNT) return picked;
  }
  // Si hay menos categorías con stock que lugares, se completa con otros productos.
  for (const product of available) {
    if (picked.length === FEATURED_COUNT) break;
    if (!picked.includes(product)) picked.push(product);
  }
  return picked;
}

// Íconos de trazo simples (24×24), decorativos.
const iconProps = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

const TreeIcon = () => (
  <svg {...iconProps}>
    <path d="M12 3l6 8h-3l4 5H5l4-5H6z" />
    <path d="M12 16v5" />
  </svg>
);

const ShieldIcon = () => (
  <svg {...iconProps}>
    <path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const DropIcon = () => (
  <svg {...iconProps}>
    <path d="M12 3c3.5 4.2 6 7.6 6 10.5a6 6 0 0 1-12 0C6 10.6 8.5 7.2 12 3z" />
    <path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5" />
  </svg>
);

const ToolIcon = () => (
  <svg {...iconProps}>
    <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3.5 17.5a1.4 1.4 0 0 0 2 2l5.8-5.8a4 4 0 0 0 5.4-5.4l-2.5 2.5-2-2z" />
  </svg>
);

// Contenido oficial del manual de marca.
const BENEFITS = [
  {
    title: 'Madera certificada',
    text: 'Maderas nativas certificadas FSC de bosques responsables argentinos: algarrobo, quebracho y caldén.',
    Icon: TreeIcon,
  },
  { title: 'Garantía extendida', text: '10 años en estructura y 5 años en acabados.', Icon: ShieldIcon },
  { title: 'Acabados naturales', text: 'Aceite de lino, cera de abejas y tintes vegetales de bajo COV.', Icon: DropIcon },
  {
    title: 'Servicio de restauración',
    text: 'Recuperamos y renovamos tus piezas para que duren generaciones.',
    Icon: ToolIcon,
  },
];

function Home() {
  const [data, setData] = useState({ status: 'loading', products: [], categories: [], error: null });

  useEffect(() => {
    let ignore = false;

    Promise.all([getProducts(), getCategories().catch(() => [])])
      .then(([products, categories]) => {
        if (!ignore) setData({ status: 'ready', products, categories, error: null });
      })
      .catch((err) => {
        if (!ignore) {
          setData({ status: 'error', products: [], categories: [], error: err.message || 'No pudimos cargar los productos' });
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const { status, products, categories, error } = data;

  const featured = pickFeatured(products, categories);

  // Cada categoría usa la foto del primer producto que pertenece a ella.
  // Las categorías sin productos no se muestran.
  const categoryCards = categories
    .map(({ value, label }) => ({
      value,
      label,
      image: products.find((p) => p.category === value)?.images?.[0],
    }))
    .filter((card) => card.image);

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Hermanos Jota</h1>
            <p className={styles.heroText}>Cada pieza cuenta la historia de manos expertas y materiales nobles.</p>
            <div className={styles.heroActions}>
              <Link to="/productos">Ver productos</Link>
            </div>
          </div>
          <div className={styles.heroMedia}>
            <img className={styles.heroImage} src="/images/sofa-patagonia.png" alt="Sofá Patagonia" width="800" height="600" />
          </div>
        </div>
      </section>

      <section aria-labelledby="home-featured">
        <div className={styles.sectionHeader}>
          <h2 id="home-featured" className={styles.sectionTitle}>
            Productos destacados
          </h2>
          <Link to="/productos" className={styles.sectionLink}>
            Ver todo
          </Link>
        </div>

        {status === 'loading' && <div role="status">Cargando productos…</div>}
        {status === 'error' && <div role="alert">{error}</div>}
        {status === 'ready' && <ProductList products={featured} className={styles.featuredGrid} />}
      </section>

      {status === 'ready' && categoryCards.length > 0 && (
        <section aria-labelledby="home-categories">
          <div className={styles.sectionHeader}>
            <h2 id="home-categories" className={styles.sectionTitle}>
              Categorías
            </h2>
          </div>
          <div className={styles.categories}>
            {categoryCards.map(({ value, label, image }) => (
              <Link
                key={value}
                to={`/productos?category=${encodeURIComponent(value)}`}
                className={styles.categoryCard}
              >
                <img className={styles.categoryImage} src={image} alt="" width="400" height="500" loading="lazy" />
                <span className={styles.categoryOverlay} aria-hidden="true" />
                <span className={styles.categoryName}>{label}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section aria-label="Beneficios">
        <ul className={styles.benefits} role="list">
          {BENEFITS.map(({ title, text, Icon }) => (
            <li key={title} className={styles.benefit}>
              <span className={styles.benefitIcon} aria-hidden="true">
                <Icon />
              </span>
              <div>
                <h3 className={styles.benefitTitle}>{title}</h3>
                <p className={styles.benefitText}>{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.banner}>
        <div>
          <h2 className={styles.bannerTitle}>Programa Herencia Viva</h2>
          <p className={styles.bannerText}>
            Vivir con Hermanos Jota se convierte en parte de tu ritual diario. Cada pieza envejece con gracia: no solo
            compraste muebles, invertiste en un legado.
          </p>
        </div>
      </section>

      <section className={styles.cta}>
        <h2>Visitá nuestra Casa Taller</h2>
        <p className={styles.ctaText}>Te esperamos en San Cristóbal para conocer cada pieza de cerca.</p>
        <Link to="/contacto">Contacto</Link>
      </section>
    </>
  );
}

export default Home;
