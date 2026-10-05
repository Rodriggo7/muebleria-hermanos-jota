import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Marca e Historia */}
        <div>
          <h3 className="footer-brand-title">Hermanos Jota</h3>
          <p className="footer-text">
            Redescubriendo el arte de vivir. Mueblería artesanal y diseño sustentable en maderas nobles certificadas FSC®.
          </p>
        </div>

        {/* Showroom & Taller */}
        <div>
          <h4 className="footer-subtitle">Casa Taller & Showroom</h4>
          <p className="footer-text">Av. San Juan 2847, Barrio de San Cristóbal</p>
          <p className="footer-text">Ciudad Autónoma de Buenos Aires, Argentina</p>
          <p className="footer-text" style={{ marginTop: '0.4rem' }}>
            <strong>Horarios:</strong> Lun a Vie: 10:00 - 19:00 | Sáb: 10:00 - 14:00
          </p>
        </div>

        {/* Contacto & Redes (Obs 2) */}
        <div>
          <h4 className="footer-subtitle">Contacto & Redes</h4>
          <ul className="footer-list">
            <li><strong>Email:</strong> info@hermanosjota.com.ar</li>
            <li><strong>WhatsApp:</strong> +54 11 4567-8900</li>
            <li><strong>Instagram:</strong> <a href="https://instagram.com" target="_blank" rel="noreferrer">@hermanosjota_ba</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Hermanos Jota Furniture · Todos los derechos reservados</p>
        <p>Programa Herencia Viva · Garantía Estructural 10 Años</p>
      </div>
    </footer>
  );
}