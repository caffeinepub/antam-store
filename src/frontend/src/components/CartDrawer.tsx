import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface CartDrawerProps {
  onCheckout: () => void;
}

export default function CartDrawer({ onCheckout }: CartDrawerProps) {
  const { items, removeItem, updateQty, totalCents, isOpen, closeCart } =
    useCart();
  const { identity } = useInternetIdentity();

  const formatPrice = (cents: number) => `₹${(cents / 100).toFixed(0)}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            data-ocid="cart.modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-card shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h2 className="font-display text-lg font-semibold">
                  Your Cart
                </h2>
                {items.length > 0 && (
                  <span className="text-sm text-muted-foreground">
                    ({items.length} items)
                  </span>
                )}
              </div>
              <Button
                data-ocid="cart.close_button"
                variant="ghost"
                size="icon"
                onClick={closeCart}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 ? (
                <div
                  data-ocid="cart.empty_state"
                  className="flex flex-col items-center justify-center h-full gap-4 text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      Your cart is empty
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add some premium nuts & fruits!
                    </p>
                  </div>
                </div>
              ) : (
                items.map((item, idx) => (
                  <div
                    key={item.productId}
                    data-ocid={`cart.item.${idx + 1}`}
                    className="flex gap-3 bg-muted/50 rounded-lg p-3"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 rounded-md object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {item.name}
                      </p>
                      <p className="text-primary font-semibold text-sm mt-0.5">
                        {formatPrice(item.priceInCents)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() =>
                            updateQty(item.productId, item.quantity - 1)
                          }
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="text-sm font-medium w-6 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() =>
                            updateQty(item.productId, item.quantity + 1)
                          }
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      data-ocid={`cart.delete_button.${idx + 1}`}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => removeItem(item.productId)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-5 border-t border-border space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-display text-xl font-semibold text-foreground">
                    {formatPrice(totalCents)}
                  </span>
                </div>
                <Separator />
                {!identity ? (
                  <p className="text-sm text-muted-foreground text-center">
                    Please login to checkout
                  </p>
                ) : null}
                <Button
                  data-ocid="cart.submit_button"
                  className="w-full bg-primary text-primary-foreground hover:opacity-90"
                  onClick={() => {
                    closeCart();
                    onCheckout();
                  }}
                  disabled={!identity}
                >
                  Proceed to Checkout
                </Button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
