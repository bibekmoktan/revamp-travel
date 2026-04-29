'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { getWishlistIds, addToWishlist, removeFromWishlist } from '@/lib/api';
import type { ApiPackage } from '@/types/api';

interface WishlistContextValue {
  ids: Set<string>;
  count: number;
  isWishlisted: (packageId: string) => boolean;
  toggle: (pkg: Pick<ApiPackage, '_id'>) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuth();
  const [ids, setIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!token) { setIds(new Set()); return; }
    getWishlistIds(token)
      .then(res => setIds(new Set(res.data)))
      .catch(() => {});
  }, [token, user]);

  const isWishlisted = useCallback((packageId: string) => ids.has(packageId), [ids]);

  const toggle = useCallback(async (pkg: Pick<ApiPackage, '_id'>) => {
    if (!token) return;
    const packageId = pkg._id;
    const alreadySaved = ids.has(packageId);

    // Optimistic update
    setIds(prev => {
      const next = new Set(prev);
      if (alreadySaved) next.delete(packageId); else next.add(packageId);
      return next;
    });

    try {
      if (alreadySaved) {
        await removeFromWishlist(token, packageId);
      } else {
        await addToWishlist(token, packageId);
      }
    } catch {
      // Revert on failure
      setIds(prev => {
        const next = new Set(prev);
        if (alreadySaved) next.add(packageId); else next.delete(packageId);
        return next;
      });
    }
  }, [token, ids]);

  return (
    <WishlistContext.Provider value={{ ids, count: ids.size, isWishlisted, toggle }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider');
  return ctx;
}
