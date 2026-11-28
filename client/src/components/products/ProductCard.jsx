import styles from "./ProductCard.module.css";
import Badge from "../common/Badge.jsx";
import Button from "../common/Button.jsx";
import cx from "../../utils/cx";

/**
 * Tarjeta de producto
 * Props:
 *  - name, href, image, imageAlt, category, description
 *  - price, oldPrice          (ya formateados, ej: "$ 120.000")
 *  - badge: { variant, label }  (variant de Badge: new | sale | featured | neutral)
 *  - unavailable              (sin stock: atenúa la imagen y deshabilita el botón)
 *  - onAddToCart, adding, addLabel   (si no hay onAddToCart, no se muestra el botón)
 */
export default function ProductCard({
  name,
  href = "#",
  image,
  imageAlt = "",
  category,
  description,
  price,
  oldPrice,
  badge,
  unavailable = false,
  onAddToCart,
  adding = false,
  addLabel = "Agregar al carrito",
}) {
  return (
    <article className={cx(styles.card, unavailable && styles.unavailable)}>
      <div className={styles.media}>
        {image ? <img className={styles.image} src={image} alt={imageAlt} loading="lazy" /> : <span className={styles.placeholder} aria-hidden="true" />}
        {unavailable ? (
          <Badge variant="neutral" className={styles.badge}>
            Sin stock
          </Badge>
        ) : badge ? (
          <Badge variant={badge.variant} className={styles.badge}>
            {badge.label}
          </Badge>
        ) : null}
      </div>

      <div className={styles.body}>
        {category ? <p className={styles.category}>{category}</p> : null}
        <h3 className={styles.name}>
          <a className={styles.link} href={href}>
            {name}
          </a>
        </h3>
        {description ? <p className={cx(styles.description, "u-line-clamp-2")}>{description}</p> : null}

        <div className={styles.footer}>
          <p className={styles.price}>
            {price}
            {oldPrice ? (
              <>
                <span className="u-sr-only"> Precio anterior: </span>
                <span className={styles.priceOld}>{oldPrice}</span>
              </>
            ) : null}
          </p>
          {onAddToCart ? (
            <Button
              size="sm"
              className={styles.action}
              onClick={onAddToCart}
              loading={adding}
              disabled={unavailable}
              aria-label={`${addLabel}: ${name}`}
            >
              {unavailable ? "Sin stock" : addLabel}
            </Button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
