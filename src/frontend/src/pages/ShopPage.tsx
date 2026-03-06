import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { useSearch } from "@tanstack/react-router";
import {
  Box,
  Cpu,
  Headphones,
  Laptop,
  Monitor,
  Server,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { ProductCard } from "../components/ProductCard";
import { useProducts } from "../hooks/useQueries";

type SortOption = "newest" | "price-asc" | "price-desc" | "deals";

interface Filters {
  brands: string[];
  rams: string[];
  storages: string[];
  conditions: string[];
  priceMax: number;
  query: string;
}

const BRANDS = ["HP", "Dell", "Lenovo", "Apple"];
const RAMS = ["4GB", "8GB", "16GB", "32GB"];
const STORAGES = ["256GB", "512GB", "1TB"];
const CONDITIONS = ["Like New", "Excellent", "Good"];
const MAX_PRICE = 200000;

const CATEGORIES = [
  { name: "All", slug: "all", icon: null },
  { name: "Laptops", slug: "laptops", icon: Laptop },
  { name: "Desktops", slug: "desktops", icon: Monitor },
  { name: "Servers", slug: "servers", icon: Server },
  { name: "Accessories", slug: "accessories", icon: Headphones },
  { name: "Workstations", slug: "workstations", icon: Cpu },
  { name: "Tiny Desktops", slug: "tiny-desktops", icon: Box },
];

function formatPrice(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function FiltersPanel({
  filters,
  onFiltersChange,
  onReset,
  totalProducts,
}: {
  filters: Filters;
  onFiltersChange: (f: Filters) => void;
  onReset: () => void;
  totalProducts: number;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">
          {totalProducts} products found
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-7 text-xs text-muted-foreground hover:text-destructive"
        >
          Reset All
        </Button>
      </div>

      <Accordion
        type="multiple"
        defaultValue={["brand", "ram", "storage", "condition", "price"]}
      >
        {/* Brand */}
        <AccordionItem value="brand" className="border-border/60">
          <AccordionTrigger className="text-sm font-semibold py-3 hover:no-underline">
            Brand
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2.5 pt-1 pb-2">
              {BRANDS.map((opt) => (
                <div key={opt} className="flex items-center gap-2.5">
                  <Checkbox
                    id={`brand-${opt}`}
                    data-ocid="shop.filter_brand_checkbox"
                    checked={filters.brands.includes(opt)}
                    onCheckedChange={() => {
                      const brands = filters.brands.includes(opt)
                        ? filters.brands.filter((x) => x !== opt)
                        : [...filters.brands, opt];
                      onFiltersChange({ ...filters, brands });
                    }}
                  />
                  <Label
                    htmlFor={`brand-${opt}`}
                    className="text-sm cursor-pointer hover:text-foreground text-muted-foreground"
                  >
                    {opt}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* RAM */}
        <AccordionItem value="ram" className="border-border/60">
          <AccordionTrigger className="text-sm font-semibold py-3 hover:no-underline">
            RAM
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2.5 pt-1 pb-2">
              {RAMS.map((opt) => (
                <div key={opt} className="flex items-center gap-2.5">
                  <Checkbox
                    id={`ram-${opt}`}
                    checked={filters.rams.includes(opt)}
                    onCheckedChange={() => {
                      const rams = filters.rams.includes(opt)
                        ? filters.rams.filter((x) => x !== opt)
                        : [...filters.rams, opt];
                      onFiltersChange({ ...filters, rams });
                    }}
                  />
                  <Label
                    htmlFor={`ram-${opt}`}
                    className="text-sm cursor-pointer hover:text-foreground text-muted-foreground"
                  >
                    {opt}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Storage */}
        <AccordionItem value="storage" className="border-border/60">
          <AccordionTrigger className="text-sm font-semibold py-3 hover:no-underline">
            Storage
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2.5 pt-1 pb-2">
              {STORAGES.map((opt) => (
                <div key={opt} className="flex items-center gap-2.5">
                  <Checkbox
                    id={`storage-${opt}`}
                    checked={filters.storages.includes(opt)}
                    onCheckedChange={() => {
                      const storages = filters.storages.includes(opt)
                        ? filters.storages.filter((x) => x !== opt)
                        : [...filters.storages, opt];
                      onFiltersChange({ ...filters, storages });
                    }}
                  />
                  <Label
                    htmlFor={`storage-${opt}`}
                    className="text-sm cursor-pointer hover:text-foreground text-muted-foreground"
                  >
                    {opt}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Condition */}
        <AccordionItem value="condition" className="border-border/60">
          <AccordionTrigger className="text-sm font-semibold py-3 hover:no-underline">
            Condition
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2.5 pt-1 pb-2">
              {CONDITIONS.map((opt) => (
                <div key={opt} className="flex items-center gap-2.5">
                  <Checkbox
                    id={`cond-${opt}`}
                    checked={filters.conditions.includes(opt)}
                    onCheckedChange={() => {
                      const conditions = filters.conditions.includes(opt)
                        ? filters.conditions.filter((x) => x !== opt)
                        : [...filters.conditions, opt];
                      onFiltersChange({ ...filters, conditions });
                    }}
                  />
                  <Label
                    htmlFor={`cond-${opt}`}
                    className="text-sm cursor-pointer hover:text-foreground text-muted-foreground"
                  >
                    {opt}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price */}
        <AccordionItem value="price" className="border-0">
          <AccordionTrigger className="text-sm font-semibold py-3 hover:no-underline">
            Price Range
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-1 pb-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Up to</span>
                <span className="font-semibold text-foreground">
                  {formatPrice(filters.priceMax)}
                </span>
              </div>
              <Slider
                min={10000}
                max={MAX_PRICE}
                step={5000}
                value={[filters.priceMax]}
                onValueChange={([v]) =>
                  onFiltersChange({ ...filters, priceMax: v })
                }
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>₹10,000</span>
                <span>{formatPrice(MAX_PRICE)}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export function ShopPage() {
  const { data: products = [], isLoading } = useProducts();
  const searchParams = useSearch({ strict: false }) as Record<string, string>;

  const initialCategory = searchParams.category
    ? (CATEGORIES.find((c) => c.slug === searchParams.category)?.slug ?? "all")
    : "all";

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [sort, setSort] = useState<SortOption>("newest");
  const [filters, setFilters] = useState<Filters>({
    brands: searchParams.brand ? [searchParams.brand] : [],
    rams: [],
    storages: [],
    conditions: [],
    priceMax: MAX_PRICE,
    query: searchParams.q || "",
  });

  const resetFilters = () =>
    setFilters({
      brands: [],
      rams: [],
      storages: [],
      conditions: [],
      priceMax: MAX_PRICE,
      query: "",
    });

  const activeFilterCount =
    filters.brands.length +
    filters.rams.length +
    filters.storages.length +
    filters.conditions.length +
    (filters.priceMax < MAX_PRICE ? 1 : 0);

  const filtered = useMemo(() => {
    let result = [...products];

    if (filters.query) {
      const q = filters.query.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.processor.toLowerCase().includes(q),
      );
    }
    if (filters.brands.length) {
      result = result.filter((p) => filters.brands.includes(p.brand));
    }
    if (filters.rams.length) {
      result = result.filter((p) => filters.rams.includes(p.ram));
    }
    if (filters.storages.length) {
      result = result.filter((p) => filters.storages.includes(p.storage));
    }
    if (filters.conditions.length) {
      result = result.filter((p) => filters.conditions.includes(p.condition));
    }
    result = result.filter(
      (p) => (p.discountPrice || p.price) <= filters.priceMax,
    );

    switch (sort) {
      case "price-asc":
        result.sort(
          (a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price),
        );
        break;
      case "price-desc":
        result.sort(
          (a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price),
        );
        break;
      case "deals":
        result.sort((a, b) => {
          const discA = a.price > 0 ? (a.price - a.discountPrice) / a.price : 0;
          const discB = b.price > 0 ? (b.price - b.discountPrice) / b.price : 0;
          return discB - discA;
        });
        break;
      default:
        result.sort((a, b) => Number(b.createdAt - a.createdAt));
    }

    return result;
  }, [products, filters, sort]);

  // Non-laptops/all categories show coming soon
  const showComingSoon =
    activeCategory !== "all" && activeCategory !== "laptops";
  const activeCategoryLabel =
    CATEGORIES.find((c) => c.slug === activeCategory)?.name ?? "All";

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Shop header banner */}
      <div className="mb-8 rounded-2xl overflow-hidden relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-6 py-8 sm:py-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.45_0.18_264/0.2),transparent_60%)]" />
        <div className="relative z-10">
          <p className="text-xs font-semibold text-primary/80 uppercase tracking-widest mb-2">
            Premium Technology
          </p>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-white mb-1">
            Shop Refurbished Laptops
          </h1>
          <p className="text-white/60 text-sm max-w-xl">
            Certified, tested, and ready to perform — enterprise-grade
            technology at up to 70% off retail price.
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="mb-6 -mx-1">
        <div className="flex gap-2 overflow-x-auto pb-2 px-1 scrollbar-hide">
          {CATEGORIES.map((cat, i) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                type="button"
                data-ocid={`shop.category_tab.${i + 1}`}
                onClick={() => setActiveCategory(cat.slug)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? "brand-gradient text-white shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {Icon && <Icon className="h-3.5 w-3.5" />}
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search + Sort bar */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Input
          data-ocid="shop.search_input"
          placeholder="Search products, brands, specs..."
          value={filters.query}
          onChange={(e) => setFilters({ ...filters, query: e.target.value })}
          className="flex-1 min-w-48"
        />

        <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
          <SelectTrigger data-ocid="shop.sort_select" className="w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="deals">Best Deals</SelectItem>
          </SelectContent>
        </Select>

        {/* Mobile filter sheet */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge className="h-5 w-5 p-0 text-xs flex items-center justify-center">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FiltersPanel
                filters={filters}
                onFiltersChange={setFilters}
                onReset={resetFilters}
                totalProducts={filtered.length}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {filters.brands.map((b) => (
            <Badge
              key={b}
              variant="secondary"
              className="gap-1 cursor-pointer"
              onClick={() =>
                setFilters({
                  ...filters,
                  brands: filters.brands.filter((x) => x !== b),
                })
              }
            >
              {b}
              <X className="h-3 w-3" />
            </Badge>
          ))}
          {filters.conditions.map((c) => (
            <Badge
              key={c}
              variant="secondary"
              className="gap-1 cursor-pointer"
              onClick={() =>
                setFilters({
                  ...filters,
                  conditions: filters.conditions.filter((x) => x !== c),
                })
              }
            >
              {c}
              <X className="h-3 w-3" />
            </Badge>
          ))}
          <button
            type="button"
            onClick={resetFilters}
            className="text-xs text-muted-foreground hover:text-destructive transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Coming soon for non-laptop categories */}
      {showComingSoon ? (
        <div
          data-ocid="shop.empty_state"
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-6">
            {(() => {
              const cat = CATEGORIES.find((c) => c.slug === activeCategory);
              const Icon = cat?.icon;
              return Icon ? <Icon className="h-10 w-10 text-primary" /> : null;
            })()}
          </div>
          <h3 className="font-display font-bold text-2xl text-foreground mb-2">
            Coming Soon — {activeCategoryLabel}
          </h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-sm">
            {activeCategoryLabel} will be available shortly. We're curating
            premium refurbished products in this category for you.
          </p>
          <Button variant="outline" onClick={() => setActiveCategory("all")}>
            Browse All Products
          </Button>
        </div>
      ) : (
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 bg-card rounded-2xl p-5 shadow-lg border border-border/60">
              <div className="flex items-center gap-2 mb-5 pb-3 border-b border-border/60">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                <h3 className="font-display font-semibold text-foreground text-sm">
                  Filters
                </h3>
              </div>
              <FiltersPanel
                filters={filters}
                onFiltersChange={setFilters}
                onReset={resetFilters}
                totalProducts={filtered.length}
              />
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {["s1", "s2", "s3", "s4", "s5", "s6"].map((k) => (
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
            ) : filtered.length === 0 ? (
              <div
                data-ocid="shop.empty_state"
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <SlidersHorizontal className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-display font-semibold text-xl text-foreground mb-2">
                  No products found
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Try adjusting your filters or search query.
                </p>
                <Button variant="outline" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {filtered.map((p, i) => (
                  <ProductCard
                    key={p.id.toString()}
                    product={p}
                    index={i + 1}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
