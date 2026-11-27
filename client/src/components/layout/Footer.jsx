import { Link } from 'react-router-dom';

// TODO: reemplazar todos los textos entre [corchetes] por los datos reales de la mueblería.

const NAV_LINKS = [
  { to: '/productos', label: 'Productos' },
  { to: '/contacto', label: 'Contacto' },
];

const SOCIAL_LINKS = [
  { href: '#', label: '[completar red social 1 y su URL]', text: '[?]' },
  { href: '#', label: '[completar red social 2 y su URL]', text: '[?]' },
];

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container inner">
        <div className="grid">
          <div className="brand">
            <p className="brandName">Hermanos Jota</p>
            <p className="tagline">[completar descripción corta de la mueblería]</p>

            <div className="social">
              {SOCIAL_LINKS.map(({ href, label, text }) => (
                <a key={label} href={href} className="socialLink" aria-label={label} title={label}>
                  {text}
                </a>
              ))}
            </div>
          </div>

          <nav className="column" aria-label="Pie de página">
            <h2 className="columnTitle">Navegación</h2>
            <ul className="list" role="list">
              {NAV_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="link">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="column">
            <h2 className="columnTitle">Contacto</h2>
            <ul className="list" role="list">
              <li>[completar dirección]</li>
              <li>[completar teléfono]</li>
              <li>[completar email]</li>
            </ul>
          </div>

          <div className="column">
            <h2 className="columnTitle">Horarios</h2>
            <ul className="list" role="list">
              <li>[completar días y horarios de atención]</li>
            </ul>
          </div>
        </div>

        <div className="bottom">
          <p className="copy">© {year} Hermanos Jota</p>
          <p className="copy">[completar texto legal o links legales]</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
