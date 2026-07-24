import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const isAdmin = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return false;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as { role: string };
    return decoded.role === 'ADMIN' || decoded.role === 'admin';
  } catch (error) {
    return false;
  }
};

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const { orderStatus } = await req.json();

    if (!orderStatus) {
      return NextResponse.json({ message: 'Order status is required' }, { status: 400 });
    }

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    order.orderStatus = orderStatus;

    if (orderStatus === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = new Date();
      // If we mark as delivered, it's usually paid, but we let the admin handle payment status separately if needed
    } else {
      // If they revert status from delivered, we should probably reset delivered flags, 
      // but usually admins don't do this. Let's do it just in case.
      order.isDelivered = false;
      order.deliveredAt = undefined;
    }

    const updatedOrder = await order.save();

    return NextResponse.json({ message: 'Order status updated successfully', order: updatedOrder }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server Error' }, { status: 500 });
  }
}
