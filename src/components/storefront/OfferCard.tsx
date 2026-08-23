"use client";

import Link from "next/link";
import { ShoppingCart, Flame, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface OfferCardProps {
  product: any;
}

export function OfferCard({ product }: OfferCardProps) {
  const { addToCart } = useStore();
  const router = useRouter();

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
    <div className="relative bg-white rounded-2xl border border-[#E5E7EB] p-3.5 sm:p-5 flex items-center gap-3.5 sm:gap-5 shadow-xs hover:shadow-md hover:border-[#6B8F71]/40 transition-all duration-300 group overflow-hidden">
      
      {/* Top Right Best Selling / Hot Deal Badge */}
      <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 bg-[#163A32] text-[#D6A84F] border border-[#D6A84F]/30 text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1 z-10">
        <Flame className="w-3 h-3 fill-[#D6A84F] text-[#D6A84F]" />
        <span>Wholesale Deal</span>
      </div>

      {/* Left Product Image */}
      <Link href={`/product/${product.slug}`} className="block w-32 h-32 sm:w-44 sm:h-44 shrink-0 relative flex items-center justify-center cursor-pointer bg-[#F7F8F5] rounded-xl p-2">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" 
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=400&auto=format&fit=crop";
          }}
        />
      </Link>

      {/* Right Product Details */}
      <div className="flex-1 min-w-0 pr-1 sm:pr-2">
        <Link href={`/product/${product.slug}`} className="block">
          <h3 className="font-extrabold text-xs sm:text-base text-[#111827] line-clamp-2 leading-tight group-hover:text-[#163A32] transition-colors pr-14 sm:pr-20">
            {product.name}
          </h3>
        </Link>

        {/* Pricing Row */}
        <div className="flex items-baseline gap-2 mt-1.5 sm:mt-2">
          <span className="font-black text-base sm:text-xl text-[#163A32]">
            ৳{offerPrice.toFixed(0)}
          </span>
          {hasDiscount && (
            <span className="text-xs sm:text-sm text-slate-400 line-through font-semibold">
              ৳{originalPrice.toFixed(0)}
            </span>
          )}
        </div>

        {/* Savings Pill Tag */}
        {savings > 0 && (
          <div className="mt-1">
            <span className="inline-block bg-[#163A32]/10 text-[#163A32] text-[10px] sm:text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-[#163A32]/20">
              Save ৳{savings}
            </span>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-3 sm:mt-4">
          <Button 
            onClick={handleAddToCart}
            size="sm"
            className="w-full sm:w-auto rounded-xl bg-[#163A32] hover:bg-[#D6A84F] text-white hover:text-[#163A32] font-black text-xs h-9 px-4.5 flex items-center justify-center gap-1.5 shadow-xs hover:shadow-md transition-all cursor-pointer group/btn"
          >
            <ShoppingCart className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
            <span>Add to Cart</span>
          </Button>
        </div>
      </div>

    </div>
  );
}
