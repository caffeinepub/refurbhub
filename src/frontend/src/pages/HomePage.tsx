import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  ChevronRight,
  Cpu,
  Headphones,
  Laptop,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Star,
  Tag,
  Truck,
  Wrench,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { HeroCarousel } from "../components/HeroCarousel";
import { ProductCard } from "../components/ProductCard";
import { useProducts } from "../hooks/useQueries";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ─── Data ─── */

const TRUST_BADGES = [
  { icon: RotateCcw, label: "7 Day Easy Return", sub: "Hassle-free policy" },
  {
    icon: ShieldCheck,
    label: "30 Day Replacement",
    sub: "Functional guarantee",
  },
  { icon: ArrowUpRight, label: "Lifetime Buyback", sub: "Upgrade anytime" },
  { icon: Headphones, label: "Lifetime Support", sub: "Always here for you" },
];

const SHOWCASE_PRODUCTS = [
  {
    image: "/assets/generated/product-hp-elitebook.dim_600x400.jpg",
    brand: "HP",
    name: "HP EliteBook 840 G9",
    specs: "Intel i7, 16GB RAM, 512GB SSD",
    price: "₹42,999",
    originalPrice: "₹95,000",
    savePct: 55,
  },
  {
    image: "/assets/generated/product-dell-latitude.dim_600x400.jpg",
    brand: "Dell",
    name: "Dell Latitude 5420",
    specs: "Intel i5, 8GB RAM, 256GB SSD",
    price: "₹28,999",
    originalPrice: "₹65,000",
    savePct: 55,
  },
  {
    image: "/assets/generated/product-lenovo-thinkpad.dim_600x400.jpg",
    brand: "Lenovo",
    name: "Lenovo ThinkPad X1 Carbon",
    specs: "Intel i7, 16GB RAM, 512GB SSD",
    price: "₹55,999",
    originalPrice: "₹1,20,000",
    savePct: 53,
  },
  {
    image: "/assets/generated/product-macbook-pro.dim_600x400.jpg",
    brand: "Apple",
    name: "Apple MacBook Pro M1",
    specs: "Apple M1, 8GB RAM, 256GB SSD",
    price: "₹75,999",
    originalPrice: "₹1,30,000",
    savePct: 42,
  },
];

