"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Search, 
  X, 
  Loader2, 
  TrendingUp, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Flame, 
  Tag,
  ChevronRight
} from "lucide-react";

interface SearchAutocompleteProps {
  variant?: "desktop" | "mobile";
  placeholder?: string;
}

const POPULAR_SEARCHES = [
  { term: "Cheetos", icon: "🥨", tag: "Snacks" },
  { term: "Ferrero Rocher", icon: "🍫", tag: "Chocolates" },
  { term: "Davidoff Coffee", icon: "☕", tag: "Beverages" },
  { term: "Pringles Sour Cream", icon: "🥔", tag: "Chips" },
  { term: "Buldak Ramen 2x", icon: "🍜", tag: "Noodles" },
  { term: "Lotus Biscoff", icon: "🍪", tag: "Cookies" },
  { term: "Nutella Biscuits", icon: "🌰", tag: "Snacks" },
];

export function SearchAutocomplete({ variant = "desktop", placeholder }: SearchAutocompleteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("dcc_recent_searches");
      if (saved) {
        setRecentSearches(JSON.parse(saved).slice(0, 5));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveRecentSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    try {
      const filtered = recentSearches.filter((s) => s.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem("dcc_recent_searches", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const clearRecentSearches = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem("dcc_recent_searches");
  };

  // Debounce query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch results when debounced query changes
  useEffect(() => {
    if (!debouncedQuery) {
      setProducts([]);
      setSuggestions([]);
      setTotalCount(0);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    async function searchAPI() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(debouncedQuery)}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setProducts(data.products || []);
            setSuggestions(data.suggestions || []);
            setTotalCount(data.totalCount || (data.products ? data.products.length : 0));
          }
        }
      } catch (err) {
        console.error("Autocomplete search error:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    searchAPI();

    return () => {
      isMounted = false;
    };
  }, [debouncedQuery]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (searchTerm?: string) => {
    const finalQuery = searchTerm || query;
    if (finalQuery.trim()) {
      saveRecentSearch(finalQuery);
      setIsFocused(false);
      inputRef.current?.blur();
      router.push(`/shop?q=${encodeURIComponent(finalQuery.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchSubmit();
    } else if (e.key === "Escape") {
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  // Helper to highlight matching letters in text
  const renderHighlightedText = (text: string, highlight: string) => {
    if (!highlight || !text) return text;
    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="text-[#163A32] font-black bg-[#D6A84F]/25 px-0.5 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const isMobile = variant === "mobile";

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Search Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearchSubmit();
        }}
        className={`relative w-full transition-all flex items-center shadow-2xs ${
          isMobile
            ? `h-10 bg-[#F7F8F5] rounded-full border ${
                isFocused ? "border-[#163A32] ring-2 ring-[#163A32]/10 bg-white" : "border-[#E5E7EB]"
              } pl-3.5 pr-1.5`
            : `h-11 lg:h-12 bg-white rounded-full border-2 ${
                isFocused
                  ? "border-[#163A32] ring-3 ring-[#163A32]/10"
                  : "border-[#163A32] hover:border-[#163A32]/90"
              } pl-4 sm:pl-5 pr-1.5`
        }`}
      >
        {/* Search Icon */}
        <Search className={`${isMobile ? "w-4 h-4" : "w-4.5 h-4.5"} text-slate-400 mr-2 shrink-0`} />

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isFocused) setIsFocused(true);
          }}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || (isMobile ? "Search chocolates, coffee, snacks..." : "What imported treats are you looking for?")}
          className="flex-1 bg-transparent text-xs sm:text-sm font-medium text-[#111827] placeholder:text-[#9CA3AF] outline-none min-w-0"
          autoComplete="off"
          spellCheck="false"
        />

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setDebouncedQuery("");
              inputRef.current?.focus();
            }}
            className="p-1 mr-1 text-slate-400 hover:text-[#111827] transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        )}

        {/* Search CTA Button */}
        <button
          type="submit"
          className={`${
            isMobile
              ? "h-7.5 px-3 bg-[#163A32] hover:bg-[#0E2620] text-white rounded-full flex items-center justify-center cursor-pointer text-xs font-bold"
              : "h-8.5 lg:h-9 px-4 sm:px-6 bg-[#163A32] hover:bg-[#0E2620] text-white font-bold text-xs sm:text-sm rounded-full flex items-center gap-1.5 shadow-sm shadow-[#163A32]/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          }`}
        >
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin text-[#D6A84F]" />
          ) : (
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white stroke-[2.2]" />
          )}
          <span className="hidden md:inline">Search</span>
        </button>
      </form>

      {/* ======================= AUTOCOMPLETE OVERLAY ======================= */}
      {isFocused && (
        <div 
          className={`absolute left-0 right-0 mt-2 bg-white border border-[#E5E7EB] rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-100 animate-in fade-in zoom-in-98 duration-150 ${
            isMobile ? "max-h-[75vh]" : "max-h-[480px]"
          }`}
        >
          {/* ================= STATE 1: Empty / Initial Focus ================= */}
          {!debouncedQuery ? (
            <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-[#6B7280] mb-2 px-1">
                    <span className="flex items-center gap-1.5 uppercase tracking-wider text-[10.5px]">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> Recent Searches
                    </span>
                    <button
                      type="button"
                      onClick={clearRecentSearches}
                      className="text-[11px] text-[#6B8F71] hover:text-red-600 hover:underline cursor-pointer"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {recentSearches.map((term, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setQuery(term);
                          handleSearchSubmit(term);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F7F8F5] hover:bg-[#163A32]/10 text-xs font-semibold text-[#111827] rounded-full border border-[#E5E7EB] transition-colors cursor-pointer"
                      >
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{term}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending & Popular Searches */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#6B7280] mb-2.5 px-1 uppercase tracking-wider text-[10.5px]">
                  <TrendingUp className="w-3.5 h-3.5 text-[#163A32]" /> Popular & Trending Searches
                </div>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((item) => (
                    <button
                      key={item.term}
                      type="button"
                      onClick={() => {
                        setQuery(item.term);
                        handleSearchSubmit(item.term);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F7F8F5] hover:bg-[#163A32] text-[#111827] hover:text-white rounded-full border border-[#E5E7EB] text-xs font-bold transition-all hover:scale-102 cursor-pointer shadow-2xs group"
                    >
                      <span>{item.icon}</span>
                      <span>{item.term}</span>
                      <span className="text-[10px] text-[#6B8F71] group-hover:text-[#D6A84F] font-normal">
                        ({item.tag})
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* ================= STATE 2: Query Typed (Suggestions + Live Products) ================= */
            <div className="overflow-y-auto max-h-[420px] divide-y divide-slate-100">
              
              {/* Keyword / Category Suggestions Bar */}
              {suggestions.length > 0 && (
                <div className="p-2.5 bg-[#F7F8F5]/80">
                  <p className="px-2 text-[10px] font-extrabold uppercase tracking-wider text-[#6B7280] mb-1.5">
                    Suggested Keywords
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setQuery(sug);
                          handleSearchSubmit(sug);
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-[#163A32] hover:text-white rounded-lg border border-[#E5E7EB] text-xs font-semibold text-[#111827] transition-colors cursor-pointer"
                      >
                        <Search className="w-3 h-3 text-slate-400 group-hover:text-white" />
                        <span>{sug}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Matching Products List */}
              {products.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  <div className="px-3.5 py-2 bg-slate-50 flex items-center justify-between text-[11px] font-bold text-[#6B7280]">
                    <span>Matching Products ({totalCount})</span>
                    <span className="text-[10px] text-[#6B8F71]">Click product to view</span>
                  </div>

                  {products.map((product) => {
                    const currentPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
                    const hasDiscount = product.price > currentPrice;

                    return (
                      <Link
                        key={product._id}
                        href={`/product/${product.slug}`}
                        onClick={() => {
                          saveRecentSearch(product.name);
                          setIsFocused(false);
                        }}
                        className="flex items-center gap-3 p-2.5 sm:p-3 hover:bg-[#F7F8F5] transition-colors group cursor-pointer"
                      >
                        {/* Square Thumbnail */}
                        <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-xl bg-[#F7F8F5] border border-[#E5E7EB] overflow-hidden shrink-0 flex items-center justify-center p-1">
                          <img
                            src={product.images?.[0] || "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=200&auto=format&fit=crop"}
                            alt={product.name}
                            className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=200&auto=format&fit=crop";
                            }}
                          />
                        </div>

                        {/* Title & Brand */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-[#111827] line-clamp-1 group-hover:text-[#163A32] transition-colors">
                            {renderHighlightedText(product.name, debouncedQuery)}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] text-[#6B8F71] font-semibold">
                              {product.brand || product.category?.name || "Direct Import"}
                            </span>
                            {product.countInStock > 0 ? (
                              <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 px-1.5 rounded">
                                In Stock
                              </span>
                            ) : (
                              <span className="text-[9.5px] font-bold text-red-600 bg-red-50 px-1.5 rounded">
                                Out of Stock
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Price Column */}
                        <div className="text-right shrink-0">
                          <p className="text-xs sm:text-sm font-black text-[#163A32]">
                            ৳{currentPrice?.toFixed(0)}
                          </p>
                          {hasDiscount && (
                            <p className="text-[10px] text-[#9CA3AF] line-through font-semibold">
                              ৳{product.price?.toFixed(0)}
                            </p>
                          )}
                        </div>

                        {/* Arrow */}
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#163A32] group-hover:translate-x-0.5 transition-all shrink-0" />
                      </Link>
                    );
                  })}
                </div>
              ) : (
                /* Empty state when query produces no matches */
                !isLoading && (
                  <div className="p-6 text-center">
                    <div className="w-10 h-10 rounded-full bg-[#F7F8F5] text-slate-400 flex items-center justify-center mx-auto mb-2">
                      <Search className="w-5 h-5" />
                    </div>
                    <p className="font-bold text-xs text-[#111827]">No direct match found for &ldquo;{debouncedQuery}&rdquo;</p>
                    <p className="text-[11px] text-[#6B7280] mt-0.5 mb-3">Try searching for broader keywords like chocolates, chips, or ramen.</p>
                    
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {["Chocolates", "Coffee", "Snacks", "Cheetos"].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            setQuery(tag);
                            handleSearchSubmit(tag);
                          }}
                          className="text-[11px] font-bold px-2.5 py-1 bg-[#F7F8F5] hover:bg-[#163A32] hover:text-white rounded-full border border-[#E5E7EB] transition-colors"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              )}

              {/* Bottom Sticky View All Banner */}
              <div className="p-3 bg-[#F7F8F5] text-center">
                <button
                  type="button"
                  onClick={() => handleSearchSubmit()}
                  className="w-full py-2 px-4 bg-[#163A32] hover:bg-[#0E2620] text-white text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs group cursor-pointer"
                >
                  <span>View all results for &ldquo;{query}&rdquo;</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#D6A84F] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
