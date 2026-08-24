"use client";

import Link from "next/link";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Trash2, 
  ShoppingCart, 
  ArrowRight, 
  Loader2, 
  Sparkles, 
  CheckCircle2, 
  ShoppingBag,
  Flame
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart, clearCart, setCartOpen } = useStore();
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch real products whenever wishlist IDs change
  useEffect(() => {
    if (!mounted) return;

    if (wishlist.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    let isMounted = true;
    async function loadProducts() {
      try {
        setLoading(true);
        const res = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: wishlist }),
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setProducts(data.products || []);
          }
        }
      } catch (error) {
        console.error("Failed to fetch wishlist products:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [wishlist, mounted]);

  const handleAddToCart = (product: any) => {
    const price = product.discountPrice > 0 ? product.discountPrice : product.price;
    addToCart({
      _id: product._id.toString(),
      name: product.name,
      price,
      image: product.images?.[0] || "",
      quantity: 1,
    });
    toast.success(`${product.name} added to cart!`);
  };

  const handleAddAllToCart = () => {
    if (products.length === 0) return;
    
    let addedCount = 0;
    products.forEach((product) => {
      if (product.countInStock !== 0) {
        const price = product.discountPrice > 0 ? product.discountPrice : product.price;
        addToCart({
          _id: product._id.toString(),
          name: product.name,
          price,
          image: product.images?.[0] || "",
          quantity: 1,
        });
        addedCount++;
      }
    });

    if (addedCount > 0) {
      toast.success(`Moved ${addedCount} items to your cart!`);
      setCartOpen(true);
    } else {
      toast.error("All saved items are currently out of stock.");
    }
  };

  const handleClearWishlist = () => {
    if (confirm("Are you sure you want to clear your entire wishlist?")) {
      wishlist.forEach((id) => toggleWishlist(id));
      toast.success("Wishlist cleared");
    }
  };

  const handleRemove = (productId: string, productName: string) => {
    toggleWishlist(productId);
    toast.success(`Removed ${productName} from wishlist`);
  };

  if (!mounted) return null;

  if (loading && products.length === 0 && wishlist.length > 0) {
    return (
      <div className="container mx-auto px-4 py-24 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#163A32] mb-4" />
        <h2 className="text-xl font-bold text-[#111827]">Loading your saved wishlist...</h2>
        <p className="text-xs text-[#6B7280] mt-1">Retrieving latest pricing and stock availability</p>
      </div>
    );
  }

  if (wishlist.length === 0 || products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 min-h-[65vh] flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#F7F8F5] border border-[#E5E7EB] rounded-full flex items-center justify-center mb-5 shadow-xs">
          <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-[#6B7280] stroke-[1.5]" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#111827] mb-2 font-heading">
          Your Wishlist is Empty
        </h1>
        <p className="text-xs sm:text-sm text-[#4B5563] mb-8 max-w-md leading-relaxed">
          Save authentic imported treats and specialty chocolates you love to your wishlist. Review them anytime and easily move them to your cart.
        </p>
        <Button size="lg" asChild className="rounded-full px-8 bg-[#163A32] hover:bg-[#0E2620] text-white font-bold shadow-md shadow-[#163A32]/20">
          <Link href="/shop" className="flex items-center gap-2">
            <span>Explore Imported Deals</span>
            <ArrowRight className="w-4 h-4 text-[#D6A84F]" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 min-h-screen">
      {/* Page Header with Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#E5E7EB]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111827] font-heading flex items-center gap-2">
              <Heart className="w-7 h-7 text-red-500 fill-red-500 shrink-0" />
              <span>My Saved Wishlist</span>
            </h1>
            <span className="bg-[#163A32] text-white text-xs font-black px-2.5 py-0.5 rounded-full">
              {products.length} {products.length === 1 ? 'Item' : 'Items'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#4B5563] mt-1 font-medium">
            Saved items from DCC Corner. Prices and stock update in real-time.
          </p>
        </div>

        {/* Global Wishlist Actions */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <Button
            type="button"
            onClick={handleAddAllToCart}
            className="bg-[#163A32] hover:bg-[#0E2620] text-white text-xs font-bold rounded-xl h-10 px-4 flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-[#D6A84F]" />
            <span>Move All to Cart</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleClearWishlist}
            className="border-[#E5E7EB] text-[#4B5563] hover:text-red-600 hover:bg-red-50 text-xs font-bold rounded-xl h-10 px-3 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            <span>Clear</span>
          </Button>
        </div>
      </div>

      {/* Product Grid (2 cols on mobile, 3 on md, 4 on lg) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
        {products.map((product) => {
          const regularPrice = product.price || 0;
          const currentPrice = product.discountPrice > 0 ? product.discountPrice : regularPrice;
          const hasDiscount = regularPrice > currentPrice;
          const discountPercent = hasDiscount
            ? Math.round(((regularPrice - currentPrice) / regularPrice) * 100)
            : 0;
          const isOutOfStock = product.countInStock === 0;

          return (
            <div
              key={product._id}
              className="group bg-white rounded-[22px] sm:rounded-[28px] p-2.5 sm:p-4 border border-[#E5E7EB] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(22,58,50,0.09)] hover:border-[#163A32]/30 transition-all duration-300 flex flex-col justify-between relative text-left h-full overflow-hidden"
            >
              {/* Image Container with Badges & Delete Button */}
              <div className="relative w-full aspect-square bg-[#F7F8F5] rounded-[18px] sm:rounded-[22px] overflow-hidden mb-2.5 sm:mb-3 border border-slate-100 flex items-center justify-center">
                
                {/* Status Badge */}
                <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 z-10">
                  {hasDiscount ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[8.5px] sm:text-[10px] font-black uppercase tracking-tight bg-red-500 text-white shadow-xs">
                      -{discountPercent}% SALE
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[8.5px] sm:text-[10px] font-black uppercase tracking-tight bg-white/90 backdrop-blur-md text-[#163A32] border border-white/60 shadow-xs">
                      Direct Import
                    </span>
                  )}
                </div>

                {/* Remove from Wishlist Trash Icon */}
                <button
                  type="button"
                  onClick={() => handleRemove(product._id, product.name)}
                  title="Remove item"
                  aria-label="Remove from wishlist"
                  className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-md shadow-xs border border-white/60 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                {/* Main Product Image */}
                <Link href={`/product/${product.slug}`} className="w-full h-full block cursor-pointer">
                  <img
                    src={product.images?.[0] || "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=400&auto=format&fit=crop"}
                    alt={product.name}
                    className="w-full h-full object-contain p-2.5 sm:p-4 group-hover:scale-108 transition-transform duration-500 ease-out"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=400&auto=format&fit=crop";
                    }}
                  />
                </Link>
              </div>

              {/* Product Info */}
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <Link href={`/product/${product.slug}`} className="block">
                    <h3 className="font-extrabold text-xs sm:text-base text-[#111827] line-clamp-2 leading-snug group-hover:text-[#163A32] transition-colors font-heading">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-[10px] sm:text-xs font-bold text-[#6B8F71] mt-0.5 line-clamp-1 font-heading">
                    {product.brand || product.category?.name || "Direct Import"}
                  </p>
                </div>

                {/* Price & Add to Cart Bottom Action */}
                <div className="mt-3 pt-1 space-y-2.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm sm:text-base font-black text-[#163A32] font-heading">
                      ৳{currentPrice.toLocaleString()}
                    </span>
                    {hasDiscount && (
                      <span className="text-[10px] sm:text-xs text-[#9CA3AF] line-through font-medium">
                        ৳{regularPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <Button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    disabled={isOutOfStock}
                    size="sm"
                    className={`w-full rounded-xl text-xs font-bold h-9 flex items-center justify-center gap-1.5 shadow-xs cursor-pointer ${
                      isOutOfStock
                        ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                        : "bg-[#163A32] hover:bg-[#D6A84F] text-white hover:text-[#163A32] transition-all duration-200"
                    }`}
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>{isOutOfStock ? "Out of Stock" : "Move to Cart"}</span>
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
