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
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        <div className="p-4 bg-[#163A32]/10 rounded-full mb-6 text-[#163A32]">
          <CheckCircle2 className="w-16 h-16 text-[#163A32]" />
        </div>
        <h1 className="text-3xl font-black text-[#111827] mb-3">Order Received Successfully!</h1>
        <p className="text-[#4B5563] mb-6 max-w-md text-sm">
          Thank you for shopping at DCC Corner. Your imported items will be delivered swiftly to your Bashundhara R/A address.
        </p>
        <Button size="lg" onClick={() => router.push("/")} className="rounded-xl px-8 bg-[#163A32] hover:bg-[#0E2620] text-white font-bold shadow-md shadow-[#163A32]/20">
          Back to Shopping
        </Button>
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
            <h2 className="text-lg font-extrabold text-[#111827] mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-4 border-b border-[#E5E7EB] pb-4 max-h-48 overflow-y-auto pr-1">
              {cart.map(item => (
                <div key={item._id} className="flex justify-between items-center text-xs">
                  <div className="flex-1 pr-3">
                    <p className="font-bold text-[#111827] line-clamp-1">{item.name}</p>
                    <p className="text-[#4B5563]">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-bold text-[#163A32]">৳{(item.price * item.quantity).toFixed(0)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs mb-4 border-b border-[#E5E7EB] pb-4">
              <div className="flex justify-between text-[#4B5563]">
                <span>Subtotal</span>
                <span className="font-bold text-[#111827]">৳{subtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-[#4B5563]">
                <span>Delivery Charge</span>
                <span className="font-bold text-[#111827]">৳{shipping.toFixed(0)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="font-extrabold text-base text-[#111827]">Total Amount</span>
              <span className="font-black text-2xl text-[#163A32]">৳{total.toFixed(0)}</span>
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

            <Button type="submit" form="checkout-form" size="lg" className="w-full rounded-xl h-12 text-sm font-bold bg-[#163A32] hover:bg-[#0E2620] text-white shadow-md shadow-[#163A32]/20" disabled={isSubmitting}>
              {isSubmitting ? "Placing Order..." : "Confirm & Place Order"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

