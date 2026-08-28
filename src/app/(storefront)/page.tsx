import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Sparkles, Flame, ShieldCheck, CheckCircle2 } from "lucide-react";
import { HeroSlider } from "@/components/storefront/HeroSlider";
import { ProductCard } from "@/components/storefront/ProductCard";
import { OfferCard } from "@/components/storefront/OfferCard";
import { CategorySlider } from "@/components/storefront/CategorySlider";
import { MiddlePromoBanner } from "@/components/storefront/MiddlePromoBanner";
import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Banner from "@/models/Banner";
import { Metadata } from 'next';
import { cache } from 'react';

export const metadata: Metadata = {
  title: 'DCC Corner — Premium Imported Chocolates & Snacks in Bashundhara, Dhaka',
  description: 'Shop 100% genuine imported chocolates, Korean ramen, international beverages, and gourmet chips at DCC Corner Bashundhara. 2-Hour Express Delivery across Dhaka.',
  keywords: [
    'DCC Corner',
    'DCC Corner Bashundhara',
    'DCC Corner Dhaka',
    'DCC Corner BD',
    'Imported chocolates Bangladesh',
    'Imported snacks Dhaka',
    'Bashundhara express delivery',
    'Wholesale chocolates BD'
  ],
  alternates: {
    canonical: 'https://dcccorner.com',
  },
  openGraph: {
    title: 'DCC Corner — Premium Imported Chocolates & Snacks in Bashundhara',
    description: '100% genuine imported chocolates, confectionery, and snacks with 2-Hour Express Delivery in Bashundhara R/A.',
    url: 'https://dcccorner.com',
    siteName: 'DCC Corner',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'DCC Corner Homepage',
      },
    ],
  },
};

// Revalidate cache every 30 seconds for blazing fast page loads while keeping admin updates fresh
export const revalidate = 30;

const getHomePageData = cache(async () => {
  try {
    await connectToDatabase();

    const [banners, sideBanner, middleBanner, categories, topSelling, featured, offers, newArrivals] = await Promise.all([
      Banner.find({ isActive: true, isSideOffer: { $ne: true }, isMiddleBanner: { $ne: true } }).sort({ order: 1 }).lean(),
      Banner.findOne({ isActive: true, isSideOffer: true }).sort({ updatedAt: -1 }).lean(),
      Banner.findOne({ isActive: true, isMiddleBanner: true }).sort({ updatedAt: -1 }).lean(),
      Category.find({}).sort({ createdAt: -1 }).limit(8).lean(),
      Product.find({}).sort({ numReviews: -1 }).limit(8).lean(),
      Product.find({ isFeatured: true }).limit(8).lean(),
      Product.find({ discountPrice: { $gt: 0 } }).limit(12).lean(),
      Product.find({}).sort({ createdAt: -1 }).limit(8).lean()
    ]);

    return {
      banners: JSON.parse(JSON.stringify(banners || [])),
      sideBanner: sideBanner ? JSON.parse(JSON.stringify(sideBanner)) : null,
      middleBanner: middleBanner ? JSON.parse(JSON.stringify(middleBanner)) : null,
      categories: JSON.parse(JSON.stringify(categories || [])),
      topSelling: JSON.parse(JSON.stringify(topSelling || [])),
      featured: JSON.parse(JSON.stringify(featured || [])),
      offers: JSON.parse(JSON.stringify(offers || [])),
      newArrivals: JSON.parse(JSON.stringify(newArrivals || [])),
    };
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    return {
      banners: [],
      sideBanner: null,
      middleBanner: null,
      categories: [],
      topSelling: [],
      featured: [],
      offers: [],
      newArrivals: [],
    };
  }
});

