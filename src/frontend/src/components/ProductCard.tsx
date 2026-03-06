import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { Heart, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "../backend.d";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";

interface ProductCardProps {
  product: Product;
  index?: number;
}

function conditionBadgeClass(condition: string) {
  switch (condition.toLowerCase()) {
    case "like new":
      return "bg-success/10 text-success border-success/20 hover:bg-success/15";
    case "excellent":
      return "bg-primary/10 text-primary border-primary/20 hover:bg-primary/15";
    case "good":
      return "bg-warning/10 text-warning-foreground border-warning/20 hover:bg-warning/15";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

function formatPrice(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function ProductCard({ product, index = 1 }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  const discount =
    product.price > 0
      ? Math.round(
          ((product.price - product.discountPrice) / product.price) * 100,
        )
      : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product.id);
    toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <article
      data-ocid={`shop.product_card.${index}`}
      className="group relative bg-card rounded-2xl overflow-hidden shadow-card card-hover border border-border/50"
    >
      {/* Wishlist button */}
      <button
        type="button"
        onClick={handleWishlist}
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm transition-all hover:scale-110"
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          className={cn(
            "h-4 w-4 transition-colors",
            wishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground",
          )}
        />
      </button>

      {discount > 0 && (
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-primary text-primary-foreground text-xs font-semibold px-2 py-0.5 rounded-full">
            -{discount}%
          </span>
        </div>
      )}

      <Link
        to="/product/$id"
        params={{ id: product.id.toString() }}
        className="block"
      >
        <div className="aspect-[4/3] bg-muted overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                {product.brand}
              </p>
              <h3 className="font-display font-semibold text-foreground text-sm leading-snug line-clamp-2 mt-0.5">
                {product.name}
              </h3>
            </div>
            <Badge
              variant="outline"
              className={cn(
                "text-xs shrink-0",
                conditionBadgeClass(product.condition),
              )}
            >
              {product.condition}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-1">
            <span className="inline-flex items-center gap-1 text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
              {product.processor.split(" ").slice(0, 3).join(" ")}
            </span>
            <span className="inline-flex items-center gap-1 text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
              {product.ram}
            </span>
            <span className="inline-flex items-center gap-1 text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
              {product.storage}
            </span>
          </div>

          <div className="flex items-end justify-between pt-1">
            <div>
              <span className="font-display font-bold text-foreground text-lg">
                {formatPrice(product.discountPrice || product.price)}
              </span>
              {product.discountPrice &&
                product.price > product.discountPrice && (
                  <span className="text-muted-foreground text-xs line-through ml-2">
                    {formatPrice(product.price)}
                  </span>
                )}
            </div>
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <Button
          onClick={handleAddToCart}
          className="w-full h-9 text-sm"
          data-ocid={"product.add_to_cart_button"}
          disabled={product.stock === 0n}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.stock === 0n ? "Out of Stock" : "Add to Cart"}
        </Button>
      </div>
    </article>
  );
}
