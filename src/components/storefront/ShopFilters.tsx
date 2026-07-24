"use client";

import { Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

interface ShopFiltersProps {
  categories: any[];
  brands: string[];
}

export function ShopFilters({ categories, brands }: ShopFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get("brand") || "");

  // Update URL whenever filters change
  const applyFilters = (newQ: string, newCat: string, newBrand: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (newQ) params.set("q", newQ); else params.delete("q");
    if (newCat) params.set("category", newCat); else params.delete("category");
    if (newBrand) params.set("brand", newBrand); else params.delete("brand");
    
    // Preserve offers parameter if it exists
    if (searchParams.get("offers")) {
      params.set("offers", searchParams.get("offers")!);
    }

    router.push(`/shop?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters(query, selectedCategory, selectedBrand);
  };

  const handleCategoryChange = (slug: string) => {
    const newCat = selectedCategory === slug ? "" : slug;
    setSelectedCategory(newCat);
    applyFilters(query, newCat, selectedBrand);
  };

  const handleBrandChange = (brand: string) => {
    const newBrand = selectedBrand === brand ? "" : brand;
    setSelectedBrand(newBrand);
    applyFilters(query, selectedCategory, newBrand);
  };

  return (
    <aside className="w-full md:w-64 shrink-0 space-y-8">
      <div className="space-y-4">
        <h3 className="font-semibold text-lg flex items-center"><Filter className="w-4 h-4 mr-2" /> Filters</h3>
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search products..." 
            className="pl-8" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>
      </div>

      <div className="space-y-4 border-t pt-4">
        <h4 className="font-medium">Categories</h4>
        <div className="space-y-2">
          {categories.map((category: any) => (
            <div key={category._id} className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id={`cat-${category.slug}`} 
                className="rounded border-gray-300 text-primary focus:ring-primary" 
                checked={selectedCategory === category.slug}
                onChange={() => handleCategoryChange(category.slug)}
              />
              <Label htmlFor={`cat-${category.slug}`} className="text-sm font-normal cursor-pointer">{category.name}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 border-t pt-4">
        <h4 className="font-medium">Brands</h4>
        <div className="space-y-2">
          {brands.map((brand: any) => (
            <div key={brand} className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id={`brand-${brand}`} 
                className="rounded border-gray-300 text-primary focus:ring-primary" 
                checked={selectedBrand === brand}
                onChange={() => handleBrandChange(brand)}
              />
              <Label htmlFor={`brand-${brand}`} className="text-sm font-normal cursor-pointer">{brand}</Label>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
