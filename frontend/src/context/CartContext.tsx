'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { CartItem } from '@/types/api';

interface CartContextValue {
  items: CartItem[];
  count: number;
  hydrated: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (cartId: string) => void;
  updateItem: (cartId: string, updates: Partial<CartItem>) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'tn_cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: CartItem[] = JSON.parse(raw);
        const migrated = parsed.map(i => i.cartId ? i : { ...i, cartId: crypto.randomUUID() });
        setItems(migrated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      }
    } catch {}
    setHydrated(true);
  }, []);

  const persist = (next: CartItem[]) => {
    setItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const addItem = useCallback((item: CartItem) => {
    setItems(prev => {
      const next = [...prev, item];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeItem = useCallback((cartId: string) => {
    setItems(prev => {
      const next = prev.filter(i => i.cartId !== cartId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const updateItem = useCallback((cartId: string, updates: Partial<CartItem>) => {
    setItems(prev => {
      const next = prev.map(i => i.cartId === cartId ? { ...i, ...updates } : i);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    persist([]);
  }, []);

  return (
    <CartContext.Provider value={{ items, count: items.length, hydrated, addItem, removeItem, updateItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
