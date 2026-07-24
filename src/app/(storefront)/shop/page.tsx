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

export const dynamic = 'force-dynamic';

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
  else sortQuery.createdAt = -1; // Default fallback

  const [products, categories] = await Promise.all([
    Product.find(query).sort(sortQuery).lean(),
    Category.find({}).lean()
  ]);

  // We fetch all products (without filters) just to get the full list of available brands for the filter sidebar
  const allProducts = await Product.find({}).select('brand').lean();
  const brands = Array.from(new Set(allProducts.map(p => (p as any).brand)));

  return {
    products: JSON.parse(JSON.stringify(products)),
    categories: JSON.parse(JSON.stringify(categories)),
    brands
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
        <h1 className="text-4xl font-bold tracking-tight">Shop All Products</h1>
        <p className="text-muted-foreground mt-2">Discover our full range of premium imported snacks and confectionery.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <ShopFilters categories={categories} brands={brands} />

        {/* Product Grid */}
        <main className="flex-1">
          {/* Toolbar */}
          <div className="flex justify-between items-center mb-6 bg-muted/30 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Showing {products.length} products</p>
            <ShopSort />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          
          {/* Pagination Placeholder */}
          <div className="mt-12 flex justify-center space-x-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="default" size="sm">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </main>
      </div>
    </div>
  );
}
