import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCart } from "../contexts/CartContext";

function formatPrice(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function CartPage() {
  const { items, removeFromCart, updateQuantity, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-24 text-center">
        <div data-ocid="cart.empty_state" className="space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-muted mx-auto flex items-center justify-center">
            <ShoppingCart className="h-10 w-10 text-muted-foreground" />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground mb-2">
              Your cart is empty
            </h1>
            <p className="text-muted-foreground">
              Looks like you haven't added any laptops yet.
            </p>
          </div>
          <Link to="/shop">
            <Button size="lg" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Start Shopping
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  const shipping = subtotal >= 5000 ? 0 : 499;
  const total = subtotal + shipping;

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-foreground mb-1">
          Shopping Cart
        </h1>
        <p className="text-muted-foreground">
          {items.length} item{items.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence mode="popLayout">
            {items.map((item, idx) => {
              const price = item.product.discountPrice || item.product.price;
              return (
                <motion.div
                  key={item.product.id.toString()}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  data-ocid={`cart.item.${idx + 1}`}
                  className="flex gap-4 bg-card rounded-2xl p-4 shadow-card"
                >
                  <div className="w-20 h-16 sm:w-28 sm:h-20 rounded-xl overflow-hidden bg-muted shrink-0">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link
                      to="/product/$id"
                      params={{ id: item.product.id.toString() }}
                      className="font-display font-semibold text-sm text-foreground hover:text-primary transition-colors line-clamp-2"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.product.brand} · {item.product.condition}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.product.ram} · {item.product.storage}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          data-ocid={`cart.quantity_input.${idx + 1}`}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-semibold tabular-nums">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-display font-bold text-foreground">
                          {formatPrice(price * item.quantity)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => removeFromCart(item.product.id)}
                          data-ocid={`cart.remove_button.${idx + 1}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          <Link
            to="/shop"
            className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors mt-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-2xl p-6 shadow-card sticky top-24">
            <h2 className="font-display font-semibold text-lg text-foreground mb-5">
              Order Summary
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium text-foreground">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span
                  className={
                    shipping === 0
                      ? "text-success font-medium"
                      : "font-medium text-foreground"
                  }
                >
                  {shipping === 0 ? "Free" : formatPrice(shipping)}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-muted-foreground">
                  Add {formatPrice(5000 - subtotal)} more for free shipping
                </p>
              )}
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between mb-6">
              <span className="font-display font-semibold text-foreground">
                Total
              </span>
              <span className="font-display font-bold text-xl text-foreground">
                {formatPrice(total)}
              </span>
            </div>

            <Link to="/checkout">
              <Button
                size="lg"
                className="w-full h-12 font-semibold gap-2"
                data-ocid="cart.checkout_button"
              >
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <div className="mt-4 space-y-2 text-xs text-muted-foreground">
              <p className="flex items-center gap-2">
                <span className="text-success">✓</span> Secure checkout
              </p>
              <p className="flex items-center gap-2">
                <span className="text-success">✓</span> 1-year warranty included
              </p>
              <p className="flex items-center gap-2">
                <span className="text-success">✓</span> 30-day return policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
