"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, Search, Percent, Trash2, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OffersAdminPage() {
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState<any[]>([]);
  
  // Search & Add state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number | "">("");
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/offers");
      if (res.ok) {
        const data = await res.json();
        setOffers(data.offers || []);
      }
    } catch (error) {
      toast.error("Failed to load offers");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setSearching(true);
      const res = await fetch(`/api/admin/offers/search?q=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.products || []);
      }
    } catch (error) {
      toast.error("Search failed");
    } finally {
      setSearching(false);
    }
  };

  const handleApplyOffer = async () => {
    if (!selectedProduct || !discountPercent || Number(discountPercent) <= 0 || Number(discountPercent) > 100) {
      toast.error("Please enter a valid discount percentage (1-100)");
      return;
    }

    try {
      setApplying(true);
      const res = await fetch("/api/admin/offers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          productId: selectedProduct._id, 
          discountPercent: Number(discountPercent) 
        }),
      });

      if (res.ok) {
        toast.success("Offer applied successfully!");
        setSelectedProduct(null);
        setDiscountPercent("");
        setSearchQuery("");
        setSearchResults([]);
        fetchOffers();
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to apply offer");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setApplying(false);
    }
  };

  const handleRemoveOffer = async (productId: string) => {
    if (!confirm("Are you sure you want to remove the offer from this product?")) return;

    try {
      const res = await fetch("/api/admin/offers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (res.ok) {
        toast.success("Offer removed");
        fetchOffers();
      } else {
        throw new Error("Failed to remove offer");
      }
    } catch (error) {
      toast.error("Failed to remove offer");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">Manage Offers</h1>
          <p className="text-muted-foreground mt-1">Search for products and apply discounts easily.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Apply New Offer */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <h2 className="text-lg font-semibold mb-4">Apply New Offer</h2>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search product..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-9 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                  />
                </div>
                <Button onClick={handleSearch} disabled={searching} className="rounded-xl px-4">
                  {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
                </Button>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && !selectedProduct && (
                <div className="max-h-60 overflow-y-auto border rounded-xl divide-y">
                  {searchResults.map(prod => (
                    <div key={prod._id} className="p-3 hover:bg-slate-50 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <img src={prod.images[0]} alt={prod.name} className="w-10 h-10 rounded-lg object-cover" />
                        <div className="truncate">
                          <p className="text-sm font-medium truncate">{prod.name}</p>
                          <p className="text-xs text-muted-foreground">${prod.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="shrink-0" onClick={() => setSelectedProduct(prod)}>
                        Select
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Selected Product Form */}
              {selectedProduct && (
                <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 space-y-4 mt-4 animate-in fade-in slide-in-from-top-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-sm line-clamp-2 pr-4">{selectedProduct.name}</h3>
                    <button onClick={() => setSelectedProduct(null)} className="text-muted-foreground hover:text-slate-900">&times;</button>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Current Price:</span>
                    <span className="font-bold">${selectedProduct.price.toFixed(2)}</span>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1">Discount Percentage (%)</label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="number"
                        min="1"
                        max="100"
                        placeholder="e.g. 20"
                        value={discountPercent}
                        onChange={(e) => setDiscountPercent(Number(e.target.value) || "")}
                        className="w-full pl-9 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                      />
                    </div>
                  </div>

                  {discountPercent && Number(discountPercent) > 0 && (
                    <div className="flex justify-between items-center text-sm bg-white p-3 rounded-lg border">
                      <span className="text-muted-foreground">New Offer Price:</span>
                      <span className="font-bold text-green-600 text-lg">
                        ${(selectedProduct.price - (selectedProduct.price * (Number(discountPercent)/100))).toFixed(2)}
                      </span>
                    </div>
                  )}

                  <Button className="w-full rounded-xl" onClick={handleApplyOffer} disabled={applying || !discountPercent}>
                    {applying ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <PlusCircle className="w-4 h-4 mr-2" />}
                    Apply Offer
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Active Offers Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="p-6 border-b bg-slate-50/50">
              <h2 className="text-lg font-semibold">Active Offers ({offers.length})</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                  <tr>
                    <th className="px-4 py-4 whitespace-nowrap">Product</th>
                    <th className="px-4 py-4 whitespace-nowrap">Original Price</th>
                    <th className="px-4 py-4 whitespace-nowrap">Discount</th>
                    <th className="px-4 py-4 text-primary font-bold whitespace-nowrap">Offer Price</th>
                    <th className="px-4 py-4 text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                        Loading offers...
                      </td>
                    </tr>
                  ) : offers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                        No active offers found.
                      </td>
                    </tr>
                  ) : (
                    offers.map((offer) => (
                      <tr key={offer._id} className="border-b last:border-0 hover:bg-slate-50/50">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <img src={offer.images[0]} alt={offer.name} className="w-12 h-12 rounded-lg object-cover border min-w-12" />
                            <p className="font-medium max-w-[120px] lg:max-w-[150px] truncate" title={offer.name}>{offer.name}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-slate-500 line-through whitespace-nowrap">
                          ${offer.price.toFixed(2)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600 whitespace-nowrap">
                            {offer.discountPercent || Math.round(((offer.price - offer.discountPrice) / offer.price) * 100)}% OFF
                          </span>
                        </td>
                        <td className="px-4 py-4 font-bold text-green-600 text-base whitespace-nowrap">
                          ${offer.discountPrice.toFixed(2)}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="rounded-xl px-3"
                              onClick={() => {
                                setSelectedProduct(offer);
                                setDiscountPercent(offer.discountPercent || Math.round(((offer.price - offer.discountPrice) / offer.price) * 100));
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              className="rounded-xl px-3"
                              onClick={() => handleRemoveOffer(offer._id)}
                            >
                              <Trash2 className="w-4 h-4 mr-1" /> Remove
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
