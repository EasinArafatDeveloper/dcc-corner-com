import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Sparkles, Flame } from "lucide-react";
import { HeroSlider } from "@/components/storefront/HeroSlider";
import { ProductCard } from "@/components/storefront/ProductCard";
import { OfferCard } from "@/components/storefront/OfferCard";
import { CategorySlider } from "@/components/storefront/CategorySlider";
import { MiddlePromoBanner } from "@/components/storefront/MiddlePromoBanner";
import { TrustBadges } from "@/components/shared/TrustBadges";
import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Banner from "@/models/Banner";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DCC Corner - Premium Imported Goods Marketplace in Bashundhara R/A',
  description: 'Fast delivery in Bashundhara R/A. 100% original imported coffee, chocolates, snacks and specialty pantry items at wholesale rates.',
};

// Force dynamic rendering for instant admin update reflection
export const dynamic = 'force-dynamic';

async function getHomePageData() {
  await connectToDatabase();

  const [banners, sideBanner, middleBanner, categories, topSelling, featured, offers, newArrivals] = await Promise.all([
    Banner.find({ isActive: true, isSideOffer: { $ne: true }, isMiddleBanner: { $ne: true } }).sort({ order: 1 }).lean(),
    Banner.findOne({ isActive: true, isSideOffer: true }).sort({ updatedAt: -1 }).lean(),
    Banner.findOne({ isActive: true, isMiddleBanner: true }).sort({ updatedAt: -1 }).lean(),
    Category.find({}).limit(8).lean(),
    Product.find({}).sort({ numReviews: -1 }).limit(5).lean(),
    Product.find({ isFeatured: true }).limit(5).lean(),
    Product.find({ discountPrice: { $gt: 0 } }).limit(5).lean(),
    Product.find({}).sort({ createdAt: -1 }).limit(5).lean()
  ]);

  return {
    banners: JSON.parse(JSON.stringify(banners)),
    sideBanner: sideBanner ? JSON.parse(JSON.stringify(sideBanner)) : null,
    middleBanner: middleBanner ? JSON.parse(JSON.stringify(middleBanner)) : null,
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
    <section className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2C2725] tracking-tight">{title}</h2>
            {subtitle && <p className="text-sm text-[#6B625D] mt-1 font-medium">{subtitle}</p>}
          </div>
          <Link href={viewAllHref} className="text-[#C5A059] font-bold hover:text-[#4A2C2A] flex items-center mt-3 md:mt-0 text-sm transition-colors">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-5">
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
    <section className="py-12 bg-[#FAF7F2] border-y border-[#E8E0D5]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#4A2C2A] text-[#C5A059] text-xs font-bold rounded-full mb-2">
              <Flame className="w-3.5 h-3.5 fill-[#C5A059]" /> DCC Special Deals
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#4A2C2A]">
              {title}
            </h2>
            {subtitle && <p className="text-[#6B625D] mt-1 text-sm font-medium">{subtitle}</p>}
          </div>
          <Link href={viewAllHref} className="text-[#C5A059] font-bold hover:text-[#4A2C2A] flex items-center mt-3 md:mt-0 text-sm transition-colors">
            View All Offers <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {products.slice(0, 4).map((product) => (
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
    <div className="flex flex-col min-h-screen bg-[#FAF7F2]">
      <div className="container mx-auto px-4 pt-4 sm:pt-6">
        {/* 1. Hero Section Slider */}
        <HeroSlider banners={data.banners} sideBanner={data.sideBanner} />
      </div>

      {/* 2. Category Visual Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#2C2725]">Explore Categories</h2>
              <p className="text-xs text-[#6B625D]">Select a category to view imported deals</p>
            </div>
            <Link href="/shop" className="text-xs font-bold text-[#C5A059] hover:underline">
              See All →
            </Link>
          </div>
          <CategorySlider categories={data.categories} />
        </div>
      </section>

      {/* 4. Special Wholesale Deals */}
      <OfferGrid 
        title="DCC Wholesale Deals" 
        subtitle="Save big compared to local supershop prices on imported items." 
        products={data.offers} 
        viewAllHref="/shop?offers=true" 
      />

      {/* 5. Top Selling Products */}
      <ProductGrid 
        title="Trending Imported Products" 
        subtitle="Our most requested coffee, chocolates, and specialty treats." 
        products={data.topSelling} 
        viewAllHref="/shop?sort=popular" 
      />

      {/* 5.5 Middle Section Promo Poster Banner */}
      <MiddlePromoBanner banner={data.middleBanner} />

      {/* 6. New Arrivals */}
      <div className="bg-white border-t border-[#E8E0D5]">
        <ProductGrid 
          title="New Arrivals" 
          subtitle="Freshly imported stock just arrived at DCC Corner." 
          products={data.newArrivals} 
          viewAllHref="/shop?sort=newest" 
        />
      </div>

      <div className="container mx-auto px-4 pb-16 pt-10 text-center">
        <Button size="lg" asChild className="rounded-xl px-8 bg-[#4A2C2A] hover:bg-[#3B221E] text-white font-bold shadow-lg">
          <Link href="/shop">
            Shop All Imported Deals <ArrowRight className="w-4 h-4 ml-2 text-[#C5A059]" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

