import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get('q') || '').trim();

    if (!q || q.length < 1) {
      return NextResponse.json({ products: [], suggestions: [] });
    }

    await connectToDatabase();

    // Ensure Category model is registered
    if (!mongoose.models.Category) {
      mongoose.model('Category', Category.schema);
    }

    // Escape regex special characters
    const escapedQ = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const searchRegex = new RegExp(escapedQ, 'i');

    // Split multi-word query into separate tokens for fuzzy/flexible matching
    const tokens = q.split(/\s+/).filter(Boolean).map(t => new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));

    // Find any matching categories
    const matchingCategories = await Category.find({
      name: { $regex: searchRegex }
    }).select('_id name slug').lean();

    const categoryIds = matchingCategories.map(c => c._id);

    // Build flexible multi-condition product query
    const productQuery: any = {
      $or: [
        { name: { $regex: searchRegex } },
        { brand: { $regex: searchRegex } },
        { tags: { $in: [searchRegex] } },
        { sku: { $regex: searchRegex } },
        { shortDescription: { $regex: searchRegex } },
        ...(categoryIds.length > 0 ? [{ category: { $in: categoryIds } }] : []),
        ...(tokens.length > 1 ? [{
          $and: tokens.map(token => ({
            $or: [
              { name: { $regex: token } },
              { brand: { $regex: token } },
              { tags: { $in: [token] } },
              { description: { $regex: token } }
            ]
          }))
        }] : [])
      ]
    };

    const [products, totalCount] = await Promise.all([
      Product.find(productQuery)
        .populate('category', 'name slug')
        .select('name slug images price discountPrice discountPercent brand category countInStock')
        .limit(8)
        .lean(),
      Product.countDocuments(productQuery)
    ]);

    // Build intelligent keyword suggestions
    const suggestionsSet = new Set<string>();

    // 1. If category matches, suggest searching in that category
    matchingCategories.forEach(cat => {
      suggestionsSet.add(`${cat.name}`);
    });

    // 2. Add product brand suggestions
    products.forEach(p => {
      if (p.brand && p.brand.toLowerCase().includes(q.toLowerCase())) {
        suggestionsSet.add(p.brand);
      }
    });

    // 3. Add clean product name phrases
    products.slice(0, 4).forEach(p => {
      suggestionsSet.add(p.name);
    });

    const suggestions = Array.from(suggestionsSet).slice(0, 5);

    return NextResponse.json({
      products: JSON.parse(JSON.stringify(products)),
      suggestions,
      totalCount
    });
  } catch (error: any) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: 'Failed to search products', products: [], suggestions: [] }, { status: 500 });
  }
}
