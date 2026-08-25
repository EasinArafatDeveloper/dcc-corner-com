import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Category from '@/models/Category';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Fetch all categories sorted by name (or createdAt)
    const categories = await Category.find({}).sort({ name: 1 }).lean();

    // Optionally get product count per category
    const productCounts = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    const countMap = new Map();
    productCounts.forEach((item: any) => {
      if (item._id) {
        countMap.set(item._id.toString(), item.count);
      }
    });

    const enrichedCategories = categories.map((cat: any) => ({
      _id: cat._id.toString(),
      name: cat.name,
      slug: cat.slug,
      image: cat.image || '',
      productCount: countMap.get(cat._id.toString()) || 0,
    }));

    return NextResponse.json(enrichedCategories, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    });
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ message: error.message || 'Failed to fetch categories' }, { status: 500 });
  }
}
