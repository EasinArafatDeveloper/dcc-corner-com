import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { sendPushNotificationToAll } from '@/lib/push';

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

export async function POST(req: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const data = await req.json();

    // Basic validation
    if (!data.name || !data.price || !data.category) {
      return NextResponse.json({ message: 'Name, price, and category are required' }, { status: 400 });
    }

    // Default slug if not provided
    if (!data.slug) {
      data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const product = await Product.create(data);

    // Send push notification in the background
    sendPushNotificationToAll({
      title: 'New Product Alert! 🎉',
      body: `Check out our new product: ${product.name}`,
      url: `/products/${product.slug}`
    });

    return NextResponse.json({ message: 'Product created successfully', product }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server Error' }, { status: 500 });
  }
}
