"use client";

import Link from "next/link";
import { Heart, ShoppingBag, Plus } from "lucide-react";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";

interface ProductCardProps {
  product: any;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, wishlist, toggleWishlist } = useStore();

  const regularPrice = product.price || 0;
  const currentPrice = product.discountPrice > 0 ? product.discountPrice : regularPrice;
  const hasDiscount = regularPrice > currentPrice;
  const discountPercentage = hasDiscount 
    ? Math.round(((regularPrice - currentPrice) / regularPrice) * 100) 
    : 0;

  const isWishlisted = wishlist?.includes(product._id?.toString());

  // Dynamic Badge logic matching reference design
  const getBadge = () => {
    if (discountPercentage >= 20) {
      return { text: `-${discountPercentage}% SALE`, isSale: true };
    }
    if (product.soldCount > 50 || product.isFeatured) {
      return { text: "Best Seller", isSale: false };
    }
    return { text: "Direct Import", isSale: false };
  };

  const badge = getBadge();

  // Strip raw HTML tags (e.g. <p>, &nbsp;) from description
  const stripHtml = (html?: string) => {
    if (!html) return "";
    return html
      .replace(/<[^>]*>?/gm, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, " ")
      .trim();
  };

  const cleanDescription = stripHtml(product.shortDescription || product.description) || "Authentic imported luxury treat guaranteed fresh in original packing.";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      _id: product._id.toString(),
      name: product.name,
      price: currentPrice,
      image: product.images?.[0] || "",
      quantity: 1,
    });
    toast.success(`${product.name} added to cart!`);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product._id.toString());
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <div className="group bg-white rounded-[22px] sm:rounded-[30px] p-2.5 sm:p-4 border border-[#E5E7EB] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(22,58,50,0.09)] hover:border-[#163A32]/30 transition-all duration-300 flex flex-col justify-between relative text-left h-full overflow-hidden">
      
      {/* 1. Top Rounded Image Container with Badges & Wishlist */}
      <div className="relative w-full aspect-square bg-[#F7F8F5] rounded-[18px] sm:rounded-[22px] overflow-hidden mb-2.5 sm:mb-3 border border-slate-100/90 flex items-center justify-center">
        
        {/* Top-Left Status Badge (Floating Glassmorphic Pill) */}
        <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 z-10">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[8.5px] sm:text-[10px] font-black uppercase tracking-tight shadow-xs border ${
            badge.isSale 
              ? "bg-red-500/90 text-white border-red-400/50" 
              : "bg-white/90 backdrop-blur-md text-[#163A32] border-white/60"
          }`}>
            {badge.text}
          </span>
        </div>

        {/* Top-Right Circular Floating Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label="Wishlist"
          className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-10 w-6.5 h-6.5 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-md shadow-xs border border-white/60 flex items-center justify-center transition-transform hover:scale-110 active:scale-90 cursor-pointer"
        >
          <Heart 
            className={`w-3 h-3 sm:w-4 sm:h-4 transition-colors ${
              isWishlisted ? "fill-red-500 text-red-500" : "text-[#6B7280] hover:text-red-500"
            }`} 
          />
        </button>

        {/* Center Product Image */}
        <Link href={`/product/${product.slug}`} className="w-full h-full block cursor-pointer">
          <img 
            src={product.images?.[0] || "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=400&auto=format&fit=crop"} 
            alt={product.name} 
            className="w-full h-full object-contain p-2.5 sm:p-4 group-hover:scale-108 transition-transform duration-500 ease-out drop-shadow-xs" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=400&auto=format&fit=crop";
            }}
          />
        </Link>

        {/* Bottom Pagination Micro Dots */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10 pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity">
          <span className="w-2.5 sm:w-3 h-1 rounded-full bg-[#163A32]" />
          <span className="w-1 sm:w-1.5 h-1 rounded-full bg-slate-300" />
          <span className="w-1 sm:w-1.5 h-1 rounded-full bg-slate-300" />
        </div>
      </div>

      {/* 2. Middle Content Area: Title, Subtitle, Clean Highlights */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          {/* Product Title */}
          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="font-extrabold text-xs sm:text-base text-[#111827] line-clamp-1 sm:line-clamp-2 leading-snug group-hover:text-[#163A32] transition-colors font-heading">
              {product.name}
            </h3>
          </Link>

          {/* Subtitle / Category Tagline */}
          <p className="text-[10px] sm:text-xs font-bold text-[#6B8F71] mt-0.5 line-clamp-1 font-heading">
            {product.category?.name || product.brand || "Authentic Direct Import"}
          </p>

          {/* Clean Short Description */}
          <p className="text-[10px] sm:text-xs text-[#6B7280] line-clamp-1 sm:line-clamp-2 mt-0.5 sm:mt-1 leading-relaxed font-normal">
            {cleanDescription}
          </p>
        </div>

        {/* 3. Bottom Area: Price & Action CTA */}
        <div className="mt-3 pt-2 border-t border-slate-100/80 flex flex-col gap-2">
          {/* Price Row */}
          <div className="flex items-baseline justify-between gap-1 flex-wrap">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-black text-[#163A32] font-heading leading-none">
                ৳{currentPrice.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-[11px] sm:text-xs text-[#9CA3AF] line-through font-semibold leading-none">
                  ৳{regularPrice.toLocaleString()}
                </span>
              )}
            </div>
            {hasDiscount && (
              <span className="text-[9px] sm:text-[10px] font-black text-red-600 bg-red-50 border border-red-200/60 px-1.5 py-0.5 rounded-md shrink-0">
                Save ৳{(regularPrice - currentPrice).toLocaleString()}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            aria-label={`Add ${product.name} to cart`}
            className="w-full h-8.5 sm:h-9 px-3 rounded-xl sm:rounded-2xl bg-[#163A32] hover:bg-[#D6A84F] active:scale-[0.98] text-white hover:text-[#163A32] font-bold text-xs transition-all duration-200 flex items-center justify-center gap-1.5 shadow-2xs hover:shadow-md cursor-pointer group/btn"
          >
            <ShoppingBag className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform shrink-0" />
            <span>Add to Cart</span>
            <Plus className="w-3.5 h-3.5 opacity-60 group-hover/btn:rotate-90 group-hover/btn:opacity-100 transition-all shrink-0 ml-auto sm:ml-0" />
          </button>
        </div>

      </div>

    </div>
  );
}

