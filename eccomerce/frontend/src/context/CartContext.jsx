import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('ethioshop_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('ethioshop_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const cartItemsCount = cartItems.reduce((acc, item) => acc + Number(item.quantity || 1), 0);
  const cartTotalPrice = cartItems.reduce(
    (acc, item) => acc + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );

  const addToCart = (product, quantityToAdd = 1) => {
    setCartItems((prevItems) => {
      const pId = product.id || product.productId || product._id;
      const existingIndex = prevItems.findIndex(
        (item) => (item.id || item.productId || item._id) === pId
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity =
          Number(updated[existingIndex].quantity || 1) + Number(quantityToAdd);
        return updated;
      } else {
        return [...prevItems, { ...product, quantity: Number(quantityToAdd) }];
      }
    });
  };

  const updateQuantity = (id, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        const itemId = item.id || item.productId || item._id;
        return itemId === id ? { ...item, quantity: Math.max(1, newQuantity) } : item;
      })
    );
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => (item.id || item.productId || item._id) !== id)
    );
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartItemsCount,
        cartTotalPrice,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        setCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);