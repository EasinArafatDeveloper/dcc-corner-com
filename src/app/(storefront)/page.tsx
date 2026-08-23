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

import { cache } from 'react';

// Revalidate cache every 30 seconds for blazing fast page loads while keeping admin updates fresh
export const revalidate = 30;

const getHomePageData = cache(async () => {
  await connectToDatabase();

  const [banners, sideBanner, middleBanner, categories, topSelling, featured, offers, newArrivals] = await Promise.all([
    Banner.find({ isActive: true, isSideOffer: { $ne: true }, isMiddleBanner: { $ne: true } }).sort({ order: 1 }).lean(),
    Banner.findOne({ isActive: true, isSideOffer: true }).sort({ updatedAt: -1 }).lean(),
    Banner.findOne({ isActive: true, isMiddleBanner: true }).sort({ updatedAt: -1 }).lean(),
    Category.find({}).limit(8).lean(),
    Product.find({}).sort({ numReviews: -1 }).limit(5).lean(),
    Product.find({ isFeatured: true }).limit(5).lean(),
    Product.find({ discountPrice: { $gt: 0 } }).limit(24).lean(),
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
});

// Reusable Product Grid Component
const ProductGrid = ({ title, subtitle, products, viewAllHref = "/shop" }: { title: string, subtitle?: string, products: any[], viewAllHref?: string }) => {
  if (!products || products.length === 0) return null;
  
  return (
    <section className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">{title}</h2>
            {subtitle && <p className="text-sm text-[#4B5563] mt-1 font-medium">{subtitle}</p>}
          </div>
          <Link href={viewAllHref} className="text-[#6B8F71] font-bold hover:text-[#163A32] flex items-center mt-3 md:mt-0 text-sm transition-colors">
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

// Reusable Offer Grid Component - Displays strictly 4 offers on homepage with "See More" button if > 4
const OfferGrid = ({ title, subtitle, products, viewAllHref = "/shop?offers=true" }: { title: string, subtitle?: string, products: any[], viewAllHref?: string }) => {
  if (!products || products.length === 0) return null;
  
  const displayedOffers = products.slice(0, 4);
  const hasMore = products.length > 4;

  return (
    <section className="py-12 bg-[#F7F8F5] border-y border-[#E5E7EB]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#163A32] text-[#D6A84F] border border-[#D6A84F]/30 text-xs font-bold rounded-full mb-2 shadow-2xs">
              <Flame className="w-3.5 h-3.5 fill-[#D6A84F]" /> DCC Special Deals
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#163A32]">
              {title}
            </h2>
            {subtitle && <p className="text-[#4B5563] mt-1 text-sm font-medium">{subtitle}</p>}
          </div>
          <Link href={viewAllHref} className="text-[#6B8F71] font-bold hover:text-[#163A32] flex items-center mt-3 md:mt-0 text-sm transition-colors">
            View All Offers <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {displayedOffers.map((product) => (
            <OfferCard key={product._id} product={product} />
          ))}
        </div>

        {/* See More button if there are more than 4 offers */}
        {hasMore && (
          <div className="mt-8 sm:mt-10 flex justify-center">
            <Link
              href={viewAllHref}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white border-2 border-[#163A32] text-[#163A32] hover:bg-[#163A32] hover:text-white rounded-2xl font-extrabold text-sm shadow-xs hover:shadow-md transition-all duration-200 group"
            >
              <span>See More Deals ({products.length - 4}+ More)</span>
              <ArrowRight className="w-4 h-4 text-[#D6A84F] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default async function HomePage() {
  const data = await getHomePageData();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. Hero Section Wrapper with Soft DCC Corner Brand Color Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#F0F5F2] via-[#F7F8F5] to-white pb-6 pt-2 sm:pt-4 border-b border-[#E5E7EB]/60">
        {/* Ambient Subtle Glows */}
        <div className="absolute -top-12 left-1/4 w-96 h-96 bg-[#6B8F71]/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-8 w-72 h-72 bg-[#D6A84F]/6 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
          <HeroSlider banners={data.banners} sideBanner={data.sideBanner} />
        </div>
      </div>

      {/* 2. Category Visual Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#111827]">Explore Categories</h2>
              <p className="text-xs text-[#4B5563]">Select a category to view imported deals</p>
            </div>
            <Link href="/shop" className="text-xs font-bold text-[#6B8F71] hover:text-[#163A32] hover:underline">
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
      <div className="bg-white border-t border-[#E5E7EB]">
        <ProductGrid 
          title="New Arrivals" 
          subtitle="Freshly imported stock just arrived at DCC Corner." 
          products={data.newArrivals} 
          viewAllHref="/shop?sort=newest" 
        />
      </div>

      <div className="container mx-auto px-4 pb-16 pt-10 text-center">
        <Button size="lg" asChild className="rounded-xl px-8 bg-[#163A32] hover:bg-[#0E2620] text-white font-bold shadow-lg shadow-[#163A32]/20">
          <Link href="/shop">
            Shop All Imported Deals <ArrowRight className="w-4 h-4 ml-2 text-[#D6A84F]" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

