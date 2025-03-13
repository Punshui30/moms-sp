import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export enum Category {
  FLOWER = 'FLOWER',
  EDIBLE = 'EDIBLE',
  CONCENTRATE = 'CONCENTRATE',
  VAPE = 'VAPE',
  TINCTURE = 'TINCTURE',
  TOPICAL = 'TOPICAL',
  ACCESSORY = 'ACCESSORY'
}

export enum StrainType {
  SATIVA = 'SATIVA',
  INDICA = 'INDICA',
  HYBRID = 'HYBRID',
  CBD = 'CBD'
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
  category: Category;
  strainType?: StrainType;
  thcPercentage?: number;
  createdAt: Date;
  sales?: number;
  lastSold?: Date;
}

interface ProductStore {
  products: Product[];
  totalSales: number;
  activeOrders: number;
  salesHistory: Array<{date: Date; amount: number}>;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  recordSale: (productId: string, amount: number, playSound?: boolean) => void;
}

const DEFAULT_PRODUCTS: Omit<Product, 'id' | 'createdAt'>[] = [
  {
    name: 'Purple Haze',
    description: 'Classic sativa-dominant hybrid with sweet berry aroma',
    price: 45.99,
    image: 'https://images.unsplash.com/photo-1603909223429-69bb7101f420?w=800',
    quantity: 100,
    category: Category.FLOWER,
    strainType: StrainType.SATIVA,
    thcPercentage: 22,
  },
  {
    name: 'OG Kush',
    description: 'Legendary strain with earthy pine and sour lemon scent',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?w=800',
    quantity: 100,
    category: Category.FLOWER,
    strainType: StrainType.HYBRID,
    thcPercentage: 24,
  },
  {
    name: 'Northern Lights',
    description: 'Pure indica strain perfect for relaxation',
    price: 47.99,
    image: 'https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?w=800',
    quantity: 100,
    category: Category.FLOWER,
    strainType: StrainType.INDICA,
    thcPercentage: 18,
  }
];

const getInitialState = () => {
  return {
    products: [],
    totalSales: mockSalesData.reduce((acc, sale) => acc + sale.amount, 0),
    activeOrders: 3,
    salesHistory: mockSalesData,
  };
};

const mockSalesData = Array.from({length: 30}, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
  amount: Math.random() * 1000
}));

export const useProductStore = create(
  persist<ProductStore>(
    (set) => ({
      ...getInitialState(),
      addProduct: (product) =>
        set((state) => {
          const newProducts = [
            ...state.products,
            {
              ...product,
              sales: 0,
              id: crypto.randomUUID(),
              createdAt: new Date(),
            },
          ];
          return { products: newProducts };
        }),
      updateProduct: (id, product) =>
        set((state) => {
          const newProducts = state.products.map((p) =>
            p.id === id ? { ...p, ...product } : p
          );
          return { products: newProducts };
        }),
      deleteProduct: (id) =>
        set((state) => {
          const newProducts = state.products.filter((p) => p.id !== id);
          return { products: newProducts };
        }),
      recordSale: (productId, amount, playSound = true) =>
        set((state) => {
          if (playSound) {
            const audio = new Audio('https://jmp.sh/de7y8rZu');
            audio.play().catch(console.error);
          }
          return {
            products: state.products.map((p) =>
              p.id === productId
                ? { ...p, sales: (p.sales || 0) + 1, lastSold: new Date() }
                : p
            ),
            totalSales: state.totalSales + amount,
            salesHistory: [...state.salesHistory, { date: new Date(), amount }],
          };
        })
    }),
    {
      name: 'product-storage',
      version: 1,
      storage: {
        getItem: (name) => JSON.parse(localStorage.getItem(name) || 'null'),
        setItem: (name, value) => localStorage.setItem(name, JSON.stringify(value)),
        removeItem: (name) => localStorage.removeItem(name)
      },
      onRehydrateStorage: () => (state) => {
        if (!state || state.products.length === 0) {
          state?.addProduct && DEFAULT_PRODUCTS.forEach(product => state.addProduct(product));
        }
      }
    }
  )
);