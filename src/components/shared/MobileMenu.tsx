"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { 
  Menu, 
  X, 
  Package, 
  Flame, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  User, 
  ChevronRight, 
  HelpCircle, 
  PhoneCall,
  LayoutDashboard,
  Heart
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useStore } from "@/store/useStore";

const mobileCategories = [
  { name: "Imported Chocolates", href: "/category/imported-chocolates", icon: "🍫", badge: "Swiss/Belgian" },
  { name: "Coffee & Beverages", href: "/category/beverages", icon: "☕", badge: "Davidoff" },
  { name: "Chips & Snacks", href: "/category/chips-snacks", icon: "🥨", badge: "Pringles" },
  { name: "Biscuits & Cookies", href: "/category/cookies", icon: "🍪", badge: "Lotus" },
  { name: "Instant Noodles & Ramen", href: "/category/instant-noodles", icon: "🍜", badge: "Buldak" },
  { name: "Candies & Sweets", href: "/category/candies", icon: "🍬", badge: "Gummies" },
];

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { user, logout, wishlist, openAuthModal } = useStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        aria-label="Toggle navigation menu"
        className="p-1 sm:p-1.5 text-[#111827] hover:text-[#163A32] focus:outline-none cursor-pointer rounded-lg active:scale-95 transition-transform"
      >
        <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {mounted && createPortal(
        <>
          {/* Backdrop Overlay */}
          {isOpen && (
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[9999] lg:hidden animate-in fade-in duration-200"
              onClick={() => setIsOpen(false)}
            />
          )}

          {/* Sliding Side Drawer */}
          <div className={`fixed inset-y-0 left-0 z-[10000] w-[85%] max-w-sm bg-white transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col shadow-2xl ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}>
            
            {/* Header: Brand Monogram + Close Button */}
            <div className="flex items-center justify-between p-4 border-b border-[#E5E7EB] bg-[#F7F8F5]">
              <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#163A32] flex items-center justify-center text-white font-bold text-sm shadow-xs border border-[#6B8F71]/30">
                  <span className="text-[#D6A84F]">D</span>
                </div>
                <div>
                  <p className="font-black text-base text-[#111827] leading-none font-heading">
                    DCC<span className="text-[#6B8F71] ml-0.5">Corner</span>
                  </p>
                  <p className="text-[9px] text-[#6B7280] font-semibold tracking-wider uppercase mt-0.5">
                    Imported Wholesale
                  </p>
                </div>
              </Link>

              <button 
                onClick={() => setIsOpen(false)} 
                aria-label="Close menu"
                className="p-2 text-slate-400 hover:text-[#111827] rounded-full hover:bg-slate-200/60 focus:outline-none cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Navigation Body */}
            <div className="flex-1 overflow-y-auto py-3 divide-y divide-slate-100" data-lenis-prevent="true">
              
              {/* Highlight Badges */}
              <div className="px-3 pb-3 space-y-1">
                <Link
                  href="/shop?offers=true"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-red-50 to-amber-50 border border-red-200/70 text-red-600 font-extrabold text-xs"
                >
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 fill-red-600 text-red-600" />
                    <span>Wholesale Flash Deals</span>
                  </div>
                  <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full font-black">
                    Up to -35%
                  </span>
                </Link>

                <Link
                  href="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-[#163A32] text-white font-extrabold text-xs shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#D6A84F]" />
                    <span>Bashundhara Express (2-Hour)</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#D6A84F]" />
                </Link>
              </div>

              {/* Browse Categories */}
              <div className="py-3 px-3">
                <p className="px-3 text-[10px] font-black uppercase tracking-wider text-[#9CA3AF] mb-2">
                  Browse Categories
                </p>
                <ul className="space-y-1">
                  {mobileCategories.map((cat) => (
                    <li key={cat.name}>
                      <Link
                        href={cat.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                          pathname === cat.href 
                            ? "text-[#163A32] bg-[#163A32]/10" 
                            : "text-[#374151] hover:bg-[#F7F8F5] hover:text-[#163A32]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">{cat.icon}</span>
                          <span>{cat.name}</span>
                        </div>
                        <span className="text-[9px] text-[#6B8F71] font-semibold">
                          {cat.badge}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick Links */}
              <div className="py-3 px-3">
                <p className="px-3 text-[10px] font-black uppercase tracking-wider text-[#9CA3AF] mb-2">
                  Explore & Services
                </p>
                <ul className="space-y-1">
                  <li>
                    <Link
                      href="/shop?sort=newest"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#374151] hover:bg-[#F7F8F5]"
                    >
                      <Sparkles className="w-4 h-4 text-[#D6A84F]" />
                      <span>New Arrivals Drop</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop?sort=popular"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#374151] hover:bg-[#F7F8F5]"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#6B8F71]" />
                      <span>Verified Direct Imports</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/wishlist"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold text-[#374151] hover:bg-[#F7F8F5]"
                    >
                      <div className="flex items-center gap-2.5">
                        <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                        <span>My Saved Wishlist</span>
                      </div>
                      {mounted && wishlist.length > 0 && (
                        <span className="text-[10px] bg-[#163A32] text-white px-2 py-0.5 rounded-full font-black">
                          {wishlist.length}
                        </span>
                      )}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/track-order"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#374151] hover:bg-[#F7F8F5]"
                    >
                      <Package className="w-4 h-4 text-[#163A32]" />
                      <span>Track Active Order</span>
                    </Link>
                  </li>
                  <li>
                    <a
                      href="https://wa.me/8801700000000"
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50/80 hover:bg-emerald-100/80"
                    >
                      <PhoneCall className="w-4 h-4 text-emerald-600" />
                      <span>WhatsApp Concierge Support</span>
                    </a>
                  </li>
                </ul>
              </div>

            </div>

            {/* Bottom Account Row */}
            <div className="p-4 border-t border-[#E5E7EB] bg-[#F7F8F5]">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-[#6B7280]">Signed in as</p>
                      <p className="text-xs font-black text-[#111827] truncate max-w-[180px]">{user.name || user.email}</p>
                    </div>
                    {user.role === "ADMIN" && (
                      <Link
                        href="/dcc-hq"
                        onClick={() => setIsOpen(false)}
                        className="px-2.5 py-1 bg-[#163A32] text-white rounded-lg text-[10px] font-bold"
                      >
                        Admin HQ
                      </Link>
                    )}
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex-1 py-2 bg-white border border-[#E5E7EB] text-[#111827] rounded-xl text-xs font-bold text-center"
                    >
                      Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="px-3 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-bold"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      openAuthModal("login");
                    }}
                    className="flex-1 py-2.5 bg-[#163A32] text-white rounded-xl text-xs font-bold text-center shadow-xs cursor-pointer"
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      openAuthModal("signup");
                    }}
                    className="flex-1 py-2.5 bg-white border border-[#E5E7EB] text-[#163A32] rounded-xl text-xs font-bold text-center cursor-pointer"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>

          </div>
        </>,
        document.body
      )}
    </>
  );
}

