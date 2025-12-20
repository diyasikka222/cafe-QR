import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.id === item.id);
      if (existingItem) {
        return prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.id === itemId);
      if (existingItem?.quantity > 1) {
        return prevCart.map((i) =>
          i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i,
        );
      }
      return prevCart.filter((i) => i.id !== itemId);
    });
  };

  const getItemQuantity = (id) => {
    const item = cart.find((i) => i.id === id);
    return item ? item.quantity : 0;
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const clearCart = () => setCart([]);

  // MAKE SURE ALL THESE ARE IN THE VALUE
  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        getItemQuantity,
        getTotal,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// CRITICAL: Ensure this 'export' is here!
export const useCart = () => useContext(CartContext);
