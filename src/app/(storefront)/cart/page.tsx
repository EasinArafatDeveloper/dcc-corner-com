"use client";

import Link from "next/link";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.05; // 5% mock tax
  const shipping = subtotal > 100 ? 0 : 15; // Free shipping over 100
  const total = subtotal + tax + shipping;

  const router = useRouter();

  const handleCheckout = () => {
    router.push("/checkout");
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8 max-w-md">Looks like you haven't added any premium snacks to your cart yet.</p>
        <Button size="lg" asChild className="rounded-full">
          <Link href="/shop">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 tracking-tight">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items List */}
        <div className="flex-1 space-y-6">
          {cart.map((item) => (
            <div key={item._id} className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-background border border-border rounded-2xl shadow-sm">
              <div className="w-24 h-24 bg-muted rounded-xl flex-shrink-0 flex items-center justify-center">
                <span className="text-[10px] text-muted-foreground">Image</span>
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-semibold text-lg line-clamp-1">{item.name}</h3>
                <p className="text-primary font-bold mt-1">৳{item.price.toFixed(2)}</p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-border rounded-full p-1 bg-background h-10 w-28">
                  <Button variant="ghost" size="icon" className="h-full rounded-full w-8" onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}>
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="flex-1 text-center text-sm font-medium">{item.quantity}</span>
                  <Button variant="ghost" size="icon" className="h-full rounded-full w-8" onClick={() => updateQuantity(item._id, item.quantity + 1)}>
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
                
                <p className="font-bold w-20 text-right">৳{(item.price * item.quantity).toFixed(2)}</p>
                
                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0" onClick={() => removeFromCart(item._id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="bg-muted/30 p-6 rounded-3xl border border-border sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-4 text-sm mb-6 border-b border-border pb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">৳{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">{shipping === 0 ? "Free" : `৳${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Tax (5%)</span>
                <span className="font-medium">৳{tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-8">
              <span className="font-bold text-lg">Total</span>
              <span className="font-extrabold text-2xl text-primary">৳{total.toFixed(2)}</span>
            </div>

            <Button size="lg" className="w-full rounded-full h-12 text-base" onClick={handleCheckout}>
              Proceed to Checkout <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <div className="mt-4 text-center">
              <Link href="/shop" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
