"use client"
import Link from "next/link";
import { Search, ShoppingCart, User, Heart, Package, Sparkles } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useEffect, useState } from "react";
import { HeaderSearch } from "./HeaderSearch";
import { MobileMenu } from "./MobileMenu";
import { AnnouncementBar } from "./AnnouncementBar";

export function Header() {
  const { cart, wishlist, setCartOpen } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartItemsCount = mounted ? cart.reduce((acc, item) => acc + item.quantity, 0) : 0;
  const wishlistCount = mounted ? wishlist.length : 0;

  return (
    <>
      <AnnouncementBar />
      <header className="sticky top-0 z-50 w-full border-b border-[#E8E0D5] bg-[#FAF7F2]/95 backdrop-blur supports-[backdrop-filter]:bg-[#FAF7F2]/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">

            {/* Logo & Mobile Menu */}
            <div className="flex-shrink-0 flex items-center gap-2">
              <MobileMenu />
              <Link href="/" className="text-2xl font-black text-[#4A2C2A] tracking-tight flex items-center gap-1.5">
                <span>DCC</span>
                <span className="text-[#C5A059] font-medium">CORNER</span>
              </Link>
            </div>

            {/* Search Bar (Desktop) */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <HeaderSearch />
            </div>

            {/* Navigation Actions */}
            <div className="flex items-center space-x-5">
              <Link href="/track-order" className="hidden sm:flex flex-col items-center justify-center text-[#6B625D] hover:text-[#4A2C2A] transition-colors">
                <Package className="w-5 h-5 mb-0.5" />
                <span className="text-[10px] font-medium leading-none">Track Order</span>
              </Link>

              <Link href="/wishlist" className="hidden sm:flex flex-col items-center justify-center text-[#6B625D] hover:text-[#4A2C2A] transition-colors relative group">
                <div className="relative">
                  <Heart className="w-5 h-5 mb-0.5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-2 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-[#4A2C2A] rounded-full border-2 border-background group-hover:border-transparent transition-colors">
                      {wishlistCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium leading-none">Wishlist</span>
              </Link>

              <Link href="/account" className="hidden sm:flex flex-col items-center justify-center text-[#6B625D] hover:text-[#4A2C2A] transition-colors">
                <User className="w-5 h-5 mb-0.5" />
                <span className="text-[10px] font-medium leading-none">Account</span>
              </Link>

              <button onClick={() => setCartOpen(true)} className="flex flex-col items-center justify-center text-[#6B625D] hover:text-[#4A2C2A] transition-colors relative group">
                <div className="relative">
                  <ShoppingCart className="w-5 h-5 mb-0.5" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-2 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-[#C5A059] rounded-full border-2 border-background group-hover:border-transparent transition-colors">
                      {cartItemsCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium leading-none">Cart</span>
              </button>
            </div>
          </div>

          {/* Visual Mega Menu Bar */}
          <nav className="hidden lg:flex items-center justify-between py-2.5 border-t border-[#E8E0D5] text-xs font-semibold text-[#2C2725] overflow-x-auto">
            <Link href="/shop" className="hover:text-[#C5A059] transition-colors flex items-center gap-1.5 whitespace-nowrap">
              🛍️ All Products
            </Link>
            <Link href="/category/coffee-beverages" className="hover:text-[#C5A059] transition-colors flex items-center gap-1.5 whitespace-nowrap">
              ☕ Coffee & Beverages
            </Link>
            <Link href="/category/imported-chocolates" className="hover:text-[#C5A059] transition-colors flex items-center gap-1.5 whitespace-nowrap">
              🍫 Chocolates & Confectionery
            </Link>
            <Link href="/category/dairy-frozen" className="hover:text-[#C5A059] transition-colors flex items-center gap-1.5 whitespace-nowrap">
              🧀 Dairy & Frozen Pantry
            </Link>
            <Link href="/category/snacks-munchies" className="hover:text-[#C5A059] transition-colors flex items-center gap-1.5 whitespace-nowrap">
              🍿 Snacks & Munchies
            </Link>
            <Link href="/category/toiletries-personal-care" className="hover:text-[#C5A059] transition-colors flex items-center gap-1.5 whitespace-nowrap">
              🧴 Toiletries & Personal Care
            </Link>
            <Link href="/shop?offers=true" className="text-[#C5A059] hover:text-[#4A2C2A] transition-colors flex items-center gap-1.5 font-bold whitespace-nowrap bg-[#C5A059]/10 px-2.5 py-1 rounded-full border border-[#C5A059]/20">
              🏷️ DCC Bundles / Wholesale Deals
            </Link>
          </nav>

          <div className="md:hidden py-3 border-t border-[#E8E0D5]">
            <HeaderSearch />
          </div>
        </div>
      </header>
    </>
  );
}

