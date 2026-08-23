"use client";

import { ShoppingCart } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useEffect, useState } from "react";

export function FloatingCartButton() {
  const { cart, setCartOpen, isCartOpen } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isCartOpen) return null;

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <button
      onClick={() => setCartOpen(true)}
      className="fixed right-4 sm:right-6 bottom-6 sm:bottom-8 bg-[#163A32] text-white p-3.5 rounded-full shadow-[0_10px_35px_rgba(22,58,50,0.35)] flex items-center justify-center z-40 hover:scale-110 active:scale-95 transition-all duration-200 group border-2 border-[#D6A84F]/50 cursor-pointer"
      aria-label="Open Cart"
    >
      <div className="relative">
        <ShoppingCart className="w-5 h-5 text-[#D6A84F] group-hover:scale-110 transition-transform" />
        {cartItemsCount > 0 && (
          <span className="absolute -top-2.5 -right-2.5 bg-red-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-xs border-2 border-white">
            {cartItemsCount}
          </span>
        )}
      </div>
    </button>
  );
}
