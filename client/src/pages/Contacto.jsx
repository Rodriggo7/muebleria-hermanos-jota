import ContactForm from '../components/ContactForm';

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

      <ContactForm />
    </main>
  );
}