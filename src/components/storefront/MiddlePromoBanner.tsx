"use client";

import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowRight } from "lucide-react";

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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Link 
          href={targetLink}
          className="group relative block w-full overflow-hidden rounded-2xl sm:rounded-3xl shadow-md border border-[#E5E7EB] bg-white transition-all duration-500 hover:shadow-2xl hover:border-[#6B8F71]/50"
        >
          {/* Main Image Banner Container with fixed aspect ratio */}
          <div className="relative w-full aspect-[2.4/1] sm:aspect-[3.6/1] lg:aspect-[4.2/1] overflow-hidden bg-slate-900">
            {/* Poster Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={banner.imageUrl}
              alt={banner.title || "Special Offer Promo Banner"}
              className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />

            {/* Subtle Gradient Overlay on Hover for Premium Depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 opacity-60 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none" />

            {/* Optional Floating Offer Badge */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-5 z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#163A32]/90 backdrop-blur-md text-[#D6A84F] text-xs font-bold rounded-full shadow-lg border border-[#D6A84F]/30">
                <Sparkles className="w-3.5 h-3.5 fill-[#D6A84F]" /> Exclusive Offer
              </span>
            </div>

            {/* Floating Action Button indicator on desktop hover */}
            <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-5 z-10">
              <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/95 backdrop-blur-md text-[#163A32] text-xs sm:text-sm font-extrabold rounded-xl shadow-lg border border-[#E5E7EB] transform transition-all duration-300 group-hover:bg-[#163A32] group-hover:text-white group-hover:scale-105">
                Explore Offer <ArrowRight className="w-3.5 h-3.5 text-[#D6A84F]" />
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
