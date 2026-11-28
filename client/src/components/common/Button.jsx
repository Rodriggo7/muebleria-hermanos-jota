import styles from "./Button.module.css";
import cx from "../../utils/cx";

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  iconOnly = false,
  loading = false,
  disabled = false,
  href,
  type = "button",
  className,
  onClick,
  children,
  ...rest
}) {
  const classes = cx(
    styles.button,
    variant !== "primary" && styles[variant],
    size !== "md" && styles[size],
    fullWidth && styles.fullWidth,
    iconOnly && styles.iconOnly,
    loading && styles.loading,
    className
  );

  const handleClick = (event) => {
    if (loading || disabled) {
      event.preventDefault();
      return;
    }
    if (onClick) onClick(event);
  };

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        aria-disabled={disabled || undefined}
        aria-busy={loading || undefined}
        onClick={handleClick}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      aria-busy={loading || undefined}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </button>
  );
}
