"use client";

import Link from "next/link";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Since we don't have a backend fetching wishlist items by ID yet, we'll use a mock item display
export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <Heart className="w-12 h-12 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Your wishlist is empty</h1>
        <p className="text-muted-foreground mb-8 max-w-md">Save items you love to your wishlist. Review them anytime and easily move them to cart.</p>
        <Button size="lg" asChild className="rounded-full">
          <Link href="/shop">Explore Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 tracking-tight flex items-center">
        <Heart className="w-8 h-8 mr-3 text-secondary fill-secondary" /> My Wishlist
      </h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {wishlist.map((id) => (
          <div key={id} className="group bg-background rounded-2xl p-4 shadow-sm border border-border/40 hover:shadow-lg transition-all text-left flex flex-col relative">
            
            <button 
              onClick={() => toggleWishlist(id)}
              className="absolute top-6 right-6 z-10 w-8 h-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center text-destructive hover:bg-destructive hover:text-white transition-colors border border-border/50 shadow-sm"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <Link href={`/product/demo-${id}`} className="block aspect-[4/5] bg-muted/50 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                <span className="text-muted-foreground text-xs">Product Image</span>
            </Link>
            <p className="text-xs text-secondary font-medium mb-1">Premium Brand</p>
            <Link href={`/product/demo-${id}`}>
              <h4 className="font-semibold text-sm md:text-base line-clamp-2 group-hover:text-primary transition-colors">Imported Product Title (ID: {id.substring(0,4)})</h4>
            </Link>
            <div className="mt-auto pt-4 space-y-3">
              <span className="text-lg font-bold text-primary block">$24.99</span>
              <Button 
                size="sm" 
                className="w-full rounded-full h-9 text-xs"
                onClick={() => {
                  addToCart({
                    _id: id,
                    name: `Imported Product Title (ID: ${id.substring(0,4)})`,
                    price: 24.99,
                    image: '',
                    quantity: 1
                  });
                  toast.success("Added to cart");
                }}
              >
                <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
