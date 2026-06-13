import { Link } from 'react-router-dom';
import { Cake, Star, Truck, ArrowRight } from 'lucide-react';

const features = [
  { Icon: Cake,  titulo: 'Ingredientes frescos', desc: 'Seleccionamos los mejores ingredientes locales cada mañana.' },
  { Icon: Star,  titulo: 'Diseños únicos',       desc: 'Cada pastel es una obra de arte creada especialmente para ti.' },
  { Icon: Truck, titulo: 'Entrega a domicilio',  desc: 'Llevamos tu pedido con cuidado directo a tu puerta.' },
];

function Inicio() {
  return (
    <div>
      <section className="hero">
        <div className="hero-overlay" />
        <img src="/equipo_12/images/bakery_banner.png" alt="Pastelería La Dulce Vida" className="hero-bg" />
        <div className="hero-content">
          <p className="hero-eyebrow">Artesanal · Hecho con amor</p>
          <h1 className="hero-title">Cada pastel,<br />una historia dulce</h1>
          <p className="hero-subtitle">
            Creamos piezas únicas para tus momentos más especiales. Desde postres del día hasta pasteles de boda completamente personalizados.
          </p>
          <div className="hero-actions">
            <Link to="/catalogo" className="btn-primary">Ver Catálogo</Link>
            <Link to="/personalizado" className="btn-outline">Cotizar Pastel Especial</Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="features-grid">
          {features.map(({ Icon, titulo, desc }) => (
            <div key={titulo} className="feature-card">
              <div className="feature-icon-wrap">
                <Icon size={26} strokeWidth={1.5} color="var(--color-secondary)" />
              </div>
              <h3 className="feature-title">{titulo}</h3>
              <p className="feature-desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <h2 className="cta-title">¿Tienes algo especial en mente?</h2>
        <p className="cta-desc">
          Cuéntanos tu visión y la convertimos en realidad. Pasteles de boda, quinceañeras, cumpleaños y más.
        </p>
        <Link to="/personalizado" className="btn-primary btn-icon">
          Diseñar mi Pastel <ArrowRight size={16} strokeWidth={2} />
        </Link>
      </section>
    </div>
  );
}

export default Inicio;
