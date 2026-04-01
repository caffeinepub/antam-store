import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useIsAdmin } from "@/hooks/useQueries";
import { useQueryClient } from "@tanstack/react-query";
import { LayoutDashboard, Leaf, ShoppingBag, User } from "lucide-react";

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { totalItems, openCart } = useCart();
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const qc = useQueryClient();
  const { data: isAdmin } = useIsAdmin();

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      qc.clear();
    } else {
      try {
        await login();
      } catch (e: any) {
        if (e?.message === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-xs">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          type="button"
          data-ocid="nav.link"
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 group"
        >
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Leaf className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-semibold text-foreground">
            Antam Store
          </span>
        </button>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6">
          <button
            type="button"
            data-ocid="nav.home.link"
            onClick={() => onNavigate("home")}
            className={`text-sm font-medium transition-colors hover:text-primary ${
              currentPage === "home" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Home
          </button>
          <button
            type="button"
            data-ocid="nav.catalog.link"
            onClick={() => onNavigate("catalog")}
            className={`text-sm font-medium transition-colors hover:text-primary ${
              currentPage === "catalog"
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            Shop
          </button>
          {isAdmin && (
            <button
              type="button"
              data-ocid="nav.admin.link"
              onClick={() => onNavigate("admin")}
              className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 ${
                currentPage === "admin"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Admin
            </button>
          )}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <Button
            data-ocid="nav.cart.button"
            variant="ghost"
            size="icon"
            className="relative"
            onClick={openCart}
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <Badge className="absolute -top-1.5 -right-1.5 w-5 h-5 p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground">
                {totalItems}
              </Badge>
            )}
          </Button>

          <Button
            data-ocid="nav.auth.button"
            size="sm"
            variant={isAuthenticated ? "outline" : "default"}
            onClick={handleAuth}
            disabled={loginStatus === "logging-in"}
            className="hidden md:flex items-center gap-1.5"
          >
            <User className="w-3.5 h-3.5" />
            {loginStatus === "logging-in"
              ? "Logging in..."
              : isAuthenticated
                ? "Logout"
                : "Login"}
          </Button>
        </div>
      </div>
    </header>
  );
}
