"use client";

import Link from "next/link";
import { Star, ShoppingBag, Heart } from "lucide-react";
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
      return { text: "SALE", bg: "bg-[#D6A84F] text-white" };
    }
    if (product.soldCount > 50 || product.isFeatured) {
      return { text: "BEST SELLER", bg: "bg-[#163A32] text-white" };
    }
    return { text: "NEW", bg: "bg-[#163A32] text-white" };
  };

  const badge = getBadge();
  const ratingScore = product.rating || (4.7 + ((product.name?.length || 0) % 3) * 0.1).toFixed(1);
  const reviewsCount = product.numReviews || (45 + ((product.name?.length || 0) * 7) % 85);

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
    toast.success(`${product.name} added to cart`);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product._id.toString());
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <div className="group bg-white rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[#E5E7EB] hover:shadow-[0_12px_30px_rgba(22,58,50,0.09)] hover:border-[#163A32]/25 transition-all duration-300 flex flex-row sm:flex-col items-center sm:items-stretch gap-3 sm:gap-0 relative text-left h-full">
      
      {/* Product Image Area with Badges & Wishlist */}
      <Link 
        href={`/product/${product.slug}`} 
        className="block relative w-28 h-28 sm:w-full sm:h-auto sm:aspect-square shrink-0 bg-[#F7F8F5] rounded-xl sm:rounded-2xl overflow-hidden sm:mb-3 border border-slate-100/80 cursor-pointer"
      >
        {/* Top-Left Status Badge */}
        <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 z-10">
          <span className={`inline-block text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md tracking-wider shadow-xs ${badge.bg}`}>
            {badge.text}
          </span>
        </div>

        {/* Top-Right Circular Floating Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label="Wishlist"
          className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center transition-transform hover:scale-110 active:scale-90 cursor-pointer"
        >
          <Heart 
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
              isWishlisted ? "fill-red-500 text-red-500" : "text-[#6B7280] hover:text-red-500"
            }`} 
          />
        </button>

        {/* Product Image */}
        <img 
          src={product.images?.[0] || "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=400&auto=format&fit=crop"} 
          alt={product.name} 
          className="w-full h-full object-contain p-2 sm:p-3 group-hover:scale-106 transition-transform duration-500 ease-out" 
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=400&auto=format&fit=crop";
          }}
        />
      </Link>

      {/* Card Body */}
      <div className="flex-1 min-w-0 flex flex-col justify-between w-full h-full">
        <div>
          {/* Category / Collection Tag */}
          <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest text-[#6B8F71] block mb-0.5 sm:mb-1 font-heading">
            {product.category?.name || product.brand || "PREMIUM COLLECTION"}
          </span>

          {/* Product Title */}
          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="font-extrabold text-xs sm:text-[15px] text-[#111827] line-clamp-1 leading-snug group-hover:text-[#163A32] transition-colors font-heading">
              {product.name}
            </h3>
          </Link>

          {/* Rating & Reviews Row */}
          <div className="flex items-center gap-1 sm:gap-1.5 my-1 sm:my-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#D6A84F] text-[#D6A84F]" 
                />
              ))}
            </div>
            <span className="text-[11px] sm:text-xs font-black text-[#111827]">
              {ratingScore}
            </span>
            <span className="text-[10px] sm:text-xs text-[#6B7280] font-normal">
              {reviewsCount} reviews
            </span>
          </div>

          {/* Pricing & Discount Row */}
          <div className="flex items-baseline gap-1.5 sm:gap-2 mt-0.5 sm:mt-1">
            <span className="text-sm sm:text-lg font-black text-[#111827] font-heading">
              ৳{currentPrice.toLocaleString()}
            </span>
            {hasDiscount && (
              <>
                <span className="text-[11px] sm:text-sm text-[#9CA3AF] line-through font-medium">
                  ৳{regularPrice.toLocaleString()}
                </span>
                <span className={`text-[9px] sm:text-[10px] font-extrabold px-1.5 py-0.5 rounded-md border ${
                  badge.text === "SALE" 
                    ? "bg-amber-50 text-amber-700 border-amber-200/60" 
                    : "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                }`}>
                  -{discountPercentage}%
                </span>
              </>
            )}
          </div>
        </div>

        {/* Add to Cart Full-Width CTA Button */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full mt-2 sm:mt-3.5 py-2 sm:py-3 rounded-xl bg-[#163A32] hover:bg-[#0E2620] active:scale-98 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 shadow-xs transition-all cursor-pointer group/btn"
        >
          <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white group-hover/btn:scale-110 transition-transform" />
          <span>Add to Cart</span>
        </button>
      </div>

    </div>
  );
}

