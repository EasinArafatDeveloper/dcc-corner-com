"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

interface CategoryProps {
  _id: string;
  name: string;
  slug: string;
  image?: string;
}

interface CategoryTheme {
  gradient: string;
  textClass: string;
  subClass: string;
}

const defaultPaletteList: CategoryTheme[] = [
  {
    gradient: "from-[#E8F3EE] via-[#DCEDE4] to-[#C9E4D5]",
    textClass: "text-[#163A32]",
    subClass: "text-[#3D6B58]",
  },
  {
    gradient: "from-[#FDF5E8] via-[#F8EBCE] to-[#EEDDB8]",
    textClass: "text-[#2B1B0E]",
    subClass: "text-[#996D25]",
  },
  {
    gradient: "from-[#EEF7F2] via-[#DEF0E4] to-[#CCE7D6]",
    textClass: "text-[#163A32]",
    subClass: "text-[#477A62]",
  },
  {
    gradient: "from-[#FFF2EE] via-[#FFE5DC] to-[#FED4C7]",
    textClass: "text-[#4A1910]",
    subClass: "text-[#B84E35]",
  },
  {
    gradient: "from-[#FEF6E9] via-[#FCECD3] to-[#F7DEBC]",
    textClass: "text-[#3A240E]",
    subClass: "text-[#A87428]",
  },
  {
    gradient: "from-[#F4F7FC] via-[#E4ECF8] to-[#D2E0F4]",
    textClass: "text-[#182E4E]",
    subClass: "text-[#476C9E]",
  },
  {
    gradient: "from-[#F5EEFB] via-[#ECE0F7] to-[#DFCEF0]",
    textClass: "text-[#2D1645]",
    subClass: "text-[#6C3C9E]",
  },
  {
    gradient: "from-[#FFF8E7] via-[#FDF0D0] to-[#F7E4B3]",
    textClass: "text-[#3D2C04]",
    subClass: "text-[#8C650C]",
  },
];

function CategoryItemCard({ cat, idx }: { cat: CategoryProps; idx: number }) {
  const [imageError, setImageError] = useState(false);
  const theme = defaultPaletteList[idx % defaultPaletteList.length];
  const hasValidImage = Boolean(cat.image && cat.image.trim() && !imageError);

  return (
    <Link
      href={`/category/${cat.slug}`}
      className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-black/5 p-3 sm:p-4 md:p-4.5 flex items-center justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer bg-gradient-to-r ${theme.gradient} min-h-[92px] sm:min-h-[110px] md:h-32 shadow-2xs`}
    >
      {/* Left Side: Category Title & Explore Link */}
      <div className="relative z-10 flex-1 pr-1.5 sm:pr-2.5 min-w-0 flex flex-col justify-center">
        <h3 className={`font-extrabold text-[12px] xs:text-[13px] sm:text-base md:text-lg leading-tight font-heading ${theme.textClass} line-clamp-2`}>
          {cat.name}
        </h3>
        <span className={`inline-flex items-center gap-1 text-[9px] sm:text-xs font-bold mt-1 sm:mt-1.5 opacity-85 group-hover:opacity-100 transition-opacity ${theme.subClass}`}>
          <span>Explore</span>
          <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:translate-x-1 transition-transform" />
        </span>
      </div>

      {/* Right Side: Curved Background Wedge + Compact Category Image on Mobile */}
      <div className="relative shrink-0 w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 -mr-1 sm:-mr-2 flex items-center justify-center">
        {/* Soft White Curved Backdrop Wedge */}
        <div className="absolute inset-0 bg-white/50 rounded-full scale-100 sm:scale-105 blur-[0.5px] pointer-events-none group-hover:bg-white/70 transition-colors" />
        
        {hasValidImage ? (
          <img
            src={cat.image}
            alt={cat.name}
            className="relative z-10 w-full h-full object-contain p-0.5 sm:p-1 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 ease-out drop-shadow-sm"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="relative z-10 w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-white/70 backdrop-blur-xs flex items-center justify-center font-heading font-black text-sm sm:text-xl md:text-2xl text-[#163A32] shadow-xs group-hover:scale-110 transition-transform">
            {cat.name?.charAt(0) || "•"}
          </div>
        )}
      </div>
    </Link>
  );
}

export function CategorySlider({ categories }: { categories: CategoryProps[] }) {
  if (!categories || categories.length === 0) return null;

  // Display up to 8 categories in the home grid
  const displayCategories = categories.slice(0, 8);

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4.5">
        {displayCategories.map((cat, idx) => (
          <CategoryItemCard key={cat._id || cat.slug || idx} cat={cat} idx={idx} />
        ))}
      </div>
    </div>
  );
}
