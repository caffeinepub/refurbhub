import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Product } from "../backend.d";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: bigint) => void;
  updateQuantity: (productId: bigint, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "refurbhub_cart";

function serializeCart(items: CartItem[]): string {
  return JSON.stringify(
    items.map((i) => ({
      ...i,
      product: {
        ...i.product,
        id: i.product.id.toString(),
        stock: i.product.stock.toString(),
        createdAt: i.product.createdAt.toString(),
      },
    })),
  );
}

function deserializeCart(raw: string): CartItem[] {
  try {
    const parsed = JSON.parse(raw) as Array<{
      product: Record<string, unknown>;
      quantity: number;
    }>;
    return parsed.map((i) => ({
      ...i,
      product: {
        ...i.product,
        id: BigInt(i.product.id as string),
        stock: BigInt(i.product.stock as string),
        createdAt: BigInt(i.product.createdAt as string),
      } as Product,
    }));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? deserializeCart(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, serializeCart(items));
  }, [items]);

  const addToCart = useCallback((product: Product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + qty }
            : i,
        );
      }
      return [...prev, { product, quantity: qty }];
    });
  }, []);

  const removeFromCart = useCallback((productId: bigint) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: bigint, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.product.id !== productId));
    } else {
      setItems((prev) =>
        prev.map((i) =>
          i.product.id === productId ? { ...i, quantity: qty } : i,
        ),
      );
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce(
    (sum, i) => sum + (i.product.discountPrice || i.product.price) * i.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
