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

export function HeroSlider({ banners }: { banners: BannerProps[] }) {
  if (!banners || banners.length === 0) return null;

  return (
    <div className="w-full relative">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        loop
        className="w-full aspect-[21/9] md:aspect-[3/1] [--swiper-navigation-size:20px] md:[--swiper-navigation-size:44px] [--swiper-navigation-color:#fff]"
      >
        {banners.map((slide) => (
          <SwiperSlide key={slide._id}>
            <div className="w-full h-full relative">
              <Link href={slide.linkUrl}>
                <img 
                  src={slide.imageUrl} 
                  alt={slide.title} 
                  className="w-full h-full object-cover"
                />
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
