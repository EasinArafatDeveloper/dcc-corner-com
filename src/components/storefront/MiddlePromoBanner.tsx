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
  const defaultBanner = {
    title: "Exclusive Imported Treats & Direct Wholesale Deals",
    imageUrl: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=1600&auto=format&fit=crop",
    linkUrl: "/shop?offers=true",
  };

  const activeBanner = (banner && banner.imageUrl && banner.isActive !== false) ? banner : defaultBanner;
  const targetLink = activeBanner.linkUrl || "/shop";

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
              src={activeBanner.imageUrl}
              alt={activeBanner.title || "Special Offer Promo Banner"}
              className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-[1.015]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=1600&auto=format&fit=crop";
              }}
            />
          </div>
        </Link>
      </div>
    </section>
  );
}
