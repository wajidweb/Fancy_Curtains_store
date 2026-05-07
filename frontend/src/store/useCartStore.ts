import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: { ms: string; en: string };
  price: number;
  image: string;
  quantity: number;
  selectedVariant?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  notification: string | null;
  clearNotification: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      notification: null,
      addItem: (item) => {
        const existingItem = get().items.find((i) => i.id === item.id && i.selectedVariant === item.selectedVariant);
        if (existingItem) {
          set({
            items: get().items.map((i) =>
              i.id === item.id && i.selectedVariant === item.selectedVariant
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
            notification: 'added',
          });
        } else {
          set({ 
            items: [...get().items, item],
            notification: 'added',
          });
        }

        // Auto clear notification after 3 seconds
        setTimeout(() => {
          get().clearNotification();
        }, 3000);
      },
      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },
      updateQuantity: (id, quantity) => {
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      clearNotification: () => set({ notification: null }),
    }),
    {
      name: 'fancy-cart-storage',
      // Only persist items, not the notification state
      partialize: (state) => ({ items: state.items }),
    }
  )
);
