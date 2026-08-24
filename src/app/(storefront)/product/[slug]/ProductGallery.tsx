"use client";

import { useState } from "react";
import { PlayCircle, Sparkles } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  productName: string;
  discountPercent?: number;
}

export function ProductGallery({ images, productName, discountPercent }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string>(
    images && images.length > 0 ? images[0] : "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=600&auto=format&fit=crop"
  );
  const [isVideoActive, setIsVideoActive] = useState(false);

  const validImages = images && images.length > 0 ? images : [selectedImage];

  return (
    <div className="w-full space-y-3 sm:space-y-4">
      {/* Main Image Stage */}
      <div className="relative w-full aspect-square max-h-[480px] lg:max-h-[520px] bg-[#F7F8F5] border border-[#E5E7EB] rounded-3xl p-6 sm:p-10 flex items-center justify-center overflow-hidden group shadow-2xs">
        {/* Floating Top Badge */}
        {discountPercent && discountPercent > 0 ? (
          <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 z-10">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 text-white text-xs font-black rounded-full shadow-xs uppercase tracking-wider">
              -{discountPercent}% SALE
            </span>
          </div>
        ) : (
          <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#163A32] text-[#D6A84F] border border-[#D6A84F]/30 text-xs font-bold rounded-full shadow-xs">
              <Sparkles className="w-3.5 h-3.5 fill-[#D6A84F]" /> Direct Import
            </span>
          </div>
        )}

        {/* Display Image or Video */}
        {isVideoActive ? (
          <div className="w-full h-full rounded-2xl bg-black flex items-center justify-center relative overflow-hidden">
            <img 
              src={selectedImage} 
              alt="Video Poster" 
              className="w-full h-full object-cover opacity-60" 
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-2">
              <PlayCircle className="w-14 h-14 text-[#D6A84F] animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider bg-black/60 px-3 py-1 rounded-full">Product Showcase (45s)</span>
            </div>
          </div>
        ) : (
          <img
            src={selectedImage}
            alt={productName}
            className="w-full h-full object-contain drop-shadow-sm transition-transform duration-500 ease-out group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=600&auto=format&fit=crop";
            }}
          />
        )}
      </div>

      {/* Thumbnails Row */}
      {validImages.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5 sm:gap-3">
          {validImages.map((img: string, idx: number) => {
            const isSelected = !isVideoActive && selectedImage === img;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSelectedImage(img);
                  setIsVideoActive(false);
                }}
                className={`aspect-square rounded-2xl border transition-all p-2 bg-[#F7F8F5] flex items-center justify-center overflow-hidden cursor-pointer ${
                  isSelected
                    ? "border-[#163A32] ring-2 ring-[#163A32]/20 shadow-xs scale-102"
                    : "border-[#E5E7EB] hover:border-[#163A32]/50 opacity-80 hover:opacity-100"
                }`}
              >
                <img
                  src={img}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=200&auto=format&fit=crop";
                  }}
                />
              </button>
            );
          })}

          {/* Video Thumbnail Button */}
          <button
            type="button"
            onClick={() => setIsVideoActive(true)}
            className={`aspect-square rounded-2xl border transition-all bg-slate-900 flex items-center justify-center relative overflow-hidden cursor-pointer group ${
              isVideoActive
                ? "border-[#163A32] ring-2 ring-[#163A32]/20 scale-102"
                : "border-[#E5E7EB] hover:border-[#163A32]/50"
            }`}
          >
            <img
              src={validImages[0]}
              alt="Video Preview"
              className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity"
            />
            <PlayCircle className="absolute w-7 h-7 text-[#D6A84F] drop-shadow-md" />
            <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-mono px-1 rounded">0:45</span>
          </button>
        </div>
      )}
    </div>
  );
}
