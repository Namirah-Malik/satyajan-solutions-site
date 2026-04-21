'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  SKU?: string;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isWishlisted: (id: string) => boolean;
  toggleWishlist: (item: WishlistItem) => void;
  wishlistCount: number;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);
const STORAGE_KEY = 'satyajan_wishlist';

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setWishlistItems(JSON.parse(stored));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistItems));
    } catch {}
  }, [wishlistItems, loaded]);

  const addToWishlist = useCallback((item: WishlistItem) => {
    setWishlistItems(prev => prev.find(i => i.id === item.id) ? prev : [...prev, item]);
  }, []);

  const removeFromWishlist = useCallback((id: string) => {
    setWishlistItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const isWishlisted = useCallback((id: string) => {
    return wishlistItems.some(i => i.id === id);
  }, [wishlistItems]);

  const toggleWishlist = useCallback((item: WishlistItem) => {
    setWishlistItems(prev =>
      prev.find(i => i.id === item.id)
        ? prev.filter(i => i.id !== item.id)
        : [...prev, item]
    );
  }, []);

  const clearWishlist = useCallback(() => setWishlistItems([]), []);

  return (
    <WishlistContext.Provider value={{
      wishlistItems, addToWishlist, removeFromWishlist,
      isWishlisted, toggleWishlist,
      wishlistCount: wishlistItems.length, clearWishlist,
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}