import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';
import User from '@/models/User';
import { notFound } from 'next/navigation';
import { PrintButton } from './PrintButton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  const userModel = User;

  const order = await Order.findById(id).populate('user', 'name email').lean();

  if (!order) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Non-printable controls */}
      <div className="print:hidden p-4 border-b bg-slate-50 flex items-center justify-between">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/dcc-hq/orders/${id}`}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Order
          </Link>
        </Button>
        <PrintButton />
      </div>

      {/* Printable Invoice Area */}
      <div className="max-w-4xl mx-auto p-8 sm:p-12 text-slate-800 bg-white">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b pb-8 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-primary">DCC Corner</h1>
            <p className="text-muted-foreground mt-1 text-sm">Premium Imported Snacks & Confectionery</p>
            <div className="mt-4 text-sm text-slate-600">
              <p>123 Premium Street, Retail District</p>
              <p>City 10001, Bangladesh</p>
              <p>Phone: +1 (800) 123-4567</p>
              <p>Email: support@dcccorner.com</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-light text-slate-400 uppercase tracking-widest">Invoice</h2>
            <div className="mt-4">
              <p className="text-sm font-semibold text-slate-700">Invoice No: <span className="font-mono font-normal ml-2">{order._id.toString().toUpperCase().substring(0, 10)}</span></p>
              <p className="text-sm font-semibold text-slate-700 mt-1">Date: <span className="font-normal ml-2">{new Date(order.createdAt).toLocaleDateString()}</span></p>
              <p className="text-sm font-semibold text-slate-700 mt-1">Status: <span className="font-normal ml-2 uppercase text-primary">{order.orderStatus}</span></p>
            </div>
          </div>
        </div>

        {/* Customer & Shipping Info */}
        <div className="flex justify-between gap-8 mb-8">
          <div className="flex-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Billed To</h3>
            <p className="font-semibold text-lg">{order.user?.name || order.shippingAddress?.fullName || 'Guest Customer'}</p>
            <p className="text-sm text-slate-600 mt-1">{order.user?.email || 'No email provided'}</p>
            <p className="text-sm text-slate-600 mt-1">{order.shippingAddress?.phone}</p>
          </div>
          <div className="flex-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Shipped To</h3>
            <p className="font-semibold text-lg">{order.shippingAddress?.fullName}</p>
            <p className="text-sm text-slate-600 mt-1">{order.shippingAddress?.address}</p>
            <p className="text-sm text-slate-600 mt-1">{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
            <p className="text-sm text-slate-600 mt-1">{order.shippingAddress?.country}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-y border-slate-200">
                <th className="py-3 px-2 text-xs font-bold text-slate-500 uppercase">Item Description</th>
                <th className="py-3 px-2 text-xs font-bold text-slate-500 uppercase text-center">Qty</th>
                <th className="py-3 px-2 text-xs font-bold text-slate-500 uppercase text-right">Price</th>
                <th className="py-3 px-2 text-xs font-bold text-slate-500 uppercase text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.orderItems.map((item: any, index: number) => (
                <tr key={index}>
                  <td className="py-4 px-2 font-medium">{item.name}</td>
                  <td className="py-4 px-2 text-center text-slate-600">{item.qty}</td>
                  <td className="py-4 px-2 text-right text-slate-600">৳{item.price.toFixed(2)}</td>
                  <td className="py-4 px-2 text-right font-medium text-slate-900">৳{(item.price * item.qty).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64 space-y-3">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Subtotal</span>
              <span className="font-medium text-slate-900">৳{order.itemsPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-600">
              <span>Shipping</span>
              <span className="font-medium text-slate-900">৳{order.shippingPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-600">
              <span>Tax (5%)</span>
              <span className="font-medium text-slate-900">৳{order.taxPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t-2 border-slate-900 pt-3 mt-3">
              <span className="font-bold text-lg">Total</span>
              <span className="font-extrabold text-xl text-primary">৳{order.totalPrice.toFixed(2)}</span>
            </div>
            
            <div className="pt-6 mt-6 border-t text-right">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Payment Method</p>
              <p className="font-medium text-sm">{order.paymentMethod}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t text-center text-sm text-slate-500">
          <p className="font-medium text-slate-700">Thank you for shopping with DCC Corner!</p>
          <p className="mt-1">If you have any questions concerning this invoice, contact our support team.</p>
        </div>
        
      </div>
    </div>
  );
}
