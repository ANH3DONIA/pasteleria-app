import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

function Detalle() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const { addToCart } = useCart();
  const { addToast } = useToast();

  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL + '/productos')
      .then(res => res.json())
      .then(data => {
        setProducto(data.find(p => p.id === id) || null);
        setCargando(false);
      })
      .catch(() => setCargando(false));
  }, [id]);

  if (cargando) return <p className="page-inner" style={{ textAlign: 'center' }}>Cargando...</p>;

  if (!producto) {
    return (
      <div className="page-inner" style={{ textAlign: 'center' }}>
        <h2 className="page-title">Producto no encontrado</h2>
        <Link to="/catalogo" className="btn-primary" style={{ display: 'inline-block', marginTop: '16px' }}>
          Volver al Catálogo
        </Link>
      </div>
    );
  }

  const handleAdd = () => {
    addToCart(producto);
    addToast(`${producto.name} añadido al carrito`);
  };

  return (
    <div className="page-inner">
      <div className="detail-grid">
        <img src={producto.image} alt={producto.name} className="detail-img" />
        <div>
          <h1 className="page-title">{producto.name}</h1>
          <p style={{ color: 'var(--color-text-light)', fontSize: '1.02rem', lineHeight: '1.7' }}>
            {producto.description}
          </p>
          <p className="detail-price">${producto.price.toFixed(2)}</p>
          <div className="detail-actions">
            <button onClick={handleAdd} className="btn-primary" style={{ flex: 1, padding: '12px' }}>
              Añadir al Carrito 🛒
            </button>
            <Link to="/carrito" className="btn-ghost" style={{ flex: 1, padding: '12px', textAlign: 'center' }}>
              Ir al Carrito
            </Link>
          </div>
          <Link to="/catalogo" style={{ display: 'block', textAlign: 'center', marginTop: '20px', color: 'var(--color-accent)', fontSize: '0.9rem' }}>
            ← Regresar al Catálogo
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Detalle;
