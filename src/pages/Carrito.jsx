import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';

function Carrito() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { addToast } = useToast();

  const handleRemove = (item) => {
    removeFromCart(item.id);
    addToast(`${item.name} eliminado del carrito`, 'info');
  };

  if (cart.length === 0) {
    return (
      <div className="page-inner" style={{ textAlign: 'center', paddingTop: '80px' }}>
        <div className="feature-icon-wrap" style={{ margin: '0 auto 20px', width: '64px', height: '64px' }}>
          <ShoppingCart size={30} strokeWidth={1.5} color="var(--color-secondary)" />
        </div>
        <h2 className="page-title">Tu carrito está vacío</h2>
        <p className="page-subtitle">Parece que aún no has añadido ninguna delicia.</p>
        <Link to="/catalogo" className="btn-primary">Ir al Catálogo</Link>
      </div>
    );
  }

  return (
    <div className="page-inner">
      <h1 className="page-title">Tu Carrito</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
        {cart.map(item => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-left">
              <img src={item.image} alt={item.name} className="cart-item-img" />
              <div>
                <p className="cart-item-name">{item.name}</p>
                <p style={{ fontSize: '0.88rem', color: 'var(--color-text-light)', margin: '0 0 8px' }}>
                  ${item.price.toFixed(2)} c/u
                </p>
                <div className="quantity-control">
                  <button className="quantity-btn" onClick={() => updateQuantity(item.id, -1)}>
                    <Minus size={13} strokeWidth={2.5} />
                  </button>
                  <span className="quantity-value">{item.quantity}</span>
                  <button className="quantity-btn" onClick={() => updateQuantity(item.id, 1)}>
                    <Plus size={13} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>
            <div className="cart-item-right">
              <span className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</span>
              <button className="link-danger btn-icon" onClick={() => handleRemove(item)}>
                <Trash2 size={14} strokeWidth={1.75} /> Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <p className="cart-total">Total: <span>${getCartTotal().toFixed(2)}</span></p>
        <div className="cart-actions">
          <button className="btn-ghost" onClick={clearCart}>Vaciar Carrito</button>
          <button className="btn-primary" onClick={() => addToast('¡Compra simulada con éxito! 🎉')}>
            Proceder al Pago
          </button>
        </div>
      </div>
    </div>
  );
}

export default Carrito;
