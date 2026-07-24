"use client"
import Link from "next/link";
import { Search, ShoppingCart, User, Heart, Package } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useEffect, useState } from "react";
import { HeaderSearch } from "./HeaderSearch";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const { cart, wishlist, setCartOpen } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartItemsCount = mounted ? cart.reduce((acc, item) => acc + item.quantity, 0) : 0;
  const wishlistCount = mounted ? wishlist.length : 0;
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* Logo & Mobile Menu */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <MobileMenu />
            <Link href="/" className="text-2xl font-bold text-primary tracking-tight">
              DCC <span className="text-secondary">Corner</span>
            </Link>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <HeaderSearch />
          </div>

          {/* Navigation Actions */}
          <div className="flex items-center space-x-6">
            <Link href="/track-order" className="hidden sm:flex flex-col items-center justify-center text-muted-foreground hover:text-primary transition-colors">
              <Package className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-medium leading-none">Track Order</span>
            </Link>

            <Link href="/wishlist" className="hidden sm:flex flex-col items-center justify-center text-muted-foreground hover:text-primary transition-colors relative group">
              <div className="relative">
                <Heart className="w-6 h-6 mb-1" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-2 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-primary rounded-full border-2 border-background group-hover:border-transparent transition-colors">
                    {wishlistCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium leading-none">Wishlist</span>
            </Link>

            <Link href="/account" className="hidden sm:flex flex-col items-center justify-center text-muted-foreground hover:text-primary transition-colors">
              <User className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-medium leading-none">Account</span>
            </Link>

            <button onClick={() => setCartOpen(true)} className="flex flex-col items-center justify-center text-muted-foreground hover:text-primary transition-colors relative group">
              <div className="relative">
                <ShoppingCart className="w-6 h-6 mb-1" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-2 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-secondary rounded-full border-2 border-background group-hover:border-transparent transition-colors">
                    {cartItemsCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium leading-none">Cart</span>
            </button>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-8 py-3 border-t text-sm font-medium">
          <Link href="/shop" className="hover:text-primary transition-colors">All Products</Link>
          <Link href="/category/imported-chocolates" className="hover:text-primary transition-colors">Imported Chocolates</Link>
          <Link href="/category/beverages" className="hover:text-primary transition-colors">Beverages</Link>
          <Link href="/category/chips-snacks" className="hover:text-primary transition-colors">Chips & Snacks</Link>
          <Link href="/shop?offers=true" className="text-secondary hover:text-secondary/80 transition-colors">Offers</Link>
        </nav>

        <div className="md:hidden py-3 border-t">
          <HeaderSearch />
        </div>
      </div>
    </header>
  );
}
