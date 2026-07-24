"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X, Package } from "lucide-react";
import { usePathname } from "next/navigation";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const links = [
    { name: "All Products", href: "/shop" },
    { name: "Imported Chocolates", href: "/category/imported-chocolates" },
    { name: "Beverages", href: "/category/beverages" },
    { name: "Chips & Snacks", href: "/category/chips-snacks" },
    { name: "Offers", href: "/shop?offers=true", highlight: true },
    { name: "Track Order", href: "/track-order", icon: Package },
  ];

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 text-slate-700 focus:outline-none"
      >
        <Menu className="w-6 h-6" />
      </button>

      {mounted && createPortal(
        <>
          {/* Overlay */}
          {isOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-[9999] md:hidden"
              onClick={() => setIsOpen(false)}
            />
          )}

          {/* Drawer */}
          <div className={`fixed inset-y-0 left-0 z-[10000] w-72 bg-white transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}>
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-bold text-lg">Menu</span>
              <button onClick={() => setIsOpen(false)} className="p-2 text-slate-500 focus:outline-none">
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-4">
              <ul className="space-y-1">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-6 py-3 font-medium transition-colors ${
                        pathname === link.href ? "text-primary bg-primary/5" : 
                        link.highlight ? "text-secondary hover:bg-slate-50" : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {link.icon && <link.icon className="w-5 h-5" />}
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </>,
        document.body
      )}
    </>
  );
}
