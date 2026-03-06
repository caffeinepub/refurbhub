import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Box,
  Check,
  ChevronRight,
  Cpu,
  Headphones,
  Laptop,
  Leaf,
  Monitor,
  RotateCcw,
  Server,
  ShieldCheck,
  ShoppingCart,
  Star,
  Tag,
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

const SHOWCASE_PRODUCTS = [
  {
    image: "/assets/generated/product-card-hp-elitebook.dim_600x450.jpg",
    brand: "HP",
    name: "HP EliteBook 840 G9",
    specs: "Intel i7, 16GB RAM, 512GB SSD",
    price: "₹42,999",
    originalPrice: "₹95,000",
    savePct: 55,
  },
  {
    image: "/assets/generated/product-card-dell-latitude.dim_600x450.jpg",
    brand: "Dell",
    name: "Dell Latitude 5420",
    specs: "Intel i5, 8GB RAM, 256GB SSD",
    price: "₹28,999",
    originalPrice: "₹65,000",
    savePct: 55,
  },
  {
    image: "/assets/generated/product-card-lenovo-thinkpad.dim_600x450.jpg",
    brand: "Lenovo",
    name: "Lenovo ThinkPad X1 Carbon",
    specs: "Intel i7, 16GB RAM, 512GB SSD",
    price: "₹55,999",
    originalPrice: "₹1,20,000",
    savePct: 53,
  },
  {
    image: "/assets/generated/product-card-macbook-pro.dim_600x450.jpg",
    brand: "Apple",
    name: "Apple MacBook Pro M1",
    specs: "Apple M1, 8GB RAM, 256GB SSD",
    price: "₹75,999",
    originalPrice: "₹1,30,000",
    savePct: 42,
  },
];

const CATEGORIES = [
  {
    name: "Laptops",
    desc: "Business & personal laptops",
    image: "/assets/generated/category-laptops.dim_600x400.jpg",
    slug: "laptops",
    icon: Laptop,
  },
  {
    name: "Desktops",
    desc: "Powerful desktop PCs",
    image: "/assets/generated/category-desktops.dim_600x400.jpg",
    slug: "desktops",
    icon: Monitor,
  },
  {
    name: "Workstations",
    desc: "High-performance workstations",
    image: "/assets/generated/category-workstations.dim_600x400.jpg",
    slug: "workstations",
    icon: Cpu,
  },
  {
    name: "Servers",
    desc: "Enterprise-grade servers",
    image: "/assets/generated/category-servers.dim_600x400.jpg",
    slug: "servers",
    icon: Server,
  },
  {
    name: "Accessories",
    desc: "Keyboards, mice & more",
    image: "/assets/generated/category-accessories.dim_600x400.jpg",
    slug: "accessories",
    icon: Headphones,
  },
  {
    name: "Tiny Desktops",
    desc: "Compact mini PCs",
    image: "/assets/generated/category-tiny-desktops.dim_600x400.jpg",
    slug: "tiny-desktops",
    icon: Box,
  },
];

