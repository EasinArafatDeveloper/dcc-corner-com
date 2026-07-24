import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import { HeroSlider } from "@/components/storefront/HeroSlider";
import { ProductCard } from "@/components/storefront/ProductCard";
import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Banner from "@/models/Banner";

// Disable caching for dynamic data (in a real app, use revalidate)
export const dynamic = 'force-dynamic';

async function getHomePageData() {
  await connectToDatabase();

  const [banners, categories, topSelling, featured, offers, newArrivals] = await Promise.all([
    Banner.find({ isActive: true }).sort({ order: 1 }).lean(),
    Category.find({}).limit(6).lean(),
    Product.find({}).sort({ numReviews: -1 }).limit(5).lean(), // Top selling by reviews
    Product.find({ isFeatured: true }).limit(5).lean(),
    Product.find({ discountPrice: { $gt: 0 } }).limit(5).lean(),
    Product.find({}).sort({ createdAt: -1 }).limit(5).lean()
  ]);

  return {
    banners: JSON.parse(JSON.stringify(banners)),
    categories: JSON.parse(JSON.stringify(categories)),
    topSelling: JSON.parse(JSON.stringify(topSelling)),
    featured: JSON.parse(JSON.stringify(featured)),
    offers: JSON.parse(JSON.stringify(offers)),
    newArrivals: JSON.parse(JSON.stringify(newArrivals)),
  };
}

// Reusable Product Grid Component
const ProductGrid = ({ title, subtitle, products, viewAllHref = "/shop" }: { title: string, subtitle?: string, products: any[], viewAllHref?: string }) => {
  if (!products || products.length === 0) return null;
  
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
            {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
          </div>
          <Link href={viewAllHref} className="text-primary font-medium hover:underline flex items-center mt-4 md:mt-0">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default async function HomePage() {
  const data = await getHomePageData();

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section Slider - pass dynamic banners */}
      <HeroSlider banners={data.banners} />

      {/* 2. Category Section */}
      <section className="py-16 bg-muted/20 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold tracking-tight">Shop by Category</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {data.categories.map((cat: any) => (
              <Link key={cat._id} href={`/category/${cat.slug}`} className="group rounded-2xl overflow-hidden bg-background border border-border/50 aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:shadow-md transition-all duration-300">
                <div className="w-16 h-16 rounded-full mb-3 flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform bg-muted/50">
                   <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-semibold text-sm text-center px-2">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* 3. Top Selling Products */}
      <ProductGrid title="Top Selling Products" subtitle="Our most loved imported treats." products={data.topSelling} viewAllHref="/shop?sort=top-selling" />

      {/* 4. Featured Products */}
      <div className="bg-primary/5">
        <ProductGrid title="Featured Products" subtitle="Handpicked premium selections for you." products={data.featured} viewAllHref="/shop?featured=true" />
      </div>

      {/* 5. Offer Products */}
      <ProductGrid title="Special Offers" subtitle="Grab these premium deals before they're gone!" products={data.offers} viewAllHref="/shop?offers=true" />

      {/* 6. New Products */}
      <div className="bg-secondary/5">
        <ProductGrid title="New Arrivals" subtitle="The latest additions to our global collection." products={data.newArrivals} viewAllHref="/shop?sort=newest" />
      </div>

      <div className="container mx-auto px-4 pb-20 pt-10 text-center">
         <Button size="lg" variant="default" asChild className="rounded-full px-8 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
            <Link href="/shop">Explore All Products <ArrowRight className="w-4 h-4 ml-2" /></Link>
         </Button>
      </div>
    </div>
  );
}
