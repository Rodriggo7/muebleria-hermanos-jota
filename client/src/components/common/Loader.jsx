import styles from './Loader.module.css';

// size: sm, lg. `center` lo muestra centrado con el texto visible (carga de sección).
function Loader({ size, center = false, label = 'Cargando…' }) {
  const spinner = (
    <span className={[styles.loader, size && styles[size]].filter(Boolean).join(' ')} aria-hidden="true" />
  );

  if (center) {
    return (
      <div className={styles.center} role="status">
        {spinner}
        <span>{label}</span>
      </div>
    );
  }

  return (
    <span role="status">
      {spinner}
      <span className="u-sr-only">{label}</span>
    </span>
  );
}

export default Loader;
