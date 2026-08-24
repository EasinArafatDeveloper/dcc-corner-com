"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Heart, Minus, Plus, ShoppingCart, Zap } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/store/useStore";

interface ProductActionsProps {
  product: any;
}

export function ProductActions({ product }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const router = useRouter();

  const handleAddToCart = () => {
    addToCart({
      _id: product._id.toString(),
      name: product.name,
      price: product.discountPrice > 0 ? product.discountPrice : product.price,
      image: product.images?.[0] || "",
      quantity,
    });
    toast.success(`Added ${quantity} item(s) to cart`);
  };

  const handleBuyNow = () => {
    addToCart({
      _id: product._id.toString(),
      name: product.name,
      price: product.discountPrice > 0 ? product.discountPrice : product.price,
      image: product.images?.[0] || "",
      quantity,
    });
    router.push("/checkout");
  };

  const handleAddToWishlist = () => {
    toggleWishlist(product._id.toString());
    const isWishlisted = wishlist.includes(product._id.toString());
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  const isWishlisted = wishlist.includes(product._id.toString());

  return (
    <div className="space-y-3 w-full mb-8">
      {/* Row 1: Quantity Selector + Add to Cart + Wishlist */}
      <div className="flex items-center gap-2.5 sm:gap-3 w-full">
        {/* Quantity Selector */}
        <div className="flex items-center justify-between border border-[#E5E7EB] rounded-2xl p-1 bg-[#F7F8F5] h-12 w-28 sm:w-36 shrink-0">
          <Button 
            type="button"
            variant="ghost" 
            size="icon" 
            className="h-10 w-8 sm:w-10 rounded-xl hover:bg-white text-[#4B5563] cursor-pointer" 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Button>
          <span className="flex-1 text-center font-extrabold text-xs sm:text-sm text-[#111827]">{quantity}</span>
          <Button 
            type="button"
            variant="ghost" 
            size="icon" 
            className="h-10 w-8 sm:w-10 rounded-xl hover:bg-white text-[#4B5563] cursor-pointer" 
            onClick={() => setQuantity(Math.min(product.countInStock || 99, quantity + 1))}
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Button>
        </div>

        {/* Add to Cart CTA Button */}
        <Button 
          type="button"
          size="lg" 
          className="flex-1 h-12 rounded-2xl text-xs sm:text-sm font-bold bg-[#163A32] hover:bg-[#0E2620] text-white shadow-md shadow-[#163A32]/20 cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 transition-all" 
          onClick={handleAddToCart}
        >
          <ShoppingCart className="w-4 h-4 text-[#D6A84F] shrink-0" />
          <span>Add to Cart</span>
        </Button>

        {/* Wishlist Button */}
        <Button 
          type="button"
          variant={isWishlisted ? "default" : "outline"} 
          size="icon" 
          className={`h-12 w-12 rounded-2xl shrink-0 cursor-pointer transition-all ${
            isWishlisted 
              ? 'bg-[#DC2626] hover:bg-[#B91C1C] border-[#DC2626] text-white' 
              : 'border-[#E5E7EB] text-[#4B5563] hover:text-[#163A32] hover:bg-[#F7F8F5]'
          }`} 
          onClick={handleAddToWishlist}
          aria-label="Wishlist"
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-white' : 'text-[#4B5563]'}`} />
        </Button>
      </div>

      {/* Row 2: Instant Buy Now Button */}
      <Button 
        type="button"
        size="lg" 
        className="w-full h-12 rounded-2xl text-sm font-black bg-[#D6A84F] hover:bg-[#C4953B] text-[#163A32] shadow-md shadow-[#D6A84F]/25 cursor-pointer flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]" 
        onClick={handleBuyNow}
      >
        <Zap className="w-4 h-4 fill-[#163A32] text-[#163A32]" />
        <span>Buy Now (Instant Order)</span>
      </Button>
    </div>
  );
}
