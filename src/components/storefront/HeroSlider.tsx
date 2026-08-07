"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

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
  const defaultBanners = [
    {
      _id: "default-1",
      title: "ডিসিসি কর্নার এখন আপনার ফোনে — বসুন্ধরায় ফাস্ট ডেলিভারি।",
      imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=1600&auto=format&fit=crop",
      linkUrl: "/shop",
      subtext: "সুপারশপের চেয়ে কম দামে ১০০% অরিজিনাল ইমপোর্টেড পণ্য।",
      cta: "Shop Imported Deals",
    },
    {
      _id: "default-2",
      title: "অরিজিনাল ইমপোর্টেড চকলেট ও কফি হোলসেল দামে",
      imageUrl: "https://images.unsplash.com/photo-1511381939415-e44015466834?q=80&w=1600&auto=format&fit=crop",
      linkUrl: "/category/imported-chocolates",
      subtext: "UK, Switzerland & Europe থেকে আমদানিকৃত সেরা ব্র্যান্ড।",
      cta: "Explore Chocolates",
    },
  ];

  const validBanners = banners && banners.length > 0 
    ? banners.filter((b: any) => b.imageUrl && !b.imageUrl.includes("placehold.co"))
    : [];

  const slideData = validBanners.length > 0 ? validBanners : defaultBanners;

  const fallbackPosterUrl = "https://images.unsplash.com/photo-1587049352847-4a222e784d38?q=80&w=1000&auto=format&fit=crop";
  const activeSideBanner = sideBanner || {
    _id: "side-default",
    title: "Exclusive Imported Offer",
    imageUrl: fallbackPosterUrl,
    linkUrl: "/shop?offers=true",
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5 items-stretch">
      
      {/* Left 2 Columns: Swiper Main Slider (Recommended Size: 1200 x 600 px) */}
      <div className="lg:col-span-2 relative rounded-2xl overflow-hidden shadow-md border border-[#E8E0D5] h-[220px] sm:h-[260px] lg:h-[310px]">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          effect="fade"
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          loop
          className="w-full h-full [--swiper-navigation-size:18px] md:[--swiper-navigation-size:24px] [--swiper-navigation-color:#FAF7F2] [--swiper-pagination-color:#C5A059]"
        >
          {slideData.map((slide: any, index: number) => (
            <SwiperSlide key={slide._id} className="h-full">
              <Link href={slide.linkUrl || "/shop"} className="block w-full h-full relative cursor-pointer">
                <img 
                  src={slide.imageUrl} 
                  alt={slide.title || "Hero Banner"} 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=1600&auto=format&fit=crop";
                  }}
                />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Right 1 Column: Clean Poster Card (Recommended Size: 600 x 600 px or 600 x 750 px) */}
      <div className="lg:col-span-1 relative rounded-2xl overflow-hidden shadow-md border border-[#E8E0D5] bg-[#FAF7F2] h-[220px] sm:h-[260px] lg:h-[310px] flex flex-col">
        <Link href={activeSideBanner.linkUrl || "/shop?offers=true"} className="block w-full h-full relative cursor-pointer">
          <img 
            src={activeSideBanner.imageUrl} 
            alt={activeSideBanner.title || "Side Offer Poster"} 
            className="w-full h-full object-cover" 
            onError={(e) => {
              // Fallback to default poster if the image URL returns HTTP 403 Forbidden or 404
              (e.target as HTMLImageElement).src = fallbackPosterUrl;
            }}
          />
        </Link>
      </div>

    </div>
  );
}
