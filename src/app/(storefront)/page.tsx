import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import { HeroSlider } from "@/components/storefront/HeroSlider";
import { ProductCard } from "@/components/storefront/ProductCard";
import { OfferCard } from "@/components/storefront/OfferCard";
import { CategorySlider } from "@/components/storefront/CategorySlider";
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

// Reusable Offer Grid Component
const OfferGrid = ({ title, subtitle, products, viewAllHref = "/shop?offers=true" }: { title: string, subtitle?: string, products: any[], viewAllHref?: string }) => {
  if (!products || products.length === 0) return null;
  
  return (
    <section className="py-16 bg-red-50/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-red-600 uppercase flex items-center gap-2">
              <Star className="w-8 h-8 fill-red-500 animate-pulse" />
              {title}
            </h2>
            {subtitle && <p className="text-red-900/70 mt-2 font-medium">{subtitle}</p>}
          </div>
          <Link href={viewAllHref} className="text-red-600 font-bold hover:underline flex items-center mt-4 md:mt-0">
            View All Offers <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {products.map((product) => (
            <OfferCard key={product._id} product={product} />
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

      {/* 2. Features/Benefits Bar */}
      <div className="bg-secondary/10 py-6 border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <h3 className="font-bold text-sm">100% Imported</h3>
              <p className="text-xs text-muted-foreground mt-1">Authentic brands</p>
            </div>
            <div>
              <h3 className="font-bold text-sm">Premium Quality</h3>
              <p className="text-xs text-muted-foreground mt-1">Carefully sourced</p>
            </div>
            <div>
              <h3 className="font-bold text-sm">Wide Variety</h3>
              <p className="text-xs text-muted-foreground mt-1">From around the globe</p>
            </div>
            <div>
              <h3 className="font-bold text-sm">Trusted Products</h3>
              <p className="text-xs text-muted-foreground mt-1">Loved by thousands</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Shop by Category (Auto Swiper) */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold tracking-tight">Shop by Category</h2>
          </div>
          <CategorySlider categories={data.categories} />
        </div>
      </section>
      
      {/* 4. Top Selling Products */}
      <div className="bg-slate-50 border-y">
        <ProductGrid title="Top Selling Products" subtitle="Our most loved imported treats." products={data.topSelling} viewAllHref="/shop?sort=popular" />
      </div>

      {/* 5. Offer Products */}
      <OfferGrid title="Special Offers" subtitle="Grab these premium deals before they're gone!" products={data.offers} viewAllHref="/shop?offers=true" />

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
