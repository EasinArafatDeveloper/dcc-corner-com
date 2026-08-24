"use client";

import Link from "next/link";
import { ShoppingCart, Flame, Zap, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface OfferCardProps {
  product: any;
}

export function OfferCard({ product }: OfferCardProps) {
  const { addToCart, wishlist, toggleWishlist } = useStore();
  const router = useRouter();

  const isWishlisted = wishlist?.includes(product._id?.toString());

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product._id.toString());
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      _id: product._id.toString(),
      name: product.name,
      price: product.discountPrice > 0 ? product.discountPrice : product.price,
      image: product.images[0],
      quantity: 1,
    });
    toast.success(`${product.name} added to cart!`);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      _id: product._id.toString(),
      name: product.name,
      price: product.discountPrice > 0 ? product.discountPrice : product.price,
      image: product.images[0],
      quantity: 1,
    });
    router.push("/checkout");
  };

  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const offerPrice = hasDiscount ? product.discountPrice : product.price;
  const originalPrice = product.price;
  const savings = hasDiscount ? Math.round(originalPrice - offerPrice) : 0;

  return (
    <div className="relative bg-white rounded-2xl border border-[#E5E7EB] p-3 sm:p-5 flex items-center gap-3 sm:gap-5 shadow-xs hover:shadow-md hover:border-[#6B8F71]/40 transition-all duration-300 group overflow-hidden">
      
      {/* Left Product Image */}
      <div className="relative w-28 h-28 sm:w-40 sm:h-40 md:w-44 md:h-44 shrink-0 flex items-center justify-center bg-[#F7F8F5] rounded-xl p-2 border border-slate-100">
        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label="Wishlist"
          className="absolute top-1.5 right-1.5 z-10 w-6.5 h-6.5 sm:w-7.5 sm:h-7.5 rounded-full bg-white/90 backdrop-blur-md shadow-xs border border-white/60 flex items-center justify-center transition-transform hover:scale-110 active:scale-90 cursor-pointer"
        >
          <Heart 
            className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-colors ${
              isWishlisted ? "fill-red-500 text-red-500" : "text-[#6B7280] hover:text-red-500"
            }`} 
          />
        </button>

        <Link href={`/product/${product.slug}`} className="w-full h-full block cursor-pointer flex items-center justify-center">
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=400&auto=format&fit=crop";
            }}
          />
        </Link>
      </div>

      {/* Right Product Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          {/* Top Deal Badge */}
          <div className="mb-1 sm:mb-1.5">
            <span className="inline-flex items-center gap-1 bg-[#163A32] text-[#D6A84F] border border-[#D6A84F]/30 text-[9px] sm:text-[11px] font-black px-2 sm:px-2.5 py-0.5 rounded-full shadow-2xs">
              <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-[#D6A84F] text-[#D6A84F]" />
              <span>Wholesale Deal</span>
            </span>
          </div>

          {/* Product Title (Full width, no badge overlap!) */}
          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="font-extrabold text-xs sm:text-base text-[#111827] line-clamp-2 leading-snug group-hover:text-[#163A32] transition-colors font-heading">
              {product.name}
            </h3>
          </Link>

          {/* Pricing Row */}
          <div className="flex items-baseline gap-1.5 sm:gap-2 mt-1 sm:mt-1.5">
            <span className="font-black text-sm sm:text-xl text-[#163A32] font-heading">
              ৳{offerPrice.toFixed(0)}
            </span>
            {hasDiscount && (
              <span className="text-[11px] sm:text-sm text-slate-400 line-through font-semibold">
                ৳{originalPrice.toFixed(0)}
              </span>
            )}
          </div>

          {/* Savings Pill Tag */}
          {savings > 0 && (
            <div className="mt-1">
              <span className="inline-block bg-[#163A32]/10 text-[#163A32] text-[9.5px] sm:text-xs font-extrabold px-2 py-0.5 rounded-full border border-[#163A32]/20">
                Save ৳{savings}
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-2.5 sm:mt-3.5">
          <Button 
            onClick={handleAddToCart}
            size="sm"
            className="w-full sm:w-auto rounded-xl bg-[#163A32] hover:bg-[#D6A84F] text-white hover:text-[#163A32] font-black text-[11px] sm:text-xs h-8 sm:h-9 px-3.5 sm:px-4.5 flex items-center justify-center gap-1.5 shadow-xs hover:shadow-md transition-all cursor-pointer group/btn"
          >
            <ShoppingCart className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
            <span>Add to Cart</span>
          </Button>
        </div>
      </div>

    </div>
  );
}
