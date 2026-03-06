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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Loader2,
  Lock,
  Package,
  Pencil,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddProduct,
  useDeleteProduct,
  useIsAdmin,
  useOrders,
  useProducts,
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
  description: "",
  stock: 1,
  imageUrl: "",
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
          description: initial.description,
          stock: Number(initial.stock),
          imageUrl: initial.imageUrl,
        }
      : EMPTY_PRODUCT,
  );

  const set = (k: keyof ProductFormData, v: string | number) =>
    setForm((prev) => ({ ...prev, [k]: v }));

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
              />
            </div>
            <div className="space-y-1.5">
              <Label>Brand *</Label>
              <Select value={form.brand} onValueChange={(v) => set("brand", v)}>
                <SelectTrigger>
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
              />
            </div>
            <div className="space-y-1.5">
              <Label>RAM *</Label>
              <Select value={form.ram} onValueChange={(v) => set("ram", v)}>
                <SelectTrigger>
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
                <SelectTrigger>
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
                <SelectTrigger>
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
              />
            </div>
            <div className="space-y-1.5">
              <Label>Image URL</Label>
              <Input
                placeholder="https://..."
                value={form.imageUrl}
                onChange={(e) => set("imageUrl", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Description *</Label>
            <Textarea
              required
              rows={3}
              placeholder="Describe the laptop in detail..."
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
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
  const { data: products = [], isLoading } = useProducts();
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const handleAdd = (data: ProductFormData) => {
    addProduct.mutate(
      { ...data, stock: BigInt(data.stock) },
      {
        onSuccess: () => {
          toast.success("Product added successfully");
          setShowAddDialog(false);
        },
        onError: () => toast.error("Failed to add product"),
      },
    );
  };

  const handleEdit = (data: ProductFormData) => {
    if (!editProduct) return;
    updateProduct.mutate(
      { ...editProduct, ...data, stock: BigInt(data.stock) },
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

export function AdminPage() {
  const { data: isAdmin, isLoading: isCheckingAdmin } = useIsAdmin();
  const { login, loginStatus } = useInternetIdentity();

  if (isCheckingAdmin) {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div data-ocid="admin.loading_state" className="space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Checking permissions...</p>
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="max-w-md mx-auto px-4 sm:px-6 py-24 text-center">
        <div data-ocid="admin.access_denied" className="space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 mx-auto flex items-center justify-center">
            <Lock className="h-8 w-8 text-destructive" />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground mb-2">
              Access Restricted
            </h1>
            <p className="text-muted-foreground text-sm">
              This area is for authorized administrators only. Please log in
              with an admin account to continue.
            </p>
          </div>
          <Button
            size="lg"
            onClick={() => void login()}
            disabled={loginStatus === "logging-in"}
            className="gap-2"
          >
            {loginStatus === "logging-in" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Lock className="h-4 w-4" />
            )}
            Log In
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-foreground mb-1">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground text-sm">
          Manage your products and orders
        </p>
      </div>

      <Tabs defaultValue="products">
        <TabsList className="mb-6">
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
        </TabsList>

        <TabsContent value="products">
          <ProductsTab />
        </TabsContent>

        <TabsContent value="orders">
          <OrdersTab />
        </TabsContent>
      </Tabs>
    </main>
  );
}
