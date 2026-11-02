import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!token) {
      setCart(null);
      return;
    }

    try {
      setLoading(true);
      const res = await api.get('/cart');
      if (res.data.success) {
        setCart(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!token) {
      throw new Error('Please log in to add products to your cart');
    }

    const res = await api.post('/cart/items', { productId, quantity });
    if (res.data.success) {
      setCart(res.data.data);
      return res.data;
    }
    throw new Error(res.data.message || 'Could not add to cart');
  };

  const updateQuantity = async (itemId, quantity) => {
    if (!token) return;

    const res = await api.put(`/cart/items/${itemId}`, { quantity });
    if (res.data.success) {
      setCart(res.data.data);
      return res.data;
    }
    throw new Error(res.data.message || 'Could not update quantity');
  };

  const removeFromCart = async (itemId) => {
    if (!token) return;

    const res = await api.delete(`/cart/items/${itemId}`);
    if (res.data.success) {
      setCart(res.data.data);
      return res.data;
    }
    throw new Error(res.data.message || 'Could not remove item');
  };

  const clearCart = async () => {
    if (!token) return;

    const res = await api.delete('/cart');
    if (res.data.success) {
      setCart(res.data.data);
      return res.data;
    }
  };

  const totalItems = cart?.totalItems || 0;
  const subtotal = cart?.subtotal || 0;
  const shipping = cart?.shipping || 0;
  const grandTotal = cart?.grandTotal || 0;
  const items = cart?.items || [];

  return (
    <CartContext.Provider
      value={{
        cart,
        items,
        totalItems,
        subtotal,
        shipping,
        grandTotal,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
