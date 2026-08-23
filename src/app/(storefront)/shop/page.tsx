import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ShopFilters } from "@/components/storefront/ShopFilters";
import { ShopSort } from "@/components/storefront/ShopSort";
import { Button } from "@/components/ui/button";

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop All Products',
  description: 'Browse our extensive collection of premium imported chocolates, snacks, and exclusive products.',
};



async function getShopData(searchParams: any) {
  await connectToDatabase();
  
  const query: any = {};
  
  if (searchParams.q) {
    query.name = { $regex: searchParams.q, $options: 'i' };
  }
  
  if (searchParams.category) {
    const categoryDoc = await Category.findOne({ slug: searchParams.category });
    if (categoryDoc) {
      query.category = categoryDoc._id;
    }
  }

  if (searchParams.brand) {
    query.brand = searchParams.brand;
  }

  if (searchParams.offers === 'true') {
    query.discountPrice = { $gt: 0 };
  }

  if (searchParams.featured === 'true') {
    query.isFeatured = true;
  }

  let sortQuery: any = {};
  if (searchParams.sort === 'price-asc') sortQuery.price = 1;
  else if (searchParams.sort === 'price-desc') sortQuery.price = -1;
  else if (searchParams.sort === 'newest') sortQuery.createdAt = -1;
  else if (searchParams.sort === 'top-selling') sortQuery.numReviews = -1;
  const [products, categories, brands] = await Promise.all([
    Product.find(query).sort(sortQuery).lean(),
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
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb & Title */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#111827]">Shop All Products</h1>
        <p className="text-[#4B5563] mt-2 text-sm">Discover our full range of premium imported snacks, chocolates, coffee, and gourmet treats.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <ShopFilters categories={categories} brands={brands} />

        {/* Product Grid */}
        <main className="flex-1">
          {/* Toolbar */}
          <div className="flex justify-between items-center mb-6 bg-[#F7F8F5] border border-[#E5E7EB] p-4 rounded-2xl">
            <p className="text-xs sm:text-sm font-semibold text-[#4B5563]">Showing <span className="text-[#111827] font-bold">{products.length}</span> products</p>
            <ShopSort />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {products.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          
          {/* Pagination */}
          <div className="mt-12 flex justify-center space-x-2">
            <Button variant="outline" size="sm" className="rounded-xl border-[#E5E7EB] text-[#4B5563]" disabled>Previous</Button>
            <Button variant="default" size="sm" className="rounded-xl bg-[#163A32] text-white font-bold">1</Button>
            <Button variant="outline" size="sm" className="rounded-xl border-[#E5E7EB] text-[#4B5563] hover:text-[#163A32]">2</Button>
            <Button variant="outline" size="sm" className="rounded-xl border-[#E5E7EB] text-[#4B5563] hover:text-[#163A32]">3</Button>
            <Button variant="outline" size="sm" className="rounded-xl border-[#E5E7EB] text-[#4B5563] hover:text-[#163A32]">Next</Button>
          </div>
        </main>
      </div>
    </div>
  );
}
