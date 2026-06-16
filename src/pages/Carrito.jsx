import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, Lock } from 'lucide-react';

function Carrito() {
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Estados para formato de tarjeta
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();

  const handleCardChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 16) val = val.slice(0, 16);
    setCardNumber(val.replace(/(\d{4})(?=\d)/g, '$1 '));
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 4) val = val.slice(0, 4);
    if (val.length > 2) val = `${val.slice(0, 2)}/${val.slice(2)}`;
    setExpiry(val);
  };

  const handleCvcChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 3) val = val.slice(0, 3);
    setCvc(val);
  };

  const handleRemove = (item) => {
    removeFromCart(item.id);
    addToast(`${item.name} eliminado del carrito`, 'info');
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!user) {
      addToast('Debes iniciar sesión para realizar un pedido.', 'error');
      setShowStripeModal(false);
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/pedidos', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          total: getCartTotal(),
          items: cart
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.mensaje || 'Error al procesar el pedido');
      
      setIsProcessing(false);
      setShowStripeModal(false);
      clearCart();
      addToast('¡Pago exitoso y pedido registrado! Gracias por tu compra');
    } catch (error) {
      setIsProcessing(false);
      addToast(error.message || 'Hubo un problema al procesar el pago.', 'error');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="page-inner" style={{ textAlign: 'center', paddingTop: '80px' }}>
        <div className="feature-icon-wrap" style={{ margin: '0 auto 20px', width: '64px', height: '64px' }}>
          <ShoppingCart size={30} strokeWidth={1.5} color="var(--color-secondary)" />
        </div>
        <h2 className="page-title">Tu pedido está vacío</h2>
        <p className="page-subtitle">Parece que aún no has añadido ninguna delicia.</p>
        <Link to="/catalogo" className="btn-primary">Ir al Catálogo</Link>
      </div>
    );
  }

  return (
    <div className="page-inner">
      <h1 className="page-title">Tu Pedido</h1>
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
          <button className="btn-ghost" onClick={clearCart}>Vaciar Pedido</button>
          <button className="btn-primary" onClick={() => {
            if (!user) {
              addToast('Por favor, inicia sesión antes de pagar.', 'info');
              return;
            }
            setShowStripeModal(true);
          }}>
            Proceder al Pago
          </button>
        </div>
      </div>

      {showStripeModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div className="card" style={{ width: '100%', maxWidth: '420px', padding: '30px', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={20} color="var(--color-primary)" />
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700' }}>Pago Seguro</h2>
              </div>
              <button onClick={() => setShowStripeModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--color-text-light)' }}>&times;</button>
            </div>
            
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Transacción encriptada con tecnología <span style={{ fontWeight: '800', color: '#635BFF', letterSpacing: '-0.5px', fontSize: '1rem' }}>stripe</span>
            </p>

            <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="form-label" style={{ fontSize: '0.85rem' }}>Número de Tarjeta</label>
                <div style={{ position: 'relative' }}>
                  <input type="text" className="form-input" placeholder="0000 0000 0000 0000" value={cardNumber} onChange={handleCardChange} maxLength="19" required style={{ paddingLeft: '40px', letterSpacing: '1px' }} />
                  <CreditCard size={18} color="var(--color-text-light)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label" style={{ fontSize: '0.85rem' }}>Expiración</label>
                  <input type="text" className="form-input" placeholder="MM/AA" value={expiry} onChange={handleExpiryChange} maxLength="5" required style={{ letterSpacing: '1px' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="form-label" style={{ fontSize: '0.85rem' }}>CVC</label>
                  <input type="text" className="form-input" placeholder="123" value={cvc} onChange={handleCvcChange} maxLength="3" required style={{ letterSpacing: '1px' }} />
                </div>
              </div>
              <div>
                <label className="form-label" style={{ fontSize: '0.85rem' }}>Nombre en la tarjeta</label>
                <input type="text" className="form-input" placeholder="Como aparece en la tarjeta" required />
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: '10px', padding: '14px', fontSize: '1.05rem', backgroundColor: '#635BFF', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }} disabled={isProcessing || cardNumber.length < 19 || expiry.length < 5 || cvc.length < 3}>
                {isProcessing ? 'Procesando seguro...' : (
                  <>
                    <Lock size={16} /> Pagar ${getCartTotal().toFixed(2)}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Carrito;
