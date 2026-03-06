import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  Heart,
  Package,
  Shield,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { ProductCard } from "../components/ProductCard";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import { useProduct, useProducts } from "../hooks/useQueries";

function formatPrice(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function conditionBadgeClass(condition: string) {
  switch (condition.toLowerCase()) {
    case "like new":
      return "bg-success/10 text-success border-success/20";
    case "excellent":
      return "bg-primary/10 text-primary border-primary/20";
    case "good":
      return "bg-warning/10 text-warning-foreground border-warning/20";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function ProductPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const productId = BigInt(id || "0");
  const { data: product, isLoading } = useProduct(productId);
  const { data: allProducts = [] } = useProducts();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const wishlisted = product ? isWishlisted(product.id) : false;

  const similar = allProducts
    .filter((p) => p.id !== productId && p.brand === product?.brand)
    .slice(0, 3);

  const discount =
    product && product.price > 0
      ? Math.round(
          ((product.price - product.discountPrice) / product.price) * 100,
        )
      : 0;

  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid lg:grid-cols-2 gap-12">
          <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-24 text-center">
        <h1 className="font-display text-3xl font-bold text-foreground mb-4">
          Product Not Found
        </h1>
        <Link to="/shop">
          <Button>Back to Shop</Button>
        </Link>
      </main>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  const handleBuyNow = () => {
    addToCart(product);
    window.location.href = "/checkout";
  };

  const handleWishlist = () => {
    toggleWishlist(product.id);
    toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 mb-8 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-foreground transition-colors">
          Shop
        </Link>
        <span>/</span>
        <span className="text-foreground truncate">{product.name}</span>
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid lg:grid-cols-2 gap-12 mb-16"
      >
        {/* Image */}
        <div className="space-y-4">
          <div className="rounded-3xl overflow-hidden bg-muted aspect-[4/3] shadow-card">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant="outline"
                className={cn(
                  "text-xs",
                  conditionBadgeClass(product.condition),
                )}
              >
                {product.condition}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {product.brand}
              </Badge>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-foreground leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="font-display font-bold text-3xl text-foreground">
              {formatPrice(product.discountPrice || product.price)}
            </span>
            {discount > 0 && (
              <>
                <span className="text-muted-foreground text-lg line-through">
                  {formatPrice(product.price)}
                </span>
                <Badge className="bg-primary/10 text-primary border-0 font-semibold">
                  Save {discount}%
                </Badge>
              </>
            )}
          </div>

          {/* Specs */}
          <div className="bg-muted/50 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {[
                  { label: "Processor", value: product.processor },
                  { label: "RAM", value: product.ram },
                  { label: "Storage", value: product.storage },
                  { label: "Condition", value: product.condition },
                  { label: "Brand", value: product.brand },
                ].map(({ label, value }, i) => (
                  <tr key={label} className={i % 2 === 0 ? "bg-muted/30" : ""}>
                    <td className="px-4 py-2.5 font-medium text-muted-foreground w-1/3">
                      {label}
                    </td>
                    <td className="px-4 py-2.5 text-foreground">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Stock & Warranty */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 text-sm text-success">
              <Check className="h-4 w-4" />
              <span>
                {product.stock > 0n
                  ? `${product.stock} in stock`
                  : "Out of stock"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-primary" />
              <span>1-Year Warranty included</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="h-4 w-4 text-primary" />
              <span>Free shipping</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4 text-primary" />
              <span>30-day returns</span>
            </div>
          </div>

          <Separator />

          {/* CTAs */}
          <div className="flex gap-3">
            <Button
              size="lg"
              className="flex-1 h-12 font-semibold"
              onClick={handleAddToCart}
              data-ocid="product.add_to_cart_button"
              disabled={product.stock === 0n}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex-1 h-12 font-semibold"
              onClick={handleBuyNow}
              data-ocid="product.buy_now_button"
              disabled={product.stock === 0n}
            >
              Buy Now
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 shrink-0"
              onClick={handleWishlist}
              data-ocid="product.wishlist_toggle"
              aria-label={
                wishlisted ? "Remove from wishlist" : "Add to wishlist"
              }
            >
              <Heart
                className={cn(
                  "h-5 w-5 transition-colors",
                  wishlisted ? "fill-red-500 text-red-500" : "",
                )}
              />
            </Button>
          </div>

          {/* Description */}
          <div className="pt-2">
            <h3 className="font-display font-semibold text-foreground mb-3">
              About this laptop
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Similar Products */}
      {similar.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-2xl text-foreground">
              More from {product.brand}
            </h2>
            <Link
              to="/shop"
              className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similar.map((p, i) => (
              <ProductCard key={p.id.toString()} product={p} index={i + 1} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
