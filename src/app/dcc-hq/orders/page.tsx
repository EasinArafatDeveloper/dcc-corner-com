import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';
import User from '@/models/User';
import Product from '@/models/Product';
import Link from 'next/link';
import { Package, User as UserIcon, Phone, MapPin, CheckCircle2, Clock, Truck, XCircle, AlertCircle, Sparkles } from 'lucide-react';
import { OrderTableActions } from '@/components/admin/OrderTableActions';
import { AdminSearch } from '@/components/admin/AdminSearch';
import { CopyableId } from '@/components/admin/CopyableId';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  await connectToDatabase();
  const resolvedParams = await searchParams;
  const q = typeof resolvedParams.q === 'string' ? resolvedParams.q.toLowerCase() : '';
  const statusFilter = typeof resolvedParams.status === 'string' ? resolvedParams.status : '';

  // Ensure models are registered for populate
  const _userModel = User; 
  const _productModel = Product;

  // Fetch all orders with populated customer & product data
  const orders = await Order.find({})
    .populate({
      path: 'user',
      select: 'name email',
    })
    .populate({
      path: 'orderItems.product',
      select: 'name sku slug brand',
    })
    .sort({ createdAt: -1 })
    .lean();

  // Search & Filter in memory
  const filteredOrders = orders.filter((o: any) => {
    // Status tab filter
    if (statusFilter && o.orderStatus !== statusFilter) {
      return false;
    }

    if (!q) return true;

    const orderId = o._id.toString().toLowerCase();
    const status = o.orderStatus?.toLowerCase() || '';
    const userName = o.user?.name?.toLowerCase() || '';
    const userEmail = o.user?.email?.toLowerCase() || '';
    const customerName = o.shippingAddress?.fullName?.toLowerCase() || '';
    const customerPhone = o.shippingAddress?.phone?.toLowerCase() || '';
    const customerCity = o.shippingAddress?.city?.toLowerCase() || '';
    const itemNames = (o.orderItems || []).map((it: any) => it.name?.toLowerCase() || '').join(' ');
    
    return (
      orderId.includes(q) || 
      status.includes(q) || 
      userName.includes(q) || 
      userEmail.includes(q) || 
      customerName.includes(q) ||
      customerPhone.includes(q) ||
      customerCity.includes(q) ||
      itemNames.includes(q)
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending': 
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/80"><Clock className="w-3 h-3" /> Pending</span>;
      case 'Processing': 
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/80"><Sparkles className="w-3 h-3" /> Processing</span>;
      case 'Shipped': 
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80"><Truck className="w-3 h-3" /> Shipped</span>;
      case 'Delivered': 
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80"><CheckCircle2 className="w-3 h-3" /> Delivered</span>;
      case 'Cancelled': 
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200/80"><XCircle className="w-3 h-3" /> Cancelled</span>;
      default: 
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">{status}</span>;
    }
  };

  const statusCounts = {
    all: orders.length,
    Pending: orders.filter((o: any) => o.orderStatus === 'Pending').length,
    Processing: orders.filter((o: any) => o.orderStatus === 'Processing').length,
    Shipped: orders.filter((o: any) => o.orderStatus === 'Shipped').length,
    Delivered: orders.filter((o: any) => o.orderStatus === 'Delivered').length,
    Cancelled: orders.filter((o: any) => o.orderStatus === 'Cancelled').length,
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-6 rounded-3xl shadow-xs border border-[#E5E7EB] gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#163A32]/10 text-[#163A32]">
              <Package className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-[#111827] font-heading">
              Orders Management
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#4B5563] mt-1">
            Manage, verify and print invoice summaries for all customer orders.
          </p>
        </div>

        {/* Quick Summary Pill */}
        <div className="flex items-center gap-2 bg-[#F7F8F5] px-4 py-2 rounded-2xl border border-[#E5E7EB]">
          <span className="text-xs font-bold text-[#4B5563]">Total Orders:</span>
          <span className="text-sm font-black text-[#163A32] font-heading">{orders.length}</span>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-3xl shadow-xs border border-[#E5E7EB] overflow-hidden">
        
        {/* Status Filter Tabs & Search Bar */}
        <div className="p-4 sm:p-5 border-b border-[#E5E7EB] bg-[#F7F8F5]/60 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { label: 'All Orders', value: '', count: statusCounts.all },
              { label: 'Pending', value: 'Pending', count: statusCounts.Pending },
              { label: 'Processing', value: 'Processing', count: statusCounts.Processing },
              { label: 'Shipped', value: 'Shipped', count: statusCounts.Shipped },
              { label: 'Delivered', value: 'Delivered', count: statusCounts.Delivered },
              { label: 'Cancelled', value: 'Cancelled', count: statusCounts.Cancelled },
            ].map((tab) => {
              const isActive = statusFilter === tab.value;
              return (
                <Link
                  key={tab.label}
                  href={tab.value ? `/dcc-hq/orders?status=${tab.value}` : '/dcc-hq/orders'}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isActive 
                      ? 'bg-[#163A32] text-white shadow-xs' 
                      : 'bg-white text-[#4B5563] border border-[#E5E7EB] hover:bg-slate-50 hover:text-[#111827]'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {tab.count}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="w-full sm:w-80">
            <AdminSearch placeholder="Search by ID, Name, Phone, Item..." />
          </div>
        </div>
        
        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[11px] text-[#6B7280] bg-[#F7F8F5] uppercase tracking-wider font-extrabold border-b border-[#E5E7EB]">
              <tr>
                <th className="px-5 py-3.5">Order ID</th>
                <th className="px-5 py-3.5">Customer Details</th>
                <th className="px-5 py-3.5">Ordered Products & Code</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Total</th>
                <th className="px-5 py-3.5">Payment</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filteredOrders.map((order: any) => {
                const customerName = order.shippingAddress?.fullName || order.user?.name || 'Customer';
                const phone = order.shippingAddress?.phone || 'N/A';
                const city = order.shippingAddress?.city || 'Dhaka';
                const itemsCount = order.orderItems?.reduce((sum: number, it: any) => sum + (it.qty || 1), 0) || 0;
                const firstItem = order.orderItems?.[0];
                const moreItemsCount = order.orderItems?.length > 1 ? order.orderItems.length - 1 : 0;

                return (
                  <tr key={order._id} className="hover:bg-[#F7F8F5]/70 transition-colors group">
                    
                    {/* 1. Order ID */}
                    <td className="px-5 py-4">
                      <CopyableId id={order._id.toString()} />
                    </td>

                    {/* 2. Customer Details */}
                    <td className="px-5 py-4 min-w-[200px]">
                      <div className="font-extrabold text-xs text-[#111827] flex items-center gap-1.5">
                        <UserIcon className="w-3.5 h-3.5 text-[#163A32]" />
                        <span>{customerName}</span>
                      </div>
                      <div className="text-[11px] text-[#4B5563] flex items-center gap-1 mt-1 font-semibold">
                        <Phone className="w-3 h-3 text-[#6B8F71]" />
                        <span>{phone}</span>
                      </div>
                      <div className="text-[10px] text-[#6B7280] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span className="truncate max-w-[180px]" title={order.shippingAddress?.address}>
                          {city} • {order.shippingAddress?.address?.substring(0, 24)}...
                        </span>
                      </div>
                    </td>

                    {/* 3. Ordered Products & Product Code / SKU */}
                    <td className="px-5 py-4 min-w-[220px]">
                      {firstItem ? (
                        <div className="flex items-center gap-2.5">
                          {/* Product Image Thumbnail */}
                          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 relative flex items-center justify-center p-0.5">
                            <img 
                              src={firstItem.image || 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=150'} 
                              alt={firstItem.name} 
                              className="w-full h-full object-contain"
                            />
                            {itemsCount > 1 && (
                              <span className="absolute bottom-0 right-0 bg-[#163A32] text-white text-[9px] font-black px-1 rounded-tl-md">
                                ×{itemsCount}
                              </span>
                            )}
                          </div>

                          {/* Title & SKU / Code */}
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-[#111827] truncate max-w-[170px]" title={firstItem.name}>
                              {firstItem.name}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[10px] font-mono font-bold text-[#163A32] bg-[#163A32]/10 px-1.5 py-0.2 rounded border border-[#163A32]/20">
                                {firstItem.product?.sku ? `SKU: ${firstItem.product.sku}` : `CODE: #${(firstItem.product?._id || firstItem._id || '').toString().slice(-6).toUpperCase()}`}
                              </span>
                              {moreItemsCount > 0 && (
                                <span className="text-[10px] font-bold text-[#6B8F71]">
                                  +{moreItemsCount} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-[#9CA3AF]">No items</span>
                      )}
                    </td>

                    {/* 4. Date */}
                    <td className="px-5 py-4 text-xs font-semibold text-[#4B5563] whitespace-nowrap">
                      <div>{new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                      <div className="text-[10px] text-[#9CA3AF] mt-0.5">
                        {new Date(order.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    {/* 5. Total */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="font-extrabold text-sm text-[#163A32] font-heading">
                        ৳{order.totalPrice ? order.totalPrice.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                      </div>
                    </td>

                    {/* 6. Payment Status */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-black uppercase tracking-tight ${
                          order.isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {order.isPaid ? 'Paid' : 'Unpaid'}
                        </span>
                        <div className="text-[10px] font-bold text-[#6B7280] uppercase truncate max-w-[100px]" title={order.paymentMethod}>
                          {order.paymentMethod || 'COD'}
                        </div>
                      </div>
                    </td>

                    {/* 7. Order Status */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      {getStatusBadge(order.orderStatus)}
                    </td>

                    {/* 8. Actions (Single, clean View + Invoice PDF + Delete controls) */}
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <OrderTableActions orderId={order._id.toString()} />
                    </td>

                  </tr>
                );
              })}
              
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center text-[#6B7280]">
                    <div className="flex flex-col items-center justify-center">
                      <Package className="w-10 h-10 text-slate-300 mb-2" />
                      <p className="font-bold text-sm text-[#111827]">No orders found</p>
                      <p className="text-xs text-[#6B7280] mt-1">Try adjusting your search query or status filter.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
