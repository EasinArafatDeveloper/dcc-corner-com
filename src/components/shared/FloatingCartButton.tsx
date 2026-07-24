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
      className="fixed right-0 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground p-3 rounded-l-xl shadow-2xl flex flex-col items-center justify-center gap-1 z-40 hover:pr-4 transition-all group border border-r-0 border-primary-foreground/20"
      aria-label="Open Cart"
    >
      <div className="relative">
        <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
        {cartItemsCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-destructive text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {cartItemsCount}
          </span>
        )}
      </div>
    </button>
  );
}
