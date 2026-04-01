import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  useAddProduct,
  useGetAllOrders,
  useGetProducts,
  useUpdateOrderStatus,
} from "@/hooks/useQueries";
import {
  ClipboardList,
  Loader2,
  Package,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import type { OrderStatus } from "../backend.d";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function AdminDashboard() {
  const { data: products, isLoading: productsLoading } = useGetProducts();
  const { data: orders, isLoading: ordersLoading } = useGetAllOrders();
  const addProduct = useAddProduct();
  const updateStatus = useUpdateOrderStatus();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !imageFile) {
      toast.error("Please fill in all fields including an image.");
      return;
    }
    try {
      const bytes = new Uint8Array(await imageFile.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) =>
        setUploadProgress(pct),
      );
      await addProduct.mutateAsync({
        id: "",
        name,
        description,
        priceInCents: BigInt(Math.round(Number.parseFloat(price) * 100)),
        image: blob,
      });
      toast.success("Product added!");
      setDialogOpen(false);
      setName("");
      setDescription("");
      setPrice("");
      setImageFile(null);
      setUploadProgress(0);
    } catch (err: any) {
      toast.error(err?.message || "Failed to add product.");
    }
  };

  const handleStatusChange = async (orderId: bigint, status: string) => {
    try {
      await updateStatus.mutateAsync({
        orderId,
        status: status as OrderStatus,
      });
      toast.success("Order status updated.");
    } catch (err: any) {
      toast.error(err?.message || "Failed to update status.");
    }
  };

  return (
    <main className="container mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">
          Admin Dashboard
        </h1>

        <Tabs defaultValue="products">
          <TabsList className="mb-6">
            <TabsTrigger value="products" data-ocid="admin.products.tab">
              <Package className="w-4 h-4 mr-2" /> Products
            </TabsTrigger>
            <TabsTrigger value="orders" data-ocid="admin.orders.tab">
              <ClipboardList className="w-4 h-4 mr-2" /> Orders
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-xl font-semibold">
                Products ({products?.length ?? 0})
              </h2>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    data-ocid="admin.product.open_modal_button"
                    className="bg-primary text-primary-foreground hover:opacity-90 gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent data-ocid="admin.product.dialog">
                  <DialogHeader>
                    <DialogTitle className="font-display">
                      Add New Product
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddProduct} className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="pname">Product Name *</Label>
                      <Input
                        id="pname"
                        data-ocid="admin.product.name.input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Premium Almonds"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pdesc">Description</Label>
                      <Textarea
                        id="pdesc"
                        data-ocid="admin.product.description.textarea"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Product description..."
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pprice">Price (₹) *</Label>
                      <Input
                        id="pprice"
                        data-ocid="admin.product.price.input"
                        type="number"
                        step="1"
                        min="0"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="499"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Product Image *</Label>
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          setImageFile(e.target.files?.[0] ?? null)
                        }
                      />
                      <Button
                        data-ocid="admin.product.upload_button"
                        type="button"
                        variant="outline"
                        onClick={() => fileRef.current?.click()}
                        className="w-full"
                      >
                        {imageFile ? imageFile.name : "Choose Image"}
                      </Button>
                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <div
                          data-ocid="admin.product.loading_state"
                          className="w-full bg-muted rounded-full h-2"
                        >
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3 pt-2">
                      <Button
                        data-ocid="admin.product.submit_button"
                        type="submit"
                        className="flex-1 bg-primary text-primary-foreground hover:opacity-90"
                        disabled={addProduct.isPending}
                      >
                        {addProduct.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                            Adding...
                          </>
                        ) : (
                          "Add Product"
                        )}
                      </Button>
                      <Button
                        data-ocid="admin.product.cancel_button"
                        type="button"
                        variant="outline"
                        onClick={() => setDialogOpen(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {productsLoading ? (
              <div
                data-ocid="admin.products.loading_state"
                className="text-center py-12 text-muted-foreground"
              >
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" />
                Loading products...
              </div>
            ) : !products || products.length === 0 ? (
              <div
                data-ocid="admin.products.empty_state"
                className="text-center py-16 text-muted-foreground"
              >
                <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p>No products yet. Add your first product!</p>
              </div>
            ) : (
              <div className="rounded-xl border border-border overflow-hidden">
                <Table data-ocid="admin.products.table">
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((p, idx) => (
                      <TableRow
                        key={p.id}
                        data-ocid={`admin.products.item.${idx + 1}`}
                      >
                        <TableCell>
                          <img
                            src={p.image.getDirectURL()}
                            alt={p.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        </TableCell>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell>
                          ₹{(Number(p.priceInCents) / 100).toFixed(0)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              data-ocid={`admin.products.edit_button.${idx + 1}`}
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              data-ocid={`admin.products.delete_button.${idx + 1}`}
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <h2 className="font-display text-xl font-semibold mb-6">
              Orders ({orders?.length ?? 0})
            </h2>

            {ordersLoading ? (
              <div
                data-ocid="admin.orders.loading_state"
                className="text-center py-12 text-muted-foreground"
              >
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" />
                Loading orders...
              </div>
            ) : !orders || orders.length === 0 ? (
              <div
                data-ocid="admin.orders.empty_state"
                className="text-center py-16 text-muted-foreground"
              >
                <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p>No orders yet.</p>
              </div>
            ) : (
              <div className="rounded-xl border border-border overflow-hidden">
                <Table data-ocid="admin.orders.table">
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Order ID</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Update</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order, idx) => (
                      <TableRow
                        key={order.id.toString()}
                        data-ocid={`admin.orders.item.${idx + 1}`}
                      >
                        <TableCell className="font-mono text-sm">
                          #{order.id.toString()}
                        </TableCell>
                        <TableCell>{order.items.length} item(s)</TableCell>
                        <TableCell>
                          ₹{(Number(order.totalAmountInCents) / 100).toFixed(0)}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] ?? ""}`}
                          >
                            {order.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={order.status}
                            onValueChange={(v) =>
                              handleStatusChange(order.id, v)
                            }
                          >
                            <SelectTrigger
                              data-ocid={`admin.orders.status.select.${idx + 1}`}
                              className="w-32 h-8 text-xs"
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[
                                "pending",
                                "processing",
                                "shipped",
                                "delivered",
                                "cancelled",
                              ].map((s) => (
                                <SelectItem key={s} value={s}>
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </main>
  );
}
