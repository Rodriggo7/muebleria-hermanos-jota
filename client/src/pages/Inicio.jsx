import { Link } from 'react-router-dom';
import './Inicio.css';

export default function Inicio() {
  return (
    <main className="page-container">
      {/* Hero Banner Editorial (Obs 1) */}
      <section className="hero-section">
        <span className="hero-badge">Atelier & Mueblería Artesanal</span>
        <h1 className="hero-title">Redescubrir el Arte de Vivir</h1>
        <p className="hero-text">
          Existimos en la intersección entre herencia e innovación. Fusionamos el optimismo de los años 60 con la conciencia de sustentabilidad del 2026.
        </p>
        <Link to="/productos" className="btn-hero">
          Explorar Catálogo
        </Link>
      </section>

      {/* Pilares y Filosofía Herencia Viva */}
      <section className="features-grid">
        <article className="feature-card">
          <span className="material-symbols-outlined feature-icon">eco</span>
          <h3 className="feature-title">Maderas Certificadas FSC®</h3>
          <p className="feature-desc">
            Abastecimiento 100% responsable de bosques argentinos nativos con acabados botánicos libres de VOC.
          </p>
        </article>

        <article className="feature-card">
          <span className="material-symbols-outlined feature-icon">precision_manufacturing</span>
          <h3 className="feature-title">Ensamble Artesanal</h3>
          <p className="feature-desc">
            Uniones a cola de milano y espiga creadas por maestros ebanistas que honran la tradición del oficio.
          </p>
        </article>

        <article className="feature-card">
          <span className="material-symbols-outlined feature-icon">verified</span>
          <h3 className="feature-title">Garantía 10 Años</h3>
          <p className="feature-desc">
            Programa Herencia Viva: cada pieza está diseñada para envejecer con gracia y perdurar por generaciones.
          </p>
        </article>
      </section>
    </main>
  );
}