// client/src/pages/Contacto.jsx
import ContactForm from '../components/ContactForm';
import './Contacto.css';

export default function Contacto() {
  return (
    <main className="page-container">
      <section className="catalogo-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <span className="catalogo-badge">Atelier Artesanal · Buenos Aires</span>
        <h1 className="catalogo-title">Hablemos de tu Proyecto</h1>
        <p className="catalogo-description" style={{ margin: '0 auto' }}>
          Diseño a medida, asesoramiento de interiores y consultas sobre materiales sustentables con nuestros artesanos.
        </p>
      </section>

      {/* Tarjetas Informativas del Atelier (Obs 8) */}
      <section className="contacto-info-grid">
        <article className="contacto-card">
          <div className="contacto-icon-box">
            <span className="material-symbols-outlined">location_on</span>
          </div>
          <div>
            <span className="contacto-card-title">Showroom Principal</span>
            <p className="contacto-card-val">Av. San Juan 2847, San Cristóbal, CABA</p>
          </div>
        </article>

        <article className="contacto-card">
          <div className="contacto-icon-box">
            <span className="material-symbols-outlined">chat</span>
          </div>
          <div>
            <span className="contacto-card-title">WhatsApp Directo</span>
            <p className="contacto-card-val">+54 11 4567-8900</p>
          </div>
        </article>

        <article className="contacto-card">
          <div className="contacto-icon-box">
            <span className="material-symbols-outlined">schedule</span>
          </div>
          <div>
            <span className="contacto-card-title">Atención en Taller</span>
            <p className="contacto-card-val">Lun a Vie: 10:00 a 19:00 hs</p>
          </div>
        </article>
      </section>

      {/* Formulario de Contacto */}
      <ContactForm />
    </main>
  );
}