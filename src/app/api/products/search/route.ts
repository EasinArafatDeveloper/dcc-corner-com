import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');

    if (!q || q.length < 2) {
      return NextResponse.json([]);
    }

    await connectToDatabase();

    const products = await Product.find({ 
      name: { $regex: q, $options: 'i' } 
    })
    .select('name slug images price discountPrice')
    .limit(5)
    .lean();

    return NextResponse.json(products);
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: 'Failed to search products' }, { status: 500 });
  }
}
