import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product, quantity = 1, selectedSize) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(
        item => item.id === product.id && item.size === selectedSize.size
      );

      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id && item.size === selectedSize.size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prevItems, {
        ...product,
        quantity,
        size: selectedSize.size,
        price: selectedSize.price
      }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId, size) => {
    setCartItems(prevItems => 
      prevItems.filter(item => !(item.id === productId && item.size === size))
    );
  };

  const updateQuantity = (productId, size, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId, size);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId && item.size === size
          ? { ...item, quantity: Math.min(newQuantity, 3) }
          : item
      )
    );
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const cartCount = cartItems.reduce(
    (count, item) => count + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartTotal,
        cartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 