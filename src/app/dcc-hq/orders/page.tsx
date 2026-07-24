import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';
import User from '@/models/User'; // Ensure User model is loaded for populate
import Link from 'next/link';
import { Search, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { OrderTableActions } from '@/components/admin/OrderTableActions';

import { AdminSearch } from '@/components/admin/AdminSearch';
import { CopyableId } from '@/components/admin/CopyableId';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  await connectToDatabase();
  const resolvedParams = await searchParams;
  const q = typeof resolvedParams.q === 'string' ? resolvedParams.q.toLowerCase() : '';
  
  const userModel = User; 

  // Fetch all orders (we will paginate later if needed)
  const orders = await Order.find({})
    .populate({
      path: 'user',
      select: 'name email',
    })
    .sort({ createdAt: -1 })
    .lean();

  // Filter in memory to support searching across populated fields (Customer Name/Email)
  const filteredOrders = q ? orders.filter((o: any) => {
    const orderId = o._id.toString().toLowerCase();
    const status = o.orderStatus?.toLowerCase() || '';
    const userName = o.user?.name?.toLowerCase() || '';
    const userEmail = o.user?.email?.toLowerCase() || '';
    const guestName = o.shippingAddress?.fullName?.toLowerCase() || '';
    
    return (
      orderId.includes(q) || 
      status.includes(q) || 
      userName.includes(q) || 
      userEmail.includes(q) || 
      guestName.includes(q)
    );
  }) : orders;

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
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage and track customer orders.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center bg-slate-50/50">
          <AdminSearch placeholder="Search by ID, Customer, or Status..." />
          <div className="text-sm text-muted-foreground">
            Showing {filteredOrders.length} orders
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 bg-slate-50 uppercase border-b">
                <tr>
                  <th className="px-6 py-4 font-medium">Order ID</th>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Total</th>
                  <th className="px-6 py-4 font-medium">Payment</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredOrders.map((order: any) => (
                  <tr key={order._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <CopyableId id={order._id.toString()} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{order.user?.name || 'Guest User'}</div>
                      <div className="text-muted-foreground mt-0.5">{order.user?.email || order.shippingAddress?.email || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900 font-mono">
                      ৳{order.totalPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        order.isPaid ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {order.isPaid ? 'Paid' : 'Unpaid'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button asChild variant="outline" size="sm" className="h-8 shadow-sm">
                          <Link href={`/dcc-hq/orders/${order._id}`}>
                            <Eye className="w-4 h-4 mr-1.5" />
                            View
                          </Link>
                        </Button>
                        <OrderTableActions orderId={order._id.toString()} />
                      </div>
                    </td>
                  </tr>
                ))}
                
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
