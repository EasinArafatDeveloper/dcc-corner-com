"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Package, Heart, User, LogOut, Truck, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, wishlist } = useStore();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "wishlist">("orders");
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    setMounted(true);
    if (!user) {
      router.push("/login");
    } else {
      fetchUserOrders();
    }
  }, [user, router]);

  const fetchUserOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await axios.get("/api/orders/user");
      if (res.data?.orders) {
        setOrders(res.data.orders);
      }
    } catch (error) {
      console.error("Failed to load orders", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      logout();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  if (!mounted || !user) return null;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-6xl min-h-[75vh]">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0 bg-white rounded-3xl p-5 border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center gap-3 pb-5 border-b border-[#E5E7EB] mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#163A32] text-[#D6A84F] flex items-center justify-center font-black text-lg shadow-xs">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-sm text-[#111827] truncate">{user.name}</h2>
              <p className="text-xs text-[#6B7280] truncate">{user.phone || user.email}</p>
            </div>
          </div>

          <nav className="space-y-1.5">
            <button 
              type="button"
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "orders" 
                  ? "bg-[#163A32] text-white shadow-xs" 
                  : "text-[#4B5563] hover:bg-[#F7F8F5] hover:text-[#111827]"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Package className="w-4 h-4" /> My Orders
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20 font-black">{orders.length}</span>
            </button>

            <button 
              type="button"
              onClick={() => setActiveTab("wishlist")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "wishlist" 
                  ? "bg-[#163A32] text-white shadow-xs" 
                  : "text-[#4B5563] hover:bg-[#F7F8F5] hover:text-[#111827]"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Heart className="w-4 h-4" /> Wishlist
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20 font-black">{wishlist.length}</span>
            </button>

            <button 
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "profile" 
                  ? "bg-[#163A32] text-white shadow-xs" 
                  : "text-[#4B5563] hover:bg-[#F7F8F5] hover:text-[#111827]"
              }`}
            >
              <User className="w-4 h-4" /> Profile Info
            </button>

            <button 
              type="button" 
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-red-600 hover:bg-red-50 transition-all cursor-pointer mt-4"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 space-y-6 w-full">
          
          {/* Header Title */}
          <div>
            <span className="text-xs font-bold text-[#6B8F71] uppercase tracking-wider">Account Dashboard</span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#111827] font-heading">
              Hello, {user.name} 👋
            </h1>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-[#E5E7EB] shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#6B7280]">Total Orders</span>
                <div className="p-2 rounded-xl bg-[#163A32]/10 text-[#163A32]">
                  <Package className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-[#163A32]">{orders.length}</p>
              <p className="text-[11px] text-[#6B7280] mt-0.5">Purchases placed with this account</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E5E7EB] shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#6B7280]">Saved Wishlist</span>
                <div className="p-2 rounded-xl bg-[#D6A84F]/15 text-[#D6A84F]">
                  <Heart className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-[#163A32]">{wishlist.length}</p>
              <p className="text-[11px] text-[#6B7280] mt-0.5">Products saved for quick checkout</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E5E7EB] shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#6B7280]">Delivery Area</span>
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                  <Truck className="w-4 h-4" />
                </div>
              </div>
              <p className="text-base font-black text-[#163A32] truncate">Bashundhara R/A</p>
              <p className="text-[11px] text-[#6B7280] mt-0.5">2-Hour Express Delivery active</p>
            </div>
          </div>

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="bg-white rounded-3xl p-6 border border-[#E5E7EB] shadow-xs space-y-4">
              <h2 className="text-lg font-black text-[#111827] pb-3 border-b border-[#E5E7EB]">Order History</h2>
              
              {loadingOrders ? (
                <div className="py-12 text-center text-xs text-[#6B7280]">Loading your order records...</div>
              ) : orders.length === 0 ? (
                <div className="py-12 text-center">
                  <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="font-bold text-sm text-[#111827]">No orders yet</p>
                  <p className="text-xs text-[#6B7280] mt-1 mb-4">Start browsing our imported snacks & confectionery.</p>
                  <Button asChild className="rounded-2xl bg-[#163A32] text-white font-bold text-xs">
                    <Link href="/shop">Explore Shop</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {orders.map((order) => (
                    <div key={order._id} className="p-4 sm:p-5 rounded-2xl border border-[#E5E7EB] bg-[#F7F8F5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono font-bold text-xs text-[#163A32]">Order #{order._id.toString().slice(-8).toUpperCase()}</span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            order.orderStatus === 'Delivered' 
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.orderStatus === 'Shipped'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {order.orderStatus || 'Pending'}
                          </span>
                        </div>
                        <p className="text-xs text-[#6B7280]">
                          Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} • {order.orderItems?.length || 0} items
                        </p>
                        <p className="font-black text-sm text-[#163A32] mt-1">৳{(order.totalPrice || 0).toLocaleString()}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button size="sm" asChild className="rounded-xl bg-[#163A32] hover:bg-[#0E2620] text-white font-bold text-xs h-8 px-4">
                          <Link href={`/track-order?id=${order._id}`}>Track Package</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === "wishlist" && (
            <div className="bg-white rounded-3xl p-6 border border-[#E5E7EB] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
                <h2 className="text-lg font-black text-[#111827]">Saved Wishlist ({wishlist.length})</h2>
                <Link href="/wishlist" className="text-xs font-bold text-[#163A32] hover:text-[#6B8F71]">
                  View Full Wishlist →
                </Link>
              </div>

              {wishlist.length === 0 ? (
                <div className="py-12 text-center">
                  <Heart className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="font-bold text-sm text-[#111827]">Your wishlist is empty</p>
                  <p className="text-xs text-[#6B7280] mt-1 mb-4">Click the heart icon on any product to save it here.</p>
                  <Button asChild className="rounded-2xl bg-[#163A32] text-white font-bold text-xs">
                    <Link href="/shop">Browse Items</Link>
                  </Button>
                </div>
              ) : (
                <div className="p-6 rounded-2xl border border-[#E5E7EB] bg-[#F7F8F5] text-center">
                  <Heart className="w-10 h-10 text-[#D6A84F] mx-auto mb-2 fill-[#D6A84F]" />
                  <p className="font-bold text-base text-[#111827]">You have {wishlist.length} item{wishlist.length > 1 ? 's' : ''} in your wishlist</p>
                  <p className="text-xs text-[#6B7280] mt-1 mb-4">View your saved items, check availability, and add them directly to your cart.</p>
                  <Button asChild className="rounded-2xl bg-[#163A32] hover:bg-[#0E2620] text-white font-black text-xs px-6">
                    <Link href="/wishlist">Go to My Wishlist</Link>
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-3xl p-6 border border-[#E5E7EB] shadow-xs space-y-4">
              <h2 className="text-lg font-black text-[#111827] pb-3 border-b border-[#E5E7EB]">Personal Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#F7F8F5] p-4 rounded-2xl border border-[#E5E7EB]">
                  <span className="text-xs font-bold text-[#6B7280]">Full Name</span>
                  <p className="font-extrabold text-sm text-[#111827] mt-0.5">{user.name}</p>
                </div>
                <div className="bg-[#F7F8F5] p-4 rounded-2xl border border-[#E5E7EB]">
                  <span className="text-xs font-bold text-[#6B7280]">Phone / Contact</span>
                  <p className="font-extrabold text-sm text-[#111827] mt-0.5">{user.phone || "Not specified"}</p>
                </div>
                <div className="bg-[#F7F8F5] p-4 rounded-2xl border border-[#E5E7EB]">
                  <span className="text-xs font-bold text-[#6B7280]">Email Address</span>
                  <p className="font-extrabold text-sm text-[#111827] mt-0.5">{user.email}</p>
                </div>
                <div className="bg-[#F7F8F5] p-4 rounded-2xl border border-[#E5E7EB]">
                  <span className="text-xs font-bold text-[#6B7280]">Account Role</span>
                  <p className="font-extrabold text-sm text-[#163A32] mt-0.5">{user.role}</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
