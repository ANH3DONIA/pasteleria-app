import { Link } from 'react-router-dom';
import { Frown } from 'lucide-react';

function NotFound() {
  return (
    <div className="not-found">
      <div className="feature-icon-wrap" style={{ width: '80px', height: '80px', margin: '0 auto 20px' }}>
        <Frown size={38} strokeWidth={1.25} color="var(--color-secondary)" />
      </div>
      <p className="not-found-code">404</p>
      <h2 className="not-found-title">¡Ups! Esta página no existe</h2>
      <p className="not-found-body">
        Parece que esta receta no está en nuestro libro. Volvamos a las delicias conocidas.
      </p>
      <Link to="/" className="btn-primary">Volver al Inicio</Link>
    </div>
  );
}

export default NotFound;
