import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  condition: "like-new" | "good" | "acceptable";
  coverImage: string;
  description?: string;
}

export type DeliveryMethod = "delivery" | "pickup";

export interface Order {
  id: string;
  items: Book[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    language: "ar" | "he";
  };
  delivery?: {
    method: "delivery" | "pickup";
    address?: string;
  };
  createdAt: string;
}

interface CartStore {
  cart: Book[];
  orders: Order[];
  delivery: {
    method: DeliveryMethod;
    address: string;
  };
  addToCart: (book: Book) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  addOrder: (order: Order) => void;
  setDelivery: (delivery: { method: DeliveryMethod; address: string }) => void;
  clearOrders: () => void;
  removeOrder: (id: string) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      cart: [],
      orders: [],
      delivery: {
        method: "pickup",
        address: "",
      },
      addToCart: (book) =>
        set((state) => {
          if (state.cart.some((b) => b.id === book.id)) return state;
          return { cart: [...state.cart, book] };
        }),
      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((b) => b.id !== id),
        })),
      clearCart: () => set({ cart: [] }),
      addOrder: (order) =>
        set((state) => ({
          orders: [order, ...state.orders],
        })),
      setDelivery: (delivery) => set({ delivery }),
      clearOrders: () => set({ orders: [] }),
      removeOrder: (id) =>
        set((state) => ({
          orders: state.orders.filter((o) => o.id !== id),
        })),
    }),
    { name: "secondbook-storage" }
  )
);
