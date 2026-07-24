"use client";

import Link from "next/link";
import { Star, ShoppingCart, CreditCard, Flame } from "lucide-react";
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
    toast.success(`${product.name} added to cart`);
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

  const discountPercent = product.discountPercent || 
    (product.discountPrice > 0 ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0);

  return (
    <Link 
      href={`/product/${product.slug}`}
      className="group relative bg-white rounded-3xl p-1 shadow-md hover:shadow-2xl transition-all duration-300 text-left flex flex-col h-full cursor-pointer overflow-hidden transform hover:-translate-y-1" 
    >
      {/* Animated Gradient Border Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 opacity-20 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Inner White Card */}
      <div className="relative bg-white rounded-[1.4rem] p-4 flex flex-col h-full h-full z-10 border border-transparent group-hover:border-white/50">
        
        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute -top-1 -right-1 bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-black px-3 py-1.5 rounded-bl-2xl rounded-tr-[1.2rem] z-20 shadow-lg flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 fill-white animate-pulse" />
            {discountPercent}% OFF
          </div>
        )}

        <div className="block aspect-square bg-slate-50/50 rounded-2xl mb-4 flex items-center justify-center overflow-hidden relative border border-slate-100/50">
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            
            {/* Quick Action Overlay on Hover (Desktop Only) */}
            <div className="absolute inset-0 bg-black/50 opacity-0 hidden md:flex group-hover:opacity-100 transition-opacity flex-col items-center justify-center gap-3 px-6 backdrop-blur-sm duration-300">
                <Button size="sm" className="w-full rounded-full shadow-xl bg-primary hover:bg-primary/90 text-white font-semibold" onClick={handleAddToCart}>
                  <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                </Button>
                <Button size="sm" variant="secondary" className="w-full rounded-full shadow-xl font-semibold bg-white text-black hover:bg-slate-100" onClick={handleBuyNow}>
                  <CreditCard className="w-4 h-4 mr-2" /> Buy Now
                </Button>
            </div>
        </div>
        
        <div className="flex-1 flex flex-col pointer-events-none">
          <p className="text-[10px] sm:text-xs text-orange-600 font-bold uppercase tracking-wider mb-1 truncate flex items-center gap-1">
             HOT DEAL
          </p>
          <h4 className="font-bold text-sm md:text-base line-clamp-2 text-slate-800 leading-tight group-hover:text-primary transition-colors">{product.name}</h4>
          
          <div className="flex items-center space-x-1 my-2">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium text-slate-600">{product.rating} <span className="text-slate-400">({product.numReviews})</span></span>
          </div>
          
          <div className="mt-auto pt-4 flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1">
              <div>
                <div className="text-xs text-slate-400 line-through font-medium mb-0.5">${product.price.toFixed(2)}</div>
                <div className="text-xl md:text-2xl font-black text-red-600 leading-none">
                  ${product.discountPrice > 0 ? product.discountPrice.toFixed(2) : product.price.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Mobile Quick Actions (Mobile Only) */}
            <div className="flex md:hidden flex-row gap-2 pointer-events-auto">
              <Button size="sm" className="flex-1 rounded-full shadow-md text-xs px-0 bg-red-600 hover:bg-red-700 text-white" onClick={handleAddToCart}>
                <ShoppingCart className="w-3.5 h-3.5 mr-1" /> Add
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
