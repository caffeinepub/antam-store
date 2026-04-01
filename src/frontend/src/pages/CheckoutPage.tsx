import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/context/CartContext";
import { usePlaceOrder, useSaveUserProfile } from "@/hooks/useQueries";
import { CheckCircle, Loader2, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

interface CheckoutPageProps {
  onNavigate: (page: string) => void;
}

export default function CheckoutPage({ onNavigate }: CheckoutPageProps) {
  const { items, totalCents, clearCart } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [ordered, setOrdered] = useState(false);

  const placeOrder = usePlaceOrder();
  const saveProfile = useSaveUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address || !phone) {
      toast.error("Please fill in all required fields.");
      return;
    }
    try {
      await saveProfile.mutateAsync({ name, email, address });
      await placeOrder.mutateAsync();
      clearCart();
      setOrdered(true);
      toast.success("Order placed successfully!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to place order.");
    }
  };

  if (ordered) {
    return (
      <div
        data-ocid="checkout.success_state"
        className="min-h-[60vh] flex items-center justify-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
          <h2 className="font-display text-3xl font-bold text-foreground mb-3">
            Order Placed!
          </h2>
          <p className="text-muted-foreground mb-6">
            Thank you for your order. We'll process and ship it soon.
          </p>
          <Button
            data-ocid="checkout.continue_button"
            onClick={() => onNavigate("home")}
            className="bg-primary text-primary-foreground hover:opacity-90"
          >
            Continue Shopping
          </Button>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div
        data-ocid="checkout.empty_state"
        className="min-h-[60vh] flex items-center justify-center"
      >
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold mb-2">
            Your cart is empty
          </h2>
          <p className="text-muted-foreground mb-6">
            Add some products before checking out.
          </p>
          <Button
            data-ocid="checkout.shop_button"
            onClick={() => onNavigate("catalog")}
          >
            Go to Shop
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="font-display text-3xl font-bold text-foreground mb-8">
        Checkout
      </h1>
      <div className="grid lg:grid-cols-2 gap-10">
        {/* Order Form */}
        <motion.form
          data-ocid="checkout.modal"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onSubmit={handleSubmit}
          className="space-y-5 bg-card rounded-2xl p-6 shadow-card"
        >
          <h2 className="font-display text-xl font-semibold">
            Delivery Details
          </h2>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              data-ocid="checkout.name.input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              data-ocid="checkout.email.input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              data-ocid="checkout.phone.input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Delivery Address *</Label>
            <Textarea
              id="address"
              data-ocid="checkout.address.textarea"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street address, city, PIN code"
              rows={3}
              required
            />
          </div>

          <Button
            data-ocid="checkout.submit_button"
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:opacity-90"
            disabled={placeOrder.isPending || saveProfile.isPending}
          >
            {placeOrder.isPending || saveProfile.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Placing
                Order...
              </>
            ) : (
              "Place Order"
            )}
          </Button>
        </motion.form>

        {/* Order Summary */}
        <div className="space-y-4">
          <h2 className="font-display text-xl font-semibold">Order Summary</h2>
          <div className="bg-card rounded-2xl p-6 shadow-card space-y-3">
            {items.map((item, idx) => (
              <div
                key={item.productId}
                data-ocid={`checkout.item.${idx + 1}`}
                className="flex items-center gap-3"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-muted-foreground text-xs">
                    Qty: {item.quantity}
                  </p>
                </div>
                <p className="font-semibold text-sm">
                  ₹{((item.priceInCents * item.quantity) / 100).toFixed(0)}
                </p>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between font-display font-bold text-lg">
              <span>Total</span>
              <span className="text-primary">
                ₹{(totalCents / 100).toFixed(0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
