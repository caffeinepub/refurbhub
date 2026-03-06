import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Order, OrderItem, Product, ShoppingItem } from "../backend.d";
import {
  type ProductWithMarketPrice,
  SAMPLE_PRODUCTS,
} from "../data/sampleProducts";
import { useActor } from "./useActor";

/* ─── Local product storage helpers (fallback when no live backend) ─── */

const LOCAL_KEY = "refurbhub_local_products";

function loadLocalProducts(): ProductWithMarketPrice[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return [];
    // bigint fields are serialised as strings — restore them
    const parsed = JSON.parse(raw) as Array<Record<string, unknown>>;
    return parsed.map((p) => ({
      ...(p as unknown as ProductWithMarketPrice),
      id: BigInt(p.id as string),
      stock: BigInt(p.stock as string),
      createdAt: BigInt(p.createdAt as string),
    }));
  } catch {
    return [];
  }
}

function saveLocalProducts(products: ProductWithMarketPrice[]) {
  // JSON can't serialise bigint — convert to string
  const serialisable = products.map((p) => ({
    ...p,
    id: p.id.toString(),
    stock: p.stock.toString(),
    createdAt: p.createdAt.toString(),
  }));
  localStorage.setItem(LOCAL_KEY, JSON.stringify(serialisable));
}

function nextLocalId(products: ProductWithMarketPrice[]): bigint {
  if (products.length === 0) return 1000n;
  const max = products.reduce((m, p) => (p.id > m ? p.id : m), 0n);
  return max + 1n;
}

/* ─── Products ─── */

export function useProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<ProductWithMarketPrice[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) {
        const local = loadLocalProducts();
        // Merge: local products replace sample products with same id, then append local-only ones
        const merged = [...SAMPLE_PRODUCTS];
        for (const lp of local) {
          const idx = merged.findIndex((p) => p.id === lp.id);
          if (idx >= 0) merged[idx] = lp;
          else merged.push(lp);
        }
        return merged;
      }
      const result = await actor.getProducts();
      return result.length > 0 ? result : SAMPLE_PRODUCTS;
    },
    enabled: !isFetching,
    staleTime: 1000 * 60 * 5,
  });
}

export function useProduct(id: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<ProductWithMarketPrice | null>({
    queryKey: ["product", id.toString()],
    queryFn: async () => {
      if (!actor) {
        const local = loadLocalProducts();
        return (
          local.find((p) => p.id === id) ??
          SAMPLE_PRODUCTS.find((p) => p.id === id) ??
          null
        );
      }
      const result = await actor.getProduct(id);
      return result ?? null;
    },
    enabled: !isFetching,
  });
}

export function useAddProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<Product, "id" | "createdAt">) => {
      if (!actor) {
        // Offline fallback — persist to localStorage
        const existing = loadLocalProducts();
        const newProduct: ProductWithMarketPrice = {
          ...data,
          id: nextLocalId(existing),
          createdAt: BigInt(Date.now()),
        };
        saveLocalProducts([...existing, newProduct]);
        return;
      }
      await actor.addProduct(
        data.name,
        data.brand,
        data.processor,
        data.ram,
        data.storage,
        data.condition,
        data.price,
        data.discountPrice,
        data.description,
        data.stock,
        data.imageUrl,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Product) => {
      if (!actor) {
        // Offline fallback — update in localStorage
        const existing = loadLocalProducts();
        const idx = existing.findIndex((p) => p.id === data.id);
        if (idx >= 0) {
          existing[idx] = { ...existing[idx], ...data };
        } else {
          existing.push({ ...data });
        }
        saveLocalProducts(existing);
        return;
      }
      await actor.updateProduct(
        data.id,
        data.name,
        data.brand,
        data.processor,
        data.ram,
        data.storage,
        data.condition,
        data.price,
        data.discountPrice,
        data.description,
        data.stock,
        data.imageUrl,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["product"] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) {
        // Offline fallback — remove from localStorage
        const existing = loadLocalProducts();
        saveLocalProducts(existing.filter((p) => p.id !== id));
        return;
      }
      await actor.deleteProduct(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

/* ─── Orders ─── */

export function useOrders() {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOrders();
    },
    enabled: !isFetching,
  });
}

export function useCreateOrder() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      customerName: string;
      email: string;
      address: string;
      items: OrderItem[];
      total: number;
    }) => {
      if (!actor) throw new Error("Not connected");
      await actor.createOrder(
        data.customerName,
        data.email,
        data.address,
        data.items,
        data.total,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: bigint; status: string }) => {
      if (!actor) throw new Error("Not connected");
      await actor.updateOrderStatus(id, status);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}

/* ─── Auth / Admin ─── */

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !isFetching,
  });
}

/* ─── Stripe ─── */

export function useCreateCheckoutSession() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (data: {
      items: ShoppingItem[];
      successUrl: string;
      cancelUrl: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createCheckoutSession(
        data.items,
        data.successUrl,
        data.cancelUrl,
      );
    },
  });
}

export function useStripeSessionStatus(sessionId: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["stripeSession", sessionId],
    queryFn: async () => {
      if (!actor || !sessionId) return null;
      return actor.getStripeSessionStatus(sessionId);
    },
    enabled: !!sessionId && !isFetching,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return 2000;
      if (data.__kind__ === "completed" || data.__kind__ === "failed")
        return false;
      return 2000;
    },
  });
}

export function useIsStripeConfigured() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["stripeConfigured"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isStripeConfigured();
    },
    enabled: !isFetching,
  });
}
