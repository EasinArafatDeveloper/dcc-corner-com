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
  Star,
  ShoppingBag
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
      
      {/* ===================== TOP HERO BENTO GRID (Standard 16:9 Fixed Ratio & Balanced Heights) ===================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 lg:gap-4 items-stretch">
        
        {/* Left 8 Columns: Fixed Height 16:9 Standard Banner Showcase Slider */}
        <div className="lg:col-span-8 relative rounded-3xl overflow-hidden shadow-lg border border-[#E5E7EB] bg-slate-100 h-[260px] sm:h-[340px] lg:h-[410px] flex items-center">
          <Swiper
            modules={[Autoplay, Pagination, Navigation, EffectFade]}
            effect="fade"
            spaceBetween={0}
            slidesPerView={1}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            navigation
            loop
            className="w-full h-full absolute inset-0 [--swiper-navigation-size:18px] md:[--swiper-navigation-size:22px] [--swiper-navigation-color:#FFFFFF] [--swiper-pagination-color:#D6A84F]"
          >
            {slideData.map((slide: any, idx: number) => (
              <SwiperSlide key={slide._id || idx} className="h-full relative">
                <Link 
                  href={slide.linkUrl || "/shop"}
                  className="block w-full h-full relative cursor-pointer group"
                >
                  <img 
                    src={slide.imageUrl} 
                    alt={slide.title || "DCC Corner Banner"} 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1511381939415-e44015466834?q=80&w=1600&auto=format&fit=crop";
                    }}
                  />
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Right 4 Columns: Interactive High-Converting Promo Bento (Aligned to 410px Height) */}
        <div className="lg:col-span-4 flex flex-col sm:grid sm:grid-cols-2 lg:flex lg:flex-col gap-3 lg:gap-3.5 h-full">
          
          {/* Card 1: Deal of the Day / Flash Wholesale Box */}
          <div className="flex-1 bg-white rounded-3xl p-3.5 sm:p-4 border border-[#E5E7EB] shadow-[0_4px_20px_rgba(22,58,50,0.05)] hover:shadow-[0_8px_30px_rgba(22,58,50,0.1)] hover:border-[#163A32]/40 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
            {/* Ambient Warm Gradient Backdrop */}
            <div className="absolute -top-10 -right-10 w-36 h-36 bg-gradient-to-br from-amber-100/60 to-red-100/30 rounded-full blur-2xl pointer-events-none" />

            <div>
              {/* Header: Dynamic Flash Deal Pill + Monospace Countdown Ticker */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-red-600 to-rose-500 text-white text-[10px] font-black shadow-xs shadow-red-500/20">
                  <Flame className="w-3 h-3 fill-white animate-pulse" /> Flash Deal
                </span>

                {/* Countdown Box with Mini Digit Blocks */}
                <div className="flex items-center gap-1 bg-[#F7F8F5] px-2 py-0.5 rounded-lg border border-[#E5E7EB] text-[10px] font-extrabold text-[#111827]">
                  <Clock className="w-3 h-3 text-[#D6A84F]" />
                  <span className="font-mono tracking-wider">
                    {String(timeLeft.hours).padStart(2, "0")}h : {String(timeLeft.minutes).padStart(2, "0")}m : {String(timeLeft.seconds).padStart(2, "0")}s
                  </span>
                </div>
              </div>

              {/* Product Preview Card */}
              <div className="flex items-center gap-2.5 p-1.5 rounded-xl bg-[#F7F8F5]/80 border border-[#E5E7EB]/60 group-hover:bg-white group-hover:border-[#6B8F71]/30 transition-all">
                {/* Product Image Thumbnail with Floating Discount Tag */}
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-white border border-[#E5E7EB] overflow-hidden shrink-0 p-1 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-300">
                  <img 
                    src="https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=400&auto=format&fit=crop" 
                    alt="Ferrero Rocher Golden Gift Box" 
                    className="w-full h-full object-contain"
                  />
                  <span className="absolute top-0.5 right-0.5 bg-red-600 text-white text-[8px] font-black px-1 py-0.2 rounded shadow-xs">
                    -29%
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-[9px] uppercase font-extrabold tracking-wider text-[#6B8F71]">Direct Import</span>
                  </div>
                  <h3 className="text-xs font-extrabold text-[#111827] line-clamp-1 group-hover:text-[#163A32] transition-colors mt-0.5 font-heading">
                    Ferrero Rocher Golden Box (16 Pcs)
                  </h3>
                  
                  {/* Price Row */}
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-sm sm:text-base font-black text-[#163A32]">৳850</span>
                    <span className="text-[11px] text-[#9CA3AF] line-through font-medium">৳1,200</span>
                    <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200/60">
                      Save ৳350
                    </span>
                  </div>
                </div>
              </div>

              {/* Stock Progress Meter */}
              <div className="mt-2 px-0.5 space-y-0.5">
                <div className="flex items-center justify-between text-[9px] font-bold text-[#4B5563]">
                  <span className="text-red-600 flex items-center gap-1">
                    🔥 Selling Fast: 14 left
                  </span>
                  <span className="text-[#9CA3AF]">78% claimed</span>
                </div>
                <div className="w-full h-1 bg-[#E5E7EB] rounded-full overflow-hidden">
                  <div className="w-[78%] h-full bg-gradient-to-r from-red-500 via-amber-500 to-[#D6A84F] rounded-full" />
                </div>
              </div>
            </div>

            {/* High-Converting Action Button */}
            <Link
              href="/shop?offers=true"
              className="mt-2.5 w-full py-2 bg-[#163A32] hover:bg-[#D6A84F] text-white hover:text-[#163A32] rounded-xl font-black text-xs transition-all duration-200 flex items-center justify-center gap-1.5 shadow-sm cursor-pointer group/btn"
            >
              <ShoppingBag className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
              <span>Claim Limited Deal</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Card 2: Bashundhara Express Delivery Guarantee */}
          <div className="flex-1 bg-gradient-to-br from-[#163A32] via-[#102B25] to-[#0A1D18] text-white rounded-3xl p-3.5 sm:p-4 border border-[#163A32] shadow-[0_6px_25px_rgba(22,58,50,0.12)] flex flex-col justify-between relative overflow-hidden group">
            {/* Ambient gold glow & subtle geometric pattern */}
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-[#D6A84F]/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
              <Truck className="w-20 h-20 text-white" />
            </div>

            <div>
              {/* Header: Express Pill + Live Pulsing City Indicator */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#D6A84F]/20 border border-[#D6A84F]/40 text-[#D6A84F] text-[10px] font-black shadow-xs">
                  <Truck className="w-3 h-3 text-[#D6A84F]" /> Express 2-Hour
                </span>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-[9px] text-emerald-300 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Bashundhara R/A</span>
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-sm sm:text-base font-black text-white leading-snug mt-0.5 font-heading tracking-tight">
                Craving Luxury Treats Right Now?
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-300 font-medium mt-1 leading-relaxed">
                Order within Bashundhara Block A-N for lightning fast doorstep delivery in insulated packs.
              </p>

              {/* 3 Quick Micro-Pills */}
              <div className="grid grid-cols-3 gap-1 mt-2 pt-1.5 border-t border-white/10 text-[9px] font-extrabold text-slate-200 text-center">
                <div className="p-1 rounded-lg bg-white/5 border border-white/10">
                  ⚡ 2-Hr Fast
                </div>
                <div className="p-1 rounded-lg bg-white/5 border border-white/10">
                  ❄️ Chill Box
                </div>
                <div className="p-1 rounded-lg bg-white/5 border border-white/10">
                  💵 Cash / bKash
                </div>
              </div>
            </div>

            {/* High-Impact Gold Button */}
            <Link
              href="/checkout"
              className="mt-2.5 w-full py-2 bg-gradient-to-r from-[#D6A84F] to-[#E5BE6A] hover:brightness-105 active:scale-98 text-[#163A32] rounded-xl font-black text-xs transition-all shadow-md shadow-[#D6A84F]/20 flex items-center justify-center gap-1.5 cursor-pointer group/order"
            >
              <span>Order Fast Delivery</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/order:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
