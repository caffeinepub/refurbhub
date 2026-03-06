import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Order, OrderItem, Product, ShoppingItem } from "../backend.d";
import {
  type ProductWithMarketPrice,
  SAMPLE_PRODUCTS,
} from "../data/sampleProducts";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

/* ─── Products ─── */

export function useProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<ProductWithMarketPrice[]>({
    queryKey: ["products"],
    queryFn: async () => {
      // No actor yet — show sample products as a pleasant fallback
      if (!actor) return SAMPLE_PRODUCTS;
      const result = await actor.getProducts();
      // Backend is empty (first launch) — show sample products so the page never looks blank
      return result.length > 0
        ? (result as ProductWithMarketPrice[])
        : SAMPLE_PRODUCTS;
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
        return SAMPLE_PRODUCTS.find((p) => p.id === id) ?? null;
      }
      const result = await actor.getProduct(id);
      return (result as ProductWithMarketPrice | null) ?? null;
    },
    enabled: !isFetching,
  });
}

export function useAddProduct() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<Product, "id" | "createdAt">) => {
      const isConnected = !!identity && !identity.getPrincipal().isAnonymous();
      if (!actor || !isConnected) {
        toast.error(
          "Please connect with Internet Identity first to add products",
        );
        throw new Error("Not connected — Internet Identity required");
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
  const { identity } = useInternetIdentity();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Product) => {
      const isConnected = !!identity && !identity.getPrincipal().isAnonymous();
      if (!actor || !isConnected) {
        toast.error(
          "Please connect with Internet Identity first to update products",
        );
        throw new Error("Not connected — Internet Identity required");
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
  const { identity } = useInternetIdentity();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      const isConnected = !!identity && !identity.getPrincipal().isAnonymous();
      if (!actor || !isConnected) {
        toast.error(
          "Please connect with Internet Identity first to delete products",
        );
        throw new Error("Not connected — Internet Identity required");
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
