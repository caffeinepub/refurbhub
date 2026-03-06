import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Order, OrderItem, Product, ShoppingItem } from "../backend.d";
import { CAFFEINE_ADMIN_TOKEN } from "../data/adminToken";
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
      if (!actor) {
        console.log(
          "[useProducts] Actor not ready — returning sample products",
        );
        return SAMPLE_PRODUCTS;
      }
      try {
        console.log("[useProducts] Fetching products from backend canister");
        const result = await actor.getProducts();
        console.log(`[useProducts] Got ${result.length} products from backend`);
        if (result.length > 0) return result as ProductWithMarketPrice[];
      } catch (err) {
        console.error("[useProducts] Backend call failed:", err);
      }
      return SAMPLE_PRODUCTS;
    },
    enabled: !isFetching,
    staleTime: 1000 * 30,
  });
}

export function useProduct(id: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<ProductWithMarketPrice | null>({
    queryKey: ["product", id.toString()],
    queryFn: async () => {
      if (!actor) {
        console.log("[useProduct] Actor not ready — falling back to sample");
        return SAMPLE_PRODUCTS.find((p) => p.id === id) ?? null;
      }
      try {
        console.log(
          `[useProduct] Fetching product ${id.toString()} from backend`,
        );
        const result = await actor.getProduct(id);
        if (result) return result as ProductWithMarketPrice;
      } catch (err) {
        console.error("[useProduct] Backend call failed:", err);
      }
      return SAMPLE_PRODUCTS.find((p) => p.id === id) ?? null;
    },
    enabled: !isFetching,
  });
}

export function useAdminProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<ProductWithMarketPrice[]>({
    queryKey: ["adminProducts"],
    queryFn: async () => {
      if (!actor) {
        console.log("[useAdminProducts] Actor not ready — returning empty");
        return [];
      }
      try {
        console.log("[useAdminProducts] Fetching products from backend");
        const result = await actor.getProducts();
        console.log(
          `[useAdminProducts] Got ${result.length} products from backend`,
        );
        return result as ProductWithMarketPrice[];
      } catch (err) {
        console.error("[useAdminProducts] Backend call failed:", err);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
  });
}

export function useAddProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<Product, "id" | "createdAt">) => {
      if (!actor) {
        throw new Error(
          "Not connected to backend. Please log in with Internet Identity first.",
        );
      }
      console.log("[useAddProduct] Adding product to backend:", data.name);
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
      console.log("[useAddProduct] Product added successfully:", data.name);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["adminProducts"] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Product) => {
      if (!actor) {
        throw new Error(
          "Not connected to backend. Please log in with Internet Identity first.",
        );
      }
      console.log(
        "[useUpdateProduct] Updating product on backend:",
        data.id.toString(),
      );
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
      console.log(
        "[useUpdateProduct] Product updated successfully:",
        data.id.toString(),
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["adminProducts"] });
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
        throw new Error(
          "Not connected to backend. Please log in with Internet Identity first.",
        );
      }
      console.log(
        "[useDeleteProduct] Deleting product from backend:",
        id.toString(),
      );
      await actor.deleteProduct(id);
      console.log(
        "[useDeleteProduct] Product deleted successfully:",
        id.toString(),
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["adminProducts"] });
    },
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
  const { identity } = useInternetIdentity();
  const isConnected = !!identity && !identity.getPrincipal().isAnonymous();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor || !isConnected) return false;
      console.log("[useIsAdmin] Checking admin status on backend");
      try {
        const result = await actor.isCallerAdmin();
        console.log("[useIsAdmin] Admin status:", result);
        return result;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        // The canister traps with "User is not registered" when the principal
        // has never called _initializeAccessControlWithSecret.
        // Treat this as "not admin yet" rather than a hard error so the
        // AdminRegistrationGate can proceed with activation.
        if (
          msg.toLowerCase().includes("not registered") ||
          msg.toLowerCase().includes("user is not") ||
          msg.toLowerCase().includes("trap")
        ) {
          console.log(
            "[useIsAdmin] Principal not yet registered — returning false (will proceed to activation)",
          );
          return false;
        }
        console.error("[useIsAdmin] Unexpected error:", err);
        return false;
      }
    },
    enabled: !isFetching && isConnected && !!actor,
    retry: false,
  });
}

export function useActivateAdmin() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) {
        console.error(
          "[useActivateAdmin] Actor is null — cannot activate admin",
        );
        throw new Error(
          "Not connected to backend. Please wait for the connection to establish.",
        );
      }
      console.log(
        "[useActivateAdmin] Attempting admin registration with token:",
        `${CAFFEINE_ADMIN_TOKEN.slice(0, 8)}...`,
      );
      try {
        const actorAny = actor as unknown as {
          _initializeAccessControlWithSecret: (secret: string) => Promise<void>;
        };
        await actorAny._initializeAccessControlWithSecret(CAFFEINE_ADMIN_TOKEN);
        console.log("[useActivateAdmin] Admin registration call succeeded");
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.warn(
          "[useActivateAdmin] _initializeAccessControlWithSecret threw:",
          msg,
        );
        // If the canister says access control is already initialized,
        // this is NOT a real error — the first admin is already registered.
        // Treat it as success so the caller can re-check admin status.
        if (
          msg.toLowerCase().includes("already") ||
          msg.toLowerCase().includes("duplicate") ||
          msg.toLowerCase().includes("initialized") ||
          msg.toLowerCase().includes("access control") ||
          msg.toLowerCase().includes("cannot call")
        ) {
          console.log(
            "[useActivateAdmin] Access control already set — treating as success",
          );
          return; // do not re-throw
        }
        throw err;
      }
    },
    onSuccess: () => {
      console.log(
        "[useActivateAdmin] Admin registration successful — refreshing admin status",
      );
      void qc.invalidateQueries({ queryKey: ["isAdmin"] });
    },
    onError: (err) => {
      console.error("[useActivateAdmin] Admin activation failed:", err);
    },
  });
}

export function useActorStatus() {
  const { actor, isFetching } = useActor();
  const { identity, isInitializing } = useInternetIdentity();
  const isConnected = !!identity && !identity.getPrincipal().isAnonymous();
  // Only report an actor error if:
  // - the user is authenticated (non-anonymous identity)
  // - II has finished initializing
  // - actor is null (failed to build)
  // - and we are not currently fetching
  const isActorError = isConnected && !isInitializing && !actor && !isFetching;
  return { actor, isFetching, isActorError };
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
