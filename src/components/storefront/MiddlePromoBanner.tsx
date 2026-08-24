"use client";

import Link from "next/link";

interface MiddlePromoBannerProps {
  banner: {
    _id?: string;
    title?: string;
    imageUrl: string;
    linkUrl?: string;
    isActive?: boolean;
  };
}

export function MiddlePromoBanner({ banner }: MiddlePromoBannerProps) {
  if (!banner || !banner.imageUrl || banner.isActive === false) return null;

  const targetLink = banner.linkUrl || "/shop";

  return (
    <section className="py-6 sm:py-10 bg-transparent">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8">
        <Link 
          href={targetLink}
          className="group relative block w-full overflow-hidden rounded-t-2xl sm:rounded-t-3xl rounded-b-none border border-[#E5E7EB] bg-slate-50 transition-all duration-300 hover:border-[#6B8F71]/60"
        >
          {/* Main Image Banner Container matching Hero Section responsive aspect ratio */}
          <div className="relative w-full aspect-[21/9] sm:aspect-[2.35/1] md:aspect-[2.5/1] lg:aspect-[2.7/1] xl:aspect-[3/1] max-h-[460px] overflow-hidden bg-slate-50 flex items-center">
            {/* Poster Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={banner.imageUrl}
              alt={banner.title || "Special Offer Promo Banner"}
              className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-[1.015]"
            />
          </div>
        </Link>
      </div>
    </section>
  );
}
