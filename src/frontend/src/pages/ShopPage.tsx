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
import { Separator } from "@/components/ui/separator";
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
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
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

function formatPrice(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function FilterSection({
  title,
  options,
  selected,
  onChange,
  prefix,
}: {
  title: string;
  options: string[];
  selected: string[];
  onChange: (val: string[]) => void;
  prefix: string;
}) {
  const toggle = (opt: string) => {
    onChange(
      selected.includes(opt)
        ? selected.filter((x) => x !== opt)
        : [...selected, opt],
    );
  };

  return (
    <div className="space-y-3">
      <h4 className="font-semibold text-sm text-foreground">{title}</h4>
      <div className="space-y-2">
        {options.map((opt) => (
          <div key={opt} className="flex items-center gap-2">
            <Checkbox
              id={`${prefix}-${opt}`}
              data-ocid="shop.filter_brand_checkbox"
              checked={selected.includes(opt)}
              onCheckedChange={() => toggle(opt)}
            />
            <Label
              htmlFor={`${prefix}-${opt}`}
              className="text-sm text-muted-foreground cursor-pointer hover:text-foreground"
            >
              {opt}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {totalProducts} products
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-7 text-xs"
        >
          Reset All
        </Button>
      </div>

      <Separator />

      <FilterSection
        title="Brand"
        options={BRANDS}
        selected={filters.brands}
        onChange={(brands) => onFiltersChange({ ...filters, brands })}
        prefix="brand"
      />

      <Separator />

      <FilterSection
        title="RAM"
        options={RAMS}
        selected={filters.rams}
        onChange={(rams) => onFiltersChange({ ...filters, rams })}
        prefix="ram"
      />

      <Separator />

      <FilterSection
        title="Storage"
        options={STORAGES}
        selected={filters.storages}
        onChange={(storages) => onFiltersChange({ ...filters, storages })}
        prefix="storage"
      />

      <Separator />

      <FilterSection
        title="Condition"
        options={CONDITIONS}
        selected={filters.conditions}
        onChange={(conditions) => onFiltersChange({ ...filters, conditions })}
        prefix="condition"
      />

      <Separator />

      <div className="space-y-3">
        <h4 className="font-semibold text-sm text-foreground">
          Max Price: {formatPrice(filters.priceMax)}
        </h4>
        <Slider
          min={10000}
          max={MAX_PRICE}
          step={5000}
          value={[filters.priceMax]}
          onValueChange={([v]) => onFiltersChange({ ...filters, priceMax: v })}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>₹10,000</span>
          <span>{formatPrice(MAX_PRICE)}</span>
        </div>
      </div>
    </div>
  );
}

export function ShopPage() {
  const { data: products = [], isLoading } = useProducts();
  const searchParams = useSearch({ strict: false }) as Record<string, string>;

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

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-foreground mb-2">
          Shop All Laptops
        </h1>
        <p className="text-muted-foreground">
          {filtered.length} premium refurbished laptops available
        </p>
      </div>

      {/* Search + Sort bar */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Input
          data-ocid="shop.search_input"
          placeholder="Search laptops, brands, specs..."
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

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-60 shrink-0">
          <div className="sticky top-24 bg-card rounded-2xl p-5 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </h3>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
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
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((p, i) => (
                <ProductCard key={p.id.toString()} product={p} index={i + 1} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
