import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Star } from "lucide-react";
import { motion } from "motion/react";
import type { Product } from "../backend.d";

interface ProductCardProps {
  product: Product;
  imageUrl: string;
  index?: number;
}

export default function ProductCard({
  product,
  imageUrl,
  index = 0,
}: ProductCardProps) {
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem({
      productId: product.id,
      name: product.name,
      priceInCents: Number(product.priceInCents),
      imageUrl,
    });
  };

  const priceFormatted = `₹${(Number(product.priceInCents) / 100).toFixed(0)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
      className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative overflow-hidden aspect-square bg-muted">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2">
          <Badge className="bg-primary/90 text-primary-foreground text-xs">
            <Star className="w-3 h-3 mr-1 fill-current" />
            Premium
          </Badge>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-display font-semibold text-foreground truncate">
          {product.name}
        </h3>
        <p className="text-muted-foreground text-sm mt-1 line-clamp-2 min-h-[2.5rem]">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <span className="font-display text-lg font-bold text-primary">
            {priceFormatted}
          </span>
          <Button
            data-ocid={`product.${index + 1}.button`}
            size="sm"
            onClick={handleAdd}
            className="bg-primary text-primary-foreground hover:opacity-90 gap-1.5"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
