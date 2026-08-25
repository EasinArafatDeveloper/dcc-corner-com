"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";

interface MiddlePromoBannerProps {
  banner?: {
    _id?: string;
    title?: string;
    subtitle?: string;
    badgeText?: string;
    buttonText?: string;
    overlayOpacity?: number;
    mediaType?: "image" | "video";
    imageUrl?: string;
    videoUrl?: string;
    linkUrl?: string;
    isActive?: boolean;
  } | null;
}

export function MiddlePromoBanner({ banner }: MiddlePromoBannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const defaultBanner = {
    title: "100% Authentic Imported Deals",
    subtitle: "Direct wholesale rates on chocolates, beverages, coffee & gourmet treats from global brands.",
    badgeText: "⚡ Wholesale Exclusive",
    buttonText: "Explore Wholesale Deals",
    overlayOpacity: 45,
    mediaType: "image" as const,
    imageUrl: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=1600&auto=format&fit=crop",
    videoUrl: "",
    linkUrl: "/shop?offers=true",
  };

  const activeBanner = (banner && (banner.imageUrl || banner.videoUrl) && banner.isActive !== false) 
    ? banner 
    : defaultBanner;

  const targetLink = activeBanner.linkUrl || "/shop";
  const isVideo = activeBanner.mediaType === "video" && Boolean(activeBanner.videoUrl);
  const opacityVal = typeof activeBanner.overlayOpacity === "number" ? activeBanner.overlayOpacity / 100 : 0.45;
  const hasOverlayText = Boolean(activeBanner.title || activeBanner.subtitle || activeBanner.badgeText || activeBanner.buttonText);

  // Performance Optimization: Pause video when off-screen to save 100% GPU/CPU decoding power
  useEffect(() => {
    if (!isVideo || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!videoRef.current) return;
          if (entry.isIntersecting) {
            videoRef.current.play().catch(() => {
              // Ignore browser autoplay policy rejections
            });
          } else {
            videoRef.current.pause();
          }
        });
      },
      { rootMargin: "150px 0px", threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isVideo, activeBanner.videoUrl]);

  return (
    <section className="py-6 sm:py-10 bg-transparent" style={{ contain: "paint" }}>
      <div className="container mx-auto px-3 sm:px-6 lg:px-8">
        <div 
          ref={containerRef}
          className="group relative block w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-black/10 shadow-xl bg-slate-950"
          style={{ transform: "translate3d(0, 0, 0)", backfaceVisibility: "hidden" }}
        >
          
          {/* Main Media Banner Container with responsive cinematic aspect ratio */}
          <div className="relative w-full min-h-[220px] sm:min-h-[280px] md:min-h-[340px] lg:min-h-[380px] max-h-[480px] overflow-hidden flex items-center">
            
            {/* 1. Background Video or Image with dedicated GPU layer */}
            {isVideo ? (
              <video
                ref={videoRef}
                key={activeBanner.videoUrl}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                poster={activeBanner.imageUrl || undefined}
                className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
                style={{
                  transform: "translate3d(0, 0, 0)",
                  willChange: "transform",
                  backfaceVisibility: "hidden",
                }}
              >
                <source src={activeBanner.videoUrl} type="video/mp4" />
                <source src={activeBanner.videoUrl} type="video/webm" />
                <source src={activeBanner.videoUrl} />
              </video>
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={activeBanner.imageUrl || "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=1600&auto=format&fit=crop"}
                alt={activeBanner.title || "Special Offer Promo Banner"}
                className="absolute inset-0 w-full h-full object-cover object-center"
                style={{ transform: "translate3d(0, 0, 0)", willChange: "transform" }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=1600&auto=format&fit=crop";
                }}
              />
            )}

            {/* 2. Soft Dark Overlay with custom opacity so text is crystal clear */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundColor: `rgba(0, 0, 0, ${opacityVal})`,
                backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.5) 100%)',
                transform: "translate3d(0, 0, 0)",
              }}
            />

            {/* 3. Foreground Text & CTA Layer */}
            {hasOverlayText && (
              <div className="relative z-10 w-full p-6 sm:p-10 md:p-14 flex flex-col justify-center items-start max-w-3xl">
                {activeBanner.badgeText && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-black tracking-wider uppercase bg-white/15 backdrop-blur-md text-[#D6A84F] border border-white/20 mb-2 sm:mb-3 shadow-xs animate-in fade-in duration-300">
                    <Sparkles className="w-3 h-3 text-[#D6A84F]" />
                    <span>{activeBanner.badgeText}</span>
                  </span>
                )}

                {activeBanner.title && (
                  <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white font-heading tracking-tight leading-tight drop-shadow-md">
                    {activeBanner.title}
                  </h2>
                )}

                {activeBanner.subtitle && (
                  <p className="text-xs sm:text-sm md:text-base text-white/90 max-w-xl mt-2 sm:mt-3 font-medium leading-relaxed drop-shadow">
                    {activeBanner.subtitle}
                  </p>
                )}

                {activeBanner.buttonText && (
                  <div className="mt-4 sm:mt-6">
                    <Link
                      href={targetLink}
                      className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-[#D6A84F] hover:bg-[#c6963e] text-[#163A32] font-extrabold text-xs sm:text-sm rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <span>{activeBanner.buttonText}</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* If no custom text is provided, full banner acts as direct link */}
            {!hasOverlayText && (
              <Link href={targetLink} className="absolute inset-0 z-20" aria-label={activeBanner.title || "Banner link"} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
