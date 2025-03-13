import { create } from 'zustand';
import { Product } from './productStore';

interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  total: number;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  btcAddress?: string;
  orderStatus: 'pending' | 'paid' | 'processing' | 'delivering' | 'completed';
  setOrderStatus: (status: CartStore['orderStatus']) => void;
  setBtcAddress: (address: string) => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  total: 0,
  orderStatus: 'pending',
  addItem: (product) =>
    set((state) => {
      const existingItem = state.items.find((item) => item.id === product.id);
      const newTotal = existingItem 
        ? state.total + product.price 
        : state.total + product.price;

      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          total: newTotal,
        };
      }
      return {
        items: [...state.items, { ...product, quantity: 1 }],
        total: newTotal,
      };
    }),
  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== productId),
      total: state.total - (state.items.find((item) => item.id === productId)?.price * 
        (state.items.find((item) => item.id === productId)?.quantity || 0)),
    })),
  updateQuantity: (productId, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      ),
      total: state.items.reduce((acc, item) => 
        acc + (item.id === productId ? item.price * quantity : item.price * item.quantity), 
        0
      ),
    })),
  clearCart: () => set({ items: [], total: 0, btcAddress: undefined, orderStatus: 'pending' }),
  setOrderStatus: (status) => set({ orderStatus: status }),
  setBtcAddress: (address) => set({ btcAddress: address }),
}));