
import { useState } from "react";
import styles from "./Navbar.module.css";
import Icon from "../common/Icon";
import cx from "../../utils/cx";

/**
 * Barra de navegación.
 *
 * Props:
 * - brandName, brandHref, logoSrc (opcional).
 * - links: [{ label, href, active }].
 * - cartHref, cartCount.
 * - accountLabel, accountHref.
 *
 * El estado interno controla la apertura del menú móvil.
 * Requiere un <main id="main"> en la página.
 */

export default function Navbar({
  brandName = "Hermanos Jota",
  brandHref = "#",
  logoSrc,
  links = [],
  cartHref = "#",
  cartCount = 0,
  accountLabel = "Ingresar",
  accountHref = "#",
}) {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <header className={styles.header}>
      <a className="skip-link" href="#main">
        Saltar al contenido
      </a>

      <div className={styles.inner}>
        <a
          className={styles.brand}
          href={brandHref}
          onClick={closeMenu}
        >
          {logoSrc && (
            <img
              className={styles.brandLogo}
              src={logoSrc}
              alt=""
            />
          )}

          <span>{brandName}</span>
        </a>

        <nav
          className={cx(
            styles.nav,
            open && styles.navOpen
          )}
          id="menu-principal"
          aria-label="Navegación principal"
        >
          <ul className={styles.navList}>
            {links.map((link) => (
              <li key={link.href + link.label}>
                <a
                  href={link.href}
                  className={cx(
                    styles.navLink,
                    link.active && styles.navLinkActive
                  )}
                  aria-current={
                    link.active ? "page" : undefined
                  }
                  onClick={closeMenu}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <a
            className={styles.actionLink}
            href={accountHref}
          >
            <Icon
              name="user"
              className={styles.icon}
            />
            <span className={styles.actionText}>
              {accountLabel}
            </span>
          </a>

          <a
            className={cx(
              styles.actionLink,
              styles.cartLink
            )}
            href={cartHref}
            aria-label={`Carrito, ${cartCount} productos`}
          >
            <Icon
              name="cart"
              className={styles.icon}
            />

            {cartCount > 0 && (
              <span className={styles.cartCount}>
                {cartCount}
              </span>
            )}
          </a>

          <button
            type="button"
            className={styles.menuToggle}
            aria-expanded={open}
            aria-controls="menu-principal"
            aria-label={
              open ? "Cerrar menú" : "Abrir menú"
            }
            onClick={() => setOpen((value) => !value)}
          >
            <Icon
              name={open ? "close" : "menu"}
              className={styles.icon}
            />
          </button>
        </div>
      </div>
    </header>
  );
}
