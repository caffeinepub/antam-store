import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetProducts } from "@/hooks/useQueries";
import { Search } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { Product } from "../backend.d";

const STATIC_PRODUCTS: (Product & { imageUrl: string; category: string })[] = [
  {
    id: "almonds-1",
    name: "California Almonds",
    description:
      "Crisp raw almonds from California orchards. Rich in Vitamin E.",
    priceInCents: BigInt(79900),
    image: {
      getDirectURL: () => "/assets/generated/product-almonds.dim_400x400.jpg",
    } as any,
    imageUrl: "/assets/generated/product-almonds.dim_400x400.jpg",
    category: "Nuts",
  },
  {
    id: "cashews-1",
    name: "Whole Cashews",
    description: "Buttery whole cashews with creamy flavour.",
    priceInCents: BigInt(99900),
    image: {
      getDirectURL: () => "/assets/generated/product-cashews.dim_400x400.jpg",
    } as any,
    imageUrl: "/assets/generated/product-cashews.dim_400x400.jpg",
    category: "Nuts",
  },
  {
    id: "pistachios-1",
    name: "Roasted Pistachios",
    description: "Lightly salted pistachios packed with antioxidants.",
    priceInCents: BigInt(89900),
    image: {
      getDirectURL: () =>
        "/assets/generated/product-pistachios.dim_400x400.jpg",
    } as any,
    imageUrl: "/assets/generated/product-pistachios.dim_400x400.jpg",
    category: "Nuts",
  },
  {
    id: "walnuts-1",
    name: "Walnut Halves",
    description: "Fresh walnut halves rich in Omega-3 fatty acids.",
    priceInCents: BigInt(64900),
    image: {
      getDirectURL: () => "/assets/generated/product-walnuts.dim_400x400.jpg",
    } as any,
    imageUrl: "/assets/generated/product-walnuts.dim_400x400.jpg",
    category: "Nuts",
  },
  {
    id: "raisins-1",
    name: "Golden Raisins",
    description: "Plump, sun-dried golden raisins naturally sweet and chewy.",
    priceInCents: BigInt(34900),
    image: {
      getDirectURL: () => "/assets/generated/product-raisins.dim_400x400.jpg",
    } as any,
    imageUrl: "/assets/generated/product-raisins.dim_400x400.jpg",
    category: "Dried Fruits",
  },
  {
    id: "dates-1",
    name: "Medjool Dates",
    description: "Soft, caramel-like Medjool dates — nature's candy.",
    priceInCents: BigInt(54900),
    image: {
      getDirectURL: () => "/assets/generated/product-dates.dim_400x400.jpg",
    } as any,
    imageUrl: "/assets/generated/product-dates.dim_400x400.jpg",
    category: "Dried Fruits",
  },
  {
    id: "trail-1",
    name: "Trail Mix Delight",
    description:
      "A wholesome blend of nuts, seeds and dried cranberries for on-the-go energy.",
    priceInCents: BigInt(74900),
    image: {
      getDirectURL: () => "/assets/generated/product-trail-mix.dim_400x400.jpg",
    } as any,
    imageUrl: "/assets/generated/product-trail-mix.dim_400x400.jpg",
    category: "Mixes",
  },
];

const SKELETON_KEYS = [
  "sk-1",
  "sk-2",
  "sk-3",
  "sk-4",
  "sk-5",
  "sk-6",
  "sk-7",
  "sk-8",
];
const CATEGORIES = ["All", "Nuts", "Dried Fruits", "Seeds", "Mixes"];

export default function CatalogPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const { data: products, isLoading } = useGetProducts();

  const allProducts: (Product & { imageUrl: string; category: string })[] =
    products && products.length > 0
      ? products.map((p) => ({
          ...p,
          imageUrl: p.image.getDirectURL(),
          category: "Nuts",
        }))
      : STATIC_PRODUCTS;

  const filtered = allProducts.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || p.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="container mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="font-display text-4xl font-bold text-foreground mb-2">
          Shop All Products
        </h1>
        <p className="text-muted-foreground mb-8">
          Handpicked premium dry fruits & nuts
        </p>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              data-ocid="catalog.search_input"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Tabs value={category} onValueChange={setCategory}>
            <TabsList className="bg-muted">
              {CATEGORIES.map((cat) => (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  data-ocid={`catalog.${cat.toLowerCase().replace(" ", "-")}.tab`}
                >
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {SKELETON_KEYS.map((k) => (
              <div
                key={k}
                data-ocid="catalog.loading_state"
                className="space-y-3"
              >
                <Skeleton className="aspect-square rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div data-ocid="catalog.empty_state" className="py-24 text-center">
            <p className="text-muted-foreground">
              No products found for your search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((p, i) => (
              <ProductCard
                key={p.id}
                product={p}
                imageUrl={p.imageUrl}
                index={i}
              />
            ))}
          </div>
        )}
      </motion.div>
    </main>
  );
}
