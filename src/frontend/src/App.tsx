import CartDrawer from "@/components/CartDrawer";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/context/CartContext";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useIsAdmin } from "@/hooks/useQueries";
import AdminDashboard from "@/pages/AdminDashboard";
import CatalogPage from "@/pages/CatalogPage";
import CheckoutPage from "@/pages/CheckoutPage";
import HomePage from "@/pages/HomePage";
import { useState } from "react";

function AppContent() {
  const [page, setPage] = useState<"home" | "catalog" | "checkout" | "admin">(
    "home",
  );
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();

  const navigate = (p: string) => {
    if (p === "checkout" && !identity) return;
    if (p === "admin" && !isAdmin) return;
    setPage(p as any);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar currentPage={page} onNavigate={navigate} />
      <CartDrawer onCheckout={() => navigate("checkout")} />

      <div className="flex-1">
        {page === "home" && <HomePage onNavigate={navigate} />}
        {page === "catalog" && <CatalogPage />}
        {page === "checkout" && <CheckoutPage onNavigate={navigate} />}
        {page === "admin" && <AdminDashboard />}
      </div>

      <footer className="border-t border-border bg-card mt-auto py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Nuts&amp;Nature. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>

      <Toaster richColors position="top-right" />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
