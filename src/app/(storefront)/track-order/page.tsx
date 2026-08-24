import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';
import mongoose from 'mongoose';
import { Package, Truck, CheckCircle2, Clock, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Track Your Order | DCC Corner',
  description: 'Track real-time status of your DCC Corner order with live updates.',
};

export default async function TrackOrderPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const resolvedParams = await searchParams;
  const orderId = resolvedParams.id?.trim();
  let order: any = null;
  let error: string | null = null;

  if (orderId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        error = "Invalid Order ID format. Please check your confirmation message.";
      } else {
        await connectToDatabase();
        order = await Order.findById(orderId)
          .select('orderStatus orderItems shippingAddress totalPrice itemsPrice shippingPrice createdAt paymentMethod isPaid isDelivered')
          .lean();

        if (!order) {
          error = "Order not found. Please verify your Order ID and try again.";
        }
      }
    } catch (e) {
      error = "Something went wrong while retrieving order details.";
    }
  }

  const steps = [
    { status: 'Pending', icon: Clock, label: 'Order Placed', desc: 'Order received & queued' },
    { status: 'Processing', icon: Package, label: 'Packing', desc: 'Items verified & packed' },
    { status: 'Shipped', icon: Truck, label: 'On The Way', desc: 'Out for express delivery' },
    { status: 'Delivered', icon: CheckCircle2, label: 'Delivered', desc: 'Package arrived' }
  ];

  const currentStepIndex = order 
    ? steps.findIndex(s => s.status === order.orderStatus)
    : -1;

  const isCancelled = order?.orderStatus === 'Cancelled';
  const orderItems = order?.orderItems || [];

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl min-h-[70vh]">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#163A32] text-[#D6A84F] border border-[#D6A84F]/30 text-xs font-bold rounded-full mb-3 shadow-2xs">
          <Truck className="w-3.5 h-3.5" /> Live Order Tracking
        </span>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#111827] mb-2 font-heading">
          Track Your Delivery
        </h1>
        <p className="text-sm sm:text-base text-[#4B5563] max-w-md mx-auto">
          Enter your Order ID below to view real-time shipping and delivery status.
        </p>
      </div>

      {/* Search Box */}
      <div className="bg-white p-5 sm:p-7 rounded-3xl shadow-xs border border-[#E5E7EB] mb-8">
        <form className="flex flex-col sm:flex-row gap-3" method="GET" action="/track-order">
          <input
            type="text"
            name="id"
            defaultValue={orderId || ''}
            placeholder="Enter Order ID (e.g. 66f0...)"
            required
            className="flex-1 px-4 py-3.5 rounded-2xl border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#163A32]/20 text-sm font-medium"
          />
          <button 
            type="submit" 
            className="bg-[#163A32] hover:bg-[#0E2620] text-white px-7 py-3.5 rounded-2xl font-black text-sm transition-all shadow-xs hover:shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Track Order</span>
            <ArrowRight className="w-4 h-4 text-[#D6A84F]" />
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 sm:p-5 rounded-2xl text-center mb-8 border border-red-200 text-sm font-semibold">
          {error}
        </div>
      )}

      {order && (
        <div className="space-y-6 sm:space-y-8">
          {/* Status Card & Timeline */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xs border border-[#E5E7EB]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-6 border-b border-[#E5E7EB] mb-6 sm:mb-8">
              <div>
                <span className="text-xs font-bold text-[#6B8F71] uppercase tracking-wider">Status Overview</span>
                <h2 className="text-lg sm:text-xl font-extrabold text-[#111827]">Order #{order._id.toString()}</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#4B5563]">Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
            
            {isCancelled ? (
              <div className="bg-red-50 p-6 rounded-2xl border border-red-200 text-center">
                <p className="text-red-700 font-bold text-base">This order has been cancelled.</p>
                <p className="text-xs text-red-600 mt-1">Please contact DCC Corner support if you have questions.</p>
              </div>
            ) : (
              <div className="py-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-2 relative">
                  {steps.map((step, index) => {
                    const isCompleted = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    const Icon = step.icon;
                    
                    return (
                      <div key={step.status} className="flex flex-col items-center text-center relative z-10 p-3 rounded-2xl bg-[#F7F8F5]">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2.5 transition-all ${
                          isCurrent 
                            ? 'bg-[#163A32] text-[#D6A84F] shadow-md ring-4 ring-[#163A32]/10' 
                            : isCompleted 
                            ? 'bg-[#163A32] text-white' 
                            : 'bg-white text-[#9CA3AF] border border-[#E5E7EB]'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <p className={`font-black text-xs sm:text-sm ${isCurrent ? 'text-[#163A32]' : isCompleted ? 'text-[#111827]' : 'text-[#9CA3AF]'}`}>
                          {step.label}
                        </p>
                        <p className="text-[11px] text-[#6B7280] mt-0.5 hidden sm:block">{step.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Delivery Address & Order Items */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Items Column */}
            <div className="md:col-span-7 bg-white p-6 sm:p-7 rounded-3xl shadow-xs border border-[#E5E7EB]">
              <h3 className="font-extrabold text-base text-[#111827] mb-4">Ordered Items ({orderItems.length})</h3>
              <div className="divide-y divide-[#E5E7EB]">
                {orderItems.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3.5 py-3.5 first:pt-0 last:pb-0">
                    <div className="w-14 h-14 rounded-xl bg-[#F7F8F5] border border-[#E5E7EB] shrink-0 p-1.5 flex items-center justify-center overflow-hidden">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=200'}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-xs sm:text-sm text-[#111827] line-clamp-1">{item.name}</p>
                      <p className="text-xs text-[#6B7280] mt-0.5">Qty: {item.qty || item.quantity || 1}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-xs sm:text-sm text-[#163A32]">৳{((item.price || 0) * (item.qty || item.quantity || 1)).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery & Summary Column */}
            <div className="md:col-span-5 space-y-6">
              {/* Shipping Address */}
              <div className="bg-white p-6 rounded-3xl shadow-xs border border-[#E5E7EB]">
                <h3 className="font-extrabold text-sm text-[#111827] mb-3 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#163A32]" /> Delivery Destination
                </h3>
                <div className="text-xs text-[#4B5563] space-y-1 leading-relaxed bg-[#F7F8F5] p-3.5 rounded-2xl border border-[#E5E7EB]">
                  <p className="font-bold text-[#111827]">{order.shippingAddress?.fullName}</p>
                  <p>{order.shippingAddress?.phone}</p>
                  <p>{order.shippingAddress?.address}</p>
                  <p>{order.shippingAddress?.city}, {order.shippingAddress?.country}</p>
                </div>
              </div>

              {/* Cost Summary */}
              <div className="bg-white p-6 rounded-3xl shadow-xs border border-[#E5E7EB]">
                <h3 className="font-extrabold text-sm text-[#111827] mb-3">Payment & Total</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-[#4B5563]">
                    <span>Items Subtotal</span>
                    <span className="font-bold">৳{(order.itemsPrice || (order.totalPrice - (order.shippingPrice || 0))).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[#4B5563]">
                    <span>Shipping Fee</span>
                    <span className="font-bold">৳{(order.shippingPrice || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-[#163A32] pt-2 border-t border-[#E5E7EB]">
                    <span>Grand Total</span>
                    <span>৳{(order.totalPrice || 0).toLocaleString()}</span>
                  </div>
                  <div className="pt-2 text-[11px] text-[#6B8F71] font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Payment: {order.paymentMethod || 'Cash / bKash on Delivery'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
