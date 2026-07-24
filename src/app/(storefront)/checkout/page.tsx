"use client";

import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

export default function CheckoutPage() {
  const { cart, clearCart } = useStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
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
  const tax = subtotal * 0.05;
  const shipping = subtotal > 100 ? 0 : 15;
  const total = subtotal + tax + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderItems: cart,
          shippingAddress: formData,
          paymentMethod: "Cash on Delivery",
          itemsPrice: subtotal,
          taxPrice: tax,
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
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
        <CheckCircle2 className="w-24 h-24 text-green-500 mb-6" />
        <h1 className="text-4xl font-bold mb-4">Thank You For Your Order!</h1>
        <p className="text-muted-foreground mb-8 max-w-lg">Your premium imported snacks are being prepared for shipment. You will receive an email confirmation shortly.</p>
        <Button size="lg" onClick={() => router.push("/")} className="rounded-full px-8">Return to Home</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 tracking-tight">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Shipping Form */}
        <div className="flex-1">
          <div className="bg-background border border-border rounded-3xl p-8 shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">Shipping Information</h2>
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input id="fullName" name="fullName" required onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" name="email" type="email" required onChange={handleInputChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" name="phone" type="tel" required onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Street Address *</Label>
                <Input id="address" name="address" required onChange={handleInputChange} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input id="city" name="city" required onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" name="country" value="Bangladesh" disabled />
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="bg-muted/30 p-6 rounded-3xl border border-border sticky top-24">
            <h2 className="text-xl font-bold mb-6">Your Order</h2>
            
            <div className="space-y-4 mb-6 border-b border-border pb-6">
              {cart.map(item => (
                <div key={item._id} className="flex justify-between items-center text-sm">
                  <div className="flex-1 pr-4">
                    <p className="font-medium line-clamp-1">{item.name}</p>
                    <p className="text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4 text-sm mb-6 border-b border-border pb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Tax (5%)</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-lg">Total</span>
              <span className="font-extrabold text-2xl text-primary">${total.toFixed(2)}</span>
            </div>
            
            <div className="space-y-3 mb-8">
              <p className="text-sm font-semibold text-primary mb-2">Select Payment Method</p>
              
              <label className="flex items-center justify-between p-4 border border-primary bg-primary/5 rounded-xl cursor-pointer">
                <div className="flex items-center gap-3">
                  <input type="radio" name="paymentMethod" value="Cash on Delivery" defaultChecked className="w-4 h-4 text-primary focus:ring-primary" />
                  <div>
                    <p className="text-sm font-semibold text-primary">Cash on Delivery</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Pay when you receive the order</p>
                  </div>
                </div>
              </label>

              <label className="flex items-center justify-between p-4 border border-border bg-muted/50 rounded-xl cursor-not-allowed opacity-60">
                <div className="flex items-center gap-3">
                  <input type="radio" name="paymentMethod" value="SSLCommerz" disabled className="w-4 h-4" />
                  <div>
                    <p className="text-sm font-semibold text-slate-700">SSLCommerz (Card / Mobile Banking)</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Coming soon!</p>
                  </div>
                </div>
              </label>
            </div>

            <Button type="submit" form="checkout-form" size="lg" className="w-full rounded-full h-14 text-lg font-bold shadow-xl shadow-primary/20" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Place Order Now"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
