import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    
    const body = await req.json();
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = body;

    // Check if user is logged in
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    let userId = null;
    if (token) {
       const decoded = await verifyToken(token);
       if (decoded) {
         userId = decoded.userId;
       }
    }

    // For now, if no user is logged in, we will use a dummy ID for guest checkout
    // In a real production app, you might require login or create a guest user
    const finalUserId = userId || '000000000000000000000000';

    if (orderItems && orderItems.length === 0) {
      return NextResponse.json({ message: 'No order items' }, { status: 400 });
    } else {
      const order = new Order({
        orderItems: orderItems.map((x: any) => ({
          name: x.name,
          qty: x.quantity || x.qty,
          image: x.image,
          price: x.price,
          product: x._id, // map the _id from cart to product reference
        })),
        user: finalUserId,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });

      const createdOrder = await order.save();
      
      return NextResponse.json(createdOrder, { status: 201 });
    }
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
