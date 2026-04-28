'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { CartItem } from '@/types/api';

interface CartContextValue {
  items: CartItem[];
  count: number;
  addItem: (item: CartItem) => void;
  removeItem: (packageId: string, date: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'tn_cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  const persist = (next: CartItem[]) => {
    setItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const addItem = useCallback((item: CartItem) => {
    setItems(prev => {
      const exists = prev.find(i => i.packageId === item.packageId && i.date === item.date);
      const next = exists
        ? prev.map(i => i.packageId === item.packageId && i.date === item.date ? item : i)
        : [...prev, item];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeItem = useCallback((packageId: string, date: string) => {
    setItems(prev => {
      const next = prev.filter(i => !(i.packageId === packageId && i.date === date));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    persist([]);
  }, []);

  return (
    <CartContext.Provider value={{ items, count: items.length, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
