import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { ids } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ products: [] });
    }

    // Filter valid MongoDB ObjectIds
    const validIds = ids.filter((id) => mongoose.Types.ObjectId.isValid(id));

    if (validIds.length === 0) {
      return NextResponse.json({ products: [] });
    }

    await connectToDatabase();

    // Ensure Category model is registered for populate
    if (!mongoose.models.Category) {
      mongoose.model('Category', Category.schema);
    }

    const products = await Product.find({ _id: { $in: validIds } })
      .populate('category', 'name slug')
      .lean();

    return NextResponse.json({ products: JSON.parse(JSON.stringify(products)) });
  } catch (error: any) {
    console.error("Wishlist API Error:", error);
    return NextResponse.json({ error: 'Failed to fetch wishlist products' }, { status: 500 });
  }
}
