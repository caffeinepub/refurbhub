import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  Bot,
  CheckCircle2,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Inbox,
  LayoutDashboard,
  Loader2,
  Lock,
  Mail,
  Package,
  Pencil,
  Plus,
  Save,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Upload,
  UserCheck,
  WifiOff,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend.d";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useActivateAdmin,
  useAddProduct,
  useAdminProducts,
  useDeleteProduct,
  useIsAdmin,
  useOrders,
  useUpdateOrderStatus,
  useUpdateProduct,
} from "../hooks/useQueries";

function formatPrice(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

const EMPTY_PRODUCT = {
  name: "",
  brand: "",
  processor: "",
  ram: "",
  storage: "",
  condition: "Like New",
  price: 0,
  discountPrice: 0,
  marketPrice: 0,
  description: "",
  stock: 1,
  imageUrls: [] as string[],
};

type ProductFormData = typeof EMPTY_PRODUCT;

function ProductFormDialog({
  open,
  onClose,
  initial,
  onSave,
  isPending,
}: {
  open: boolean;
  onClose: () => void;
  initial?: Product;
  onSave: (data: ProductFormData) => void;
  isPending: boolean;
}) {
  const [form, setForm] = useState<ProductFormData>(
    initial
      ? {
          name: initial.name,
          brand: initial.brand,
          processor: initial.processor,
          ram: initial.ram,
          storage: initial.storage,
          condition: initial.condition,
          price: initial.price,
          discountPrice: initial.discountPrice,
          marketPrice: 0,
          description: initial.description,
          stock: Number(initial.stock),
          imageUrls:
            (initial as unknown as { imageUrls?: string[] }).imageUrls ??
            (initial.imageUrl ? [initial.imageUrl] : []),
        }
      : EMPTY_PRODUCT,
  );
  const [urlInput, setUrlInput] = useState("");
  const [addMode, setAddMode] = useState<"url" | "upload">("url");

  const set = (k: keyof ProductFormData, v: string | number | string[]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const MAX_IMAGES = 5;

  const addImageUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    if (form.imageUrls.length >= MAX_IMAGES) {
      toast.error(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }
    setForm((prev) => ({ ...prev, imageUrls: [...prev.imageUrls, trimmed] }));
    setUrlInput("");
  };

  const removeImage = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== idx),
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (form.imageUrls.length >= MAX_IMAGES) {
      toast.error(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result;
      if (typeof dataUrl === "string") {
        setForm((prev) => ({
          ...prev,
          imageUrls: [...prev.imageUrls, dataUrl],
        }));
      }
    };
    reader.readAsDataURL(file);
    // Reset input so same file can be re-selected
    e.target.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        data-ocid="admin.product_dialog"
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className="font-display">
            {initial ? "Edit Product" : "Add New Product"}
          </DialogTitle>
          <DialogDescription>
            {initial
              ? "Update the product information below."
              : "Fill in the details to add a new laptop."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Product Name *</Label>
              <Input
                required
                placeholder="Dell XPS 15 9520"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                data-ocid="admin.product_dialog.name_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Brand *</Label>
              <Select value={form.brand} onValueChange={(v) => set("brand", v)}>
                <SelectTrigger data-ocid="admin.product_dialog.brand_select">
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  {["HP", "Dell", "Lenovo", "Apple", "Asus", "Acer", "MSI"].map(
                    (b) => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Processor *</Label>
              <Input
                required
                placeholder="Intel Core i7-12700H"
                value={form.processor}
                onChange={(e) => set("processor", e.target.value)}
                data-ocid="admin.product_dialog.processor_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>RAM *</Label>
              <Select value={form.ram} onValueChange={(v) => set("ram", v)}>
                <SelectTrigger data-ocid="admin.product_dialog.ram_select">
                  <SelectValue placeholder="Select RAM" />
                </SelectTrigger>
                <SelectContent>
                  {["4GB", "8GB", "16GB", "32GB", "64GB"].map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Storage *</Label>
              <Select
                value={form.storage}
                onValueChange={(v) => set("storage", v)}
              >
                <SelectTrigger data-ocid="admin.product_dialog.storage_select">
                  <SelectValue placeholder="Select storage" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "128GB SSD",
                    "256GB SSD",
                    "512GB SSD",
                    "1TB SSD",
                    "2TB SSD",
                  ].map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Condition *</Label>
              <Select
                value={form.condition}
                onValueChange={(v) => set("condition", v)}
              >
                <SelectTrigger data-ocid="admin.product_dialog.condition_select">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  {["Like New", "Excellent", "Good"].map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Original Price (₹) *</Label>
              <Input
                type="number"
                required
                placeholder="85000"
                value={form.price || ""}
                onChange={(e) => set("price", Number(e.target.value))}
                data-ocid="admin.product_dialog.price_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Discount Price (₹) *</Label>
              <Input
                type="number"
                required
                placeholder="72000"
                value={form.discountPrice || ""}
                onChange={(e) => set("discountPrice", Number(e.target.value))}
                data-ocid="admin.product_dialog.discount_price_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Market Price of New (₹)</Label>
              <Input
                type="number"
                placeholder="150000"
                value={form.marketPrice || ""}
                onChange={(e) => set("marketPrice", Number(e.target.value))}
                data-ocid="admin.product_dialog.market_price_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Stock Quantity *</Label>
              <Input
                type="number"
                required
                min={0}
                placeholder="5"
                value={form.stock || ""}
                onChange={(e) => set("stock", Number(e.target.value))}
                data-ocid="admin.product_dialog.stock_input"
              />
            </div>
          </div>

          {/* Multi-image section — full width below the grid */}
          <div className="space-y-3">
            <Label>
              Product Images (up to {MAX_IMAGES})
              <span className="ml-2 text-xs text-muted-foreground font-normal">
                {form.imageUrls.length}/{MAX_IMAGES} added
              </span>
            </Label>

            {/* Thumbnail list */}
            {form.imageUrls.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.imageUrls.map((url, idx) => (
                  <div
                    key={`img-${idx}-${url.slice(-10)}`}
                    className="relative group"
                  >
                    <img
                      src={url}
                      alt={`Product ${idx + 1}`}
                      className="w-16 h-16 rounded-lg object-cover border border-border"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "https://placehold.co/64x64?text=?";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                      aria-label="Remove image"
                    >
                      <span className="text-xs leading-none">×</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add image controls */}
            {form.imageUrls.length < MAX_IMAGES && (
              <div className="rounded-xl border border-border bg-muted/30 p-3 space-y-3">
                {/* Tab switcher */}
                <div className="flex gap-1 bg-muted rounded-lg p-0.5 w-fit">
                  <button
                    type="button"
                    onClick={() => setAddMode("url")}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                      addMode === "url"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Paste URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddMode("upload")}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                      addMode === "upload"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Upload File
                  </button>
                </div>

                {addMode === "url" ? (
                  <div className="flex gap-2">
                    <Input
                      placeholder="https://example.com/image.jpg"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addImageUrl();
                        }
                      }}
                      data-ocid="admin.product_dialog.image_url_input"
                      className="flex-1 h-9 text-sm"
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={addImageUrl}
                      data-ocid="admin.product_dialog.add_image_url_button"
                      className="h-9 shrink-0"
                    >
                      Add
                    </Button>
                  </div>
                ) : (
                  <label className="flex items-center gap-3 cursor-pointer rounded-lg border-2 border-dashed border-border hover:border-primary/50 p-3 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Upload className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Click to upload image
                      </p>
                      <p className="text-xs text-muted-foreground">
                        JPG, PNG, WebP, GIF supported
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                      data-ocid="admin.product_dialog.upload_button"
                    />
                  </label>
                )}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Description *</Label>
            <Textarea
              required
              rows={3}
              placeholder="Describe the laptop in detail..."
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              data-ocid="admin.product_dialog.description_textarea"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              data-ocid="admin.product_dialog.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              data-ocid="admin.product_dialog.save_button"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : initial ? (
                "Save Changes"
              ) : (
                "Add Product"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ProductsTab() {
  const { data: products = [], isLoading } = useAdminProducts();
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const handleAdd = (data: ProductFormData) => {
    const { imageUrls, ...rest } = data;
    addProduct.mutate(
      { ...rest, imageUrl: imageUrls[0] ?? "", stock: BigInt(data.stock) },
      {
        onSuccess: () => {
          toast.success("Product added successfully");
          setShowAddDialog(false);
        },
        onError: (err) =>
          toast.error(
            err instanceof Error ? err.message : "Failed to add product",
          ),
      },
    );
  };

  const handleEdit = (data: ProductFormData) => {
    if (!editProduct) return;
    const { imageUrls, ...rest } = data;
    updateProduct.mutate(
      {
        ...editProduct,
        ...rest,
        imageUrl: imageUrls[0] ?? editProduct.imageUrl,
        stock: BigInt(data.stock),
      },
      {
        onSuccess: () => {
          toast.success("Product updated");
          setEditProduct(null);
        },
        onError: () => toast.error("Failed to update product"),
      },
    );
  };

  const handleDelete = (id: bigint) => {
    deleteProduct.mutate(id, {
      onSuccess: () => toast.success("Product deleted"),
      onError: () => toast.error("Failed to delete product"),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {products.length} products
        </p>
        <Button
          onClick={() => setShowAddDialog(true)}
          data-ocid="admin.add_product_button"
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {["sk1", "sk2", "sk3", "sk4"].map((k) => (
            <Skeleton key={k} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <Table data-ocid="admin.product_table">
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Product</TableHead>
                <TableHead className="hidden sm:table-cell">Brand</TableHead>
                <TableHead className="hidden md:table-cell">
                  Condition
                </TableHead>
                <TableHead className="hidden lg:table-cell">Price</TableHead>
                <TableHead className="hidden lg:table-cell">Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-12 text-muted-foreground"
                    data-ocid="admin.empty_state"
                  >
                    No products yet. Add your first product.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product, idx) => (
                  <TableRow
                    key={product.id.toString()}
                    data-ocid={`admin.product_row.${idx + 1}`}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-8 rounded-lg overflow-hidden bg-muted shrink-0 hidden sm:block">
                          <img
                            src={
                              product.imageUrl || "https://placehold.co/100x80"
                            }
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-foreground line-clamp-1">
                            {product.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {product.processor}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm">
                      {product.brand}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          product.condition === "Like New"
                            ? "bg-success/10 text-success border-success/20"
                            : product.condition === "Excellent"
                              ? "bg-primary/10 text-primary border-primary/20"
                              : "bg-warning/10 text-warning-foreground border-warning/20"
                        }`}
                      >
                        {product.condition}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm">
                      {formatPrice(product.discountPrice || product.price)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm">
                      {product.stock.toString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          asChild
                          data-ocid={`admin.view_product_button.${idx + 1}`}
                        >
                          <a
                            href={`/product/${product.id.toString()}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="View product page"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setEditProduct(product)}
                          data-ocid={`admin.edit_button.${idx + 1}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              data-ocid={`admin.delete_button.${idx + 1}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent data-ocid="admin.delete_dialog">
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Product
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{product.name}
                                "? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel data-ocid="admin.delete_dialog.cancel_button">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(product.id)}
                                data-ocid="admin.delete_dialog.confirm_button"
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <ProductFormDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onSave={handleAdd}
        isPending={addProduct.isPending}
      />

      {editProduct && (
        <ProductFormDialog
          open={!!editProduct}
          onClose={() => setEditProduct(null)}
          initial={editProduct}
          onSave={handleEdit}
          isPending={updateProduct.isPending}
        />
      )}
    </div>
  );
}

const STATUS_OPTIONS = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

function statusBadgeClass(status: string) {
  switch (status.toLowerCase()) {
    case "delivered":
      return "bg-success/10 text-success border-success/20";
    case "shipped":
      return "bg-primary/10 text-primary border-primary/20";
    case "processing":
      return "bg-warning/10 text-warning-foreground border-warning/20";
    case "cancelled":
      return "bg-destructive/10 text-destructive border-destructive/20";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function OrdersTab() {
  const { data: orders = [], isLoading } = useOrders();
  const updateStatus = useUpdateOrderStatus();

  const handleStatusChange = (id: bigint, status: string) => {
    updateStatus.mutate(
      { id, status },
      {
        onSuccess: () => toast.success("Order status updated"),
        onError: () => toast.error("Failed to update status"),
      },
    );
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {orders.length} orders total
      </p>

      {isLoading ? (
        <div className="space-y-3">
          {["sk1", "sk2", "sk3", "sk4"].map((k) => (
            <Skeleton key={k} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <Table data-ocid="admin.orders_table">
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden sm:table-cell">Email</TableHead>
                <TableHead className="hidden md:table-cell">Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-12 text-muted-foreground"
                    data-ocid="admin.orders_empty_state"
                  >
                    No orders yet.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order, idx) => (
                  <TableRow
                    key={order.id.toString()}
                    data-ocid={`admin.order_row.${idx + 1}`}
                  >
                    <TableCell className="text-sm font-mono text-muted-foreground">
                      #{order.id.toString()}
                    </TableCell>
                    <TableCell className="font-medium text-sm">
                      {order.customerName}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      {order.email}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm">
                      {formatPrice(order.total)}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        onValueChange={(v) => handleStatusChange(order.id, v)}
                      >
                        <SelectTrigger
                          data-ocid={`admin.order_status_select.${idx + 1}`}
                          className="h-8 w-36"
                        >
                          <SelectValue>
                            <Badge
                              variant="outline"
                              className={`text-xs ${statusBadgeClass(order.status)}`}
                            >
                              {order.status}
                            </Badge>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((s) => (
                            <SelectItem key={s} value={s}>
                              <Badge
                                variant="outline"
                                className={`text-xs ${statusBadgeClass(s)}`}
                              >
                                {s}
                              </Badge>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {new Date(
                        Number(order.createdAt) / 1_000_000,
                      ).toLocaleDateString("en-IN")}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

/* ─── Special Requests Tab (wired to localStorage) ─── */

interface SpecialRequest {
  name: string;
  email: string;
  phone: string;
  requestType: string;
  submittedAt: string;
}

function SpecialRequestsTab() {
  const [requests, setRequests] = useState<SpecialRequest[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("refurbhub_special_requests");
      if (raw) {
        const parsed = JSON.parse(raw) as SpecialRequest[];
        setRequests(parsed);
      }
    } catch {
      setRequests([]);
    }
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {requests.length} special request{requests.length !== 1 ? "s" : ""}
        </p>
      </div>
      <div className="rounded-xl border border-border overflow-hidden">
        <Table data-ocid="admin.special_requests_table">
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Name</TableHead>
              <TableHead className="hidden sm:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell">Phone</TableHead>
              <TableHead className="hidden lg:table-cell">
                Request Type
              </TableHead>
              <TableHead className="hidden lg:table-cell">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-12 text-muted-foreground"
                  data-ocid="admin.special_requests_empty_state"
                >
                  <p className="font-medium mb-1">No special requests yet.</p>
                  <p className="text-xs">
                    Requests submitted via the contact form will appear here.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              requests.map((req, idx) => (
                <TableRow
                  key={`${req.email}-${idx}`}
                  data-ocid={`admin.special_request_row.${idx + 1}`}
                >
                  <TableCell className="font-medium text-sm">
                    {req.name}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                    {req.email}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {req.phone}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Badge variant="outline" className="text-xs">
                      {req.requestType || "—"}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                    {new Date(req.submittedAt).toLocaleDateString("en-IN")}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function NewsletterTab() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Emails subscribed to the newsletter.
      </p>
      <div className="rounded-xl border border-border overflow-hidden">
        <Table data-ocid="admin.newsletter_table">
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Email</TableHead>
              <TableHead className="hidden sm:table-cell">
                Subscribed On
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell
                colSpan={2}
                className="text-center py-12 text-muted-foreground"
                data-ocid="admin.newsletter_empty_state"
              >
                <p className="font-medium mb-1">
                  No newsletter subscribers yet.
                </p>
                <p className="text-xs">
                  Email subscriptions will appear here once backend is updated.
                </p>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

/* ─── CSV Parsing ─── */

const CSV_HEADERS = [
  "name",
  "brand",
  "processor",
  "ram",
  "storage",
  "condition",
  "price",
  "discountprice",
  "stock",
  "imageurl",
  "description",
];

const CSV_TEMPLATE =
  "name,brand,processor,ram,storage,condition,price,discountprice,stock,imageurl,description\n" +
  "HP EliteBook 840 G9,HP,Intel Core i7-1265U,16GB,512GB SSD,Like New,95000,42999,5,https://example.com/image.jpg,Business laptop in excellent condition\n" +
  'Dell Latitude 5420,Dell,Intel Core i5-1145G7,8GB,256GB SSD,Excellent,65000,28999,3,https://example.com/image2.jpg,"Slim, durable enterprise laptop"\n';

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = lines[0]
    .split(",")
    .map((h) => h.trim().toLowerCase().replace(/[_\s]/g, ""));
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cells: string[] = [];
    let inQuote = false;
    let current = "";
    for (const ch of lines[i]) {
      if (ch === '"') {
        inQuote = !inQuote;
      } else if (ch === "," && !inQuote) {
        cells.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
    cells.push(current.trim());
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = cells[idx] ?? "";
    });
    rows.push(row);
  }
  return rows;
}

interface ParsedProductRow {
  name: string;
  brand: string;
  processor: string;
  ram: string;
  storage: string;
  condition: string;
  price: number;
  discountPrice: number;
  stock: number;
  imageUrl: string;
  description: string;
  errors: string[];
}

function validateRow(row: Record<string, string>): ParsedProductRow {
  const errors: string[] = [];
  const get = (keys: string[]) => {
    for (const k of keys) {
      if (row[k] !== undefined && row[k] !== "") return row[k];
    }
    return "";
  };

  const name = get(["name"]);
  const brand = get(["brand"]);
  const processor = get(["processor"]);
  const ram = get(["ram"]);
  const storage = get(["storage"]);
  const condition = get(["condition"]) || "Like New";
  const priceStr = get(["price"]);
  const discountPriceStr = get(["discountprice", "discount_price"]);
  const stockStr = get(["stock"]);
  const imageUrl = get(["imageurl", "image_url"]);
  const description = get(["description"]);

  if (!name) errors.push("name");
  if (!brand) errors.push("brand");
  if (!processor) errors.push("processor");
  if (!ram) errors.push("ram");
  if (!storage) errors.push("storage");

  const price = Number.parseFloat(priceStr.replace(/,/g, "")) || 0;
  const discountPrice =
    Number.parseFloat(discountPriceStr.replace(/,/g, "")) || 0;
  const stock = Number.parseInt(stockStr) || 1;

  if (!price) errors.push("price");

  return {
    name,
    brand,
    processor,
    ram,
    storage,
    condition,
    price,
    discountPrice,
    stock,
    imageUrl,
    description,
    errors,
  };
}

/* ─── Import Tab ─── */

function ImportTab() {
  const addProduct = useAddProduct();
  const [rows, setRows] = useState<ParsedProductRow[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importTotal, setImportTotal] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === "string") {
        const parsed = parseCSV(text);
        const validated = parsed.map(validateRow);
        setRows(validated);
      }
    };
    reader.readAsText(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const validRows = rows.filter((r) => r.errors.length === 0);
  const errorRows = rows.filter((r) => r.errors.length > 0);

  const handleImport = async () => {
    if (validRows.length === 0) return;
    setImporting(true);
    setImportTotal(validRows.length);
    setImportProgress(0);

    let success = 0;
    let failed = 0;

    for (let i = 0; i < validRows.length; i++) {
      const row = validRows[i];
      try {
        await new Promise<void>((resolve, reject) => {
          addProduct.mutate(
            {
              name: row.name,
              brand: row.brand,
              processor: row.processor,
              ram: row.ram,
              storage: row.storage,
              condition: row.condition,
              price: row.price,
              discountPrice: row.discountPrice,
              description: row.description,
              stock: BigInt(row.stock),
              imageUrl: row.imageUrl,
            },
            {
              onSuccess: () => resolve(),
              onError: () => reject(),
            },
          );
        });
        success++;
      } catch {
        failed++;
      }
      setImportProgress(i + 1);
    }

    setImporting(false);
    if (failed === 0) {
      toast.success(
        `Successfully imported ${success} product${success !== 1 ? "s" : ""}`,
      );
    } else {
      toast.error(`Imported ${success}, failed ${failed}`);
    }
    setRows([]);
    setFileName(null);
  };

  const downloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "refurbhub-product-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="font-display font-semibold text-lg text-foreground">
            Import Products via CSV
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Upload a CSV file to bulk-import products. Download the template
            below to get started.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={downloadTemplate}
          data-ocid="admin.import.download_template_button"
          className="gap-2 shrink-0"
        >
          <Download className="h-4 w-4" />
          Download CSV Template
        </Button>
      </div>

      {/* Column guide */}
      <div className="bg-muted/40 rounded-xl p-4 border border-border">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          Expected Columns
        </p>
        <div className="flex flex-wrap gap-2">
          {CSV_HEADERS.map((h) => (
            <code
              key={h}
              className="text-xs bg-background border border-border rounded px-2 py-0.5 text-foreground font-mono"
            >
              {h}
            </code>
          ))}
        </div>
      </div>

      {/* Drop Zone */}
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        data-ocid="admin.import.dropzone"
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200 p-10 flex flex-col items-center justify-center gap-3 text-center ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50"
        }`}
      >
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Upload className="h-7 w-7 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-foreground">
            {fileName ?? "Drag & drop your CSV file here"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {fileName
              ? "Click to replace file"
              : "or click to browse — .csv files supported"}
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={onFileChange}
          data-ocid="admin.import.upload_button"
        />
      </label>

      {/* Parse results */}
      {rows.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-sm text-success font-medium">
              <CheckCircle2 className="h-4 w-4" />
              {validRows.length} valid
            </span>
            {errorRows.length > 0 && (
              <span className="flex items-center gap-1.5 text-sm text-destructive font-medium">
                <AlertCircle className="h-4 w-4" />
                {errorRows.length} with errors
              </span>
            )}
          </div>

          <div className="rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto max-h-72">
              <Table data-ocid="admin.import.preview_table">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-6">#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Processor</TableHead>
                    <TableHead>RAM</TableHead>
                    <TableHead>Storage</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row, idx) => (
                    <TableRow
                      key={`${row.name}-${row.brand}-${idx}`}
                      data-ocid={`admin.import.preview_row.${idx + 1}`}
                      className={
                        row.errors.length > 0 ? "bg-destructive/5" : ""
                      }
                    >
                      <TableCell className="text-xs text-muted-foreground">
                        {idx + 1}
                      </TableCell>
                      <TableCell className="text-sm font-medium max-w-[120px] truncate">
                        {row.name || "—"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {row.brand || "—"}
                      </TableCell>
                      <TableCell className="text-sm max-w-[120px] truncate">
                        {row.processor || "—"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {row.ram || "—"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {row.storage || "—"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {row.price ? `₹${row.price.toLocaleString()}` : "—"}
                      </TableCell>
                      <TableCell>
                        {row.errors.length === 0 ? (
                          <Badge
                            variant="outline"
                            className="text-xs bg-success/10 text-success border-success/20"
                          >
                            Valid
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-xs bg-destructive/10 text-destructive border-destructive/20"
                            title={`Missing: ${row.errors.join(", ")}`}
                          >
                            Missing: {row.errors.join(", ")}
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Import progress */}
          {importing && (
            <div className="space-y-2" data-ocid="admin.import.loading_state">
              <p className="text-sm text-muted-foreground">
                Importing {importProgress} of {importTotal}...
              </p>
              <Progress
                value={(importProgress / importTotal) * 100}
                className="h-2"
              />
            </div>
          )}

          {validRows.length > 0 && (
            <Button
              onClick={() => void handleImport()}
              disabled={importing}
              data-ocid="admin.import.import_button"
              className="gap-2"
            >
              {importing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Import {validRows.length} Valid Row
                  {validRows.length !== 1 ? "s" : ""}
                </>
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── AI Product Assistant Tab ─── */

interface ExtractedProduct {
  name: string;
  brand: string;
  processor: string;
  ram: string;
  storage: string;
  condition: string;
  price: number;
  discountPrice: number;
  stock: number;
  imageUrl: string;
  description: string;
}

function extractProductInfo(text: string): ExtractedProduct {
  const t = text;

  // Brand
  const brandMatch = t.match(
    /\b(HP|Dell|Lenovo|Apple|Asus|Acer|MSI|Microsoft|Samsung|Toshiba)\b/i,
  );
  const brand = brandMatch
    ? brandMatch[1].charAt(0).toUpperCase() + brandMatch[1].slice(1)
    : "";

  // Processor
  const processorMatch = t.match(
    /Intel\s+Core\s+i[3579][-\s]\d+\w*|AMD\s+Ryzen\s+\d+\s+\w+|Apple\s+M[123]\s*(?:Pro|Max|Ultra)?|Intel\s+Celeron\s+\w+|Intel\s+Pentium\s+\w+|Core\s+i[3579][-\s]\d+\w*/i,
  );
  const processor = processorMatch ? processorMatch[0].trim() : "";

  // RAM
  const ramMatch = t.match(/(\d+)\s*GB\s*(?:RAM|Memory|DDR\d?)/i);
  const ram = ramMatch ? `${ramMatch[1]}GB` : "";

  // Storage
  const storageMatch = t.match(
    /(\d+)\s*(GB|TB)\s*(?:SSD|HDD|NVMe|Storage|Solid)/i,
  );
  const storage = storageMatch
    ? `${storageMatch[1]}${storageMatch[2].toUpperCase()} SSD`
    : "";

  // Price
  const priceMatch = t.match(/[₹$][\d,]+(?:\.\d+)?|Rs\.?\s*[\d,]+/i);
  const rawPrice = priceMatch
    ? Number.parseFloat(priceMatch[0].replace(/[₹$Rs., ]/gi, ""))
    : 0;

  // Condition
  const conditionMatch = t.match(
    /\b(Like New|Brand New|Excellent|Good|Fair|Refurbished)\b/i,
  );
  const condition = conditionMatch ? conditionMatch[1] : "Excellent";

  // Name — model number patterns
  const nameMatch = t.match(
    /\b(?:EliteBook\s+\d+\s*G\d*|ThinkPad\s+\w+\s*\w*|MacBook\s+(?:Pro|Air)\s*(?:M\d)?|Latitude\s+\d+|XPS\s+\d+|ProBook\s+\d+\s*G\d*|IdeaPad\s+\w+|Inspiron\s+\d+|ZBook\s+\w+|Pavilion\s+\w+)\b/i,
  );
  const modelName = nameMatch ? nameMatch[0].trim() : "";
  const name = modelName
    ? brand
      ? `${brand} ${modelName}`
      : modelName
    : brand
      ? `${brand} Refurbished Laptop`
      : "";

  return {
    name,
    brand,
    processor,
    ram,
    storage,
    condition,
    price: rawPrice,
    discountPrice: 0,
    stock: 1,
    imageUrl: "",
    description: text.trim().slice(0, 500),
  };
}

function AIAssistantTab() {
  const { data: products = [] } = useAdminProducts();
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();

  const [passage, setPassage] = useState("");
  const [extracted, setExtracted] = useState<ExtractedProduct | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string>("");

  const handleExtract = () => {
    if (!passage.trim()) {
      toast.error("Please paste some product text first");
      return;
    }
    const info = extractProductInfo(passage);
    setExtracted(info);
    toast.success("Product info extracted — review and edit below");
  };

  const setField = (k: keyof ExtractedProduct, v: string | number) => {
    if (!extracted) return;
    setExtracted((prev) => (prev ? { ...prev, [k]: v } : null));
  };

  const handleSaveNew = () => {
    if (!extracted) return;
    addProduct.mutate(
      {
        ...extracted,
        stock: BigInt(extracted.stock),
      },
      {
        onSuccess: () => {
          toast.success("Product added successfully");
          setExtracted(null);
          setPassage("");
        },
        onError: () => toast.error("Failed to add product"),
      },
    );
  };

  const handleUpdateExisting = () => {
    if (!extracted || !selectedProductId || selectedProductId === "new") return;
    const target = products.find((p) => p.id.toString() === selectedProductId);
    if (!target) return;

    updateProduct.mutate(
      {
        ...target,
        ...extracted,
        id: target.id,
        createdAt: target.createdAt,
        stock: BigInt(extracted.stock),
      },
      {
        onSuccess: () => {
          toast.success("Product updated successfully");
          setExtracted(null);
          setPassage("");
          setSelectedProductId("");
        },
        onError: () => toast.error("Failed to update product"),
      },
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display font-semibold text-lg text-foreground">
          AI Product Assistant
        </h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          Paste any product description, spec sheet, or listing text and the
          assistant will extract structured product data automatically.
        </p>
      </div>

      {/* Input area */}
      <div className="space-y-3">
        <Label htmlFor="ai-passage">Product Text / Description</Label>
        <Textarea
          id="ai-passage"
          rows={7}
          value={passage}
          onChange={(e) => setPassage(e.target.value)}
          placeholder="Paste a product description, spec sheet, or any text about a laptop here... e.g. 'HP EliteBook 840 G9 — Intel Core i7-1265U, 16GB RAM, 512GB NVMe SSD, Like New condition, priced at ₹42,999 (retail ₹95,000). Corporate refurbished machine with full testing done.'"
          data-ocid="admin.ai.passage_textarea"
          className="resize-y font-mono text-sm"
        />
        <Button
          onClick={handleExtract}
          data-ocid="admin.ai.extract_button"
          className="gap-2"
        >
          <Bot className="h-4 w-4" />
          Extract Product Info
        </Button>
      </div>

      {/* Extracted form */}
      {extracted && (
        <div className="space-y-5 border border-primary/20 rounded-2xl p-5 bg-primary/5">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <p className="font-semibold text-foreground">
              Extracted — review and edit before saving
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Product Name</Label>
              <Input
                value={extracted.name}
                onChange={(e) => setField("name", e.target.value)}
                data-ocid="admin.ai.name_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Brand</Label>
              <Select
                value={extracted.brand}
                onValueChange={(v) => setField("brand", v)}
              >
                <SelectTrigger data-ocid="admin.ai.brand_select">
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "HP",
                    "Dell",
                    "Lenovo",
                    "Apple",
                    "Asus",
                    "Acer",
                    "MSI",
                    "Microsoft",
                    "Samsung",
                    "Toshiba",
                  ].map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Processor</Label>
              <Input
                value={extracted.processor}
                onChange={(e) => setField("processor", e.target.value)}
                data-ocid="admin.ai.processor_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>RAM</Label>
              <Select
                value={extracted.ram}
                onValueChange={(v) => setField("ram", v)}
              >
                <SelectTrigger data-ocid="admin.ai.ram_select">
                  <SelectValue placeholder="Select RAM" />
                </SelectTrigger>
                <SelectContent>
                  {["4GB", "8GB", "16GB", "32GB", "64GB"].map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Storage</Label>
              <Select
                value={extracted.storage}
                onValueChange={(v) => setField("storage", v)}
              >
                <SelectTrigger data-ocid="admin.ai.storage_select">
                  <SelectValue placeholder="Select storage" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "128GB SSD",
                    "256GB SSD",
                    "512GB SSD",
                    "1TB SSD",
                    "2TB SSD",
                  ].map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Condition</Label>
              <Select
                value={extracted.condition}
                onValueChange={(v) => setField("condition", v)}
              >
                <SelectTrigger data-ocid="admin.ai.condition_select">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  {["Like New", "Excellent", "Good"].map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Price (₹)</Label>
              <Input
                type="number"
                value={extracted.price || ""}
                onChange={(e) => setField("price", Number(e.target.value))}
                data-ocid="admin.ai.price_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Discount Price (₹)</Label>
              <Input
                type="number"
                value={extracted.discountPrice || ""}
                onChange={(e) =>
                  setField("discountPrice", Number(e.target.value))
                }
                data-ocid="admin.ai.discount_price_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Stock</Label>
              <Input
                type="number"
                min={0}
                value={extracted.stock}
                onChange={(e) => setField("stock", Number(e.target.value))}
                data-ocid="admin.ai.stock_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Image URL</Label>
              <Input
                value={extracted.imageUrl}
                onChange={(e) => setField("imageUrl", e.target.value)}
                placeholder="https://..."
                data-ocid="admin.ai.image_url_input"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea
              rows={3}
              value={extracted.description}
              onChange={(e) => setField("description", e.target.value)}
              data-ocid="admin.ai.description_textarea"
            />
          </div>

          {/* Update existing product selector */}
          <div className="space-y-1.5">
            <Label>Update Existing Product (optional)</Label>
            <Select
              value={selectedProductId}
              onValueChange={setSelectedProductId}
            >
              <SelectTrigger data-ocid="admin.ai.existing_product_select">
                <SelectValue placeholder="Select a product to update, or leave blank to add new" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">— Add as new product —</SelectItem>
                {products.map((p) => (
                  <SelectItem key={p.id.toString()} value={p.id.toString()}>
                    {p.name} ({p.brand})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 flex-wrap">
            <Button
              onClick={handleSaveNew}
              disabled={addProduct.isPending}
              data-ocid="admin.ai.save_new_button"
              className="gap-2"
            >
              {addProduct.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Save as New Product
            </Button>
            <Button
              variant="outline"
              onClick={handleUpdateExisting}
              disabled={
                !selectedProductId ||
                selectedProductId === "new" ||
                updateProduct.isPending
              }
              data-ocid="admin.ai.update_existing_button"
              className="gap-2"
            >
              {updateProduct.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Pencil className="h-4 w-4" />
              )}
              Update Existing Product
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setExtracted(null);
                setPassage("");
              }}
              data-ocid="admin.ai.clear_button"
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-muted/40 rounded-xl p-4 border border-border">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5" />
          Tips for best extraction
        </p>
        <ul className="space-y-1 text-xs text-muted-foreground">
          <li>• Include the full brand name (HP, Dell, Lenovo, Apple, etc.)</li>
          <li>• Mention processor explicitly: "Intel Core i7-1265U"</li>
          <li>• Include RAM: "16GB RAM" or "16GB Memory"</li>
          <li>• Include storage: "512GB SSD" or "1TB NVMe"</li>
          <li>• Include price with ₹ or Rs symbol for auto-detection</li>
          <li>• Mention condition: Like New / Excellent / Good</li>
        </ul>
      </div>
    </div>
  );
}

/* ─── Home Sections Tab ─── */

const LS_FEATURED = "refurbhub_featured_ids";
const LS_TOP_PICKS = "refurbhub_top_picks_ids";
const LS_HOT_DEALS = "refurbhub_hot_deals_ids";

function getHomeSectionIds(key: string): string[] {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]") as string[];
  } catch {
    return [];
  }
}

function HomeSectionsTab() {
  const { data: products = [], isLoading } = useAdminProducts();

  const [featuredIds, setFeaturedIds] = useState<string[]>(() =>
    getHomeSectionIds(LS_FEATURED),
  );
  const [topPicksIds, setTopPicksIds] = useState<string[]>(() =>
    getHomeSectionIds(LS_TOP_PICKS),
  );
  const [hotDealsIds, setHotDealsIds] = useState<string[]>(() =>
    getHomeSectionIds(LS_HOT_DEALS),
  );

  const toggleId = (
    ids: string[],
    setIds: React.Dispatch<React.SetStateAction<string[]>>,
    id: string,
    max: number,
  ) => {
    if (ids.includes(id)) {
      setIds(ids.filter((i) => i !== id));
    } else {
      if (ids.length >= max) {
        toast.error(`Maximum ${max} products allowed for this section`);
        return;
      }
      setIds([...ids, id]);
    }
  };

  const saveSection = (key: string, ids: string[], label: string) => {
    localStorage.setItem(key, JSON.stringify(ids));
    toast.success(
      `${label} updated — ${ids.length} product${ids.length !== 1 ? "s" : ""} selected`,
    );
  };

  const SectionCard = ({
    title,
    description,
    ids,
    setIds,
    max,
    lsKey,
    ocidPrefix,
    saveOcid,
  }: {
    title: string;
    description: string;
    ids: string[];
    setIds: React.Dispatch<React.SetStateAction<string[]>>;
    max: number;
    lsKey: string;
    ocidPrefix: string;
    saveOcid: string;
  }) => (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="font-display text-base">{title}</CardTitle>
            <CardDescription className="mt-1 text-xs">
              {description}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-muted-foreground font-medium">
              {ids.length}/{max} selected
            </span>
            <Button
              size="sm"
              onClick={() => saveSection(lsKey, ids, title)}
              data-ocid={saveOcid}
              className="gap-1.5 h-8"
            >
              <Save className="h-3.5 w-3.5" />
              Save
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((k) => (
              <div key={k} className="flex items-center gap-3 p-2 rounded-lg">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-4 w-40" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <p
            className="text-sm text-muted-foreground py-4 text-center"
            data-ocid={`${ocidPrefix}.empty_state`}
          >
            No products available. Add products first.
          </p>
        ) : (
          <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
            {products.map((product, idx) => {
              const pid = product.id.toString();
              const checked = ids.includes(pid);
              return (
                <label
                  key={pid}
                  htmlFor={`${ocidPrefix}-${pid}`}
                  className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-colors ${
                    checked
                      ? "bg-primary/8 border border-primary/20"
                      : "hover:bg-muted/60"
                  }`}
                >
                  <Checkbox
                    id={`${ocidPrefix}-${pid}`}
                    data-ocid={`${ocidPrefix}.checkbox.${idx + 1}`}
                    checked={checked}
                    onCheckedChange={() => toggleId(ids, setIds, pid, max)}
                  />
                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-muted shrink-0">
                    <img
                      src={
                        product.imageUrl || "https://placehold.co/32x32?text=?"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "https://placehold.co/32x32?text=?";
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {product.brand}
                    </p>
                  </div>
                  {checked && (
                    <span className="text-xs font-semibold text-primary shrink-0">
                      #{ids.indexOf(pid) + 1}
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div data-ocid="admin.home_sections_tab" className="space-y-6">
      <div>
        <h3 className="font-display font-semibold text-lg text-foreground">
          Home Page Sections
        </h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          Select which products appear in each homepage section. Changes are
          saved to this browser and reflected immediately on the homepage.
        </p>
      </div>

      <SectionCard
        title="Featured Products"
        description="Shown in the first product grid on the homepage. Max 4 products."
        ids={featuredIds}
        setIds={setFeaturedIds}
        max={4}
        lsKey={LS_FEATURED}
        ocidPrefix="admin.featured"
        saveOcid="admin.featured_save_button"
      />

      <SectionCard
        title="Top Picks"
        description="Shown in the 'Top Picks' section. Max 4 products."
        ids={topPicksIds}
        setIds={setTopPicksIds}
        max={4}
        lsKey={LS_TOP_PICKS}
        ocidPrefix="admin.top_picks"
        saveOcid="admin.top_picks_save_button"
      />

      <SectionCard
        title="Hot Deals"
        description="Shown in 'Today's Best Laptop Deals' section. Max 3 products."
        ids={hotDealsIds}
        setIds={setHotDealsIds}
        max={3}
        lsKey={LS_HOT_DEALS}
        ocidPrefix="admin.hot_deals"
        saveOcid="admin.hot_deals_save_button"
      />
    </div>
  );
}

/* ─── Password Gate ─── */

const ADMIN_PASSWORD = "Armaan@10";

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_auth", "true");
      onUnlock();
    } else {
      setPasswordError("Incorrect password. Please try again.");
      setPasswordInput("");
    }
  };

  return (
    <div
      data-ocid="admin.password_gate"
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          "linear-gradient(135deg, #0B2A4A 0%, #0f3a63 50%, #091e33 100%)",
      }}
    >
      {/* Subtle background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 30%, rgba(30,94,255,0.15) 0%, transparent 70%)",
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div
          className="rounded-2xl p-8 sm:p-10"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow:
              "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(30,94,255,0.08)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-6">
              <span
                className="text-2xl font-bold tracking-tight"
                style={{ color: "#ffffff", fontFamily: "inherit" }}
              >
                Refurb{" "}
                <span
                  style={{ color: "#0B2A4A", WebkitTextStroke: "1px #4a9eff" }}
                >
                  Hub
                </span>
              </span>
            </div>

            {/* Lock icon */}
            <div
              className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, rgba(30,94,255,0.2), rgba(30,94,255,0.1))",
                border: "1px solid rgba(30,94,255,0.3)",
              }}
            >
              <Lock className="h-8 w-8" style={{ color: "#4a9eff" }} />
            </div>

            <h1
              className="text-2xl font-bold mb-2"
              style={{ color: "#ffffff", letterSpacing: "-0.02em" }}
            >
              Admin Access
            </h1>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              Enter the admin password to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="admin-password"
                className="text-sm font-medium"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  data-ocid="admin.password_input"
                  type={showPassword ? "text" : "password"}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (passwordError) setPasswordError("");
                  }}
                  placeholder="Enter admin password"
                  autoComplete="current-password"
                  className="w-full h-12 rounded-xl px-4 pr-12 text-sm outline-none transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: passwordError
                      ? "1px solid rgba(239,68,68,0.6)"
                      : "1px solid rgba(255,255,255,0.12)",
                    color: "#ffffff",
                  }}
                  onFocus={(e) => {
                    if (!passwordError) {
                      e.currentTarget.style.border =
                        "1px solid rgba(74,158,255,0.6)";
                      e.currentTarget.style.boxShadow =
                        "0 0 0 3px rgba(30,94,255,0.15)";
                    }
                  }}
                  onBlur={(e) => {
                    if (!passwordError) {
                      e.currentTarget.style.border =
                        "1px solid rgba(255,255,255,0.12)";
                      e.currentTarget.style.boxShadow = "none";
                    }
                  }}
                />
                <button
                  type="button"
                  data-ocid="admin.password_toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors duration-150"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Error message */}
              {passwordError && (
                <div
                  data-ocid="admin.password_error_state"
                  className="flex items-center gap-2 text-sm mt-1"
                  style={{ color: "#f87171" }}
                  role="alert"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              data-ocid="admin.password_submit_button"
              className="w-full h-12 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 mt-2"
              style={{
                background: "linear-gradient(135deg, #1E5EFF, #3b7dff)",
                color: "#ffffff",
                boxShadow: "0 4px 20px rgba(30,94,255,0.4)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, #2468ff, #4a8aff)";
                e.currentTarget.style.boxShadow =
                  "0 6px 28px rgba(30,94,255,0.55)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, #1E5EFF, #3b7dff)";
                e.currentTarget.style.boxShadow =
                  "0 4px 20px rgba(30,94,255,0.4)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <Lock className="h-4 w-4" />
              Unlock Dashboard
            </button>
          </form>
        </div>

        {/* Footer note */}
        <p
          className="text-center text-xs mt-6"
          style={{ color: "rgba(255,255,255,0.25)" }}
        >
          Authorized personnel only
        </p>
      </div>
    </div>
  );
}

/* ─── Admin Status Pill (header badge) ─── */

function AdminStatusPill() {
  const { identity, login } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();
  const isConnected = !!identity && !identity.getPrincipal().isAnonymous();

  if (isConnected && isAdmin) {
    return (
      <span
        data-ocid="admin.connected_status"
        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
        style={{
          background: "rgba(34,197,94,0.12)",
          border: "1px solid rgba(34,197,94,0.25)",
          color: "#16a34a",
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: "#22c55e" }}
        />
        Connected as Admin
      </span>
    );
  }

  if (isConnected && isAdmin === false) {
    return (
      <span
        data-ocid="admin.not_admin_status"
        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
        style={{
          background: "rgba(239,68,68,0.1)",
          border: "1px solid rgba(239,68,68,0.25)",
          color: "#dc2626",
        }}
      >
        <AlertCircle className="w-3.5 h-3.5" />
        Not Admin
      </span>
    );
  }

  return (
    <button
      type="button"
      data-ocid="admin.not_connected_status"
      onClick={() => void login()}
      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all"
      style={{
        background: "rgba(234,179,8,0.1)",
        border: "1px solid rgba(234,179,8,0.25)",
        color: "#ca8a04",
        cursor: "pointer",
      }}
    >
      <WifiOff className="w-3.5 h-3.5" />
      Not Connected — Click to Login
    </button>
  );
}

/* ─── Shared Dark Card Layout (matches PasswordGate aesthetic) ─── */

function DarkScreenWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative"
      style={{
        background:
          "linear-gradient(135deg, #0B2A4A 0%, #0f3a63 50%, #091e33 100%)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 30%, rgba(30,94,255,0.15) 0%, transparent 70%)",
        }}
      />
      <div className="relative w-full max-w-md">
        <div
          className="rounded-2xl p-8 sm:p-10"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow:
              "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(30,94,255,0.08)",
            backdropFilter: "blur(20px)",
          }}
        >
          {children}
        </div>
        <p
          className="text-center text-xs mt-6"
          style={{ color: "rgba(255,255,255,0.25)" }}
        >
          Authorized personnel only
        </p>
      </div>
    </div>
  );
}

/* ─── Step 2: Internet Identity Login Gate ─── */

function IILoginGate() {
  const { login, isLoggingIn, isLoginError, loginError } =
    useInternetIdentity();

  return (
    <DarkScreenWrapper>
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-6">
          <span
            className="text-2xl font-bold tracking-tight"
            style={{ color: "#ffffff" }}
          >
            Refurb{" "}
            <span style={{ color: "#0B2A4A", WebkitTextStroke: "1px #4a9eff" }}>
              Hub
            </span>
          </span>
        </div>

        <div
          className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(30,94,255,0.2), rgba(30,94,255,0.1))",
            border: "1px solid rgba(30,94,255,0.3)",
          }}
        >
          <UserCheck className="h-8 w-8" style={{ color: "#4a9eff" }} />
        </div>

        <h1
          className="text-2xl font-bold mb-2"
          style={{ color: "#ffffff", letterSpacing: "-0.02em" }}
        >
          Verify Your Identity
        </h1>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
          Login with Internet Identity to access the admin dashboard
        </p>
      </div>

      {isLoginError && (
        <div
          data-ocid="admin.ii_login_error_state"
          className="flex items-center gap-2 text-sm mb-4 p-3 rounded-xl"
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.25)",
            color: "#f87171",
          }}
          role="alert"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>
            {loginError?.message ?? "Login failed. Please try again."}
          </span>
        </div>
      )}

      <button
        type="button"
        data-ocid="admin.ii_login_button"
        onClick={() => void login()}
        disabled={isLoggingIn}
        className="w-full h-12 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2"
        style={{
          background: isLoggingIn
            ? "rgba(30,94,255,0.5)"
            : "linear-gradient(135deg, #1E5EFF, #3b7dff)",
          color: "#ffffff",
          boxShadow: isLoggingIn ? "none" : "0 4px 20px rgba(30,94,255,0.4)",
          cursor: isLoggingIn ? "not-allowed" : "pointer",
        }}
        onMouseEnter={(e) => {
          if (!isLoggingIn) {
            e.currentTarget.style.background =
              "linear-gradient(135deg, #2468ff, #4a8aff)";
            e.currentTarget.style.boxShadow = "0 6px 28px rgba(30,94,255,0.55)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isLoggingIn) {
            e.currentTarget.style.background =
              "linear-gradient(135deg, #1E5EFF, #3b7dff)";
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(30,94,255,0.4)";
            e.currentTarget.style.transform = "translateY(0)";
          }
        }}
      >
        {isLoggingIn ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Connecting to Internet Identity...
          </>
        ) : (
          <>
            <UserCheck className="h-4 w-4" />
            Login with Internet Identity
          </>
        )}
      </button>

      <p
        className="text-center text-xs mt-4"
        style={{ color: "rgba(255,255,255,0.35)" }}
      >
        Your identity is secured by the Internet Computer
      </p>
    </DarkScreenWrapper>
  );
}

/* ─── Step 3: Admin Registration Gate ─── */

function AdminRegistrationGate() {
  const activateAdmin = useActivateAdmin();
  const { actor, isFetching: actorFetching } = useActor();

  const handleRegister = () => {
    if (!actor) {
      toast.error("Backend not connected. Please wait and try again.");
      return;
    }
    activateAdmin.mutate(undefined, {
      onSuccess: () => {
        toast.success("Admin access granted! Welcome to the dashboard.");
      },
      onError: (err) => {
        const msg = err instanceof Error ? err.message : "Registration failed";
        console.error("[AdminRegistrationGate] Error:", err);
        toast.error(msg);
      },
    });
  };

  const isWaiting = actorFetching || !actor;

  return (
    <DarkScreenWrapper>
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-6">
          <span
            className="text-2xl font-bold tracking-tight"
            style={{ color: "#ffffff" }}
          >
            Refurb{" "}
            <span style={{ color: "#0B2A4A", WebkitTextStroke: "1px #4a9eff" }}>
              Hub
            </span>
          </span>
        </div>

        <div
          className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(30,94,255,0.2), rgba(30,94,255,0.1))",
            border: "1px solid rgba(30,94,255,0.3)",
          }}
        >
          <ShieldCheck className="h-8 w-8" style={{ color: "#4a9eff" }} />
        </div>

        <h1
          className="text-2xl font-bold mb-2"
          style={{ color: "#ffffff", letterSpacing: "-0.02em" }}
        >
          Register as Admin
        </h1>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
          Your account is not yet registered as admin on this canister. Click
          below to register your Internet Identity as the site administrator.
        </p>
      </div>

      {activateAdmin.isError && (
        <div
          data-ocid="admin.register_error_state"
          className="flex items-center gap-2 text-sm mb-4 p-3 rounded-xl"
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.25)",
            color: "#f87171",
          }}
          role="alert"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>
            {activateAdmin.error instanceof Error
              ? activateAdmin.error.message
              : "Registration failed. Please try again."}
          </span>
        </div>
      )}

      <button
        type="button"
        data-ocid="admin.register_admin_button"
        onClick={handleRegister}
        disabled={activateAdmin.isPending || isWaiting}
        className="w-full h-12 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2"
        style={{
          background:
            activateAdmin.isPending || isWaiting
              ? "rgba(30,94,255,0.5)"
              : "linear-gradient(135deg, #1E5EFF, #3b7dff)",
          color: "#ffffff",
          boxShadow:
            activateAdmin.isPending || isWaiting
              ? "none"
              : "0 4px 20px rgba(30,94,255,0.4)",
          cursor:
            activateAdmin.isPending || isWaiting ? "not-allowed" : "pointer",
        }}
        onMouseEnter={(e) => {
          if (!activateAdmin.isPending && !isWaiting) {
            e.currentTarget.style.background =
              "linear-gradient(135deg, #2468ff, #4a8aff)";
            e.currentTarget.style.boxShadow = "0 6px 28px rgba(30,94,255,0.55)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }
        }}
        onMouseLeave={(e) => {
          if (!activateAdmin.isPending && !isWaiting) {
            e.currentTarget.style.background =
              "linear-gradient(135deg, #1E5EFF, #3b7dff)";
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(30,94,255,0.4)";
            e.currentTarget.style.transform = "translateY(0)";
          }
        }}
      >
        {isWaiting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Connecting to backend...
          </>
        ) : activateAdmin.isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Registering admin access...
          </>
        ) : (
          <>
            <ShieldCheck className="h-4 w-4" />
            Register as Admin
          </>
        )}
      </button>

      <p
        className="text-center text-xs mt-4"
        style={{ color: "rgba(255,255,255,0.35)" }}
      >
        This registers your Internet Identity principal as the site admin
      </p>
    </DarkScreenWrapper>
  );
}

