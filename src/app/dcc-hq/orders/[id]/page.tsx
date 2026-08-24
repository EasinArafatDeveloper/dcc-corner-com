import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';
import User from '@/models/User';
import Product from '@/models/Product';
import Link from 'next/link';
import { ArrowLeft, MapPin, CreditCard, User as UserIcon, Calendar, Package, Printer, Phone, Mail, FileText, CheckCircle2, Clock, Truck, XCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CopyableId } from '@/components/admin/CopyableId';
import { notFound } from 'next/navigation';
import { OrderStatusUpdater } from '@/components/admin/OrderStatusUpdater';

export const dynamic = 'force-dynamic';

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  const _userModel = User;
  const _productModel = Product;

  const order = await Order.findById(id)
    .populate('user', 'name email')
    .populate('orderItems.product', 'name sku slug brand')
    .lean();

  if (!order) {
    notFound();
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending': 
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/80"><Clock className="w-3.5 h-3.5" /> Pending</span>;
      case 'Processing': 
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/80"><Sparkles className="w-3.5 h-3.5" /> Processing</span>;
      case 'Shipped': 
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80"><Truck className="w-3.5 h-3.5" /> Shipped</span>;
      case 'Delivered': 
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80"><CheckCircle2 className="w-3.5 h-3.5" /> Delivered</span>;
      case 'Cancelled': 
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200/80"><XCircle className="w-3.5 h-3.5" /> Cancelled</span>;
      default: 
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">{status}</span>;
    }
  };

  const customerName = order.shippingAddress?.fullName || order.user?.name || 'Customer';
  const customerEmail = order.user?.email || order.shippingAddress?.email || 'N/A';
  const customerPhone = order.shippingAddress?.phone || 'N/A';

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-xs border border-[#E5E7EB]">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="icon" className="rounded-2xl border-[#E5E7EB] hover:bg-[#F7F8F5]">
            <Link href="/dcc-hq/orders">
              <ArrowLeft className="w-5 h-5 text-[#163A32]" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-black text-[#111827] font-heading">Order Details</h1>
              {getStatusBadge(order.orderStatus)}
            </div>
            <div className="mt-1.5 flex items-center gap-2">
              <CopyableId id={order._id.toString()} />
              <span className="text-xs text-[#6B7280]">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} at {new Date(order.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Button asChild className="rounded-xl bg-[#163A32] hover:bg-[#0E2620] text-white font-bold text-xs shadow-md shadow-[#163A32]/20 cursor-pointer">
            <Link href={`/dcc-hq/orders/${order._id}/invoice`} target="_blank">
              <Printer className="w-4 h-4 mr-1.5 text-[#D6A84F]" />
              Print / Save PDF Invoice
            </Link>
          </Button>

          <div className="flex items-center gap-2.5 bg-[#F7F8F5] p-2 rounded-2xl border border-[#E5E7EB]">
            <span className="text-xs font-bold text-[#4B5563] pl-2 hidden md:inline">Status:</span>
            <OrderStatusUpdater orderId={order._id.toString()} currentStatus={order.orderStatus} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (8 cols) - Order Items & Breakdown */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Order Items Table Card */}
          <div className="bg-white rounded-3xl shadow-xs border border-[#E5E7EB] overflow-hidden">
            <div className="p-5 border-b border-[#E5E7EB] bg-[#F7F8F5]/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-[#163A32]" />
                <h2 className="font-extrabold text-base text-[#111827] font-heading">
                  Ordered Items ({order.orderItems?.length || 0})
                </h2>
              </div>
              <span className="text-xs font-bold text-[#6B8F71]">100% Authentic Products</span>
            </div>

            <div className="divide-y divide-[#E5E7EB]">
              {order.orderItems.map((item: any, index: number) => {
                const productCode = item.product?.sku ? `SKU: ${item.product.sku}` : `CODE: #${(item.product?._id || item._id || '').toString().slice(-6).toUpperCase()}`;
                
                return (
                  <div key={index} className="p-4 sm:p-5 flex items-center gap-4 hover:bg-[#F7F8F5]/50 transition-colors">
                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-[#E5E7EB] overflow-hidden shrink-0 flex items-center justify-center p-1 shadow-2xs">
                      <img 
                        src={item.image || 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=200'} 
                        alt={item.name} 
                        className="w-full h-full object-contain" 
                      />
                    </div>

                    {/* Product Details & Code */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-extrabold text-xs sm:text-sm text-[#111827] truncate font-heading" title={item.name}>
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-[10px] font-mono font-bold text-[#163A32] bg-[#163A32]/10 px-2 py-0.5 rounded-md border border-[#163A32]/20">
                          {productCode}
                        </span>
                        {item.product?.brand && (
                          <span className="text-[10px] font-bold text-[#6B8F71]">
                            Brand: {item.product.brand}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#4B5563] mt-1 font-semibold">
                        ৳{item.price.toFixed(2)} × {item.qty} {item.qty > 1 ? 'items' : 'item'}
                      </p>
                    </div>

                    {/* Line Total */}
                    <div className="text-right shrink-0">
                      <span className="font-extrabold text-sm sm:text-base text-[#163A32] font-heading">
                        ৳{(item.price * item.qty).toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Financial Summary Card */}
          <div className="bg-white rounded-3xl shadow-xs border border-[#E5E7EB] overflow-hidden p-6">
            <h2 className="font-extrabold text-base text-[#111827] font-heading mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#163A32]" />
              <span>Payment & Cost Breakdown</span>
            </h2>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-[#4B5563] font-semibold">
                <span>Items Subtotal</span>
                <span className="font-bold text-[#111827]">৳{(order.itemsPrice || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#4B5563] font-semibold">
                <span>Shipping / Delivery Fee</span>
                <span className="font-bold text-[#111827]">৳{(order.shippingPrice || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#4B5563] font-semibold">
                <span>Estimated Tax (0%)</span>
                <span className="font-bold text-[#111827]">৳{(order.taxPrice || 0).toFixed(2)}</span>
              </div>
              
              <div className="pt-4 border-t border-[#E5E7EB] flex justify-between items-baseline">
                <span className="font-black text-base text-[#111827] font-heading">Grand Total</span>
                <span className="font-black text-xl sm:text-2xl text-[#163A32] font-heading">
                  ৳{(order.totalPrice || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols) - Customer, Delivery & Payment Info */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Customer Details Card */}
          <div className="bg-white rounded-3xl shadow-xs border border-[#E5E7EB] overflow-hidden p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#E5E7EB]">
              <UserIcon className="w-5 h-5 text-[#163A32]" />
              <h2 className="font-extrabold text-sm text-[#111827] font-heading">Customer Information</h2>
            </div>
            
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider block">Customer Name</span>
                <span className="font-extrabold text-sm text-[#111827] mt-0.5 block">{customerName}</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider block">Phone Number</span>
                <a href={`tel:${customerPhone}`} className="font-bold text-xs text-[#163A32] hover:underline flex items-center gap-1.5 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-[#6B8F71]" />
                  <span>{customerPhone}</span>
                </a>
              </div>

              <div>
                <span className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider block">Email Address</span>
                <span className="font-semibold text-xs text-[#4B5563] flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{customerEmail}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Address Card */}
          <div className="bg-white rounded-3xl shadow-xs border border-[#E5E7EB] overflow-hidden p-6 space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-[#E5E7EB]">
              <MapPin className="w-5 h-5 text-[#6B8F71]" />
              <h2 className="font-extrabold text-sm text-[#111827] font-heading">Delivery Destination</h2>
            </div>

            <div className="text-xs text-[#4B5563] font-semibold leading-relaxed space-y-1">
              <p className="font-bold text-[#111827]">{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.address}</p>
              <p>{order.shippingAddress?.city}{order.shippingAddress?.postalCode ? ` - ${order.shippingAddress?.postalCode}` : ''}</p>
              <p className="text-[11px] text-[#9CA3AF]">{order.shippingAddress?.country || 'Bangladesh'}</p>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="bg-white rounded-3xl shadow-xs border border-[#E5E7EB] overflow-hidden p-6 space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-[#E5E7EB]">
              <CreditCard className="w-5 h-5 text-[#163A32]" />
              <h2 className="font-extrabold text-sm text-[#111827] font-heading">Payment Information</h2>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider block">Payment Method</span>
                <span className="inline-block mt-1 font-extrabold text-xs uppercase bg-[#F7F8F5] text-[#163A32] border border-[#E5E7EB] px-2.5 py-1 rounded-lg">
                  {order.paymentMethod || 'Cash on Delivery'}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider block">Payment Status</span>
                <div className="mt-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-black uppercase tracking-tight ${
                    order.isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {order.isPaid ? 'Paid' : 'Unpaid (Due on Delivery)'}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
