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

  return (
    <Link href={`/product/${product.slug}`} className="group bg-background rounded-2xl p-4 shadow-sm border border-border/40 hover:shadow-lg transition-all text-left flex flex-col h-full relative cursor-pointer">
      
      {product.discountPrice > 0 && (
        <div className="absolute top-2 right-2 bg-destructive text-white text-xs font-bold px-2 py-1 rounded-full z-10">
          SALE
        </div>
      )}

      <div className="block aspect-square bg-muted/20 rounded-xl mb-4 flex items-center justify-center overflow-hidden relative">
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
          
          {/* Quick Action Overlay on Hover (Desktop Only) */}
          <div className="absolute inset-0 bg-black/40 opacity-0 hidden md:flex group-hover:opacity-100 transition-opacity flex-col items-center justify-center gap-2 px-4 backdrop-blur-[2px]">
              <Button size="sm" className="w-full rounded-full shadow-lg" onClick={handleAddToCart}>
                <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
              </Button>
              <Button size="sm" variant="secondary" className="w-full rounded-full shadow-lg" onClick={handleBuyNow}>
                <CreditCard className="w-4 h-4 mr-2" /> Buy Now
              </Button>
          </div>
      </div>
      
      <div className="flex-1 flex flex-col pointer-events-none">
        <p className="text-xs text-secondary font-medium mb-1 truncate">{product.brand}</p>
        <h4 className="font-semibold text-sm md:text-base line-clamp-2 group-hover:text-primary transition-colors">{product.name}</h4>
        
        <div className="flex items-center space-x-1 my-2">
          <Star className="w-3.5 h-3.5 fill-secondary text-secondary" />
          <span className="text-xs text-muted-foreground">{product.rating} ({product.numReviews})</span>
        </div>
        
        <div className="mt-auto pt-4 flex flex-col gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-primary">
              ${product.discountPrice > 0 ? product.discountPrice.toFixed(2) : product.price.toFixed(2)}
            </span>
            {product.discountPrice > 0 && (
              <span className="text-xs text-muted-foreground line-through">${product.price.toFixed(2)}</span>
            )}
          </div>

          {/* Mobile Quick Actions (Mobile Only) */}
          <div className="flex md:hidden flex-row gap-2 pointer-events-auto">
            <Button size="sm" className="flex-1 rounded-full shadow-sm text-xs px-0" onClick={handleAddToCart}>
              <ShoppingCart className="w-3.5 h-3.5 mr-1" /> Add
            </Button>
            <Button size="sm" variant="secondary" className="flex-1 rounded-full shadow-sm text-xs px-0" onClick={handleBuyNow}>
              <CreditCard className="w-3.5 h-3.5 mr-1" /> Buy
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