const WHY_REFURBISHED = [
  {
    icon: Tag,
    title: "Better Value",
    desc: "Get premium corporate laptops at 30–70% lower cost than new retail devices.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Laptop,
    title: "Business-Class Build Quality",
    desc: "Refurbished laptops are often enterprise-grade machines built to last longer than many consumer laptops.",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    icon: ShieldCheck,
    title: "Fully Tested & Certified",
    desc: "Each laptop goes through strict multi-point testing and performance optimization.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: Cpu,
    title: "Eco-Friendly Choice",
    desc: "Buying refurbished reduces electronic waste and environmental impact.",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    icon: BadgeCheck,
    title: "Same Real-World Performance",
    desc: "For most work, study, coding, and professional tasks, refurbished laptops perform just as efficiently as new devices.",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
];

const PROTECTION_POLICIES = [
  {
    icon: ShieldCheck,
    title: "7 Day Easy Return",
    desc: "Return within 7 days of delivery if not satisfied.",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    icon: RotateCcw,
    title: "30 Day Replacement",
    desc: "30-day hassle-free replacement for any functional issue.",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-100",
  },
  {
    icon: ArrowUpRight,
    title: "Lifetime Buyback & Upgrade",
    desc: "Return your old laptop and get credit toward a newer device.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  {
    icon: Wrench,
    title: "Lifetime Maintenance Support",
    desc: "Lifetime technical support and maintenance guidance.",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
  {
    icon: BadgeCheck,
    title: "Extended Warranty",
    desc: "Optional extended warranty plans at affordable pricing.",
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-100",
  },
];

const WHY_BUY_FROM_US = [
  {
    icon: ShieldCheck,
    title: "Certified Refurbished Devices",
    desc: "Every laptop is professionally tested and restored.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Tag,
    title: "Unbelievable Prices",
    desc: "Save up to 70% compared to retail price.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: Laptop,
    title: "Premium Business Laptops",
    desc: "Enterprise-grade models trusted by global corporations.",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    icon: Headphones,
    title: "Reliable Support",
    desc: "Fast delivery and responsive customer service.",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
];

const BRANDS = [
  {
    name: "HP",
    accent: "bg-blue-600",
    light: "bg-blue-50",
    text: "text-blue-600",
  },
  {
    name: "Dell",
    accent: "bg-blue-800",
    light: "bg-blue-50",
    text: "text-blue-800",
  },
  {
    name: "Lenovo",
    accent: "bg-red-600",
    light: "bg-red-50",
    text: "text-red-600",
  },
  {
    name: "Apple",
    accent: "bg-gray-800",
    light: "bg-gray-50",
    text: "text-gray-800",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "We Source Corporate Laptops",
    desc: "Premium enterprise-grade devices sourced from corporations worldwide.",
  },
  {
    step: "02",
    title: "Devices Undergo Professional Testing",
    desc: "Full hardware diagnostics, battery testing, and performance benchmarks.",
  },
  {
    step: "03",
    title: "Hardware is Refurbished and Optimized",
    desc: "Deep cleaning, component servicing, and fresh OS installation.",
  },
  {
    step: "04",
    title: "Devices Are Delivered at Unbelievable Prices",
    desc: "Secure packaging and fast shipping directly to your door.",
  },
];

const TESTIMONIALS = [
  {
    name: "Rahul K.",
    initials: "RK",
    text: "I got a Dell Latitude i7 for almost half the market price. Works perfectly.",
    stars: 5,
  },
  {
    name: "Sunita M.",
    initials: "SM",
    text: "Excellent condition laptop and fast delivery. Couldn't be happier.",
    stars: 5,
  },
  {
    name: "Vikram P.",
    initials: "VP",
    text: "Great value compared to buying new. The ThinkPad feels brand new!",
    stars: 5,
  },
];

const DEALS = [
  {
    image: "/assets/generated/product-hp-elitebook.dim_600x400.jpg",
    name: "HP EliteBook 840 G9",
    price: "₹42,999",
    originalPrice: "₹95,000",
    save: "Save 55%",
    badgeColor: "bg-rose-500",
  },
  {
    image: "/assets/generated/product-dell-latitude.dim_600x400.jpg",
    name: "Dell Latitude 5420",
    price: "₹28,999",
    originalPrice: "₹72,000",
    save: "Save 60%",
    badgeColor: "bg-emerald-600",
  },
  {
    image: "/assets/generated/product-lenovo-thinkpad.dim_600x400.jpg",
    name: "Lenovo ThinkPad X1",
    price: "₹55,999",
    originalPrice: "₹1,12,000",
    save: "Save 50%",
    badgeColor: "bg-violet-600",
  },
];

const REQUEST_TYPES = [
  "Bulk Laptop Order",
  "Specific Laptop Model",
  "Custom PC Build",
  "Business Purchase",
  "Other",
];

/* ─── Component ─── */

export function HomePage() {
  const { data: products = [], isLoading } = useProducts();
  const [email, setEmail] = useState("");

  const [bulkForm, setBulkForm] = useState({
    name: "",
    emailAddress: "",
    phone: "",
    requestType: "",
    budget: "",
    message: "",
  });

  const featuredProducts = products.slice(0, 4);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      toast.success("You're on the list! We'll be in touch.");
      setEmail("");
    }
  };

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Request submitted! Our team will reach out to you shortly.");
    setBulkForm({
      name: "",
      emailAddress: "",
      phone: "",
      requestType: "",
      budget: "",
      message: "",
    });
  };

  const handleAddToCart = (name: string) => {
    toast.success("Added to cart!");
    void name;
  };

  return (
    <main>
      {/* ── Section 1: Hero Carousel ── */}
      <HeroCarousel />

      {/* ── Section 2: Trust Badges ── */}
      <section className="border-y border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {TRUST_BADGES.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3 py-2">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">
                    {label}
                  </p>
                  <p className="text-xs text-muted-foreground">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: Featured Products ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">
              Featured
            </p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground">
              Featured Laptops
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              HP, Dell, Lenovo &amp; Apple – Business-class machines at
              unbeatable prices.
            </p>
          </div>
          <Link
            to="/shop"
            data-ocid="featured.view_all_link"
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            View All
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Backend products */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {[1, 2, 3, 4].map((k) => (
              <div key={k} className="rounded-2xl overflow-hidden">
                <Skeleton className="aspect-[4/3] w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-9 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12"
          >
            {featuredProducts.map((p, i) => (
              <motion.div key={p.id.toString()} variants={fadeUp}>
                <ProductCard product={p} index={i + 1} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Static showcase cards */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-6">
            Brand Highlights
          </p>
        </div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {SHOWCASE_PRODUCTS.map((p, i) => (
            <motion.div
              key={p.name}
              variants={fadeUp}
              data-ocid={`showcase.product.item.${i + 1}`}
              className="bg-card rounded-2xl overflow-hidden shadow-card border border-border/50 group"
            >
              <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                  -{p.savePct}%
                </span>
              </div>
              <div className="p-4 space-y-2">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  {p.brand}
                </p>
                <h3 className="font-display font-semibold text-foreground text-sm leading-snug">
                  {p.name}
                </h3>
                <p className="text-xs text-muted-foreground">{p.specs}</p>
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="font-display font-bold text-foreground text-lg">
                    {p.price}
                  </span>
                  <span className="text-muted-foreground text-xs line-through">
                    {p.originalPrice}
                  </span>
                </div>
                <Button
                  className="w-full h-9 text-sm mt-1"
                  data-ocid={`showcase.add_to_cart_button.${i + 1}`}
                  onClick={() => handleAddToCart(p.name)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-8 text-center sm:hidden">
          <Link to="/shop">
            <Button variant="outline" className="gap-2">
              View All Products
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Section 4: Why Refurbished ── */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left column */}
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
                Smart Choice
              </p>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground mb-8">
                Why Refurbished is the Smarter Choice
              </h2>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={stagger}
                className="space-y-4"
              >
                {WHY_REFURBISHED.map(
                  ({ icon: Icon, title, desc, color, bg }) => (
                    <motion.div
                      key={title}
                      variants={fadeUp}
                      className="flex gap-4 items-start"
                    >
                      <div
                        className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center shrink-0 mt-0.5`}
                      >
                        <Icon className={`h-5 w-5 ${color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-sm mb-0.5">
                          {title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {desc}
                        </p>
                      </div>
                    </motion.div>
                  ),
                )}
              </motion.div>
            </div>

            {/* Right column */}
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img
                src="/assets/generated/why-refurbished-comparison.dim_800x500.jpg"
                alt="Refurbished vs New Laptop Comparison"
                className="w-full rounded-3xl shadow-2xl object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Section 5: Customer Protection Policies ── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              Your Security
            </p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground">
              Buy With Complete Confidence
            </h2>
          </div>

          {/* Trust image */}
          <div className="flex justify-center mb-10">
            <img
              src="/assets/generated/protection-trust-icons.dim_800x400.png"
              alt="Trust and Protection Icons"
              className="max-w-2xl w-full rounded-2xl"
            />
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {PROTECTION_POLICIES.map(
              ({ icon: Icon, title, desc, color, bg, border }, i) => (
                <motion.div
                  key={title}
                  variants={fadeUp}
                  data-ocid={`protection.policy.item.${i + 1}`}
                  className={`bg-card rounded-2xl p-6 shadow-card border ${border} hover:shadow-card-hover transition-shadow`}
                >
                  <div
                    className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center mb-4`}
                  >
                    <Icon className={`h-6 w-6 ${color}`} />
                  </div>
                  <h3 className="font-display font-bold text-foreground text-base mb-2">
                    {title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {desc}
                  </p>
                </motion.div>
              ),
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Section 6: Why Buy From Us ── */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              Our Promise
            </p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground">
              Why Buy From Us
            </h2>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {WHY_BUY_FROM_US.map(({ icon: Icon, title, desc, color, bg }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="bg-card rounded-2xl p-6 text-center shadow-card hover:shadow-card-hover transition-shadow"
              >
                <div
                  className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center mx-auto mb-4`}
                >
                  <Icon className={`h-7 w-7 ${color}`} />
                </div>
                <h3 className="font-display font-bold text-foreground text-base mb-2">
                  {title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Section 7: Brands We Offer ── */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              Premium Brands
            </p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground">
              Brands We Offer
            </h2>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {BRANDS.map(({ name, accent, light, text }) => (
              <motion.div
                key={name}
                variants={fadeUp}
                className="bg-white rounded-2xl p-8 text-center shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1 border border-border/50 cursor-default"
              >
                <div
                  className={`w-16 h-16 rounded-2xl ${light} flex items-center justify-center mx-auto mb-4`}
                >
                  <span
                    className={`font-display font-extrabold text-2xl ${text}`}
                  >
                    {name[0]}
                  </span>
                </div>
                <div
                  className={`w-8 h-1 rounded-full ${accent} mx-auto mb-3`}
                />
                <h3 className="font-display font-bold text-foreground text-xl">
                  {name}
                </h3>
                <p className="text-muted-foreground text-xs mt-1">
                  Premium Refurbished
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Section 8: How It Works ── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              Our Process
            </p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground">
              How It Works
            </h2>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14 relative"
          >
            {HOW_IT_WORKS.map(({ step, title, desc }, i) => (
              <motion.div
                key={step}
                variants={fadeUp}
                className="relative text-center group"
              >
                {/* Connecting line */}
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-1/2 w-full h-px bg-gradient-to-r from-primary/30 to-transparent z-0" />
                )}
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                    <span className="font-display font-extrabold text-primary-foreground text-sm">
                      {step}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-foreground text-base mb-2">
                    {title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Infographic image */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <img
              src="/assets/generated/how-it-works-infographic.dim_1000x400.jpg"
              alt="How Refurbished Laptops Are Processed"
              className="max-w-4xl w-full rounded-3xl shadow-xl object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* ── Section 9: Special Requests / Bulk Orders ── */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: form */}
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
                Custom Orders
              </p>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground mb-2">
                Have a Special Requirement?
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Looking for bulk laptops, a specific model, or a custom-built
                PC? Tell us what you need and our team will reach out to help
                you.
              </p>

              <form onSubmit={handleBulkSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="bulk-name">Name</Label>
                    <Input
                      id="bulk-name"
                      data-ocid="bulk.name_input"
                      placeholder="Your full name"
                      required
                      value={bulkForm.name}
                      onChange={(e) =>
                        setBulkForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="bulk-email">Email Address</Label>
                    <Input
                      id="bulk-email"
                      type="email"
                      data-ocid="bulk.email_input"
                      placeholder="you@example.com"
                      required
                      value={bulkForm.emailAddress}
                      onChange={(e) =>
                        setBulkForm((prev) => ({
                          ...prev,
                          emailAddress: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="bulk-phone">Phone Number</Label>
                    <Input
                      id="bulk-phone"
                      type="tel"
                      data-ocid="bulk.phone_input"
                      placeholder="+91 98765 43210"
                      required
                      value={bulkForm.phone}
                      onChange={(e) =>
                        setBulkForm((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="bulk-request">Type of Request</Label>
                    <Select
                      required
                      value={bulkForm.requestType}
                      onValueChange={(val) =>
                        setBulkForm((prev) => ({ ...prev, requestType: val }))
                      }
                    >
                      <SelectTrigger
                        id="bulk-request"
                        data-ocid="bulk.request_type_select"
                      >
                        <SelectValue placeholder="Select request type" />
                      </SelectTrigger>
                      <SelectContent>
                        {REQUEST_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="bulk-budget">Budget Range</Label>
                  <Input
                    id="bulk-budget"
                    data-ocid="bulk.budget_input"
                    placeholder="e.g. ₹50,000 – ₹1,00,000"
                    required
                    value={bulkForm.budget}
                    onChange={(e) =>
                      setBulkForm((prev) => ({
                        ...prev,
                        budget: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="bulk-message">Message / Requirements</Label>
                  <Textarea
                    id="bulk-message"
                    data-ocid="bulk.message_textarea"
                    rows={4}
                    placeholder="Describe your requirements in detail..."
                    required
                    value={bulkForm.message}
                    onChange={(e) =>
                      setBulkForm((prev) => ({
                        ...prev,
                        message: e.target.value,
                      }))
                    }
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 font-semibold"
                  data-ocid="bulk.submit_button"
                >
                  Request a Quote
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </div>

            {/* Right: image */}
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="hidden lg:block sticky top-24"
            >
              <img
                src="/assets/generated/bulk-orders-workstation.dim_800x500.jpg"
                alt="Bulk Laptop Orders"
                className="w-full rounded-3xl shadow-2xl object-cover"
              />
              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  { label: "Bulk Orders", sub: "10+ units" },
                  { label: "Custom Builds", sub: "Any config" },
                  { label: "Fast Turnaround", sub: "48hr quote" },
                  { label: "Business Support", sub: "Dedicated team" },
                ].map(({ label, sub }) => (
                  <div
                    key={label}
                    className="bg-card rounded-xl p-3 border border-border shadow-sm text-center"
                  >
                    <p className="font-semibold text-sm text-foreground">
                      {label}
                    </p>
                    <p className="text-xs text-muted-foreground">{sub}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Section 10: Testimonials ── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              Reviews
            </p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground">
              What Our Customers Say
            </h2>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {TESTIMONIALS.map(({ name, initials, text, stars }, i) => (
              <motion.div
                key={name}
                variants={fadeUp}
                data-ocid={`testimonial.item.${i + 1}`}
                className="bg-card rounded-2xl p-6 shadow-card border border-border/50"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from(
                    { length: stars },
                    (_, si) => `star-${name}-${si}`,
                  ).map((k) => (
                    <Star
                      key={k}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-foreground/80 text-sm leading-relaxed mb-6">
                  "{text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
                    {initials}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">
                      {name}
                    </p>
                    <div className="flex items-center gap-1">
                      <BadgeCheck className="h-3 w-3 text-emerald-500" />
                      <span className="text-xs text-muted-foreground">
                        Verified Purchase
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Section 11: Limited Deals ── */}
      <section className="py-20 relative overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "url('/assets/generated/deals-spotlight-display.dim_800x500.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-900/95" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge className="mb-3 bg-rose-500/20 text-rose-300 border-rose-500/30 hover:bg-rose-500/30">
              ⚡ Limited Time
            </Badge>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
              Today's Best Laptop Deals
            </h2>
            <p className="text-white/60 mt-2">
              Grab these enterprise-grade machines before they're gone.
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {DEALS.map(
              ({ image, name, price, originalPrice, save, badgeColor }, i) => (
                <motion.div
                  key={name}
                  variants={fadeUp}
                  data-ocid={`deals.item.${i + 1}`}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/15 hover:bg-white/15 transition-all group"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={image}
                      alt={name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <span
                      className={`absolute top-3 left-3 ${badgeColor} text-white text-xs font-extrabold px-3 py-1.5 rounded-full shadow-lg`}
                    >
                      {save}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display font-bold text-white text-base mb-1">
                      {name}
                    </h3>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="font-display font-extrabold text-white text-xl">
                        {price}
                      </span>
                      <span className="text-white/40 text-sm line-through">
                        {originalPrice}
                      </span>
                    </div>
                    <Button
                      className="w-full"
                      data-ocid={`deals.add_to_cart_button.${i + 1}`}
                      onClick={() => handleAddToCart(name)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </motion.div>
              ),
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Section 12: Final CTA ── */}
      <section
        className="py-24 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.15 0.05 264) 0%, oklch(0.12 0.08 264) 50%, oklch(0.1 0.04 264) 100%)",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.4_0.15_264/0.15),transparent_70%)]" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.p
              variants={fadeUp}
              className="text-xs font-semibold text-primary/80 uppercase tracking-widest mb-3"
            >
              Ready to Upgrade?
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="font-display font-extrabold text-4xl sm:text-5xl text-white mb-4 leading-tight"
            >
              Upgrade Your Laptop Today
            </motion.h2>
            <motion.p variants={fadeUp} className="text-white/60 text-lg mb-8">
              Premium refurbished laptops at prices you won't believe.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link to="/shop">
                <Button
                  size="lg"
                  data-ocid="final_cta.shop_now_button"
                  className="h-13 px-10 font-bold text-base shadow-xl"
                >
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Section 13: Newsletter ── */}
      <section className="bg-foreground py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="space-y-6"
          >
            <motion.p
              variants={fadeUp}
              className="text-xs font-semibold text-primary uppercase tracking-widest"
            >
              Newsletter
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="font-display font-bold text-3xl sm:text-4xl text-background"
            >
              Get the Best Deals First
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-background/60 text-base"
            >
              Subscribe and receive exclusive deals, new arrivals, and
              refurbishing tips directly in your inbox.
            </motion.p>
            <motion.form
              variants={fadeUp}
              onSubmit={handleNewsletter}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                data-ocid="newsletter.email_input"
                className="flex-1 bg-background/10 border-background/20 text-background placeholder:text-background/40 focus:border-primary"
              />
              <Button
                type="submit"
                data-ocid="newsletter.submit_button"
                className="sm:shrink-0 font-semibold"
              >
                Subscribe Now
              </Button>
            </motion.form>
            <motion.p variants={fadeUp} className="text-background/40 text-xs">
              No spam. Unsubscribe at any time. By subscribing you agree to our
              Privacy Policy.
            </motion.p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
