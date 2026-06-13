import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand-col">
          <h3 className="footer-brand">La Dulce Vida</h3>
          <p className="footer-tagline">
            Creando momentos dulces desde 2010. Cada pastel, una historia.
          </p>
        </div>

        <div>
          <h4 className="footer-heading">Navegación</h4>
          <ul className="footer-links">
            <li><Link to="/" className="footer-link">Inicio</Link></li>
            <li><Link to="/nosotros" className="footer-link">Nosotros</Link></li>
            <li><Link to="/catalogo" className="footer-link">Catálogo</Link></li>
            <li><Link to="/personalizado" className="footer-link">Diseña tu Pastel</Link></li>
            <li><Link to="/contacto" className="footer-link">Contacto</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="footer-heading">Contacto</h4>
          <ul className="footer-info">
            <li>📍 Calle Dulce #42, Col. Centro</li>
            <li>📞 +52 (555) 123-4567</li>
            <li>✉️ hola@ladulcevida.mx</li>
            <li>🕐 Lun–Sáb: 9am – 8pm</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 La Dulce Vida · Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
