"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
};

type CartState = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  total: () => number;
  count: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) =>
        set((state) => {
          const existing = state.items.find(
            (cartItem) => cartItem.id === item.id
          );

          if (existing) {
            return {
              items: state.items.map((cartItem) =>
                cartItem.id === item.id
                  ? {
                      ...cartItem,
                      qty: cartItem.qty + item.qty,
                      name: item.name,
                      price: item.price,
                      image: item.image ?? cartItem.image,
                    }
                  : cartItem
              ),
            };
          }

          return { items: [...state.items, item] };
        }),
      remove: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      setQty: (id, qty) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item.id === id
                ? {
                    ...item,
                    qty: Math.max(0, qty),
                  }
                : item
            )
            .filter((item) => item.qty > 0),
        })),
      clear: () => set({ items: [] }),
      total: () =>
        get().items.reduce(
          (sum, item) => sum + item.price * Math.max(item.qty, 0),
          0
        ),
      count: () => get().items.reduce((sum, item) => sum + item.qty, 0),
    }),
    {
      name: "glamora_cart_v1",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);