const PROTECTION_POLICIES = [
  {
    icon: ShieldCheck,
    title: "7 Day Easy Return",
    desc: "Return within 7 days of delivery if not satisfied.",
    color: "text-[#1E5EFF]",
    bg: "bg-[#F4F6FA]",
    border: "border-[#1E5EFF]/10",
  },
  {
    icon: RotateCcw,
    title: "30 Day Replacement",
    desc: "30-day hassle-free replacement for any functional issue.",
    color: "text-[#1E5EFF]",
    bg: "bg-[#F4F6FA]",
    border: "border-[#1E5EFF]/10",
  },
  {
    icon: ArrowUpRight,
    title: "Lifetime Buyback & Upgrade",
    desc: "Return your old laptop and get credit toward a newer device.",
    color: "text-[#1E5EFF]",
    bg: "bg-[#F4F6FA]",
    border: "border-[#1E5EFF]/10",
  },
  {
    icon: Wrench,
    title: "Lifetime Maintenance Support",
    desc: "Lifetime technical support and maintenance guidance.",
    color: "text-[#1E5EFF]",
    bg: "bg-[#F4F6FA]",
    border: "border-[#1E5EFF]/10",
  },
  {
    icon: BadgeCheck,
    title: "Extended Warranty",
    desc: "Optional extended warranty plans at affordable pricing.",
    color: "text-[#1E5EFF]",
    bg: "bg-[#F4F6FA]",
    border: "border-[#1E5EFF]/10",
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
    image: "/assets/generated/product-card-hp-elitebook.dim_600x450.jpg",
    name: "HP EliteBook 840 G9",
    price: "₹42,999",
    originalPrice: "₹95,000",
    save: "Save 55%",
    badgeColor: "bg-rose-500",
    stock: "Only 3 left",
  },
  {
    image: "/assets/generated/product-card-dell-latitude.dim_600x450.jpg",
    name: "Dell Latitude 5420",
    price: "₹28,999",
    originalPrice: "₹72,000",
    save: "Save 60%",
    badgeColor: "bg-emerald-600",
    stock: "2 remaining",
  },
  {
    image: "/assets/generated/product-card-lenovo-thinkpad.dim_600x450.jpg",
    name: "Lenovo ThinkPad X1",
    price: "₹55,999",
    originalPrice: "₹1,12,000",
    save: "Save 50%",
    badgeColor: "bg-violet-600",
    stock: "Last 4 units",
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

  const [bannerForm, setBannerForm] = useState({
    name: "",
    email: "",
    phone: "",
    requestType: "",
  });

  const featuredProducts = products.slice(0, 4);

  const handleBannerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const existing = JSON.parse(
      localStorage.getItem("refurbhub_special_requests") || "[]",
    ) as object[];
    existing.push({
      ...bannerForm,
      submittedAt: new Date().toISOString(),
    });
    localStorage.setItem(
      "refurbhub_special_requests",
      JSON.stringify(existing),
    );
    toast.success("Request submitted! We'll reach out shortly.");
    setBannerForm({ name: "", email: "", phone: "", requestType: "" });
  };

  const handleAddToCart = (name: string) => {
    toast.success("Added to cart!");
    void name;
  };

  return (
    <main>
      {/* ── Section 1: Hero Carousel ── */}
      <HeroCarousel />

      {/* ── Section 2: USP Banner ── */}
      <section
        className="py-5"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.2 0.08 264) 0%, oklch(0.25 0.12 250) 50%, oklch(0.2 0.08 264) 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { icon: Tag, label: "Up to 70% Savings", sub: "vs retail price" },
              {
                icon: BadgeCheck,
                label: "Certified Refurbished",
                sub: "Every device tested",
              },
              {
                icon: ShieldCheck,
                label: "Warranty Available",
                sub: "Extended plans offered",
              },
              {
                icon: RotateCcw,
                label: "7-Day Returns",
                sub: "Hassle-free policy",
              },
              {
                icon: ArrowUpRight,
                label: "Lifetime Upgrade",
                sub: "Buyback & trade-in",
              },
            ].map(({ icon: Icon, label, sub }, i, arr) => (
              <div
                key={label}
                className="relative flex items-center gap-3 py-1"
              >
                {/* Vertical divider between items on lg */}
                {i < arr.length - 1 && (
                  <span className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 h-8 w-px bg-white/20" />
                )}
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-bold text-sm text-white leading-tight">
                    {label}
                  </p>
                  <p className="text-xs text-white/70">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: Featured Products ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            HP, Dell, Lenovo &amp; Apple – Business-class machines at unbeatable
            prices.
          </p>
          <Link
            to="/shop"
            data-ocid="featured.view_all_link"
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors shrink-0 ml-4"
          >
            View All
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Backend products */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4"
          >
            {featuredProducts.map((p, i) => (
              <motion.div key={p.id.toString()} variants={fadeUp}>
                <ProductCard product={p} index={i + 1} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Static showcase cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {SHOWCASE_PRODUCTS.map((p, i) => (
            <motion.div
              key={p.name}
              variants={fadeUp}
              data-ocid={`showcase.product.item.${i + 1}`}
              className="premium-card card-hover bg-card rounded-2xl overflow-hidden border border-border/50 group"
            >
              <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <span className="absolute top-2 left-2 brand-gradient text-white text-xs font-bold px-2 py-0.5 rounded-full">
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
                  className="w-full h-9 text-sm mt-1 brand-gradient border-0 text-white"
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

      {/* ── Section: Shop by Category ── */}
      <section className="alt-section py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-7">
            <p className="text-xs font-semibold gradient-text uppercase tracking-widest mb-2">
              Browse
            </p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground">
              Shop by Category
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Explore our full range of refurbished technology — from laptops to
              enterprise servers.
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {CATEGORIES.map(({ name, desc, image, slug, icon: Icon }, i) => (
              <motion.div key={name} variants={fadeUp}>
                <Link
                  to="/shop"
                  search={{ category: slug } as Record<string, string>}
                  data-ocid={`category.item.${i + 1}`}
                  className="group block"
                >
                  <div className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-40">
                    {/* Background image */}
                    <img
                      src={image}
                      alt={name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    {/* Gradient overlay */}
                    <div className="category-card-overlay absolute inset-0" />
                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-4">
                      <Icon className="h-5 w-5 text-white/80 mb-2" />
                      <h3 className="font-display font-bold text-white text-sm leading-tight">
                        {name}
                      </h3>
                      <p className="text-white/65 text-xs mt-0.5 leading-snug">
                        {desc}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Section: Top Picks ── */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-xs font-semibold gradient-text uppercase tracking-widest mb-2">
                Our Selection
              </p>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground">
                Top Picks
              </h2>
              <p className="text-muted-foreground mt-2 max-w-lg">
                Handpicked refurbished laptops with the best value and
                performance this week.
              </p>
            </div>
            <Link
              to="/shop"
              data-ocid="trending.view_all_link"
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors shrink-0 mb-2"
            >
              View All
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {SHOWCASE_PRODUCTS.map((p, i) => {
              const badgeConfig = [
                { label: "Top Deal", cls: "bg-[#1E5EFF] text-white" },
                { label: "Best Seller", cls: "bg-[#6B7280] text-white" },
                { label: "Staff Pick", cls: "bg-[#1E5EFF] text-white" },
                { label: "Top Deal", cls: "bg-[#6B7280] text-white" },
              ][i] ?? { label: "Top Deal", cls: "bg-[#1E5EFF] text-white" };
              return (
                <motion.div
                  key={`trending-${p.name}`}
                  variants={fadeUp}
                  data-ocid={`trending.item.${i + 1}`}
                  className="premium-card card-hover bg-card rounded-2xl overflow-hidden border border-border/50 group"
                >
                  <div className="relative aspect-[3/4] bg-muted overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2 flex gap-1.5">
                      <span
                        className={`${badgeConfig.cls} text-xs font-semibold px-2.5 py-1 rounded-full`}
                      >
                        {badgeConfig.label}
                      </span>
                    </div>
                    <span className="absolute top-2 right-2 brand-gradient text-white text-xs font-bold px-2 py-0.5 rounded-full">
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
                      className="w-full h-9 text-sm mt-1 brand-gradient border-0 text-white"
                      data-ocid={`trending.add_to_cart_button.${i + 1}`}
                      onClick={() => handleAddToCart(p.name)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <div className="mt-6 text-center sm:hidden">
            <Link to="/shop">
              <Button variant="outline" className="gap-2">
                View All
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why Refurbished — Full Dark Blue Section ── */}
      <section
        data-ocid="why_refurbished.section"
        className="dark-section relative overflow-hidden py-12"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.45_0.18_264/0.15),transparent_65%)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-7">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary/80 mb-2">
              Smarter Choice
            </p>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white mb-4 leading-tight">
              Why Refurbished is the Smarter Choice
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">
              Enterprise-grade technology at a fraction of the cost — tested,
              certified, and ready to perform.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            {[
              {
                icon: Tag,
                title: "Save Up to 70%",
                desc: "Premium corporate laptops at 30–70% lower cost than new retail devices.",
                color: "text-amber-400",
              },
              {
                icon: Laptop,
                title: "Enterprise Build Quality",
                desc: "Refurbished laptops are often enterprise-grade machines built to last longer.",
                color: "text-blue-400",
              },
              {
                icon: ShieldCheck,
                title: "Fully Tested & Certified",
                desc: "Each laptop goes through strict multi-point testing and performance optimization.",
                color: "text-emerald-400",
              },
              {
                icon: Leaf,
                title: "Eco-Friendly Choice",
                desc: "Buying refurbished reduces electronic waste and environmental impact.",
                color: "text-green-400",
              },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div
                key={title}
                className="bg-white/8 backdrop-blur-sm rounded-2xl p-4 border border-white/12 hover:bg-white/12 transition-all hover:-translate-y-1 duration-300"
              >
                <Icon className={`h-6 w-6 ${color} mb-4`} />
                <h3 className="font-display font-bold text-white text-base mb-2">
                  {title}
                </h3>
                <p className="text-white/60 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link to="/shop">
              <Button
                size="lg"
                data-ocid="why_refurbished.shop_button"
                className="h-12 px-10 font-bold text-base brand-gradient border-0 text-white shadow-xl"
              >
                Shop Refurbished Laptops
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <div className="mt-4">
              <Link
                to="/why-refurbished"
                data-ocid="why_refurbished.learn_more_button"
                className="text-white/50 hover:text-white/80 text-sm transition-colors underline underline-offset-4"
              >
                Learn more about why refurbished →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 5: Customer Protection Policies ── */}
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-7">
            <p className="text-xs font-semibold gradient-text uppercase tracking-widest mb-2">
              Your Security
            </p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground">
              Buy With Complete Confidence
            </h2>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
          >
            {PROTECTION_POLICIES.map(
              ({ icon: Icon, title, desc, color, bg, border }, i) => (
                <motion.div
                  key={title}
                  variants={fadeUp}
                  data-ocid={`protection.policy.item.${i + 1}`}
                  className={`premium-card card-hover bg-card rounded-2xl p-4 border ${border} text-center`}
                >
                  <div
                    className={`w-9 h-9 rounded-2xl ${bg} flex items-center justify-center mb-4 mx-auto`}
                  >
                    <Icon className={`h-5 w-5 ${color}`} />
                  </div>
                  <h3 className="font-display font-bold text-foreground text-base mb-2 text-center">
                    {title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed text-center">
                    {desc}
                  </p>
                </motion.div>
              ),
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Section 6: What Our Customers Say (dark navy) ── */}
      <section className="dark-section py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,oklch(0.45_0.18_264/0.12),transparent_65%)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-7">
            <p className="text-xs font-semibold text-primary/80 uppercase tracking-widest mb-2">
              Reviews
            </p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
              What Our Customers Say
            </h2>
            <p className="text-white/60 mt-3">
              Real experiences from real customers across India.
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {TESTIMONIALS.map(({ name, initials, text, stars }, i) => (
              <motion.div
                key={name}
                variants={fadeUp}
                data-ocid={`testimonial.item.${i + 1}`}
                className="bg-white/8 backdrop-blur-sm rounded-2xl p-5 border border-white/12 hover:bg-white/12 transition-all hover:-translate-y-1 duration-300"
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
                <p className="text-white/80 text-sm leading-relaxed mb-6">
                  "{text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm border border-primary/30">
                    {initials}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-white">{name}</p>
                    <div className="flex items-center gap-1">
                      <BadgeCheck className="h-3 w-3 text-emerald-400" />
                      <span className="text-xs text-white/50">
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

      {/* ── Section 7: Why Buy From Us ── */}
      <section className="alt-section py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-7">
            <p className="text-xs font-semibold gradient-text uppercase tracking-widest mb-2">
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {WHY_BUY_FROM_US.map(({ icon: Icon, title, desc, color, bg }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="premium-card card-hover bg-card rounded-2xl p-4 text-center border border-border/40"
              >
                <div
                  className={`w-11 h-11 rounded-2xl ${bg} flex items-center justify-center mx-auto mb-4`}
                >
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <h3 className="font-display font-bold text-foreground text-base mb-2 text-center">
                  {title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed text-center">
                  {desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Section 9: Limited Deals ── */}
      <section className="py-12 relative overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "url('/assets/generated/deals-spotlight-bg-v2.dim_1400x600.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/85 to-slate-900/90" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-7">
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
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {DEALS.map(
              (
                { image, name, price, originalPrice, save, badgeColor, stock },
                i,
              ) => (
                <motion.div
                  key={name}
                  variants={fadeUp}
                  data-ocid={`deals.item.${i + 1}`}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/15 hover:bg-white/15 transition-all group"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
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
                  <div className="p-4">
                    <h3 className="font-display font-bold text-white text-base mb-1">
                      {name}
                    </h3>
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="font-display font-extrabold text-white text-xl">
                        {price}
                      </span>
                      <span className="text-white/40 text-sm line-through">
                        {originalPrice}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mb-3">
                      <div className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                      <span className="text-rose-300 text-xs font-semibold">
                        {stock}
                      </span>
                    </div>
                    <Button
                      className="w-full brand-gradient border-0 text-white"
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
        className="py-14 relative overflow-hidden"
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
              className="font-display font-extrabold text-3xl sm:text-4xl text-white mb-4 leading-tight"
            >
              Upgrade Your Laptop Today
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-white/60 text-base mb-6"
            >
              Premium refurbished laptops at prices you won't believe.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link to="/shop">
                <Button
                  size="lg"
                  data-ocid="final_cta.shop_now_button"
                  className="h-13 px-10 font-bold text-base shadow-xl brand-gradient border-0 text-white"
                >
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Have a Special Requirement? (above footer) ── */}
      <section
        id="special-request"
        className="relative overflow-hidden py-10 sm:py-14"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.2 0.08 264) 0%, oklch(0.25 0.12 250) 50%, oklch(0.2 0.08 264) 100%)",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.45_0.2_264/0.12),transparent_70%)]" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left: heading + bullets */}
            <div>
              <p className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">
                Custom Orders &amp; Bulk Requests
              </p>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mb-3 leading-tight">
                Have a Special Requirement?
              </h2>
              <p className="text-white/65 text-sm mb-6 leading-relaxed">
                Looking for bulk laptops, a specific model, or a custom-built
                PC? Tell us what you need and our team will reach out to help
                you.
              </p>
              <ul className="space-y-3">
                {[
                  "Bulk Laptop Orders (10+ units)",
                  "Specific laptop model sourcing",
                  "Custom PC builds to your specs",
                  "Business & corporate purchases",
                  "Fast 24hr dedicated response",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-white/80 text-sm"
                  >
                    <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Check className="h-3 w-3 text-white" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: compact form */}
            <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
              <p className="text-white font-display font-semibold text-base mb-4">
                Send us your requirement
              </p>
              <form onSubmit={handleBannerSubmit} className="space-y-3">
                <Input
                  type="text"
                  placeholder="Your Name"
                  required
                  data-ocid="banner.name_input"
                  value={bannerForm.name}
                  onChange={(e) =>
                    setBannerForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="h-10 bg-white/15 border-white/30 text-white placeholder:text-white/50 rounded-xl focus-visible:ring-[#1E5EFF] focus-visible:border-[#1E5EFF]"
                />
                <Input
                  type="email"
                  placeholder="Email Address"
                  required
                  data-ocid="banner.email_input"
                  value={bannerForm.email}
                  onChange={(e) =>
                    setBannerForm((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="h-10 bg-white/15 border-white/30 text-white placeholder:text-white/50 rounded-xl focus-visible:ring-[#1E5EFF] focus-visible:border-[#1E5EFF]"
                />
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  required
                  data-ocid="banner.phone_input"
                  value={bannerForm.phone}
                  onChange={(e) =>
                    setBannerForm((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  className="h-10 bg-white/15 border-white/30 text-white placeholder:text-white/50 rounded-xl focus-visible:ring-[#1E5EFF] focus-visible:border-[#1E5EFF]"
                />
                <Select
                  value={bannerForm.requestType}
                  onValueChange={(val) =>
                    setBannerForm((prev) => ({ ...prev, requestType: val }))
                  }
                >
                  <SelectTrigger
                    data-ocid="banner.request_type_select"
                    className="h-10 bg-white/15 border-white/30 text-white rounded-xl focus:ring-[#1E5EFF] [&>span]:text-white/50 data-[state=open]:border-[#1E5EFF]"
                  >
                    <SelectValue placeholder="Type of Request" />
                  </SelectTrigger>
                  <SelectContent>
                    {REQUEST_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="submit"
                  data-ocid="banner.submit_button"
                  className="w-full h-11 font-bold bg-white text-[#0B2A4A] hover:bg-white/90 border-0 rounded-xl text-base"
                >
                  Request a Quote
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
