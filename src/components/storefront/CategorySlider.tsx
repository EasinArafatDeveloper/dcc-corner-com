"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/free-mode';

interface CategoryProps {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

const fallbackCategoryImages: Record<string, string> = {
  "imported-chocolates": "https://images.unsplash.com/photo-1511381939415-e44015466834?q=80&w=400&auto=format&fit=crop",
  "beverages": "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=400&auto=format&fit=crop",
  "chips-snacks": "https://images.unsplash.com/photo-1566478989037-eec170784d0b?q=80&w=400&auto=format&fit=crop",
  "cookies": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=400&auto=format&fit=crop",
  "candies": "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?q=80&w=400&auto=format&fit=crop",
  "instant-noodles": "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?q=80&w=400&auto=format&fit=crop",
};

export function CategorySlider({ categories }: { categories: CategoryProps[] }) {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="w-full relative pt-2 pb-6 px-1">
      <Swiper
        modules={[Autoplay, FreeMode]}
        spaceBetween={16}
        slidesPerView="auto"
        freeMode={true}
        grabCursor={true}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        className="w-full !py-2 !px-1 [&&_.swiper-wrapper]:justify-start md:[&&_.swiper-wrapper]:justify-center"
      >
        {categories.map((cat) => {
          const isPlaceholder = !cat.image || cat.image.includes("placehold.co");
          const displayImg = isPlaceholder 
            ? (fallbackCategoryImages[cat.slug] || "https://images.unsplash.com/photo-1511381939415-e44015466834?q=80&w=400&auto=format&fit=crop")
            : cat.image;

          return (
            <SwiperSlide key={cat._id} className="!w-auto">
              <Link 
                href={`/category/${cat.slug}`} 
                className="w-24 sm:w-28 md:w-36 lg:w-44 group rounded-2xl overflow-hidden bg-white border border-[#E8E0D5] p-3 sm:p-4 flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full mb-2 md:mb-3 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform bg-[#FAF7F2] p-1 border border-[#E8E0D5]">
                  <img 
                    src={displayImg} 
                    alt={cat.name} 
                    className="w-full h-full object-cover rounded-full" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1511381939415-e44015466834?q=80&w=400&auto=format&fit=crop";
                    }}
                  />
                </div>
                <h3 className="font-bold text-xs sm:text-sm text-[#2C2725] text-center leading-tight line-clamp-2 group-hover:text-[#4A2C2A]">
                  {cat.name}
                </h3>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
