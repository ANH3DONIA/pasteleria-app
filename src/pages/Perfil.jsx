import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, Navigate } from 'react-router-dom';

function Perfil() {
  const { user, logout } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetch(import.meta.env.VITE_API_URL + '/pedidos/mis-pedidos', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(res => res.json())
      .then(data => {
        setPedidos(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al obtener pedidos:", err);
        setLoading(false);
      });
    }
  }, [user]);

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="page-inner">
      <div className="profile-header">
        <div>
          <h1 className="page-title" style={{ marginBottom: '4px' }}>Hola, {user.nombre}</h1>
          <p className="page-subtitle" style={{ margin: 0 }}>Bienvenido a tu perfil de La Dulce Vida</p>
        </div>
        <button onClick={logout} className="btn-ghost">Cerrar Sesión</button>
      </div>

      <h2 className="section-title">Mis Pedidos</h2>
      {loading ? (
        <p>Cargando pedidos...</p>
      ) : pedidos.length === 0 ? (
        <p>Aún no tienes pedidos registrados.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {pedidos.map(pedido => (
            <div key={pedido.id} className="order-row">
              <span className="order-id">PED-{String(pedido.id).padStart(4, '0')}</span>
              <div>
                <p className="order-name">Pedido #{pedido.id}</p>
                <p className="order-date">{new Date(pedido.fecha).toLocaleDateString()}</p>
              </div>
              <span className={`badge ${pedido.estado === 'entregado' ? 'badge--success' : 'badge--warning'}`} style={{textTransform: 'capitalize'}}>
                {pedido.estado}
              </span>
              <span className="order-price">${Number(pedido.total).toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <Link to="/catalogo" className="btn-primary">Hacer un Nuevo Pedido</Link>
      </div>
    </div>
  );
}

export default Perfil;
