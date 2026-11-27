import { Link } from 'react-router-dom';
import { STORE_INFO } from '../../utils/storeInfo.js';

const NAV_LINKS = [
  { to: '/productos', label: 'Productos' },
  { to: '/contacto', label: 'Contacto' },
];

const EXTERNAL = { target: '_blank', rel: 'noopener noreferrer' };

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3.5 20.5l1.3-4.2A8.5 8.5 0 1 1 8 19.4z" />
      <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1.2-1.4-2-1-1 .8a4.5 4.5 0 0 1-2.1-2.1l.8-1-1-2z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { href: STORE_INFO.instagram.url, label: STORE_INFO.instagram.label, Icon: InstagramIcon },
  { href: STORE_INFO.whatsapp.url, label: 'WhatsApp', Icon: WhatsAppIcon },
];

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container inner">
        <div className="grid">
          <div className="brand">
            <p className="brandName">{STORE_INFO.name}</p>
            <p className="tagline">{STORE_INFO.tagline}</p>

            <div className="social">
              {SOCIAL_LINKS.map(({ href, label, Icon }) => (
                <a key={href} href={href} className="socialLink" aria-label={label} title={label} {...EXTERNAL}>
                  <Icon />
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
              <li>{STORE_INFO.address}</li>
              <li>
                <a href={STORE_INFO.whatsapp.url} className="link" {...EXTERNAL}>
                  {STORE_INFO.whatsapp.label}
                </a>
              </li>
              <li>
                <a href={`mailto:${STORE_INFO.email}`} className="link">
                  {STORE_INFO.email}
                </a>
              </li>
            </ul>
          </div>

          <div className="column">
            <h2 className="columnTitle">Horarios</h2>
            <ul className="list" role="list">
              <li>{STORE_INFO.hours}</li>
            </ul>
          </div>
        </div>

        <div className="bottom">
          <p className="copy">
            © {year} {STORE_INFO.name}. {STORE_INFO.legal}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
