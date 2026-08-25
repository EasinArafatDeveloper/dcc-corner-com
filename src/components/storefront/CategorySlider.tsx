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
      className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-black/5 p-3.5 sm:p-4.5 flex items-center justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer bg-gradient-to-r ${theme.gradient} h-24 sm:h-28 md:h-32 shadow-2xs`}
    >
      {/* Left Side: Category Title & Explore Link */}
      <div className="relative z-10 flex-1 pr-2 min-w-0">
        <h3 className={`font-extrabold text-xs sm:text-base md:text-lg leading-tight font-heading ${theme.textClass} line-clamp-2`}>
          {cat.name}
        </h3>
        <span className={`inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold mt-1 sm:mt-1.5 opacity-80 group-hover:opacity-100 transition-opacity ${theme.subClass}`}>
          <span>Explore</span>
          <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:translate-x-1 transition-transform" />
        </span>
      </div>

      {/* Right Side: Curved Background Wedge + Database Category Image */}
      <div className="relative shrink-0 w-20 h-20 sm:w-26 sm:h-26 md:w-28 md:h-28 -mr-2 sm:-mr-3 flex items-center justify-center">
        {/* Soft White Curved Backdrop Wedge */}
        <div className="absolute inset-0 bg-white/50 rounded-full scale-105 blur-[0.5px] pointer-events-none group-hover:bg-white/70 transition-colors" />
        
        {hasValidImage ? (
          <img
            src={cat.image}
            alt={cat.name}
            className="relative z-10 w-full h-full object-contain p-1 sm:p-1.5 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 ease-out drop-shadow-md"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="relative z-10 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white/70 backdrop-blur-xs flex items-center justify-center font-heading font-black text-lg sm:text-2xl text-[#163A32] shadow-xs group-hover:scale-110 transition-transform">
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
