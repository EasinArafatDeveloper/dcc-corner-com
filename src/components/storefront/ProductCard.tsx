"use client";

import Link from "next/link";
import { Star, ShoppingCart, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: any;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useStore();
  const router = useRouter();

  const originFlag = product.origin || product.country || "🇬🇧 Imported";
  const regularPrice = product.price || 0;
  const currentPrice = product.discountPrice > 0 ? product.discountPrice : regularPrice;
  const savings = regularPrice > currentPrice ? regularPrice - currentPrice : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      _id: product._id.toString(),
      name: product.name,
      price: currentPrice,
      image: product.images[0],
      quantity: 1,
    });
    toast.success(`${product.name} added to cart`);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      _id: product._id.toString(),
      name: product.name,
      price: currentPrice,
      image: product.images[0],
      quantity: 1,
    });
    router.push("/checkout");
  };

  return (
    <Link href={`/product/${product.slug}`} className="group bg-white rounded-2xl p-3.5 shadow-sm border border-[#E8E0D5]/70 hover:shadow-xl hover:border-[#C5A059]/40 transition-all text-left flex flex-col h-full relative cursor-pointer">
      
      {/* Top Badges (Origin Tag & Savings) */}
      <div className="flex items-center justify-between gap-1 mb-2 z-10">
        <span className="inline-flex items-center gap-1 bg-[#FAF7F2] text-[#4A2C2A] border border-[#E8E0D5] text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
          <span>{originFlag}</span>
        </span>
        {savings > 0 && (
          <span className="bg-[#4A2C2A] text-[#C5A059] text-[10px] font-black px-2 py-0.5 rounded-full shadow-2xs">
            Save ৳{savings.toFixed(0)}
          </span>
        )}
      </div>

      <div className="block aspect-square bg-[#FAF7F2] rounded-xl mb-3 flex items-center justify-center overflow-hidden relative border border-[#E8E0D5]/40">
        <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain p-2 group-hover:scale-108 transition-transform duration-500" />
        
        {/* Freshness Tag Overlay */}
        <div className="absolute bottom-1.5 left-1.5 bg-[#2C2725]/80 text-[#FAF7F2] text-[9px] font-medium px-2 py-0.5 rounded-md backdrop-blur-xs">
          ✓ Fresh / Long Expiry
        </div>

        {/* Quick Action Overlay on Hover (Desktop Only) */}
        <div className="absolute inset-0 bg-[#2C2725]/40 opacity-0 hidden md:flex group-hover:opacity-100 transition-opacity flex-col items-center justify-center gap-2 px-4 backdrop-blur-[2px]">
          <Button size="sm" className="w-full rounded-xl bg-[#4A2C2A] hover:bg-[#3B221E] text-white shadow-lg font-bold" onClick={handleAddToCart}>
            <ShoppingCart className="w-4 h-4 mr-2 text-[#C5A059]" /> Add to Cart
          </Button>
          <Button size="sm" className="w-full rounded-xl bg-[#C5A059] hover:bg-[#D4AF37] text-[#2C2725] shadow-lg font-bold" onClick={handleBuyNow}>
            <CreditCard className="w-4 h-4 mr-2" /> Buy Now
          </Button>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col pointer-events-none">
        <p className="text-[11px] text-[#C5A059] font-bold uppercase tracking-wider mb-1 truncate">{product.brand || "Imported Goods"}</p>
        <h4 className="font-bold text-sm text-[#2C2725] line-clamp-2 leading-snug group-hover:text-[#4A2C2A] transition-colors">{product.name}</h4>
        
        <div className="flex items-center space-x-1 my-1.5">
          <Star className="w-3.5 h-3.5 fill-[#C5A059] text-[#C5A059]" />
          <span className="text-[11px] font-semibold text-[#6B625D]">{product.rating || "4.9"} ({product.numReviews || "12"})</span>
        </div>
        
        <div className="mt-auto pt-3 flex flex-col gap-2.5">
          <div className="flex flex-col">
            <span className="text-[11px] text-[#6B625D]">
              Market Rate: <span className="line-through">৳{(regularPrice * 1.15).toFixed(0)}</span>
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-base font-extrabold text-[#4A2C2A]">
                DCC Price: ৳{currentPrice.toFixed(0)}
              </span>
            </div>
          </div>

          {/* Mobile Quick Actions */}
          <div className="flex md:hidden flex-row gap-2 pointer-events-auto">
            <Button size="sm" className="flex-1 rounded-xl bg-[#4A2C2A] text-white shadow-sm text-xs px-0 font-bold" onClick={handleAddToCart}>
              <ShoppingCart className="w-3.5 h-3.5 mr-1 text-[#C5A059]" /> Add
            </Button>
            <Button size="sm" className="flex-1 rounded-xl bg-[#C5A059] text-[#2C2725] shadow-sm text-xs px-0 font-bold" onClick={handleBuyNow}>
              <CreditCard className="w-3.5 h-3.5 mr-1" /> Buy
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
