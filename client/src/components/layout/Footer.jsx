
import { Link } from "react-router-dom";
import "./Footer.css";

const NAV_LINKS = [
  { to: "/productos", label: "Productos" },
  { to: "/contacto", label: "Contacto" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container inner">
        <div className="grid">
          <div className="brand">
            <p className="brandName">Hermanos Jota</p>
            <p className="tagline">
              Muebles para tu hogar, con calidad y estilo.
            </p>
          </div>

          <nav className="column" aria-label="Navegación del pie de página">
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
        </div>

        <div className="bottom">
          <p className="copy">
            © {year} Mueblería Hermanos Jota. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
