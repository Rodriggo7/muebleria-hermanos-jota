import { Link } from 'react-router-dom';
import styles from './Button.module.css';

// variant: primary (por defecto), secondary, accent, outline, ghost, danger.
// size: sm, lg. Con `to` se dibuja como Link con el mismo aspecto.
function Button({
  variant = 'primary',
  size,
  fullWidth = false,
  loading = false,
  to,
  type = 'button',
  disabled = false,
  className,
  children,
  ...rest
}) {
  const classes = [
    styles.button,
    variant !== 'primary' && styles[variant],
    size && styles[size],
    fullWidth && styles.fullWidth,
    loading && styles.loading,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
