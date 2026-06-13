import { useAuth } from '../context/AuthContext';
import { Link, Navigate } from 'react-router-dom';

const pedidosSimulados = [
  { id: 'PED-001', producto: 'Pastel de Chocolate Premium', fecha: '2026-05-20', estado: 'Entregado', total: 35.00 },
  { id: 'PED-002', producto: 'Tarta de Frutas Frescas', fecha: '2026-06-01', estado: 'En preparación', total: 28.50 },
];

function Perfil() {
  const { user, logout } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="page-inner">
      <div className="profile-header">
        <div>
          <h1 className="page-title" style={{ marginBottom: '4px' }}>Hola, {user.name} 👋</h1>
          <p className="page-subtitle" style={{ margin: 0 }}>Bienvenido a tu perfil de La Dulce Vida</p>
        </div>
        <button onClick={logout} className="btn-ghost">Cerrar Sesión</button>
      </div>

      <h2 className="section-title">Mis Pedidos</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {pedidosSimulados.map(pedido => (
          <div key={pedido.id} className="order-row">
            <span className="order-id">{pedido.id}</span>
            <div>
              <p className="order-name">{pedido.producto}</p>
              <p className="order-date">{pedido.fecha}</p>
            </div>
            <span className={`badge ${pedido.estado === 'Entregado' ? 'badge--success' : 'badge--warning'}`}>
              {pedido.estado}
            </span>
            <span className="order-price">${pedido.total.toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <Link to="/catalogo" className="btn-primary">Hacer un Nuevo Pedido</Link>
      </div>
    </div>
  );
}

export default Perfil;
