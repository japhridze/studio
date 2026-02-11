'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { CartItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/lib/types';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number, messages: { title: string; description: string; }) => void;
  removeFromCart: (productId: string, messages: { title: string; description: string; }) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product, quantity: number, messages: { title: string; description: string; }) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      const newItem: CartItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity,
          image: product.images[0],
          slug: product.slug,
      }
      return [...prevItems, newItem];
    });
    toast({
        title: messages.title,
        description: messages.description,
    })
  };

  const removeFromCart = (productId: string, messages: { title: string; description: string; }) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    toast({
        title: messages.title,
        description: messages.description,
        variant: 'destructive',
    })
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      // Silently remove, or pass messages to updateQuantity as well
      setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
