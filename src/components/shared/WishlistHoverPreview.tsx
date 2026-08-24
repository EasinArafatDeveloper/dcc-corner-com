"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";

export function WishlistHoverPreview() {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch real product details whenever wishlist IDs change and dropdown is opened or on mount
  useEffect(() => {
    if (!mounted || wishlist.length === 0) {
      setProducts([]);
      return;
    }

    let isMounted = true;
    async function loadWishlistProducts() {
      try {
        setLoading(true);
        const res = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: wishlist }),
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.products) {
            setProducts(data.products);
          }
        }
      } catch (err) {
        console.error("Failed to load wishlist items:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadWishlistProducts();

    return () => {
      isMounted = false;
    };
  }, [wishlist, mounted]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  const handleQuickAdd = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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

  const handleRemove = (productId: string, productName: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(productId);
    toast.success(`Removed ${productName} from wishlist`);
  };

  const wishlistCount = mounted ? wishlist.length : 0;

  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Wishlist Heart Icon Button */}
      <Link
        href="/wishlist"
        aria-label="Wishlist"
        className="p-2 text-[#111827] hover:text-[#163A32] hover:bg-[#F7F8F5] rounded-full transition-colors cursor-pointer relative flex items-center justify-center"
      >
        <Heart className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[1.8]" />
        {wishlistCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-[#163A32] text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-xs">
            {wishlistCount}
          </span>
        )}
      </Link>

      {/* Desktop Hover Dropdown Preview (Hidden on Mobile) */}
      {isOpen && (
        <div 
          className="hidden md:block absolute right-0 top-full pt-2 z-50 w-80 sm:w-96 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] overflow-hidden">
            {/* Header */}
            <div className="p-3.5 bg-[#F7F8F5] border-b border-[#E5E7EB] flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-[#111827]">
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                <span>My Wishlist</span>
                <span className="text-xs text-[#6B7280] font-normal">({wishlistCount})</span>
              </div>
              <Link 
                href="/wishlist" 
                onClick={() => setIsOpen(false)}
                className="text-xs font-bold text-[#6B8F71] hover:text-[#163A32] transition-colors"
              >
                View All →
              </Link>
            </div>

            {/* Content List */}
            <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 p-1">
              {loading && products.length === 0 ? (
                <div className="py-8 flex flex-col items-center justify-center text-slate-400 gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-[#163A32]" />
                  <span className="text-xs">Loading your saved items...</span>
                </div>
              ) : products.length === 0 ? (
                <div className="py-8 px-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#F7F8F5] text-slate-400 flex items-center justify-center mx-auto mb-2">
                    <Heart className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <p className="font-bold text-xs text-[#111827]">Your wishlist is empty</p>
                  <p className="text-[11px] text-[#6B7280] mt-0.5 mb-3">Save favorite imported treats to purchase later.</p>
                  <Link
                    href="/shop"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-[#163A32] text-white text-xs font-bold rounded-full hover:bg-[#0E2620] transition-colors"
                  >
                    Explore Shop
                  </Link>
                </div>
              ) : (
                products.map((item) => {
                  const currentPrice = item.discountPrice > 0 ? item.discountPrice : item.price;
                  const hasDiscount = item.price > currentPrice;

                  return (
                    <div 
                      key={item._id}
                      className="p-2.5 hover:bg-[#F7F8F5] rounded-xl transition-colors flex items-center gap-3 group"
                    >
                      {/* Product Thumbnail */}
                      <Link 
                        href={`/product/${item.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="w-13 h-13 bg-[#F7F8F5] border border-[#E5E7EB] rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-1"
                      >
                        <img 
                          src={item.images?.[0] || "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=200&auto=format&fit=crop"} 
                          alt={item.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                        />
                      </Link>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <Link 
                          href={`/product/${item.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="block"
                        >
                          <h4 className="font-bold text-xs text-[#111827] line-clamp-1 group-hover:text-[#163A32] transition-colors">
                            {item.name}
                          </h4>
                        </Link>
                        <div className="flex items-baseline gap-1.5 mt-0.5">
                          <span className="font-black text-xs text-[#163A32]">
                            ৳{currentPrice?.toLocaleString()}
                          </span>
                          {hasDiscount && (
                            <span className="text-[10px] text-[#9CA3AF] line-through">
                              ৳{item.price?.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => handleQuickAdd(item, e)}
                          title="Add to Cart"
                          className="p-1.5 bg-[#163A32] hover:bg-[#D6A84F] text-white hover:text-[#163A32] rounded-lg transition-all active:scale-95 cursor-pointer shadow-xs"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleRemove(item._id, item.name, e)}
                          title="Remove from Wishlist"
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer CTA */}
            {products.length > 0 && (
              <div className="p-2.5 bg-[#F7F8F5] border-t border-[#E5E7EB] text-center">
                <Link
                  href="/wishlist"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-2 px-4 bg-[#163A32] hover:bg-[#0E2620] text-white text-xs font-black rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs group"
                >
                  <span>Go to Wishlist Page</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#D6A84F] group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
