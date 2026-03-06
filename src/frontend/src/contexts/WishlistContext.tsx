import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface WishlistContextValue {
  wishlist: bigint[];
  toggleWishlist: (id: bigint) => void;
  isWishlisted: (id: bigint) => boolean;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

const STORAGE_KEY = "refurbhub_wishlist";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<bigint[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    try {
      const arr = JSON.parse(stored) as string[];
      return arr.map(BigInt);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist.map(String)));
  }, [wishlist]);

  const toggleWishlist = useCallback((id: bigint) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  const isWishlisted = useCallback(
    (id: bigint) => wishlist.includes(id),
    [wishlist],
  );

  return (
    <WishlistContext.Provider
      value={{ wishlist, toggleWishlist, isWishlisted }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
