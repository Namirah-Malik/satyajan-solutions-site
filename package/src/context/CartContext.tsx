'use client';
// context/CartContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id:             string;
  name:           string;
  SKU:            string;
  price:          number;
  image:          string;
  quantity:       number;
  originalPrice?: number;
}

interface CartContextType {
  cartItems:       CartItem[];
  addToCart:       (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart:  (id: string) => void;
  updateQuantity:  (id: string, quantity: number) => void;
  clearCart:       () => void;
  getTotalItems:   () => number;
  getSubtotal:     () => number;
  getTotalSavings: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) return JSON.parse(savedCart);
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
    return [];
  });

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  // CHANGED: debounced write — rapid add-to-cart no longer triggers
  // a synchronous JSON.stringify + localStorage write on every click
  useEffect(() => {
    if (!isInitialized) return;
    const timer = setTimeout(() => {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }, 300);
    return () => clearTimeout(timer);
  }, [cartItems, isInitialized]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalSavings = () => {
    return cartItems.reduce((total, item) => {
      if (item.originalPrice) {
        return total + (item.originalPrice - item.price) * item.quantity;
      }
      return total;
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getSubtotal,
        getTotalSavings,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}