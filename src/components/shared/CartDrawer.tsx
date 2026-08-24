"use client";

import { useStore } from "@/store/useStore";
import { X, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

export function CartDrawer() {
  const { cart, isCartOpen, setCartOpen, updateQuantity, removeFromCart } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <>
      {/* Backdrop */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 transition-opacity backdrop-blur-sm"
          onClick={() => setCartOpen(false)}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-background shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-[#E5E7EB] bg-[#F7F8F5]">
          <h2 className="text-lg font-black text-[#111827] flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2 text-[#163A32]" /> Your Cart
            <span className="ml-2 text-xs font-black bg-[#163A32] text-white w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
              {cart.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          </h2>
          <Button variant="ghost" size="icon" onClick={() => setCartOpen(false)} className="rounded-full hover:bg-slate-200/60 text-[#4B5563]">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4" data-lenis-prevent="true">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-[#4B5563] space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#F7F8F5] flex items-center justify-center text-[#6B8F71]">
                <ShoppingCart className="w-8 h-8 opacity-60" />
              </div>
              <p className="font-semibold text-sm text-[#111827]">Your cart is completely empty.</p>
              <Button onClick={() => setCartOpen(false)} className="rounded-xl bg-[#163A32] text-white hover:bg-[#0E2620] font-bold text-xs">
                Start Shopping
              </Button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item._id} className="flex gap-3.5 p-3.5 border border-[#E5E7EB] rounded-2xl bg-white relative group hover:border-[#6B8F71]/30 transition-all">
                <div className="w-18 h-18 bg-[#F7F8F5] border border-slate-100 rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-1">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <h4 className="font-bold text-xs text-[#111827] line-clamp-2 leading-tight pr-6">{item.name}</h4>
                    <p className="text-[#163A32] font-black text-sm mt-1">৳{item.price.toFixed(0)}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-[#E5E7EB] rounded-full bg-[#F7F8F5]">
                      <button 
                        className="w-7 h-7 flex items-center justify-center text-[#4B5563] hover:text-[#163A32] hover:bg-white rounded-full transition-colors cursor-pointer"
                        onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-[#111827]">{item.quantity}</span>
                      <button 
                        className="w-7 h-7 flex items-center justify-center text-[#4B5563] hover:text-[#163A32] hover:bg-white rounded-full transition-colors cursor-pointer"
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => removeFromCart(item._id)}
                  className="absolute top-3 right-3 text-slate-400 hover:text-[#DC2626] transition-colors p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-5 border-t border-[#E5E7EB] bg-[#F7F8F5]">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-xs text-[#4B5563]">Subtotal</span>
              <span className="text-xl font-black text-[#163A32]">৳{subtotal.toFixed(0)}</span>
            </div>
            <div className="space-y-2.5">
              <Button asChild className="w-full h-11 rounded-xl font-bold text-sm bg-[#163A32] hover:bg-[#0E2620] text-white shadow-md shadow-[#163A32]/20">
                <Link href="/checkout" onClick={() => setCartOpen(false)}>Proceed to Checkout</Link>
              </Button>
              <Button asChild variant="outline" className="w-full h-11 rounded-xl font-bold text-xs border-[#E5E7EB] text-[#111827] hover:bg-white">
                <Link href="/cart" onClick={() => setCartOpen(false)}>View Full Cart</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
