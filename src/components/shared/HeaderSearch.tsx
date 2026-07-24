"use client";

import { Search, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export function HeaderSearch() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounce the search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch results when debounced query changes
  useEffect(() => {
    async function fetchResults() {
      if (debouncedQuery.length < 2) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(debouncedQuery)}`);
        const data = await res.json();
        setResults(data);
        setIsOpen(true);
      } catch (error) {
        console.error("Search fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchResults();
  }, [debouncedQuery]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpen(false);
    if (query.trim()) {
      router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/shop");
    }
  };

  return (
    <div className="relative w-full group" ref={dropdownRef}>
      <form onSubmit={handleSearch} className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (results.length > 0) setIsOpen(true) }}
          className="block w-full p-2 pl-10 pr-10 text-sm bg-muted/50 border border-transparent rounded-full focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-background transition-all outline-none"
          placeholder="Search premium imported snacks..."
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Loader2 className="w-4 h-4 text-primary animate-spin" />
          </div>
        )}
      </form>

      {/* Live Search Dropdown */}
      {isOpen && debouncedQuery.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border shadow-xl rounded-2xl overflow-hidden z-50">
          {results.length > 0 ? (
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-semibold text-muted-foreground bg-muted/20">
                Products
              </div>
              {results.map((product) => (
                <Link 
                  key={product._id} 
                  href={`/product/${product.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 px-4 py-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="w-10 h-10 bg-muted/30 rounded-md overflow-hidden shrink-0">
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h4 className="text-sm font-medium truncate">{product.name}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-sm font-bold text-primary">
                        ${product.discountPrice > 0 ? product.discountPrice.toFixed(2) : product.price.toFixed(2)}
                      </span>
                      {product.discountPrice > 0 && (
                        <span className="text-xs text-muted-foreground line-through">${product.price.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
              <div className="border-t border-border mt-1">
                <button 
                  onClick={handleSearch}
                  className="w-full text-center py-3 text-sm text-primary font-medium hover:bg-primary/5 transition-colors"
                >
                  View all results for "{debouncedQuery}"
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-muted-foreground text-sm">
              No products found for "{debouncedQuery}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
