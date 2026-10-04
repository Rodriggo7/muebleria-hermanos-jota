import { useState } from 'react';
import './ProductDetail.css';

export default function ProductDetail({ producto, onAddToCart }) {
  // Estado para controlar qué acordeón está desplegado
  const [acordeonAbierto, setAcordeonAbierto] = useState('materiales');

  const toggleAcordeon = (seccion) => {
    setAcordeonAbierto(acordeonAbierto === seccion ? null : seccion);
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(producto);
    }
  };

  return (
    <article className="detail-container">
      {/* Imagen e Identificador visual */}
      <div className="detail-image-wrapper">
        <img 
          src={producto.imagen ? `/${producto.imagen}` : 'https://via.placeholder.com/500'} 
          alt={producto.nombre} 
          className="detail-image"
        />
        <span className="detail-eco-badge">
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>eco</span>
          Certificación FSC®
        </span>
      </div>

      {/* Información del Producto */}
      <div className="detail-info">
        <span className="detail-category">{producto.categoria}</span>
        <h1 className="detail-title">{producto.nombre}</h1>

        <div className="detail-price-box">
          <span className="detail-price">${producto.precio} USD</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--texto-secundario)' }}>Envío de Guante Blanco</span>
        </div>

        <p className="detail-description">{producto.descripcion}</p>

        {/* Acordeón de Especificaciones Técnicas */}
        <div className="accordion-section">
          {/* Materiales y Acabado */}
          <div className="accordion-item">
            <button className="accordion-header" onClick={() => toggleAcordeon('materiales')}>
              <span>Materiales y Acabado</span>
              <span className="material-symbols-outlined">
                {acordeonAbierto === 'materiales' ? 'expand_less' : 'expand_more'}
              </span>
            </button>
            {acordeonAbierto === 'materiales' && (
              <div className="accordion-content">
                <p><strong>Materiales:</strong> {producto.materiales}</p>
                <p><strong>Acabado:</strong> {producto.acabado}</p>
              </div>
            )}
          </div>

          {/* Dimensiones y Capacidad */}
          <div className="accordion-item">
            <button className="accordion-header" onClick={() => toggleAcordeon('medidas')}>
              <span>Medidas y Capacidad</span>
              <span className="material-symbols-outlined">
                {acordeonAbierto === 'medidas' ? 'expand_less' : 'expand_more'}
              </span>
            </button>
            {acordeonAbierto === 'medidas' && (
              <div className="accordion-content">
                <p><strong>Dimensiones:</strong> {producto.medidas}</p>
                <p><strong>Capacidad:</strong> {producto.capacidad}</p>
                {producto.peso && <p><strong>Peso:</strong> {producto.peso}</p>}
              </div>
            )}
          </div>

          {/* Atributos Específicos Dinámicos */}
          {(producto.rotacion || producto.garantia || producto.extension || producto.caracteristicas) && (
            <div className="accordion-item">
              <button className="accordion-header" onClick={() => toggleAcordeon('atributos')}>
                <span>Detalles Exclusivos</span>
                <span className="material-symbols-outlined">
                  {acordeonAbierto === 'atributos' ? 'expand_less' : 'expand_more'}
                </span>
              </button>
              {acordeonAbierto === 'atributos' && (
                <div className="accordion-content">
                  {producto.rotacion && <p><strong>Rotación:</strong> {producto.rotacion}</p>}
                  {producto.garantia && <p><strong>Garantía:</strong> {producto.garantia}</p>}
                  {producto.extension && <p><strong>Sistema de extensión:</strong> {producto.extension}</p>}
                  {producto.caracteristicas && <p><strong>Detalle:</strong> {producto.caracteristicas}</p>}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Botón Principal de Acción */}
        <button className="btn-add-detail" onClick={handleAddToCart}>
          <span className="material-symbols-outlined">shopping_bag</span>
          Añadir al Carrito
        </button>
      </div>
    </article>
  );
}