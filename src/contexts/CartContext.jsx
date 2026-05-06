import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('smartnest-cart');
    if (saved) {
      try { setCart(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('smartnest-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback((product, quantity = 1, selectedAttributes = {}) => {
    setCart(prev => {
      const existing = prev.find(item =>
        item.productId === product._id &&
        JSON.stringify(item.selectedAttributes) === JSON.stringify(selectedAttributes)
      );
      if (existing) {
        return prev.map(item =>
          item.productId === product._id &&
          JSON.stringify(item.selectedAttributes) === JSON.stringify(selectedAttributes)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, {
        productId: product._id, name: product.name, price: product.price,
        image: product.images[0], quantity, selectedAttributes,
        maxInventory: product.inventory,
      }];
    });
    setIsOpen(true);
  }, []);

  const removeFromCart = useCallback((productId, selectedAttributes) => {
    setCart(prev => prev.filter(item =>
      !(item.productId === productId &&
        JSON.stringify(item.selectedAttributes) === JSON.stringify(selectedAttributes))
    ));
  }, []);

  const updateQuantity = useCallback((productId, selectedAttributes, quantity) => {
    if (quantity < 1) { removeFromCart(productId, selectedAttributes); return; }
    setCart(prev => prev.map(item =>
      item.productId === productId &&
      JSON.stringify(item.selectedAttributes) === JSON.stringify(selectedAttributes)
        ? { ...item, quantity: Math.min(quantity, item.maxInventory) }
        : item
    ));
  }, [removeFromCart]);

  const clearCart = useCallback(() => setCart([]), []);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart, isOpen, setIsOpen, addToCart, removeFromCart,
      updateQuantity, clearCart, totalItems, totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};