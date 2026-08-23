"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X, Package, Heart, ShoppingBag, Sparkles, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { useStore } from "@/store/useStore";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { user } = useStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const links = [
    { name: "Deals of the Week", href: "/shop?offers=true", badge: "Hot", badgeColor: "bg-rose-50 text-[#DC2626] border border-rose-200" },
    { name: "New Arrivals", href: "/shop?sort=newest" },
    { name: "Imported Chocolates", href: "/category/imported-chocolates" },
    { name: "Coffee & Beverages", href: "/category/coffee-beverages" },
    { name: "Chips & Snacks", href: "/category/chips-snacks" },
    { name: "Dairy & Frozen Pantry", href: "/category/dairy-frozen" },
    { name: "Special Sale", href: "/shop?offers=true", badge: "20% OFF", badgeColor: "bg-[#163A32]/10 text-[#163A32] border border-[#163A32]/20" },
    { name: "Track Order", href: "/track-order", icon: Package },
  ];

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        aria-label="Toggle menu"
        className="lg:hidden p-1.5 text-[#111827] hover:text-[#163A32] focus:outline-none cursor-pointer"
      >
        <Menu className="w-6 h-6" />
      </button>

      {mounted && createPortal(
        <>
          {/* Overlay */}
          {isOpen && (
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[9999] lg:hidden animate-in fade-in duration-200"
              onClick={() => setIsOpen(false)}
            />
          )}

          {/* Drawer */}
          <div className={`fixed inset-y-0 left-0 z-[10000] w-80 bg-white transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col shadow-2xl ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}>
            <div className="flex items-center justify-between p-4.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#163A32] flex items-center justify-center text-white font-bold text-sm border border-[#6B8F71]/30">
                  D
                </div>
                <span className="font-extrabold text-base text-[#111827]">
                  DCC <span className="text-[#6B8F71] font-bold">Corner</span>
                </span>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-1.5 text-slate-400 hover:text-[#111827] rounded-full hover:bg-slate-100 focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-3">
              <ul className="space-y-1 px-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                        pathname === link.href 
                          ? "text-[#163A32] bg-[#163A32]/10" 
                          : "text-[#4B5563] hover:bg-[#F7F8F5] hover:text-[#163A32]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {link.icon && <link.icon className="w-4 h-4 text-[#6B8F71]" />}
                        <span>{link.name}</span>
                      </div>
                      {link.badge && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${link.badgeColor}`}>
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-4 border-t border-slate-100 px-4 space-y-2">
                <Link
                  href={user ? (user.role === "ADMIN" ? "/dcc-hq" : "/dashboard") : "/login"}
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#163A32] hover:bg-[#0E2620] text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                >
                  <User className="w-4 h-4 text-[#6B8F71]" />
                  <span>{user ? "My Account" : "Sign In / Register"}</span>
                </Link>
              </div>
            </nav>
          </div>
        </>,
        document.body
      )}
    </>
  );
}
