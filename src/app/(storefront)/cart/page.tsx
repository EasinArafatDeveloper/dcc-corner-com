"use client";

import Link from "next/link";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, ShieldCheck, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useStore();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 60 : 0; // Bashundhara Express rate
  const total = subtotal + shipping;

  const handleCheckout = () => {
    router.push("/checkout");
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 sm:py-28 flex flex-col items-center justify-center text-center max-w-lg min-h-[60vh]">
        <div className="w-20 h-20 bg-[#163A32]/10 rounded-full flex items-center justify-center mb-6 text-[#163A32]">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#111827] mb-2 font-heading">Your Cart is Empty</h1>
        <p className="text-sm text-[#4B5563] mb-8 leading-relaxed">
          Looks like you haven't added any premium imported snacks or chocolates yet.
        </p>
        <Button asChild className="rounded-2xl bg-[#163A32] hover:bg-[#0E2620] text-white font-black text-sm px-8 py-3.5 shadow-md shadow-[#163A32]/20">
          <Link href="/shop">Explore All Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-6xl min-h-[75vh]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-xs font-bold text-[#6B8F71] uppercase tracking-wider">Review Items</span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#111827] font-heading">Shopping Cart ({cart.length})</h1>
        </div>
        <Link href="/shop" className="text-xs sm:text-sm font-bold text-[#163A32] hover:text-[#6B8F71] transition-colors flex items-center gap-1">
          Continue Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Cart Items List */}
        <div className="flex-1 space-y-4">
          {cart.map((item) => (
            <div key={item._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 bg-white border border-[#E5E7EB] rounded-3xl shadow-xs hover:border-[#6B8F71]/30 transition-all">
              <div className="flex items-center gap-4 min-w-0 flex-1">
                {/* Thumbnail */}
                <div className="w-20 h-20 sm:w-22 sm:h-22 bg-[#F7F8F5] rounded-2xl border border-[#E5E7EB] shrink-0 p-2 flex items-center justify-center overflow-hidden">
                  <img 
                    src={item.image || "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=200"} 
                    alt={item.name} 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=200";
                    }}
                  />
                </div>
                
                {/* Title & Price */}
                <div className="min-w-0 flex-1">
                  <h3 className="font-extrabold text-sm sm:text-base text-[#111827] line-clamp-2 leading-tight">
                    {item.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-black text-[#163A32] mt-1">৳{item.price.toLocaleString()}</p>
                </div>
              </div>

              {/* Quantity Controls & Price */}
              <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E5E7EB]">
                {/* Quantity Controls */}
                <div className="flex items-center border border-[#E5E7EB] rounded-full p-1 bg-[#F7F8F5] h-9">
                  <button 
                    type="button"
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[#163A32] hover:bg-white transition-colors cursor-pointer" 
                    onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-black text-[#111827]">{item.quantity}</span>
                  <button 
                    type="button"
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[#163A32] hover:bg-white transition-colors cursor-pointer" 
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                
                {/* Line Total */}
                <div className="text-right min-w-[70px]">
                  <p className="font-black text-sm sm:text-base text-[#163A32]">৳{(item.price * item.quantity).toLocaleString()}</p>
                </div>
                
                {/* Remove Button */}
                <button 
                  type="button"
                  className="p-2 text-slate-400 hover:text-red-600 transition-colors cursor-pointer rounded-lg hover:bg-red-50" 
                  onClick={() => removeFromCart(item._id)}
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E5E7EB] shadow-xs sticky top-24 space-y-6">
            <h2 className="text-lg font-black text-[#111827] pb-4 border-b border-[#E5E7EB]">Order Summary</h2>
            
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between text-[#4B5563]">
                <span>Items Subtotal</span>
                <span className="font-bold text-[#111827]">৳{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#4B5563]">
                <span>Estimated Delivery (Bashundhara)</span>
                <span className="font-bold text-[#111827]">৳{shipping.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E5E7EB] flex justify-between items-center">
              <div>
                <span className="font-bold text-sm text-[#111827] block">Total Amount</span>
                <span className="text-[11px] text-[#6B7280]">VAT / Tax Included</span>
              </div>
              <span className="font-black text-2xl text-[#163A32]">৳{total.toLocaleString()}</span>
            </div>

            <Button 
              size="lg" 
              className="w-full rounded-2xl h-12 bg-[#163A32] hover:bg-[#0E2620] text-white font-black text-sm shadow-md shadow-[#163A32]/20 cursor-pointer flex items-center justify-center gap-2" 
              onClick={handleCheckout}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 text-[#D6A84F]" />
            </Button>
            
            <div className="pt-2 text-[11px] text-[#6B8F71] font-bold flex items-center justify-center gap-1.5">
              <Truck className="w-3.5 h-3.5" />
              <span>Under 2-Hour Express Delivery in Bashundhara</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
