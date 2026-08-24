import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ShopFilters } from "@/components/storefront/ShopFilters";
import { ShopSort } from "@/components/storefront/ShopSort";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  Sparkles, 
  Flame, 
  RotateCcw, 
  Search, 
  CheckCircle2, 
  PackageSearch 
} from "lucide-react";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop All Imported Products | DCC Corner',
  description: 'Browse authentic imported chocolates, snacks, coffee, biscuits, ramen, and wholesale deals from USA, UK, Switzerland, and Japan.',
};

async function getShopData(searchParams: any) {
  await connectToDatabase();
  
  const query: any = {};
  
  // 1. Search Query with Multi-field and Token Matching
  if (searchParams.q && searchParams.q.trim()) {
    const rawQ = searchParams.q.trim();
    const escapedQ = rawQ.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const searchRegex = new RegExp(escapedQ, 'i');

    const matchingCategories = await Category.find({
      name: { $regex: searchRegex }
    }).select('_id').lean();
    const categoryIds = matchingCategories.map(c => c._id);

    const tokens = rawQ.split(/\s+/).filter(Boolean).map((t: string) => new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));

    query.$or = [
      { name: { $regex: searchRegex } },
      { brand: { $regex: searchRegex } },
      { tags: { $in: [searchRegex] } },
      { sku: { $regex: searchRegex } },
      { shortDescription: { $regex: searchRegex } },
      { description: { $regex: searchRegex } },
      ...(categoryIds.length > 0 ? [{ category: { $in: categoryIds } }] : []),
      ...(tokens.length > 1 ? [{
        $and: tokens.map((token: RegExp) => ({
          $or: [
            { name: { $regex: token } },
            { brand: { $regex: token } },
            { tags: { $in: [token] } },
            { description: { $regex: token } }
          ]
        }))
      }] : [])
    ];
  }
  
  // 2. Category Filter
  if (searchParams.category) {
    const categoryDoc = await Category.findOne({ slug: searchParams.category });
    if (categoryDoc) {
      query.category = categoryDoc._id;
    }
  }

  // 3. Brand Filter
  if (searchParams.brand) {
    query.brand = searchParams.brand;
  }

  // 4. Wholesale Offers
  if (searchParams.offers === 'true') {
    query.discountPrice = { $gt: 0 };
  }

  // 5. In Stock Filter
  if (searchParams.inStock === 'true') {
    query.countInStock = { $gt: 0 };
  }

  // 6. Price Range Filter
  if (searchParams.minPrice || searchParams.maxPrice) {
    const min = searchParams.minPrice ? Number(searchParams.minPrice) : 0;
    const max = searchParams.maxPrice ? Number(searchParams.maxPrice) : Infinity;

    const priceCondition: any = {};
    if (searchParams.minPrice) priceCondition.$gte = min;
    if (searchParams.maxPrice) priceCondition.$lte = max;

    query.$and = [
      ...(query.$and || []),
      {
        $or: [
          { discountPrice: { $gt: 0, ...priceCondition } },
          { discountPrice: { $lte: 0 }, price: priceCondition }
        ]
      }
    ];
  }

  if (searchParams.featured === 'true') {
    query.isFeatured = true;
  }

  // Sorting
  let sortQuery: any = {};
  if (searchParams.sort === 'price-asc') sortQuery.price = 1;
  else if (searchParams.sort === 'price-desc') sortQuery.price = -1;
  else if (searchParams.sort === 'newest') sortQuery.createdAt = -1;
  else if (searchParams.sort === 'top-selling') sortQuery.numReviews = -1;
  else sortQuery.createdAt = -1;

  const [products, categories, brands] = await Promise.all([
    Product.find(query).sort(sortQuery).populate('category', 'name slug').lean(),
    Category.find({}).lean(),
    Product.distinct('brand')
  ]);

  return {
    products: JSON.parse(JSON.stringify(products)),
    categories: JSON.parse(JSON.stringify(categories)),
    brands: (brands || []).filter(Boolean)
  };
}

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const resolvedParams = await searchParams;
  const data = await getShopData(resolvedParams);
  const { products, categories, brands } = data;

  const activeCategory = categories.find((c: any) => c.slug === resolvedParams.category);
  const hasActiveFilters = Boolean(
    resolvedParams.q || 
    resolvedParams.category || 
    resolvedParams.brand || 
    resolvedParams.offers || 
    resolvedParams.inStock || 
    resolvedParams.minPrice || 
    resolvedParams.maxPrice
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 min-h-screen">
      {/* Header Banner & Breadcrumbs */}
      <div className="mb-6 sm:mb-8">
        <nav className="flex items-center gap-1.5 text-xs text-[#6B7280] mb-3">
          <Link href="/" className="hover:text-[#163A32] font-medium">Home</Link>
          <span>/</span>
          <span className="text-[#111827] font-bold">Shop All Products</span>
          {activeCategory && (
            <>
              <span>/</span>
              <span className="text-[#163A32] font-bold">{activeCategory.name}</span>
            </>
          )}
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#111827] font-heading flex items-center gap-2.5">
              <span>{activeCategory ? activeCategory.name : "Shop All Imported Products"}</span>
              <span className="text-xs sm:text-sm font-bold bg-[#163A32] text-[#D6A84F] px-3 py-1 rounded-full border border-[#D6A84F]/30 shrink-0">
                100% Authentic
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-[#4B5563] mt-1.5 max-w-2xl leading-relaxed">
              {activeCategory?.description || "Browse premium imported chocolates, gourmet coffee, authentic chips, biscuits, and exclusive wholesale deals."}
            </p>
          </div>
        </div>
      </div>

      {/* Main Layout: Filters Sidebar + Products Grid */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        {/* Left Filter Sidebar */}
        <ShopFilters categories={categories} brands={brands} />

        {/* Right Products Container */}
        <main className="flex-1 w-full min-w-0">
          {/* Toolbar: Counter, Active Pills & Sort */}
          <div className="bg-[#F7F8F5] border border-[#E5E7EB] rounded-2xl p-3 sm:p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-bold text-[#111827]">
                Showing <span className="text-[#163A32] font-black">{products.length}</span> {products.length === 1 ? 'Product' : 'Products'}
              </span>

              {hasActiveFilters && (
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 hover:text-red-700 bg-red-50 border border-red-200/80 px-2.5 py-0.5 rounded-full transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear All Filters</span>
                </Link>
              )}
            </div>

            <ShopSort />
          </div>

          {/* Products Grid or Empty State */}
          {products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5.5">
              {products.map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            /* No Products Found */
            <div className="bg-[#F7F8F5] border border-[#E5E7EB] rounded-3xl p-8 sm:p-14 text-center">
              <div className="w-16 h-16 bg-white border border-[#E5E7EB] rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400 shadow-2xs">
                <PackageSearch className="w-8 h-8 text-[#163A32]" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#111827] mb-1.5 font-heading">
                No matching imported products found
              </h3>
              <p className="text-xs sm:text-sm text-[#4B5563] max-w-md mx-auto mb-6">
                We couldn&apos;t find any products matching your active filters. Try adjusting your search query, price range, or category filter.
              </p>
              <Button asChild size="lg" className="rounded-full bg-[#163A32] hover:bg-[#0E2620] text-white text-xs font-bold px-6 shadow-md shadow-[#163A32]/20">
                <Link href="/shop" className="flex items-center gap-2">
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </Link>
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
