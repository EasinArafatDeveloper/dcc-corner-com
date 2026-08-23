"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import Link from "next/link";
import { 
  Flame, 
  Truck, 
  ArrowRight, 
  Clock, 
  ChevronRight,
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
      title: "Indulge in Genuine Artisan Chocolates & Gourmet Treats",
      imageUrl: "https://images.unsplash.com/photo-1511381939415-e44015466834?q=80&w=1600&auto=format&fit=crop",
      linkUrl: "/category/imported-chocolates",
    },
    {
      _id: "default-2",
      title: "Elevate Your Morning with Davidoff & Artisan Roasts",
      imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=1600&auto=format&fit=crop",
      linkUrl: "/category/beverages",
    },
    {
      _id: "default-3",
      title: "Wholesale Super-Shop Prices, 2-Hour Express Delivery",
      imageUrl: "https://images.unsplash.com/photo-1587049352847-4a222e784d38?q=80&w=1600&auto=format&fit=crop",
      linkUrl: "/shop?offers=true",
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
    <div className="w-full">
      {/* ===================== FULL WIDTH HERO BANNER SLIDER ===================== */}
      <div className="w-full relative rounded-t-2xl sm:rounded-t-3xl rounded-b-none overflow-hidden bg-slate-50 aspect-[16/9] sm:aspect-[21/9] lg:aspect-[2.4/1] xl:h-[460px] flex items-center">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          effect="fade"
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          loop
          className="w-full h-full absolute inset-0 [--swiper-navigation-size:18px] md:[--swiper-navigation-size:24px] [--swiper-navigation-color:#FFFFFF] [--swiper-pagination-color:#D6A84F]"
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
    </div>
  );
}
