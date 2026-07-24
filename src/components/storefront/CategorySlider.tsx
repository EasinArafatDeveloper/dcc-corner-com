"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

import 'swiper/css';

interface CategoryProps {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export function CategorySlider({ categories }: { categories: CategoryProps[] }) {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="w-full relative py-4">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={16}
        slidesPerView="auto"
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={categories.length > 3} // Only loop if there are enough categories
        className="w-full"
      >
        {categories.map((cat) => (
          <SwiperSlide key={cat._id} className="!w-auto">
            <Link href={`/category/${cat.slug}`} className="w-28 sm:w-32 md:w-40 lg:w-48 group rounded-xl lg:rounded-2xl overflow-hidden bg-background border border-border/50 aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full mb-2 md:mb-3 lg:mb-4 flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform bg-muted/50 p-1 md:p-2">
                 <img src={cat.image} alt={cat.name} className="w-full h-full object-cover rounded-full" />
              </div>
              <h3 className="font-medium text-[11px] sm:text-xs md:text-sm lg:text-base font-semibold text-center px-1 md:px-2 leading-tight line-clamp-2">{cat.name}</h3>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
