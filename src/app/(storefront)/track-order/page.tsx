import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';
import mongoose from 'mongoose';
import { Package, Truck, CheckCircle2, Clock } from 'lucide-react';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Track Your Order',
  description: 'Track the status of your DCC Corner order using your Order ID.',
};

export default async function TrackOrderPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const resolvedParams = await searchParams;
  const orderId = resolvedParams.id;
  let order = null;
  let error = null;

  if (orderId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        error = "Invalid Order ID format.";
      } else {
        await connectToDatabase();
        // Fetch order but only select safe fields for public tracking
        order = await Order.findById(orderId)
          .select('orderStatus items totalPrice shippingPrice createdAt paymentMethod isPaid isDelivered')
          .populate({
            path: 'items.product',
            select: 'name images price'
          })
          .lean();

        if (!order) {
          error = "Order not found. Please check your Order ID.";
        }
      }
    } catch (e) {
      error = "Something went wrong while tracking the order.";
    }
  }

  const steps = [
    { status: 'Pending', icon: Clock, label: 'Order Placed' },
    { status: 'Processing', icon: Package, label: 'Processing' },
    { status: 'Shipped', icon: Truck, label: 'Shipped' },
    { status: 'Delivered', icon: CheckCircle2, label: 'Delivered' }
  ];

  const currentStepIndex = order 
    ? steps.findIndex(s => s.status === order.orderStatus)
    : -1;

  // Handle Cancelled separately
  const isCancelled = order?.orderStatus === 'Cancelled';

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-3">Track Your Order</h1>
        <p className="text-muted-foreground">Enter your Order ID to see real-time updates on your package.</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border mb-8">
        <form className="flex flex-col sm:flex-row gap-4" method="GET" action="/track-order">
          <input
            type="text"
            name="id"
            defaultValue={orderId || ''}
            placeholder="e.g. 64a7b8f9..."
            required
            className="flex-1 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button type="submit" className="bg-primary text-white px-8 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors">
            Track Order
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center mb-8 border border-red-100">
          {error}
        </div>
      )}

      {order && (
        <div className="space-y-8">
          {/* Status Timeline */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-semibold">Order Status</h2>
              <span className="text-sm text-muted-foreground font-mono">ID: {order._id.toString()}</span>
            </div>
            
            {isCancelled ? (
              <div className="bg-red-50 p-6 rounded-xl border border-red-100 text-center">
                <p className="text-red-700 font-medium text-lg">This order has been cancelled.</p>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 rounded-full hidden sm:block"></div>
                <div 
                  className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 rounded-full hidden sm:block transition-all duration-500" 
                  style={{ width: `${Math.max(0, (currentStepIndex / (steps.length - 1)) * 100)}%` }}
                ></div>
                
                <div className="flex flex-col sm:flex-row justify-between relative gap-6 sm:gap-0">
                  {steps.map((step, index) => {
                    const isCompleted = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    const Icon = step.icon;
                    
                    return (
                      <div key={step.status} className="flex sm:flex-col items-center gap-4 sm:gap-3 relative z-10">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shrink-0 transition-colors duration-300 ${isCompleted ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="sm:text-center">
                          <p className={`font-semibold ${isCurrent ? 'text-primary' : isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                            {step.label}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Order Details */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border">
            <h2 className="text-lg font-semibold mb-6">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center gap-4 py-4 border-b last:border-0 last:pb-0">
                  <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden relative shrink-0">
                    <Image
                      src={item.product?.images?.[0] || 'https://via.placeholder.com/150'}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 line-clamp-1">{item.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary font-mono">৳{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Amount:</span>
                <span className="text-primary font-mono">৳{order.totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-muted-foreground mt-2">
                <span>Payment Method:</span>
                <span>{order.paymentMethod}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
