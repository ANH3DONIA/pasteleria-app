import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, Menu, X, MessageCircle, Camera } from 'lucide-react';

function Navbar() {
  const { user } = useAuth();
  const { cart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [animating, setAnimating] = useState({});

  const itemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const closeMenu = () => setMenuOpen(false);

  const handleSocialClick = (id) => {
    setAnimating(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setAnimating(prev => ({ ...prev, [id]: false }));
    }, 400);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand" onClick={closeMenu}>La Dulce Vida</Link>

      <button className="hamburger" onClick={() => setMenuOpen(prev => !prev)} aria-label="Abrir menú">
        {menuOpen ? <X size={22} color="var(--color-secondary)" /> : <Menu size={22} color="var(--color-secondary)" />}
      </button>

      <div className={`navbar-links ${menuOpen ? 'navbar-links--open' : ''}`}>
        <Link to="/" className="navbar-link" onClick={closeMenu}>Inicio</Link>
        <Link to="/nosotros" className="navbar-link" onClick={closeMenu}>Nosotros</Link>
        <Link to="/catalogo" className="navbar-link" onClick={closeMenu}>Catálogo</Link>
        <Link to="/personalizado" className="navbar-link" onClick={closeMenu}>Diseña tu Pastel</Link>
        
        <div className="navbar-socials">
          <button className={`navbar-social-btn ${animating['wa'] ? 'navbar-social-btn--pop' : ''}`} onClick={() => handleSocialClick('wa')} aria-label="WhatsApp">
            <MessageCircle size={18} strokeWidth={1.75} />
          </button>
          <button className={`navbar-social-btn ${animating['ig'] ? 'navbar-social-btn--pop' : ''}`} onClick={() => handleSocialClick('ig')} aria-label="Instagram">
            <Camera size={18} strokeWidth={1.75} />
          </button>
          <button className={`navbar-social-btn ${animating['fb'] ? 'navbar-social-btn--pop' : ''}`} onClick={() => handleSocialClick('fb')} aria-label="Facebook">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </button>
        </div>

        <Link to="/contacto" className="navbar-link" onClick={closeMenu}>Contacto</Link>
        <Link to="/carrito" className="navbar-link navbar-link--icon" onClick={closeMenu}>
          <ShoppingCart size={18} strokeWidth={1.75} />
          Mi Pedido
          {itemsCount > 0 && <span key={itemsCount} className="cart-badge">{itemsCount}</span>}
        </Link>
        {user ? (
          <Link to="/perfil" className="btn-primary btn-icon" style={{ backgroundColor: 'var(--color-accent)' }} onClick={closeMenu}>
            <User size={15} strokeWidth={2} />
            {user.nombre}
          </Link>
        ) : (
          <Link to="/login" className="btn-primary" onClick={closeMenu}>Iniciar Sesión</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
