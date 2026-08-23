"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { 
  Sparkles, 
  Flame, 
  Truck, 
  ShieldCheck, 
  ArrowRight, 
  Clock, 
  ChevronRight,
  Gift,
  Tag,
  Star
} from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

interface BannerProps {
  _id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
}

export function HeroSlider({ 
  banners, 
  sideBanner 
}: { 
  banners?: BannerProps[];
  sideBanner?: BannerProps;
}) {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 42, seconds: 18 });

  // Curated fallback slides with rich e-commerce content
  const defaultBanners = [
    {
      _id: "default-1",
      badge: "✨ 100% European & Swiss Imports",
      title: "Indulge in Genuine Artisan Chocolates & Gourmet Treats",
      subtext: "Directly imported from Switzerland, Belgium & the UK. Enjoy wholesale rates on your favorite Lindt, Ferrero Rocher & Godiva collections.",
      imageUrl: "https://images.unsplash.com/photo-1511381939415-e44015466834?q=80&w=1600&auto=format&fit=crop",
      linkUrl: "/category/imported-chocolates",
      primaryCta: "Shop Chocolates",
      secondaryCta: "View Wholesale Deals",
    },
    {
      _id: "default-2",
      badge: "☕ Premium Coffee & Pantry",
      title: "Elevate Your Morning with Davidoff & Artisan Roasts",
      subtext: "Authentic Davidoff Rich Aroma, Nescafe Gold & European pantry delights with fast same-day delivery right to your doorstep.",
      imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=1600&auto=format&fit=crop",
      linkUrl: "/category/beverages",
      primaryCta: "Explore Coffee",
      secondaryCta: "All Beverages",
    },
    {
      _id: "default-3",
      badge: "⚡ Bashundhara R/A Priority",
      title: "Wholesale Super-Shop Prices, 2-Hour Express Delivery",
      subtext: "Save up to 35% compared to local department stores. Genuine packaging, verified batch dates, and pristine cold storage guarantee.",
      imageUrl: "https://images.unsplash.com/photo-1587049352847-4a222e784d38?q=80&w=1600&auto=format&fit=crop",
      linkUrl: "/shop?offers=true",
      primaryCta: "Explore Wholesale Deals",
      secondaryCta: "Track My Order",
    }
  ];

  const validBanners = banners && banners.length > 0 
    ? banners.filter((b: any) => b.imageUrl && !b.imageUrl.includes("placehold.co"))
    : [];

  const slideData = validBanners.length > 0 ? validBanners : defaultBanners;

  // Live countdown ticker for Deal of the Day
  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 6, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full space-y-4 sm:space-y-5">
      
      {/* ===================== TOP HERO BENTO GRID ===================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-stretch">
        
        {/* Left 8 Columns: Dynamic Showcase Slider with Rich Vignette & CTAs */}
        <div className="lg:col-span-8 relative rounded-3xl overflow-hidden shadow-xl border border-[#E5E7EB] bg-[#0E2620] min-h-[360px] sm:min-h-[400px] lg:min-h-[440px] flex flex-col justify-end">
          <Swiper
            modules={[Autoplay, Pagination, Navigation, EffectFade]}
            effect="fade"
            spaceBetween={0}
            slidesPerView={1}
            autoplay={{ delay: 5500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            navigation
            loop
            className="w-full h-full absolute inset-0 [--swiper-navigation-size:18px] md:[--swiper-navigation-size:22px] [--swiper-navigation-color:#FFFFFF] [--swiper-pagination-color:#D6A84F]"
          >
            {slideData.map((slide: any, idx: number) => {
              const badge = slide.badge || "✨ 100% Authentic Imported Goods";
              const title = slide.title || "Premium Imported Treats at Wholesale Rates";
              const subtext = slide.subtext || "Directly sourced from trusted European suppliers. Fast doorstep delivery in Bashundhara R/A.";
              const primaryCta = slide.primaryCta || "Shop Now";
              const secondaryCta = slide.secondaryCta || "Explore Deals";

              return (
                <SwiperSlide key={slide._id || idx} className="h-full relative">
                  {/* Background Image with Zoom & Dark Gradient Overlay */}
                  <div className="absolute inset-0 w-full h-full overflow-hidden">
                    <img 
                      src={slide.imageUrl} 
                      alt={slide.title || "Hero Banner"} 
                      className="w-full h-full object-cover transform scale-102 transition-transform duration-7000 ease-out" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1511381939415-e44015466834?q=80&w=1600&auto=format&fit=crop";
                      }}
                    />
                    {/* Multi-layered cinematic gradient for text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0E2620]/95 via-[#0E2620]/60 to-[#0E2620]/25" />
                    <div className="absolute inset-0 bg-radial-at-l from-[#163A32]/50 to-transparent" />
                  </div>

                  {/* Content Overlay */}
                  <div className="relative z-10 h-full flex flex-col justify-end p-6 sm:p-8 lg:p-10 max-w-2xl text-left">
                    
                    {/* Badge */}
                    <div className="mb-3">
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#163A32]/85 backdrop-blur-md border border-[#D6A84F]/40 text-[#D6A84F] text-xs font-black shadow-sm tracking-wide">
                        <Sparkles className="w-3.5 h-3.5 text-[#D6A84F]" />
                        {badge}
                      </span>
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-[1.18] mb-3 drop-shadow-sm font-heading">
                      {title}
                    </h1>

                    {/* Subtext */}
                    <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed mb-6 line-clamp-2 max-w-lg">
                      {subtext}
                    </p>

                    {/* Dual Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <Link
                        href={slide.linkUrl || "/shop"}
                        className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#D6A84F] hover:bg-[#E0BC70] text-[#163A32] text-xs sm:text-sm font-black shadow-lg shadow-[#D6A84F]/25 transition-all hover:scale-103 active:scale-98 flex items-center gap-2 cursor-pointer group"
                      >
                        <span>{primaryCta}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>

                      <Link
                        href="/shop?offers=true"
                        className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white text-xs sm:text-sm font-bold transition-all hover:scale-102 active:scale-98 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Flame className="w-4 h-4 text-[#D6A84F] fill-[#D6A84F]" />
                        <span>{secondaryCta}</span>
                      </Link>
                    </div>

                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        {/* Right 4 Columns: Interactive Promo Bento (Deal of the Day + Express Card) */}
        <div className="lg:col-span-4 flex flex-col sm:grid sm:grid-cols-2 lg:flex lg:flex-col gap-4 lg:gap-4">
          
          {/* Card 1: Deal of the Day / Flash Wholesale Box */}
          <div className="flex-1 bg-white rounded-3xl p-4 sm:p-5 border border-[#E5E7EB] shadow-md hover:border-[#163A32] transition-all flex flex-col justify-between relative overflow-hidden group">
            {/* Subtle background glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D6A84F]/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              {/* Header: Tag + Live Countdown */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-[11px] font-black">
                  <Flame className="w-3 h-3 fill-red-600" /> Flash Deal
                </span>

                {/* Countdown Ticker */}
                <div className="flex items-center gap-1 text-[11px] font-bold text-[#4B5563] bg-[#F7F8F5] px-2.5 py-1 rounded-full border border-[#E5E7EB]">
                  <Clock className="w-3 h-3 text-[#D6A84F]" />
                  <span>
                    {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}
                  </span>
                </div>
              </div>

              {/* Product Preview & Discount info */}
              <div className="flex items-center gap-3.5 my-2">
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-[#F7F8F5] border border-[#E5E7EB] overflow-hidden shrink-0 p-1.5 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <img 
                    src="https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=400&auto=format&fit=crop" 
                    alt="Ferrero Rocher Box" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#6B8F71]">Limited Stock</span>
                  <h3 className="text-xs sm:text-sm font-extrabold text-[#111827] line-clamp-1 group-hover:text-[#163A32] transition-colors">
                    Ferrero Rocher Golden Gift Box (16 Pcs)
                  </h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-base font-black text-[#163A32]">৳850</span>
                    <span className="text-xs text-[#9CA3AF] line-through">৳1,200</span>
                    <span className="text-[10px] font-black text-red-600 bg-red-50 px-1.5 py-0.5 rounded-md">-29%</span>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/shop?offers=true"
              className="mt-3 w-full py-2.5 bg-[#F7F8F5] hover:bg-[#163A32] text-[#163A32] hover:text-white rounded-2xl font-black text-xs transition-colors flex items-center justify-center gap-1.5 group-hover:bg-[#163A32] group-hover:text-white cursor-pointer"
            >
              <span>Claim Limited Deal</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: Bashundhara Express Delivery Guarantee */}
          <div className="flex-1 bg-[#163A32] text-white rounded-3xl p-4 sm:p-5 border border-[#163A32] shadow-md flex flex-col justify-between relative overflow-hidden group">
            {/* Ambient gold glow */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#D6A84F]/20 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#D6A84F] text-[11px] font-black">
                  <Truck className="w-3 h-3 text-[#D6A84F]" /> Express 2-Hour
                </span>
                <span className="text-[10px] text-emerald-200/80 font-bold">Bashundhara R/A</span>
              </div>

              <h3 className="text-sm sm:text-base font-black text-white leading-snug mt-1.5 font-heading">
                Craving Luxury Treats Right Now?
              </h3>
              <p className="text-[11px] text-slate-300 font-medium mt-1 leading-relaxed">
                Order within Bashundhara Block A-N for lightning fast doorstep delivery in insulated packages.
              </p>
            </div>

            <Link
              href="/checkout"
              className="mt-3.5 w-full py-2.5 bg-[#D6A84F] hover:bg-[#E0BC70] text-[#163A32] rounded-2xl font-black text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer hover:scale-102 active:scale-98"
            >
              <span>Order Fast Delivery</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}

