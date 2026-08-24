"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Filter, 
  Search, 
  X, 
  RotateCcw, 
  Flame, 
  Sparkles, 
  Check, 
  ChevronDown, 
  SlidersHorizontal,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ShopFiltersProps {
  categories: any[];
  brands: string[];
}

const PRICE_PRESETS = [
  { label: "All Prices", min: "", max: "" },
  { label: "Under ৳500", min: "0", max: "500" },
  { label: "৳500 - ৳1,000", min: "500", max: "1000" },
  { label: "৳1,000 - ৳2,500", min: "1000", max: "2500" },
  { label: "Over ৳2,500", min: "2500", max: "" },
];

export function ShopFilters({ categories, brands }: ShopFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get("brand") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [isOffersOnly, setIsOffersOnly] = useState(searchParams.get("offers") === "true");
  const [isInStockOnly, setIsInStockOnly] = useState(searchParams.get("inStock") === "true");
  const [brandSearch, setBrandSearch] = useState("");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Sync state with URL changes
  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "");
    setSelectedBrand(searchParams.get("brand") || "");
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
    setIsOffersOnly(searchParams.get("offers") === "true");
    setIsInStockOnly(searchParams.get("inStock") === "true");
  }, [searchParams]);

  // Apply all filters into URL search params
  const updateUrl = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || value === "false") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    router.push(`/shop?${params.toString()}`);
  };

  const handleCategorySelect = (slug: string) => {
    const nextCat = selectedCategory === slug ? "" : slug;
    setSelectedCategory(nextCat);
    updateUrl({ category: nextCat || null });
  };

  const handleBrandSelect = (brand: string) => {
    const nextBrand = selectedBrand === brand ? "" : brand;
    setSelectedBrand(nextBrand);
    updateUrl({ brand: nextBrand || null });
  };

  const handlePricePreset = (min: string, max: string) => {
    setMinPrice(min);
    setMaxPrice(max);
    updateUrl({ minPrice: min || null, maxPrice: max || null });
  };

  const handleCustomPriceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl({ minPrice: minPrice || null, maxPrice: maxPrice || null });
  };

  const handleOffersToggle = () => {
    const next = !isOffersOnly;
    setIsOffersOnly(next);
    updateUrl({ offers: next ? "true" : null });
  };

  const handleInStockToggle = () => {
    const next = !isInStockOnly;
    setIsInStockOnly(next);
    updateUrl({ inStock: next ? "true" : null });
  };

  const handleResetAll = () => {
    setSelectedCategory("");
    setSelectedBrand("");
    setMinPrice("");
    setMaxPrice("");
    setIsOffersOnly(false);
    setIsInStockOnly(false);
    setBrandSearch("");
    router.push("/shop");
  };

  // Count total active filters
  const activeCount = [
    selectedCategory,
    selectedBrand,
    minPrice,
    maxPrice,
    isOffersOnly,
    isInStockOnly,
  ].filter(Boolean).length;

  const filteredBrands = brands.filter((b) =>
    b.toLowerCase().includes(brandSearch.toLowerCase())
  );

  const filterContent = (
    <div className="space-y-6">
      {/* 1. Filter Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#163A32]" />
          <h3 className="font-black text-sm text-[#111827] uppercase tracking-wider font-heading">
            Filters
          </h3>
          {activeCount > 0 && (
            <span className="bg-[#163A32] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={handleResetAll}
            className="text-[11px] font-bold text-[#6B8F71] hover:text-red-600 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* 2. Quick Perks / Toggles (Wholesale Deals, In Stock) */}
      <div className="space-y-2">
        <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#9CA3AF]">
          Special Filters
        </p>
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={handleOffersToggle}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              isOffersOnly
                ? "bg-red-50 text-red-700 border-red-200 shadow-2xs font-extrabold"
                : "bg-[#F7F8F5] hover:bg-[#E5E7EB]/70 text-[#374151] border-[#E5E7EB]"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 fill-red-500 text-red-500" />
              <span>Wholesale Deals Only</span>
            </span>
            {isOffersOnly && <Check className="w-3.5 h-3.5 text-red-600" />}
          </button>

          <button
            type="button"
            onClick={handleInStockToggle}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              isInStockOnly
                ? "bg-emerald-50 text-emerald-800 border-emerald-200 shadow-2xs font-extrabold"
                : "bg-[#F7F8F5] hover:bg-[#E5E7EB]/70 text-[#374151] border-[#E5E7EB]"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>In Stock Items Only</span>
            </span>
            {isInStockOnly && <Check className="w-3.5 h-3.5 text-emerald-600" />}
          </button>
        </div>
      </div>

      {/* 3. Category Filter */}
      <div className="space-y-2.5 pt-2 border-t border-slate-100">
        <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#9CA3AF]">
          Categories
        </p>
        <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
          {categories.map((cat: any) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat._id}
                type="button"
                onClick={() => handleCategorySelect(cat.slug)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#163A32] text-white font-bold shadow-xs"
                    : "hover:bg-[#F7F8F5] text-[#374151] font-medium"
                }`}
              >
                <span className="truncate">{cat.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#D6A84F]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Price Range Presets & Custom Filter */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#9CA3AF]">
          Price Range (BDT)
        </p>
        <div className="flex flex-wrap gap-1.5">
          {PRICE_PRESETS.map((preset) => {
            const isSelected = minPrice === preset.min && maxPrice === preset.max;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => handlePricePreset(preset.min, preset.max)}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#163A32] text-white border-[#163A32] shadow-2xs"
                    : "bg-[#F7F8F5] hover:bg-[#E5E7EB] text-[#374151] border-[#E5E7EB]"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* Custom Min / Max Inputs */}
        <form onSubmit={handleCustomPriceSubmit} className="flex items-center gap-2 pt-1">
          <input
            type="number"
            placeholder="Min ৳"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-1/2 h-8 px-2.5 bg-[#F7F8F5] border border-[#E5E7EB] rounded-lg text-xs font-semibold text-[#111827] outline-none focus:border-[#163A32]"
          />
          <span className="text-slate-400 text-xs font-bold">-</span>
          <input
            type="number"
            placeholder="Max ৳"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-1/2 h-8 px-2.5 bg-[#F7F8F5] border border-[#E5E7EB] rounded-lg text-xs font-semibold text-[#111827] outline-none focus:border-[#163A32]"
          />
          <Button
            type="submit"
            size="sm"
            className="h-8 px-2.5 bg-[#163A32] hover:bg-[#0E2620] text-white text-xs font-bold rounded-lg cursor-pointer shrink-0"
          >
            Apply
          </Button>
        </form>
      </div>

      {/* 5. Brands Filter */}
      {brands.length > 0 && (
        <div className="space-y-2.5 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#9CA3AF]">
              Brands
            </p>
            {brands.length > 5 && (
              <span className="text-[10px] text-[#6B8F71] font-semibold">
                {brands.length} Brands
              </span>
            )}
          </div>

          {/* Mini Search for Brands */}
          {brands.length > 6 && (
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
              <input
                type="text"
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                placeholder="Search brands..."
                className="w-full h-7.5 pl-7 pr-2 bg-[#F7F8F5] border border-[#E5E7EB] rounded-lg text-[11px] text-[#111827] outline-none"
              />
            </div>
          )}

          <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
            {filteredBrands.map((brand) => {
              const isSelected = selectedBrand === brand;
              return (
                <button
                  key={brand}
                  type="button"
                  onClick={() => handleBrandSelect(brand)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#163A32] text-white font-bold shadow-xs"
                      : "hover:bg-[#F7F8F5] text-[#374151] font-medium"
                  }`}
                >
                  <span className="truncate">{brand}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#D6A84F]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 xl:w-72 shrink-0">
        <div className="bg-white p-5 rounded-3xl border border-[#E5E7EB] shadow-2xs sticky top-24">
          {filterContent}
        </div>
      </aside>

      {/* Mobile Drawer Trigger Button */}
      <div className="lg:hidden w-full mb-4">
        <Button
          type="button"
          onClick={() => setIsMobileOpen(true)}
          className="w-full h-11 bg-white hover:bg-[#F7F8F5] text-[#111827] border border-[#E5E7EB] rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-2xs"
        >
          <SlidersHorizontal className="w-4 h-4 text-[#163A32]" />
          <span>Filter Products</span>
          {activeCount > 0 && (
            <span className="bg-[#163A32] text-white text-[10px] font-black px-2 py-0.5 rounded-full ml-1">
              {activeCount} Active
            </span>
          )}
        </Button>
      </div>

      {/* Mobile Slide-Up Modal Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl max-h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">
            {/* Modal Header */}
            <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#163A32]" />
                <h3 className="font-black text-sm text-[#111827] uppercase tracking-wider">
                  Filter Products
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                className="p-1.5 text-slate-400 hover:text-[#111827] rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5">
              {filterContent}
            </div>

            {/* Modal Footer CTA */}
            <div className="p-4 border-t border-[#E5E7EB] bg-[#F7F8F5] flex items-center gap-3">
              {activeCount > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResetAll}
                  className="flex-1 h-11 rounded-2xl border-[#E5E7EB] text-xs font-bold text-red-600 hover:bg-red-50"
                >
                  Clear All
                </Button>
              )}
              <Button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                className="flex-1 h-11 bg-[#163A32] hover:bg-[#0E2620] text-white rounded-2xl font-bold text-xs shadow-md shadow-[#163A32]/20"
              >
                Show Results
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
