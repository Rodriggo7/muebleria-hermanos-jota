import styles from "./Footer.css";
import Icon from "../common/Icon";

/**
 * Pie de página (solo presentación).
 * Props:
 *  - brandName, tagline
 *  - columns: [{ title, links: [{ label, href }] }]
 *  - social:  [{ label, href, icon }]   icon: "instagram" | "facebook" | "mail" | "phone"
 *  - copyright
 */
export default function Footer({
  brandName = "Mueblería Hermanos Jota",
  tagline = "Muebles de madera hechos a mano, con materiales sustentables.",
  columns = [],
  social = [],
  copyright = `© ${new Date().getFullYear()} Mueblería Hermanos Jota. Todos los derechos reservados.`,
}) {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.brandName}>{brandName}</span>
          <p className={styles.tagline}>{tagline}</p>
          {social.length > 0 ? (
            <div className={styles.social}>
              {social.map((item) => (
                <a key={item.href} className={styles.socialLink} href={item.href} aria-label={item.label}>
                  <Icon name={item.icon} />
                </a>
              ))}
            </div>
          ) : null}
        </div>

        {columns.length > 0 ? (
          <div className={styles.columns}>
            {columns.map((column) => (
              <nav key={column.title} className={styles.column} aria-label={column.title}>
                <h2 className={styles.columnTitle}>{column.title}</h2>
                <ul className={styles.list}>
                  {column.links.map((link) => (
                    <li key={link.href + link.label}>
                      <a className={styles.link} href={link.href}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        ) : null}
      </div>
      <div className={styles.bottom}>
        <span>{copyright}</span>
      </div>
    </footer>
  );
}