/* ─── Main AdminPage ─── */

export function AdminPage() {
  const [passwordUnlocked, setPasswordUnlocked] = useState(
    () => sessionStorage.getItem("admin_auth") === "true",
  );
  const { identity, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsAdmin();

  // Step 1: Password gate
  if (!passwordUnlocked) {
    return <PasswordGate onUnlock={() => setPasswordUnlocked(true)} />;
  }

  // Step 2: Wait for II initialization, then require login
  if (isInitializing) {
    return (
      <DarkScreenWrapper>
        <div className="text-center py-8">
          <Loader2
            className="h-10 w-10 animate-spin mx-auto mb-4"
            style={{ color: "#4a9eff" }}
          />
          <p
            className="text-sm font-medium"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            Initializing identity...
          </p>
        </div>
      </DarkScreenWrapper>
    );
  }

  const isConnected = !!identity && !identity.getPrincipal().isAnonymous();

  if (!isConnected) {
    return <IILoginGate />;
  }

  // Step 3: Identity loaded — check admin status
  if (isAdminLoading) {
    return (
      <DarkScreenWrapper>
        <div className="text-center py-8">
          <Loader2
            className="h-10 w-10 animate-spin mx-auto mb-4"
            style={{ color: "#4a9eff" }}
          />
          <p
            className="text-sm font-medium"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            Verifying admin access...
          </p>
        </div>
      </DarkScreenWrapper>
    );
  }

  if (!isAdmin) {
    return <AdminRegistrationGate />;
  }

  // Step 4: Authenticated admin — show dashboard
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-bold text-3xl text-foreground mb-1">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage your products and orders
          </p>
        </div>
        <AdminStatusPill />
      </div>

      <Tabs defaultValue="products">
        <TabsList className="mb-6 flex-wrap h-auto gap-1">
          <TabsTrigger
            value="products"
            className="gap-2"
            data-ocid="admin.products_tab"
          >
            <Package className="h-4 w-4" />
            Products
          </TabsTrigger>
          <TabsTrigger
            value="orders"
            className="gap-2"
            data-ocid="admin.orders_tab"
          >
            <ShoppingBag className="h-4 w-4" />
            Orders
          </TabsTrigger>
          <TabsTrigger
            value="import"
            className="gap-2"
            data-ocid="admin.import_tab"
          >
            <Upload className="h-4 w-4" />
            Import Products
          </TabsTrigger>
          <TabsTrigger
            value="ai-assistant"
            className="gap-2"
            data-ocid="admin.ai_assistant_tab"
          >
            <Bot className="h-4 w-4" />
            AI Assistant
          </TabsTrigger>
          <TabsTrigger
            value="home-sections"
            className="gap-2"
            data-ocid="admin.home_sections_tab"
          >
            <LayoutDashboard className="h-4 w-4" />
            Home Sections
          </TabsTrigger>
          <TabsTrigger
            value="special-requests"
            className="gap-2"
            data-ocid="admin.special_requests_tab"
          >
            <Inbox className="h-4 w-4" />
            Special Requests
          </TabsTrigger>
          <TabsTrigger
            value="newsletter"
            className="gap-2"
            data-ocid="admin.newsletter_tab"
          >
            <Mail className="h-4 w-4" />
            Newsletter
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <ProductsTab />
        </TabsContent>

        <TabsContent value="orders">
          <OrdersTab />
        </TabsContent>

        <TabsContent value="import">
          <ImportTab />
        </TabsContent>

        <TabsContent value="ai-assistant">
          <AIAssistantTab />
        </TabsContent>

        <TabsContent value="home-sections">
          <HomeSectionsTab />
        </TabsContent>

        <TabsContent value="special-requests">
          <SpecialRequestsTab />
        </TabsContent>

        <TabsContent value="newsletter">
          <NewsletterTab />
        </TabsContent>
      </Tabs>
    </main>
  );
}
