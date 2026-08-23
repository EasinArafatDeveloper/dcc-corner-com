"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/store/useStore";

interface ProductActionsProps {
  product: any;
}

export function ProductActions({ product }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, toggleWishlist, wishlist } = useStore();

  const handleAddToCart = () => {
    addToCart({
      _id: product._id.toString(),
      name: product.name,
      price: product.discountPrice > 0 ? product.discountPrice : product.price,
      image: product.images[0],
      quantity,
    });
    toast.success(`Added ${quantity} item(s) to cart`);
  };

  const handleAddToWishlist = () => {
    toggleWishlist(product._id.toString());
    const isWishlisted = wishlist.includes(product._id.toString());
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  const isWishlisted = wishlist.includes(product._id.toString());

  return (
    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
      <div className="flex items-center border border-[#E5E7EB] rounded-2xl p-1 bg-[#F7F8F5] h-12 w-full sm:w-36">
        <Button variant="ghost" size="icon" className="h-full rounded-xl hover:bg-white text-[#4B5563]" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
          <Minus className="w-4 h-4" />
        </Button>
        <span className="flex-1 text-center font-extrabold text-sm text-[#111827]">{quantity}</span>
        <Button variant="ghost" size="icon" className="h-full rounded-xl hover:bg-white text-[#4B5563]" onClick={() => setQuantity(Math.min(product.countInStock || 99, quantity + 1))}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <Button size="lg" className="w-full h-12 rounded-2xl text-sm font-bold bg-[#163A32] hover:bg-[#0E2620] text-white shadow-md shadow-[#163A32]/20 cursor-pointer" onClick={handleAddToCart}>
        <ShoppingCart className="w-4 h-4 mr-2 text-[#D6A84F]" /> Add to Cart
      </Button>
      <Button 
        variant={isWishlisted ? "default" : "outline"} 
        size="icon" 
        className={`h-12 w-12 rounded-2xl shrink-0 cursor-pointer ${isWishlisted ? 'bg-[#DC2626] hover:bg-[#B91C1C] border-[#DC2626] text-white' : 'border-[#E5E7EB] text-[#4B5563] hover:text-[#163A32] hover:bg-[#F7F8F5]'}`} 
        onClick={handleAddToWishlist}
      >
        <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-white' : 'text-[#4B5563]'}`} />
      </Button>
    </div>
  );
}
