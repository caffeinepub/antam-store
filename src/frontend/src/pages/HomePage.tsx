import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetProducts } from "@/hooks/useQueries";
import { ArrowRight, Award, Shield, Truck } from "lucide-react";
import { motion } from "motion/react";

const STATIC_PRODUCTS = [
  {
    id: "almonds-1",
    name: "California Almonds",
    description:
      "Crisp and nutritious raw almonds sourced directly from California orchards. Rich in Vitamin E and healthy fats.",
    priceInCents: BigInt(79900),
    imageUrl: "/assets/generated/product-almonds.dim_400x400.jpg",
    category: "Nuts",
  },
  {
    id: "cashews-1",
    name: "Whole Cashews",
    description:
      "Buttery, whole cashews with a rich creamy flavour. Perfect for snacking or cooking.",
    priceInCents: BigInt(99900),
    imageUrl: "/assets/generated/product-cashews.dim_400x400.jpg",
    category: "Nuts",
  },
  {
    id: "pistachios-1",
    name: "Roasted Pistachios",
    description:
      "Lightly salted, roasted pistachios. Crunchy, flavourful and packed with antioxidants.",
    priceInCents: BigInt(89900),
    imageUrl: "/assets/generated/product-pistachios.dim_400x400.jpg",
    category: "Nuts",
  },
  {
    id: "walnuts-1",
    name: "Walnut Halves",
    description:
      "Fresh walnut halves with a mild, earthy taste. Excellent brain food rich in Omega-3.",
    priceInCents: BigInt(64900),
    imageUrl: "/assets/generated/product-walnuts.dim_400x400.jpg",
    category: "Nuts",
  },
];

const SKELETON_KEYS = ["sk-1", "sk-2", "sk-3", "sk-4"];

const FEATURES = [
  {
    icon: Shield,
    title: "100% Natural",
    desc: "No preservatives, no additives",
  },
  { icon: Truck, title: "Fast Delivery", desc: "Delivered fresh to your door" },
  {
    icon: Award,
    title: "Premium Quality",
    desc: "Sourced from the best farms",
  },
];

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const { data: products, isLoading } = useGetProducts();

  const displayProducts =
    products && products.length > 0
      ? products.slice(0, 4).map((p) => ({
          ...p,
          imageUrl: p.image.getDirectURL(),
          category: "Nuts",
        }))
      : STATIC_PRODUCTS;

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="h-[520px] md:h-[600px] bg-cover bg-center relative"
          style={{
            backgroundImage: `url('/assets/generated/hero-dryfuits.dim_1200x600.jpg')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent" />
          <div className="relative container mx-auto px-4 h-full flex items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="max-w-xl"
            >
              <p className="text-primary font-medium tracking-wider uppercase text-sm mb-3">
                Farm to Table
              </p>
              <h1 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground leading-tight">
                Premium Dry Fruits,{" "}
                <span className="text-primary">Delivered Fresh</span>
              </h1>
              <p className="mt-4 text-primary-foreground/80 text-lg leading-relaxed">
                Handpicked from the world's finest orchards. Pure, nutritious,
                and irresistibly delicious.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <Button
                  data-ocid="hero.primary_button"
                  size="lg"
                  className="bg-primary text-primary-foreground hover:opacity-90 gap-2"
                  onClick={() => onNavigate("catalog")}
                >
                  Shop Now <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  data-ocid="hero.secondary_button"
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground text-primary-foreground bg-transparent hover:bg-primary-foreground/10"
                  onClick={() => onNavigate("catalog")}
                >
                  Browse All
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Pills */}
      <section className="bg-primary py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex items-center gap-3 text-primary-foreground"
              >
                <Icon className="w-5 h-5" />
                <div>
                  <p className="font-semibold text-sm">{title}</p>
                  <p className="text-xs opacity-80">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-primary font-medium uppercase tracking-wider text-sm mb-2">
              Bestsellers
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Featured Products
            </h2>
          </div>
          <Button
            data-ocid="home.view_all.button"
            variant="ghost"
            className="text-primary hover:text-primary gap-1"
            onClick={() => onNavigate("catalog")}
          >
            View All <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {SKELETON_KEYS.map((k) => (
              <div key={k} data-ocid="home.loading_state" className="space-y-3">
                <Skeleton className="aspect-square rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {displayProducts.map((p, i) => (
              <ProductCard
                key={p.id}
                product={{
                  id: p.id,
                  name: p.name,
                  description: p.description,
                  priceInCents: p.priceInCents,
                  image: (p as any).image || {
                    getDirectURL: () => (p as any).imageUrl,
                  },
                }}
                imageUrl={
                  (p as any).imageUrl ||
                  (p as any).image?.getDirectURL?.() ||
                  ""
                }
                index={i}
              />
            ))}
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <section className="bg-accent py-14 mx-4 md:mx-8 rounded-2xl mb-16">
        <div className="text-center max-w-2xl mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-foreground mb-3">
            Taste the Difference
          </h2>
          <p className="text-muted-foreground mb-6">
            Join thousands of happy customers who trust us for their daily
            nutrition needs.
          </p>
          <Button
            data-ocid="cta.shop_button"
            size="lg"
            className="bg-primary text-primary-foreground hover:opacity-90"
            onClick={() => onNavigate("catalog")}
          >
            Explore Full Collection
          </Button>
        </div>
      </section>
    </main>
  );
}
