import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle,
  Loader2,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { OrderItem, ShoppingItem } from "../backend.d";
import { useCart } from "../contexts/CartContext";
import {
  useCreateCheckoutSession,
  useCreateOrder,
  useStripeSessionStatus,
} from "../hooks/useQueries";

function formatPrice(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function SuccessState({ onContinue }: { onContinue: () => void }) {
  return (
    <div
      data-ocid="checkout.success_state"
      className="text-center py-16 space-y-6"
    >
      <div className="w-20 h-20 rounded-full bg-success/10 mx-auto flex items-center justify-center">
        <CheckCircle className="h-10 w-10 text-success" />
      </div>
      <div>
        <h2 className="font-display font-bold text-2xl text-foreground mb-2">
          Order Confirmed!
        </h2>
        <p className="text-muted-foreground">
          Thank you for your purchase. Your order has been placed successfully.
        </p>
      </div>
      <Button onClick={onContinue} size="lg">
        Continue Shopping
      </Button>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      data-ocid="checkout.error_state"
      className="text-center py-16 space-y-6"
    >
      <div className="w-20 h-20 rounded-full bg-destructive/10 mx-auto flex items-center justify-center">
        <XCircle className="h-10 w-10 text-destructive" />
      </div>
      <div>
        <h2 className="font-display font-bold text-2xl text-foreground mb-2">
          Payment Failed
        </h2>
        <p className="text-muted-foreground">
          Your payment could not be processed. Please try again.
        </p>
      </div>
      <Button onClick={onRetry} variant="outline" size="lg">
        Try Again
      </Button>
    </div>
  );
}

export function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as Record<string, string>;
  const sessionId = searchParams.session_id || null;

  const createCheckout = useCreateCheckoutSession();
  const createOrder = useCreateOrder();
  const { data: sessionStatus } = useStripeSessionStatus(sessionId);

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paymentFailed, setPaymentFailed] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  // Stable ref so the effect only runs when sessionStatus changes
  const handledSessionRef = useRef<string | null>(null);

  // Handle Stripe return
  useEffect(() => {
    if (!sessionStatus || !sessionId) return;
    // Only handle each session once
    const key = `${sessionId}-${sessionStatus.__kind__}`;
    if (handledSessionRef.current === key) return;
    handledSessionRef.current = key;

    if (sessionStatus.__kind__ === "completed") {
      const orderItems: OrderItem[] = items.map((i) => ({
        productId: i.product.id,
        quantity: BigInt(i.quantity),
        price: i.product.discountPrice || i.product.price,
      }));

      createOrder.mutate(
        {
          customerName: formData.name || "Customer",
          email: formData.email || "",
          address: `${formData.address}, ${formData.city}`,
          items: orderItems,
          total: subtotal,
        },
        {
          onSuccess: () => {
            clearCart();
            setOrderPlaced(true);
          },
        },
      );
    } else if (sessionStatus.__kind__ === "failed") {
      setPaymentFailed(true);
      toast.error("Payment failed. Please try again.");
    }
  }, [
    sessionStatus,
    sessionId,
    items,
    formData,
    subtotal,
    clearCart,
    createOrder,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const shoppingItems: ShoppingItem[] = items.map((i) => ({
      productName: i.product.name,
      currency: "inr",
      quantity: BigInt(i.quantity),
      priceInCents: BigInt(
        Math.round((i.product.discountPrice || i.product.price) * 100),
      ),
      productDescription: `${i.product.processor} · ${i.product.ram} · ${i.product.storage}`,
    }));

    const successUrl = `${window.location.origin}/checkout?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${window.location.origin}/checkout`;

    createCheckout.mutate(
      { items: shoppingItems, successUrl, cancelUrl },
      {
        onSuccess: (url) => {
          if (url) {
            window.location.href = url;
          } else {
            // Stripe not configured — place order directly
            const orderItems: OrderItem[] = items.map((i) => ({
              productId: i.product.id,
              quantity: BigInt(i.quantity),
              price: i.product.discountPrice || i.product.price,
            }));
            createOrder.mutate(
              {
                customerName: formData.name,
                email: formData.email,
                address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.pincode}, ${formData.country}`,
                items: orderItems,
                total: subtotal,
              },
              {
                onSuccess: () => {
                  clearCart();
                  setOrderPlaced(true);
                  toast.success("Order placed successfully!");
                },
              },
            );
          }
        },
        onError: () => {
          toast.error("Could not initiate payment. Please try again.");
        },
      },
    );
  };

  if (orderPlaced) {
    return (
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <SuccessState onContinue={() => void navigate({ to: "/shop" })} />
      </main>
    );
  }

  if (paymentFailed) {
    return (
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <ErrorState onRetry={() => setPaymentFailed(false)} />
      </main>
    );
  }

  if (items.length === 0 && !sessionId) {
    return (
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-24 text-center">
        <p className="text-muted-foreground mb-6">Your cart is empty.</p>
        <Link to="/shop">
          <Button>Browse Products</Button>
        </Link>
      </main>
    );
  }

  const isProcessing = createCheckout.isPending || createOrder.isPending;
  const shipping = subtotal >= 5000 ? 0 : 499;

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <Link
          to="/cart"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </Link>
        <h1 className="font-display font-bold text-3xl text-foreground">
          Checkout
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-8">
          {/* Customer Details */}
          <div className="bg-card rounded-2xl p-6 shadow-card space-y-4">
            <h2 className="font-display font-semibold text-lg text-foreground">
              Customer Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  data-ocid="checkout.name_input"
                  required
                  placeholder="Riya Sharma"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  data-ocid="checkout.email_input"
                  required
                  placeholder="riya@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-card rounded-2xl p-6 shadow-card space-y-4">
            <h2 className="font-display font-semibold text-lg text-foreground">
              Shipping Address
            </h2>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="address">Street Address *</Label>
                <Input
                  id="address"
                  data-ocid="checkout.address_input"
                  required
                  placeholder="123 MG Road, Indiranagar"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    required
                    placeholder="Bengaluru"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    required
                    placeholder="Karnataka"
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    required
                    placeholder="560038"
                    value={formData.pincode}
                    onChange={(e) =>
                      setFormData({ ...formData, pincode: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-card rounded-2xl p-6 shadow-card space-y-4">
            <h2 className="font-display font-semibold text-lg text-foreground flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Secure Payment
            </h2>
            <p className="text-sm text-muted-foreground">
              You'll be redirected to Stripe's secure checkout to complete your
              payment. We accept all major cards, UPI, and net banking.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Visa", "Mastercard", "UPI", "Net Banking", "Rupay"].map(
                (m) => (
                  <Badge key={m} variant="outline" className="text-xs">
                    {m}
                  </Badge>
                ),
              )}
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full h-14 text-base font-semibold gap-2"
            data-ocid="checkout.pay_button"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <ShieldCheck className="h-5 w-5" />
                Pay {formatPrice(subtotal + shipping)} Securely
              </>
            )}
          </Button>
        </form>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-2xl p-6 shadow-card sticky top-24">
            <h2 className="font-display font-semibold text-lg text-foreground mb-5">
              Order Summary
            </h2>

            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.product.id.toString()} className="flex gap-3">
                  <div className="w-12 h-10 rounded-lg overflow-hidden bg-muted shrink-0">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground line-clamp-1">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-xs font-semibold text-foreground shrink-0">
                    {formatPrice(
                      (item.product.discountPrice || item.product.price) *
                        item.quantity,
                    )}
                  </p>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className={shipping === 0 ? "text-success" : ""}>
                  {shipping === 0 ? "Free" : formatPrice(shipping)}
                </span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between font-display font-bold text-foreground">
              <span>Total</span>
              <span>{formatPrice(subtotal + shipping)}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
