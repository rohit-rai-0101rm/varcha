'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  slug: string;
  qty: number;
  stockQty: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'qty'>) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = 'varcha_cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      // corrupted localStorage — start fresh
    }
  }, []);

  function persist(next: CartItem[]) {
    setItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function addItem(item: Omit<CartItem, 'qty'>) {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      let next: CartItem[];
      if (existing) {
        next = prev.map((i) =>
          i.productId === item.productId
            ? { ...i, qty: Math.min(i.qty + 1, i.stockQty) }
            : i,
        );
      } else {
        next = [...prev, { ...item, qty: 1 }];
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  function removeItem(productId: string) {
    persist(items.filter((i) => i.productId !== productId));
  }

  function updateQty(productId: string, qty: number) {
    if (qty < 1) return removeItem(productId);
    persist(
      items.map((i) =>
        i.productId === productId ? { ...i, qty: Math.min(qty, i.stockQty) } : i,
      ),
    );
  }

  function clearCart() {
    persist([]);
  }

  const totalItems = items.reduce((s, i) => s + i.qty, 0);
  const totalAmount = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, totalItems, totalAmount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
