import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';
import User from '@/models/User';
import Product from '@/models/Product';
import { notFound } from 'next/navigation';
import { PrintButton } from './PrintButton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Phone, Mail, MapPin, CheckCircle2, ShieldCheck, ShoppingBag } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
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

  const invoiceNumber = `DCC-${order._id.toString().slice(-6).toUpperCase()}`;
  const customerName = order.shippingAddress?.fullName || order.user?.name || 'Customer';
  const customerEmail = order.user?.email || order.shippingAddress?.email || 'N/A';
  const customerPhone = order.shippingAddress?.phone || 'N/A';

  return (
    <div className="bg-slate-100 min-h-screen py-6 sm:py-10 print:bg-white print:py-0">
      
      {/* Non-printable Top Bar */}
      <div className="max-w-4xl mx-auto mb-6 px-4 print:hidden flex items-center justify-between">
        <Button asChild variant="outline" size="sm" className="rounded-xl border-[#E5E7EB] bg-white hover:bg-slate-50 text-[#163A32] font-bold">
          <Link href={`/dcc-hq/orders/${id}`}>
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Order Details
          </Link>
        </Button>
        <PrintButton />
      </div>

      {/* Printable Paper Sheet (A4 Standard Format) */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl print:rounded-none shadow-xl print:shadow-none border border-[#E5E7EB] print:border-none p-8 sm:p-12 text-[#111827]">
        
        {/* 1. Header with DCC Brand Monogram & Invoice Meta */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b-2 border-[#163A32] pb-6 mb-8 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#163A32] flex items-center justify-center text-white font-black text-lg shadow-sm">
                <span className="text-[#D6A84F]">D</span>
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-[#111827] font-heading leading-none">
                  DCC<span className="text-[#6B8F71] ml-0.5">Corner</span>
                </h1>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D6A84F]">
                  Premium Imported Goods
                </span>
              </div>
            </div>
            
            <div className="text-xs text-[#4B5563] space-y-0.5 pt-1">
              <p className="font-bold text-[#111827]">DCC Corner Bangladesh</p>
              <p>Bashundhara R/A, Dhaka - 1229, Bangladesh</p>
              <p>Hotline / Support: +880 1800-000000</p>
              <p>Email: support@dcccorner.com • Web: dcccorner.com</p>
            </div>
          </div>

          {/* Invoice Tag & Meta */}
          <div className="sm:text-right space-y-1">
            <div className="inline-block bg-[#163A32] text-[#D6A84F] px-3.5 py-1 rounded-xl text-xs font-black uppercase tracking-wider mb-2">
              Tax Invoice / Bill
            </div>
            <p className="text-sm font-bold text-[#111827]">
              Invoice No: <span className="font-mono font-black text-[#163A32] ml-1">#{invoiceNumber}</span>
            </p>
            <p className="text-xs text-[#4B5563] font-medium">
              Order Date: {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </p>
            <p className="text-xs text-[#4B5563] font-medium">
              Payment Status: <span className="font-bold uppercase text-[#163A32]">{order.isPaid ? 'PAID' : 'UNPAID (COD)'}</span>
            </p>
          </div>
        </div>

        {/* 2. Customer & Shipping Info Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#F7F8F5] p-5 rounded-2xl border border-[#E5E7EB] mb-8">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#9CA3AF] block mb-1.5">
              Customer Details (Billed To)
            </span>
            <p className="font-black text-sm text-[#111827]">{customerName}</p>
            <p className="text-xs text-[#4B5563] mt-1 font-semibold flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#6B8F71]" />
              <span>{customerPhone}</span>
            </p>
            <p className="text-xs text-[#4B5563] mt-0.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{customerEmail}</span>
            </p>
          </div>

          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#9CA3AF] block mb-1.5">
              Delivery Destination (Shipped To)
            </span>
            <p className="font-black text-sm text-[#111827]">{order.shippingAddress?.fullName || customerName}</p>
            <p className="text-xs text-[#4B5563] font-medium mt-1 leading-relaxed">
              {order.shippingAddress?.address}
            </p>
            <p className="text-xs text-[#4B5563] font-bold mt-0.5">
              {order.shippingAddress?.city}{order.shippingAddress?.postalCode ? ` - ${order.shippingAddress?.postalCode}` : ''}, Bangladesh
            </p>
          </div>
        </div>

        {/* 3. Items Breakdown Table */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-[#E5E7EB]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F7F8F5] border-b border-[#E5E7EB] text-[11px] font-black uppercase tracking-wider text-[#4B5563]">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">Item & Product Code</th>
                <th className="py-3 px-4 text-center w-20">Qty</th>
                <th className="py-3 px-4 text-right w-28">Unit Price</th>
                <th className="py-3 px-4 text-right w-28">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-xs">
              {order.orderItems.map((item: any, index: number) => {
                const productCode = item.product?.sku ? `SKU: ${item.product.sku}` : `CODE: #${(item.product?._id || item._id || '').toString().slice(-6).toUpperCase()}`;

                return (
                  <tr key={index} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4 text-center font-bold text-slate-400">
                      {index + 1}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-extrabold text-[#111827]">{item.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-mono font-bold text-[#163A32] bg-[#163A32]/10 px-1.5 py-0.2 rounded border border-[#163A32]/20">
                          {productCode}
                        </span>
                        {item.product?.brand && (
                          <span className="text-[10px] font-semibold text-[#6B8F71]">
                            {item.product.brand}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-black text-[#111827]">
                      {item.qty}
                    </td>
                    <td className="py-3.5 px-4 text-right font-medium text-[#4B5563]">
                      ৳{item.price.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-[#163A32]">
                      ৳{(item.price * item.qty).toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 4. Financial Calculations & Summary */}
        <div className="flex flex-col sm:flex-row justify-between gap-6 border-t-2 border-[#E5E7EB] pt-6 mb-8">
          
          {/* Payment Method Details */}
          <div className="space-y-2 max-w-sm">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#9CA3AF] block">
              Payment & Verification Method
            </span>
            <div className="p-3 bg-[#F7F8F5] rounded-xl border border-[#E5E7EB] text-xs">
              <p className="font-bold text-[#111827] uppercase">
                {order.paymentMethod || 'Cash on Delivery'}
              </p>
              <p className="text-[11px] text-[#6B7280] mt-0.5">
                {order.isPaid ? 'Payment received successfully.' : 'Please pay the exact amount upon receiving your package.'}
              </p>
            </div>
          </div>

          {/* Totals Table */}
          <div className="w-full sm:w-72 space-y-2.5 text-xs">
            <div className="flex justify-between text-[#4B5563] font-semibold">
              <span>Items Subtotal:</span>
              <span className="font-bold text-[#111827]">৳{(order.itemsPrice || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#4B5563] font-semibold">
              <span>Shipping & Handling:</span>
              <span className="font-bold text-[#111827]">৳{(order.shippingPrice || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#4B5563] font-semibold">
              <span>Estimated Tax (0%):</span>
              <span className="font-bold text-[#111827]">৳{(order.taxPrice || 0).toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between border-t-2 border-[#163A32] pt-3 mt-2 items-baseline">
              <span className="font-black text-sm uppercase text-[#111827] font-heading">Total Payable:</span>
              <span className="font-black text-xl text-[#163A32] font-heading">
                ৳{(order.totalPrice || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* 5. Official Stamp & Signature Area */}
        <div className="pt-6 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B7280] gap-4">
          <div>
            <p className="font-extrabold text-[#111827]">Thank you for shopping with DCC Corner!</p>
            <p className="text-[11px] mt-0.5">For queries or returns, please contact support@dcccorner.com</p>
          </div>
          <div className="text-center sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0">
            <p className="text-[11px] font-bold text-[#163A32]">DCC Corner Verified Order</p>
            <p className="text-[10px] text-[#9CA3AF] font-mono mt-0.5">System Generated Invoice</p>
          </div>
        </div>

      </div>
    </div>
  );
}