// Reusable Product Grid Component
const ProductGrid = ({ title, subtitle, products, viewAllHref = "/shop" }: { title: string, subtitle?: string, products: any[], viewAllHref?: string }) => {
  if (!products || products.length === 0) return null;
  
  return (
    <section className="py-10 sm:py-14">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight font-heading">{title}</h2>
            {subtitle && <p className="text-xs sm:text-sm text-[#4B5563] mt-1 font-medium">{subtitle}</p>}
          </div>
          <Link href={viewAllHref} className="text-[#6B8F71] font-bold hover:text-[#163A32] flex items-center mt-3 md:mt-0 text-xs sm:text-sm transition-colors group">
            <span>View All</span>
            <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5.5">
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
  
  const displayedOffers = products.slice(0, 4);
  const hasMore = products.length > 4;

  return (
    <section className="py-10 sm:py-14 bg-[#F7F8F5] rounded-t-[32px] sm:rounded-t-[44px] border-t border-[#E5E7EB] shadow-xs relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#163A32] text-[#D6A84F] border border-[#D6A84F]/30 text-xs font-bold rounded-full mb-2 shadow-2xs">
              <Flame className="w-3.5 h-3.5 fill-[#D6A84F]" /> DCC Special Deals
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#163A32] font-heading">
              {title}
            </h2>
            {subtitle && <p className="text-[#4B5563] mt-1 text-xs sm:text-sm font-medium">{subtitle}</p>}
          </div>
          <Link href={viewAllHref} className="text-[#6B8F71] font-bold hover:text-[#163A32] flex items-center mt-3 md:mt-0 text-xs sm:text-sm transition-colors group">
            <span>View All Offers</span>
            <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {displayedOffers.map((product) => (
            <OfferCard key={product._id} product={product} />
          ))}
        </div>

        {/* See More button if there are more offers */}
        {hasMore && (
          <div className="mt-8 sm:mt-10 flex justify-center">
            <Link
              href={viewAllHref}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white border-2 border-[#163A32] text-[#163A32] hover:bg-[#163A32] hover:text-white rounded-2xl font-extrabold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all duration-200 group"
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

// Popular Imported Brands Section
const PopularBrands = () => {
  const brands = [
    { name: "Ferrero Rocher", origin: "Italy", query: "Ferrero" },
    { name: "Davidoff Coffee", origin: "Switzerland", query: "Davidoff" },
    { name: "Pringles", origin: "USA", query: "Pringles" },
    { name: "Lindt Chocolate", origin: "Switzerland", query: "Lindt" },
    { name: "Samyang Buldak", origin: "Korea", query: "Samyang" },
    { name: "Lotus Biscoff", origin: "Belgium", query: "Lotus" },
    { name: "Oreo", origin: "USA", query: "Oreo" },
    { name: "Cheetos", origin: "USA", query: "Cheetos" },
  ];

  return (
    <section className="py-10 bg-[#F7F8F5] border-y border-[#E5E7EB]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold text-[#6B8F71] uppercase tracking-wider">Direct Sourcing</span>
          <h3 className="text-xl sm:text-2xl font-black text-[#111827] font-heading mt-1">
            Authentic Global Brands
          </h3>
          <p className="text-xs sm:text-sm text-[#4B5563] mt-1">
            Directly imported from USA, UK, Switzerland, Italy, and South Korea.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {brands.map((brand) => (
            <Link
              key={brand.name}
              href={`/shop?brand=${encodeURIComponent(brand.query)}`}
              className="bg-white border border-[#E5E7EB] hover:border-[#163A32] p-3.5 rounded-2xl text-center shadow-2xs hover:shadow-md transition-all group cursor-pointer flex flex-col items-center justify-center min-h-[90px]"
            >
              <span className="text-xs font-black text-[#111827] group-hover:text-[#163A32] transition-colors line-clamp-1">
                {brand.name}
              </span>
              <span className="text-[10px] font-bold text-[#6B8F71] bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100 mt-1">
                {brand.origin}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default async function HomePage() {
  const data = await getHomePageData();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. Hero Section Wrapper (Seamless pure white background) */}
      <div className="relative bg-white pb-4 pt-2 sm:pt-4 border-b border-[#E5E7EB]/60">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
          <HeroSlider banners={data.banners} sideBanner={data.sideBanner} />
        </div>
      </div>

      {/* 2. Category Visual Grid */}
      <section className="py-6 sm:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-5 sm:mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#111827] font-heading">Explore Categories</h2>
              <p className="text-xs text-[#4B5563]">Select a category to view imported deals</p>
            </div>
            {data.categories && data.categories.length > 4 && (
              <Link href="/shop" className="text-xs font-bold text-[#6B8F71] hover:text-[#163A32] hover:underline">
                See All →
              </Link>
            )}
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

      {/* 5. Trending Imported Products */}
      <ProductGrid 
        title="Trending Imported Products" 
        subtitle="Our most requested coffee, chocolates, and specialty treats." 
        products={data.topSelling} 
        viewAllHref="/shop?sort=top-selling" 
      />

      {/* 6. Middle Section Promo Poster Banner */}
      <MiddlePromoBanner banner={data.middleBanner} />

      {/* 7. New Arrivals */}
      <div className="bg-white">
        <ProductGrid 
          title="New Arrivals" 
          subtitle="Freshly imported stock just arrived at DCC Corner." 
          products={data.newArrivals} 
          viewAllHref="/shop?sort=newest" 
        />
      </div>

      {/* 8. Popular Global Brands Bar */}
      <PopularBrands />

      {/* 9. Bottom CTA Section */}
      <div className="container mx-auto px-4 py-12 sm:py-16 text-center">
        <div className="max-w-2xl mx-auto bg-radial from-slate-50 to-white p-8 rounded-3xl border border-[#E5E7EB] shadow-xs">
          <span className="text-xs font-bold text-[#6B8F71] uppercase tracking-wider">Fast Bashundhara Delivery</span>
          <h3 className="text-2xl sm:text-3xl font-black text-[#111827] mt-1 font-heading">
            Looking for something special?
          </h3>
          <p className="text-xs sm:text-sm text-[#4B5563] mt-2 mb-6">
            Explore our complete collection of 100% authentic direct-import goods at unbeatable wholesale prices.
          </p>
          <Button size="lg" asChild className="rounded-2xl px-8 h-12 bg-[#163A32] hover:bg-[#0E2620] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#163A32]/20 cursor-pointer">
            <Link href="/shop" className="inline-flex items-center gap-2">
              <span>Browse All Imported Products</span>
              <ArrowRight className="w-4 h-4 text-[#D6A84F]" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
