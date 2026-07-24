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
        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/20">
          <h2 className="text-xl font-bold flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2" /> Your Cart
            <span className="ml-2 text-sm font-medium bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center">
              {cart.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          </h2>
          <Button variant="ghost" size="icon" onClick={() => setCartOpen(false)} className="rounded-full hover:bg-muted">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
              <ShoppingCart className="w-16 h-16 opacity-20" />
              <p className="font-medium">Your cart is completely empty.</p>
              <Button variant="outline" onClick={() => setCartOpen(false)}>Continue Shopping</Button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item._id} className="flex gap-4 p-4 border border-border/50 rounded-2xl bg-muted/10 relative group">
                <div className="w-20 h-20 bg-muted/30 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold text-sm line-clamp-2 leading-tight pr-6">{item.name}</h4>
                    <p className="text-primary font-bold mt-1">৳{item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-border rounded-full bg-background">
                      <button 
                        className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground"
                        onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button 
                        className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground"
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => removeFromCart(item._id)}
                  className="absolute top-4 right-4 text-muted-foreground hover:text-destructive opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-border bg-muted/20">
            <div className="flex justify-between items-center mb-6">
              <span className="font-medium text-muted-foreground">Subtotal</span>
              <span className="text-2xl font-bold text-primary">৳{subtotal.toFixed(2)}</span>
            </div>
            <div className="space-y-3">
              <Button asChild className="w-full h-12 rounded-full font-bold text-base shadow-lg shadow-primary/20">
                <Link href="/checkout" onClick={() => setCartOpen(false)}>Checkout Now</Link>
              </Button>
              <Button asChild variant="outline" className="w-full h-12 rounded-full font-medium">
                <Link href="/cart" onClick={() => setCartOpen(false)}>View Full Cart</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
