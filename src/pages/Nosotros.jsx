import { Link } from 'react-router-dom';
import { Award, Heart, Leaf } from 'lucide-react';

const equipo = [
  { nombre: 'Sofía Ramírez', rol: 'Fundadora & Chef Pastelera', foto: '/equipo_12/images/team_sofia.png' },
  { nombre: 'Carlos Mendoza', rol: 'Maestro Chocolatero',        foto: '/equipo_12/images/team_carlos.png' },
  { nombre: 'Valentina Cruz', rol: 'Diseñadora de Pasteles',     foto: '/equipo_12/images/team_valentina.png' },
];

const stats = [
  { Icon: Award, valor: '+5,000', label: 'Pasteles creados' },
  { Icon: Heart, valor: '15 Años', label: 'De tradición artesanal' },
  { Icon: Leaf,  valor: '100%',   label: 'Ingredientes naturales' },
];

function Nosotros() {
  return (
    <div className="page-inner--narrow">
      <h1 className="page-title" style={{ textAlign: 'center' }}>Nuestra Historia</h1>
      <p className="page-subtitle" style={{ textAlign: 'center', fontSize: '1.05rem', lineHeight: '1.8' }}>
        La Dulce Vida nació en 2010 en la pequeña cocina de Sofía Ramírez, con una receta familiar de bizcocho de vainilla y mucho amor.
        Lo que empezó como un hobby, se convirtió en la pastelería artesanal más querida del barrio.
        Hoy, horneamos cada pieza a mano con ingredientes frescos y el mismo cariño del primer día.
      </p>

      <div className="three-col-grid" style={{ marginBottom: '48px' }}>
        {stats.map(({ Icon, valor, label }) => (
          <div key={valor} className="card card-center">
            <div className="feature-icon-wrap" style={{ margin: '0 auto 14px' }}>
              <Icon size={22} strokeWidth={1.5} color="var(--color-secondary)" />
            </div>
            <p className="stat-value">{valor}</p>
            <p className="stat-label">{label}</p>
          </div>
        ))}
      </div>

      <h2 className="section-title">Conoce a Nuestro Equipo</h2>
      <div className="three-col-grid">
        {equipo.map(p => (
          <div key={p.nombre} className="team-card card">
            <img src={p.foto} alt={p.nombre} className="team-photo" />
            <p className="team-name">{p.nombre}</p>
            <p className="team-role">{p.rol}</p>
          </div>
        ))}
      </div>

      <div className="cta-band">
        <h2>¿Lista para tu próximo evento?</h2>
        <p>Permítenos crear algo especial para ti y tus seres queridos.</p>
        <Link to="/personalizado" className="btn-primary">Cotizar mi Pastel</Link>
      </div>
    </div>
  );
}

export default Nosotros;
