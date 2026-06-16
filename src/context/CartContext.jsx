import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

const CART_KEY = 'ldv_cart';

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    const existing = cart.find(item => String(item.id) === String(product.id));
    if (existing && existing.quantity >= 10) {
      return false; // No se puede añadir más
    }
    setCart((prev) => {
      const prevExisting = prev.find(item => String(item.id) === String(product.id));
      if (prevExisting) {
        return prev.map(item =>
          String(item.id) === String(product.id) ? { ...item, quantity: Math.min(10, item.quantity + 1) } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    return true; // Añadido con éxito
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter(item => String(item.id) !== String(productId)));
  };

  const updateQuantity = (productId, delta) => {
    setCart((prev) =>
      prev
        .map(item => {
          if (String(item.id) === String(productId)) {
            const newQuantity = Math.max(0, Math.min(10, item.quantity + delta));
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter(item => item.quantity > 0)
    );
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
