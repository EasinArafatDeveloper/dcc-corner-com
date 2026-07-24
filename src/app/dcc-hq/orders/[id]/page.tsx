import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';
import User from '@/models/User'; // Ensure User model is loaded
import Link from 'next/link';
import { ArrowLeft, MapPin, CreditCard, User as UserIcon, Calendar, Package, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { notFound } from 'next/navigation';
import { OrderStatusUpdater } from '@/components/admin/OrderStatusUpdater';

export const dynamic = 'force-dynamic';

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  // Ensure the User model is registered
  const userModel = User;

  const order = await Order.findById(id).populate('user', 'name email').lean();

  if (!order) {
    notFound();
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Shipped': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon" className="rounded-full">
            <Link href="/dcc-hq/orders">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">Order Details</h1>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.orderStatus)}`}>
                {order.orderStatus}
              </span>
            </div>
            <p className="text-muted-foreground text-sm font-mono mt-1">ID: {order._id.toString()}</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Button asChild variant="outline" className="border-slate-300">
            <Link href={`/dcc-hq/orders/${order._id}/invoice`} target="_blank">
              <Printer className="w-4 h-4 mr-2" />
              Download Invoice
            </Link>
          </Button>

          <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border">
            <span className="text-sm font-medium text-slate-600 pl-1 hidden md:inline">Update Status:</span>
            <OrderStatusUpdater orderId={order._id.toString()} currentStatus={order.orderStatus} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Order Items & Summary */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Order Items */}
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="p-4 border-b bg-slate-50/50 flex items-center gap-2">
              <Package className="w-5 h-5 text-slate-500" />
              <h2 className="font-semibold text-lg text-slate-800">Order Items</h2>
            </div>
            <div className="divide-y">
              {order.orderItems.map((item: any, index: number) => (
                <div key={index} className="p-4 flex items-center gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="w-16 h-16 rounded-lg bg-muted/30 overflow-hidden shrink-0 border">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-slate-900 truncate">{item.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      ৳{item.price.toFixed(2)} × {item.qty}
                    </p>
                  </div>
                  <div className="text-right font-medium">
                    ৳{(item.price * item.qty).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
             <div className="p-4 border-b bg-slate-50/50">
              <h2 className="font-semibold text-lg text-slate-800">Financial Summary</h2>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">৳{order.itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">৳{order.shippingPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium">৳{order.taxPrice.toFixed(2)}</span>
              </div>
              <div className="pt-3 border-t mt-3 flex justify-between">
                <span className="font-semibold text-lg">Total</span>
                <span className="font-bold text-lg text-primary">৳{order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Customer Info, Shipping, Payment */}
        <div className="space-y-6">
          
          {/* Customer Info */}
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="p-4 border-b bg-slate-50/50 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-slate-500" />
              <h2 className="font-semibold text-slate-800">Customer Details</h2>
            </div>
            <div className="p-4 space-y-3 text-sm">
              <div>
                <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">Name</span>
                <span className="font-medium">{order.shippingAddress?.fullName || order.user?.name || 'Guest'}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">Email</span>
                <span className="font-medium">{order.user?.email || 'No email provided'}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">Phone</span>
                <span className="font-medium">{order.shippingAddress?.phone}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="p-4 border-b bg-slate-50/50 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-slate-500" />
              <h2 className="font-semibold text-slate-800">Shipping Address</h2>
            </div>
            <div className="p-4 text-sm leading-relaxed text-slate-700">
              {order.shippingAddress?.address}<br />
              {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}<br />
              {order.shippingAddress?.country}
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="p-4 border-b bg-slate-50/50 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-slate-500" />
              <h2 className="font-semibold text-slate-800">Payment & Date</h2>
            </div>
            <div className="p-4 space-y-4 text-sm">
              <div>
                <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">Method</span>
                <span className="font-medium uppercase bg-slate-100 px-2 py-1 rounded text-xs">{order.paymentMethod}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">Payment Status</span>
                {order.isPaid ? (
                  <div className="flex flex-col">
                    <span className="text-green-600 font-medium">Paid</span>
                    <span className="text-xs text-muted-foreground mt-0.5">at {new Date(order.paidAt).toLocaleString()}</span>
                  </div>
                ) : (
                  <span className="text-red-500 font-medium">Unpaid</span>
                )}
              </div>
              
              <div className="pt-3 border-t">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-muted-foreground text-xs uppercase tracking-wider">Order Date</span>
                </div>
                <span className="font-medium">{new Date(order.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
