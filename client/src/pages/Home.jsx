import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductList from '../components/products/ProductList.jsx';
import { getCategories, getProducts } from '../services/productService.js';

import styles from './Home.module.css';

// Destacados elegidos: Aparador Uspallata, SofÃ¡ Patagonia, Mesa de Noche Aconcagua, Silla de Trabajo Belgrano.
const FEATURED_IDS = ['1', '6', '5', '10'];

// Sin datos todavÃ­a: reemplazar cada [completar ...] por el contenido real.
const BENEFITS = [1, 2, 3, 4].map((n) => ({
  id: n,
  title: `[completar beneficio ${n}]`,
  text: `[completar descripciÃ³n del beneficio ${n}]`,
}));

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

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

  const featured = FEATURED_IDS.map((id) => products.find((p) => p._id === id)).filter(Boolean);

  // Cada categorÃ­a usa la foto del primer producto que pertenece a ella.
  const categoryCards = categories.map((category) => ({
    category,
    image: products.find((p) => p.category === category)?.images?.[0],
  }));

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Hermanos Jota</h1>
            <p className={styles.heroText}>[completar subtÃ­tulo del hero]</p>
            <div className={styles.heroActions}>
              <Link to="/productos">Ver productos</Link>
            </div>
          </div>
          <div className={styles.heroMedia}>
            <img className={styles.heroImage} src="/images/sofa-patagonia.png" alt="SofÃ¡ Patagonia" width="800" height="600" />
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

        {status === 'loading' && <div role="status">Cargando productosâ€¦</div>}
        {status === 'error' && <div role="alert">{error}</div>}
        {status === 'ready' && <ProductList products={featured} className={styles.featuredGrid} />}
      </section>

      {status === 'ready' && categoryCards.length > 0 && (
        <section aria-labelledby="home-categories">
          <div className={styles.sectionHeader}>
            <h2 id="home-categories" className={styles.sectionTitle}>
              CategorÃ­as
            </h2>
          </div>
          <div className={styles.categories}>
            {categoryCards.map(({ category, image }) => (
              <Link
                key={category}
                to={`/productos?category=${encodeURIComponent(category)}`}
                className={styles.categoryCard}
              >
                {image && (
                  <img className={styles.categoryImage} src={image} alt="" width="400" height="500" loading="lazy" />
                )}
                <span className={styles.categoryOverlay} aria-hidden="true" />
                <span className={styles.categoryName}>{capitalize(category)}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section aria-label="Beneficios">
        <ul className={styles.benefits} role="list">
          {BENEFITS.map(({ id, title, text }) => (
            <li key={id} className={styles.benefit}>
              <span className={styles.benefitIcon} aria-hidden="true">
                [Ã­cono]
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
          <h2 className={styles.bannerTitle}>[completar tÃ­tulo del banner]</h2>
          <p className={styles.bannerText}>[completar texto del banner]</p>
        </div>
      </section>

      <section className={styles.cta}>
        <h2>[completar tÃ­tulo del llamado final]</h2>
        <p className={styles.ctaText}>[completar texto del llamado final]</p>
        <Link to="/contacto">Contacto</Link>
      </section>
    </>
  );
}

export default Home;
