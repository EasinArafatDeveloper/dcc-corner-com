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
      <div className="flex items-center border border-border rounded-full p-1 bg-background h-12 w-full sm:w-32">
        <Button variant="ghost" size="icon" className="h-full rounded-full" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
          <Minus className="w-4 h-4" />
        </Button>
        <span className="flex-1 text-center font-medium">{quantity}</span>
        <Button variant="ghost" size="icon" className="h-full rounded-full" onClick={() => setQuantity(Math.min(product.countInStock, quantity + 1))}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <Button size="lg" className="w-full h-12 rounded-full text-base" onClick={handleAddToCart}>
        <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
      </Button>
      <Button 
        variant={isWishlisted ? "default" : "outline"} 
        size="icon" 
        className={`h-12 w-12 rounded-full shrink-0 ${isWishlisted ? 'bg-destructive hover:bg-destructive/90 border-destructive text-white' : ''}`} 
        onClick={handleAddToWishlist}
      >
        <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-white' : 'text-muted-foreground'}`} />
      </Button>
    </div>
  );
}
