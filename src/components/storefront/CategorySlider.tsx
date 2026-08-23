"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CategoryProps {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

interface CategoryTheme {
  gradient: string;
  textClass: string;
  subClass: string;
  wedgeBg: string;
  fallbackImg: string;
}

const categoryThemes: Record<string, CategoryTheme> = {
  "imported-chocolates": {
    gradient: "from-[#E8F3EE] via-[#DCEDE4] to-[#C9E4D5]",
    textClass: "text-[#163A32]",
    subClass: "text-[#3D6B58]",
    wedgeBg: "bg-white/60",
    fallbackImg: "/images/Chocolates.png",
  },
  "beverages": {
    gradient: "from-[#FDF5E8] via-[#F8EBCE] to-[#EEDDB8]",
    textClass: "text-[#2B1B0E]",
    subClass: "text-[#996D25]",
    wedgeBg: "bg-white/60",
    fallbackImg: "/images/Beverages.png",
  },
  "chips-snacks": {
    gradient: "from-[#EEF7F2] via-[#DEF0E4] to-[#CCE7D6]",
    textClass: "text-[#163A32]",
    subClass: "text-[#477A62]",
    wedgeBg: "bg-white/60",
    fallbackImg: "/images/Chips & Snacks.png",
  },
  "candies": {
    gradient: "from-[#FFF2EE] via-[#FFE5DC] to-[#FED4C7]",
    textClass: "text-[#4A1910]",
    subClass: "text-[#B84E35]",
    wedgeBg: "bg-white/60",
    fallbackImg: "/images/Candies.png",
  },
  "cookies": {
    gradient: "from-[#FEF6E9] via-[#FCECD3] to-[#F7DEBC]",
    textClass: "text-[#3A240E]",
    subClass: "text-[#A87428]",
    wedgeBg: "bg-white/60",
    fallbackImg: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=400&auto=format&fit=crop",
  },
  "instant-noodles": {
    gradient: "from-[#F4F7FC] via-[#E4ECF8] to-[#D2E0F4]",
    textClass: "text-[#182E4E]",
    subClass: "text-[#476C9E]",
    wedgeBg: "bg-white/60",
    fallbackImg: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?q=80&w=400&auto=format&fit=crop",
  },
};

const category3DImages: Record<string, string> = {
  "imported-chocolates": "/images/Chocolates.png",
  "chocolates": "/images/Chocolates.png",
  "beverages": "/images/Beverages.png",
  "chips-snacks": "/images/Chips & Snacks.png",
  "snacks": "/images/Chips & Snacks.png",
  "candies": "/images/Candies.png",
  "candies-sweets": "/images/Candies.png",
};

const getCategory3DImage = (cat: { slug: string; name: string; image?: string }) => {
  const lowerSlug = (cat.slug || "").toLowerCase();
  const lowerName = (cat.name || "").toLowerCase();

  if (category3DImages[lowerSlug]) return category3DImages[lowerSlug];
  if (lowerName.includes("chocolate")) return "/images/Chocolates.png";
  if (lowerName.includes("beverage") || lowerName.includes("coffee") || lowerName.includes("drink")) return "/images/Beverages.png";
  if (lowerName.includes("snack") || lowerName.includes("chip")) return "/images/Chips & Snacks.png";
  if (lowerName.includes("cand") || lowerName.includes("sweet")) return "/images/Candies.png";

  if (cat.image && !cat.image.includes("placehold.co")) return cat.image;
  return categoryThemes[lowerSlug]?.fallbackImg || "/images/Chocolates.png";
};

const defaultPaletteList: CategoryTheme[] = [
  categoryThemes["imported-chocolates"],
  categoryThemes["beverages"],
  categoryThemes["chips-snacks"],
  categoryThemes["candies"],
  categoryThemes["cookies"],
  categoryThemes["instant-noodles"],
];

export function CategorySlider({ categories }: { categories: CategoryProps[] }) {
  if (!categories || categories.length === 0) return null;

  // Show only 4 categories in the home grid
  const displayCategories = categories.slice(0, 4);

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4.5">
        {displayCategories.map((cat, idx) => {
          const theme = categoryThemes[cat.slug] || defaultPaletteList[idx % defaultPaletteList.length];
          const displayImg = getCategory3DImage(cat);

          return (
            <Link
              key={cat._id}
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

              {/* Right Side: Curved Background Wedge + 3D Product Image Cutout */}
              <div className="relative shrink-0 w-20 h-20 sm:w-26 sm:h-26 md:w-30 md:h-30 -mr-2 sm:-mr-3 flex items-center justify-center">
                {/* Soft White Curved Backdrop Wedge */}
                <div className="absolute inset-0 bg-white/45 rounded-full scale-105 blur-[0.5px] pointer-events-none group-hover:bg-white/65 transition-colors" />
                
                {/* 3D Product Image Cutout */}
                <img
                  src={displayImg}
                  alt={cat.name}
                  className="relative z-10 w-full h-full object-contain p-1 sm:p-1.5 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 ease-out drop-shadow-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = theme.fallbackImg;
                  }}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
