"use client";

import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, Truck, Zap, ShieldCheck } from "lucide-react";

export default function CheckoutPage() {
  const { cart, clearCart } = useStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [deliveryType, setDeliveryType] = useState<"bashundhara_express" | "standard">("bashundhara_express");

  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    bashundharaBlock: "Block C",
    roadNo: "",
    houseNo: "",
    fullAddress: "",
    city: "Dhaka",
    country: "Bangladesh",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (cart.length === 0 && !isSuccess) {
    router.push("/cart");
    return null;
  }

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = deliveryType === "bashundhara_express" ? 60 : 100;
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const combinedAddress = deliveryType === "bashundhara_express"
      ? `Bashundhara R/A, ${formData.bashundharaBlock}, Road ${formData.roadNo}, House ${formData.houseNo}. Notes: ${formData.fullAddress}`
      : formData.fullAddress;

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderItems: cart,
          shippingAddress: {
            fullName: formData.fullName,
            email: formData.email || "guest@dcccorner.com",
            phone: formData.phone,
            address: combinedAddress,
            city: formData.city,
            country: formData.country,
          },
          paymentMethod: "Cash / bKash on Delivery",
          itemsPrice: subtotal,
          taxPrice: 0,
          shippingPrice: shipping,
          totalPrice: total,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to place order");
      }

      const orderData = await res.json();
      setCreatedOrderId(orderData._id);
      clearCart();
      setIsSuccess(true);
      toast.success("Order placed successfully!");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-16 sm:py-24 flex flex-col items-center justify-center text-center max-w-lg min-h-[70vh]">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 text-[#163A32] ring-8 ring-emerald-50/50">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <span className="text-xs font-bold text-[#6B8F71] uppercase tracking-wider mb-1">Order Confirmed</span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#111827] mb-2 font-heading">Order Received!</h1>
        {createdOrderId && (
          <div className="bg-[#F7F8F5] border border-[#E5E7EB] rounded-2xl px-4 py-2 mb-4">
            <span className="text-xs text-[#4B5563]">Order ID: </span>
            <span className="font-mono font-bold text-xs text-[#163A32]">{createdOrderId}</span>
          </div>
        )}
        <p className="text-sm text-[#4B5563] mb-8 leading-relaxed">
          Thank you for shopping at DCC Corner. Your imported items are being packed and prepared for express delivery.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {createdOrderId && (
            <Button size="lg" onClick={() => router.push(`/track-order?id=${createdOrderId}`)} className="rounded-2xl bg-[#163A32] hover:bg-[#0E2620] text-white font-black text-sm px-6 py-3.5 shadow-md shadow-[#163A32]/20 cursor-pointer">
              Track Delivery 📦
            </Button>
          )}
          <Button size="lg" variant="outline" onClick={() => router.push("/")} className="rounded-2xl border-[#E5E7EB] font-bold text-sm px-6 py-3.5 cursor-pointer">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-xs font-bold text-[#6B8F71] uppercase tracking-wider">Fast & Easy Checkout</span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#111827]">Complete Your Order</h1>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#4B5563]">
          <ShieldCheck className="w-4 h-4 text-[#6B8F71]" />
          <span>No Registration Required</span>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Shipping & Delivery Form */}
        <div className="flex-1 space-y-6">
          
          {/* Delivery Logic Toggle */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs">
            <h2 className="text-lg font-extrabold text-[#111827] mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#163A32]" /> Delivery Location & Express Options
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setDeliveryType("bashundhara_express")}
                className={`p-4 rounded-xl border text-left transition-all relative ${
                  deliveryType === "bashundhara_express"
                    ? "border-[#163A32] bg-[#163A32]/5 ring-1 ring-[#163A32]"
                    : "border-[#E5E7EB] hover:border-[#6B8F71]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-sm text-[#163A32] flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-[#D6A84F] fill-[#D6A84F]" /> Bashundhara Express
                  </span>
                  <span className="text-xs font-black text-[#163A32]">৳60</span>
                </div>
                <p className="text-xs text-[#4B5563]">Fastest delivery across Block A to N (Under 2 hrs)</p>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryType("standard")}
                className={`p-4 rounded-xl border text-left transition-all relative ${
                  deliveryType === "standard"
                    ? "border-[#163A32] bg-[#163A32]/5 ring-1 ring-[#163A32]"
                    : "border-[#E5E7EB] hover:border-[#6B8F71]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-[#111827]">Outside Bashundhara</span>
                  <span className="text-xs font-bold text-[#111827]">৳100</span>
                </div>
                <p className="text-xs text-[#4B5563]">Standard delivery across Dhaka city</p>
              </button>
            </div>
          </div>

          {/* Guest Contact Details */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs">
            <h2 className="text-lg font-extrabold text-[#111827] mb-4">Customer Contact Information</h2>
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className="text-xs font-bold text-[#111827]">Full Name *</Label>
                  <Input id="fullName" name="fullName" required onChange={handleInputChange} placeholder="e.g. Tanvir Ahmed" className="rounded-xl border-[#E5E7EB] focus:ring-[#163A32]" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-bold text-[#111827]">Mobile Phone Number *</Label>
                  <Input id="phone" name="phone" type="tel" required onChange={handleInputChange} placeholder="017XXXXXXXX" className="rounded-xl border-[#E5E7EB] focus:ring-[#163A32]" />
                </div>
              </div>

              {deliveryType === "bashundhara_express" ? (
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="bashundharaBlock" className="text-xs font-bold text-[#111827]">Block *</Label>
                    <select
                      id="bashundharaBlock"
                      name="bashundharaBlock"
                      onChange={handleInputChange}
                      className="w-full h-9 rounded-xl border border-[#E5E7EB] bg-white px-3 text-xs font-semibold text-[#111827] focus:outline-none focus:ring-1 focus:ring-[#163A32]"
                    >
                      {["Block A", "Block B", "Block C", "Block D", "Block E", "Block F", "Block G", "Block H", "Block I", "Block J", "Block K", "Block L", "Block M", "Block N"].map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="roadNo" className="text-xs font-bold text-[#111827]">Road No. *</Label>
                    <Input id="roadNo" name="roadNo" required onChange={handleInputChange} placeholder="e.g. 5" className="rounded-xl border-[#E5E7EB] focus:ring-[#163A32]" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="houseNo" className="text-xs font-bold text-[#111827]">House/Apt *</Label>
                    <Input id="houseNo" name="houseNo" required onChange={handleInputChange} placeholder="e.g. 12/A" className="rounded-xl border-[#E5E7EB] focus:ring-[#163A32]" />
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5 pt-2">
                  <Label htmlFor="fullAddress" className="text-xs font-bold text-[#111827]">Full Delivery Address *</Label>
                  <Input id="fullAddress" name="fullAddress" required onChange={handleInputChange} placeholder="House, Road, Sector/Area, City" className="rounded-xl border-[#E5E7EB] focus:ring-[#163A32]" />
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Order Summary & Payment */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm sticky top-24">
            <h2 className="text-lg font-extrabold text-[#111827] mb-4 font-heading flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-xs font-black bg-[#163A32] text-white px-2 py-0.5 rounded-full">
                {cart.reduce((sum, item) => sum + item.quantity, 0)} {cart.reduce((sum, item) => sum + item.quantity, 0) === 1 ? 'item' : 'items'}
              </span>
            </h2>
            
            {/* Products List with Images */}
            <div className="space-y-3 mb-4 border-b border-[#E5E7EB] pb-4 max-h-64 overflow-y-auto pr-1 divide-y divide-slate-100">
              {cart.map((item) => (
                <div key={item._id} className="flex items-center gap-3 pt-3 first:pt-0">
                  {/* Product Image Thumbnail */}
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 bg-[#F7F8F5] border border-[#E5E7EB] rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-1">
                    <img 
                      src={item.image || "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=200&auto=format&fit=crop"} 
                      alt={item.name} 
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=200&auto=format&fit=crop";
                      }}
                    />
                    <span className="absolute -top-1 -right-1 bg-[#163A32] text-white text-[9.5px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-2xs">
                      {item.quantity}
                    </span>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-[#111827] line-clamp-2 leading-tight">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-[#6B7280] mt-0.5 font-medium">
                      ৳{item.price.toLocaleString()} × {item.quantity}
                    </p>
                  </div>

                  {/* Total Price */}
                  <div className="text-right shrink-0">
                    <span className="font-black text-xs sm:text-sm text-[#163A32] font-heading">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2 text-xs mb-4 border-b border-[#E5E7EB] pb-4">
              <div className="flex justify-between text-[#4B5563]">
                <span>Subtotal</span>
                <span className="font-bold text-[#111827]">৳{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#4B5563]">
                <span>Delivery Charge</span>
                <span className="font-bold text-[#111827]">৳{shipping.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="font-extrabold text-base text-[#111827]">Total Amount</span>
              <span className="font-black text-2xl text-[#163A32] font-heading">৳{total.toLocaleString()}</span>
            </div>
            
            <div className="space-y-2 mb-6">
              <p className="text-xs font-bold text-[#163A32]">Payment Method</p>
              <div className="p-3 border border-[#163A32] bg-[#163A32]/5 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#163A32]">Cash / bKash on Delivery</p>
                  <p className="text-[10px] text-[#4B5563]">Pay when package reaches your door</p>
                </div>
                <span className="text-xs font-black text-[#163A32] bg-[#163A32]/10 px-2 py-0.5 rounded-md">COD</span>
              </div>
            </div>

            <Button type="submit" form="checkout-form" size="lg" className="w-full rounded-xl h-12 text-sm font-bold bg-[#163A32] hover:bg-[#0E2620] text-white shadow-md shadow-[#163A32]/20 cursor-pointer" disabled={isSubmitting}>
              {isSubmitting ? "Placing Order..." : "Confirm & Place Order"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

