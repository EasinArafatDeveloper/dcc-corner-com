"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown, ChevronDown } from "lucide-react";

export function ShopSort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "";

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value) {
      params.set("sort", e.target.value);
    } else {
      params.delete("sort");
    }
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="relative inline-flex items-center bg-white border border-[#E5E7EB] rounded-2xl px-3 py-1.5 shadow-2xs">
      <ArrowUpDown className="w-3.5 h-3.5 text-[#163A32] mr-2 shrink-0" />
      <span className="text-xs font-semibold text-[#6B7280] mr-1.5 hidden sm:inline">Sort:</span>
      <select 
        className="text-xs font-bold text-[#111827] bg-transparent outline-none cursor-pointer pr-5 appearance-none"
        value={currentSort}
        onChange={handleSortChange}
      >
        <option value="">Featured Items</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="newest">Newest Arrivals</option>
        <option value="top-selling">Best Sellers</option>
      </select>
      <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 pointer-events-none" />
    </div>
  );
}
