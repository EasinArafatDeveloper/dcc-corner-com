"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, Search, Percent, Trash2, PlusCircle, Image as ImageIcon, Upload, Link as LinkIcon, Sparkles, CheckCircle2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OffersAdminPage() {
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState<any[]>([]);
  
  // Tab Switcher State: "product_offer" | "side_poster"
  const [activeTab, setActiveTab] = useState<"product_offer" | "side_poster">("product_offer");

  // Search & Add state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number | "">("");
  const [applying, setApplying] = useState(false);

  // Hero Side Offer Poster state
  const [sidePosterImage, setSidePosterImage] = useState("");
  const [sidePosterLink, setSidePosterLink] = useState("/shop?offers=true");
  const [hasSavedPoster, setHasSavedPoster] = useState(false);
  const [isEditingPoster, setIsEditingPoster] = useState(false);
  const [uploadingPoster, setUploadingPoster] = useState(false);
  const [savingPoster, setSavingPoster] = useState(false);
  const [deletingPoster, setDeletingPoster] = useState(false);

  useEffect(() => {
    fetchOffers();
    fetchSidePoster();
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

  const fetchSidePoster = async () => {
    try {
      const res = await fetch("/api/admin/side-banner");
      if (res.ok) {
        const data = await res.json();
        if (data.sideBanner && data.sideBanner.imageUrl) {
          setSidePosterImage(data.sideBanner.imageUrl);
          setSidePosterLink(data.sideBanner.linkUrl || "/shop?offers=true");
          setHasSavedPoster(true);
        } else {
          setHasSavedPoster(false);
        }
      }
    } catch (error) {
      console.error("Failed to fetch side poster");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadingPoster(true);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setSidePosterImage(data.url);
        toast.success("Image uploaded successfully!");
      } else if (data.fileUrl) {
        setSidePosterImage(data.fileUrl);
        toast.success("Image uploaded successfully!");
      } else {
        throw new Error(data.error || "Failed to upload image");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image");
    } finally {
      setUploadingPoster(false);
    }
  };

  const handleSaveSidePoster = async () => {
    if (!sidePosterImage.trim()) {
      toast.error("Please provide or upload a poster image URL");
      return;
    }

    try {
      setSavingPoster(true);
      const res = await fetch("/api/admin/side-banner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: sidePosterImage,
          linkUrl: sidePosterLink || "/shop?offers=true",
          title: "Hero Side Offer Poster",
        }),
      });

      if (res.ok) {
        setHasSavedPoster(true);
        setIsEditingPoster(false);
        toast.success("Hero Side Offer Poster updated & published to storefront!");
      } else {
        throw new Error("Failed to save side poster");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update side poster");
    } finally {
      setSavingPoster(false);
    }
  };

  const handleRemoveSidePoster = async () => {
    if (!confirm("Are you sure you want to remove the Hero Side Poster from the website?")) return;

    try {
      setDeletingPoster(true);
      const res = await fetch("/api/admin/side-banner", {
        method: "DELETE",
      });

      if (res.ok) {
        setSidePosterImage("");
        setHasSavedPoster(false);
        setIsEditingPoster(false);
        toast.success("Hero Side Poster removed from storefront.");
      } else {
        throw new Error("Failed to remove side poster");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to remove side poster");
    } finally {
      setDeletingPoster(false);
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
          <p className="text-muted-foreground mt-1">Search for products, apply discounts, and manage the Hero Side Offer Poster.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Tabbed Action Box */}
        <div className="lg:col-span-1 space-y-4">
          
          {/* 2 Tab Switcher Buttons */}
          <div className="bg-slate-100/80 p-1.5 rounded-2xl border border-[#E5E7EB] flex gap-1 shadow-xs">
            <button
              onClick={() => setActiveTab("product_offer")}
              className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "product_offer"
                  ? "bg-[#163A32] text-white shadow-sm"
                  : "text-[#4B5563] hover:text-[#111827] hover:bg-white/60"
              }`}
            >
              <Percent className="w-3.5 h-3.5" />
              <span>Product Offer</span>
            </button>

            <button
              onClick={() => setActiveTab("side_poster")}
              className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 relative ${
                activeTab === "side_poster"
                  ? "bg-[#163A32] text-white shadow-sm"
                  : "text-[#4B5563] hover:text-[#111827] hover:bg-white/60"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D6A84F]" />
              <span>Hero Side Poster</span>
              {hasSavedPoster && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse absolute top-1.5 right-1.5" />
              )}
            </button>
          </div>

          {/* Tab 1 Content: Apply Product Offer */}
          {activeTab === "product_offer" && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] animate-in fade-in duration-300">
              <h2 className="text-base font-extrabold text-[#111827] mb-4">Apply Product Discount</h2>
              
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
                      className="w-full pl-9 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#163A32]/20 text-xs"
                    />
                  </div>
                  <Button onClick={handleSearch} disabled={searching} className="rounded-xl px-4 bg-[#163A32] hover:bg-[#0E2620] text-white text-xs font-bold">
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
                            <p className="text-xs text-muted-foreground">৳{prod.price.toFixed(2)}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="shrink-0 rounded-xl text-xs" onClick={() => setSelectedProduct(prod)}>
                          Select
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Selected Product Form */}
                {selectedProduct && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-xs text-[#111827] line-clamp-2 pr-4">{selectedProduct.name}</h3>
                      <button onClick={() => setSelectedProduct(null)} className="text-muted-foreground hover:text-slate-900 font-bold">&times;</button>
                    </div>
                    
                    <div className="flex justify-between text-xs">
                      <span className="text-[#4B5563]">Regular Price:</span>
                      <span className="font-bold text-[#111827]">৳{selectedProduct.price.toFixed(2)}</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#111827] mb-1">Discount Percentage (%)</label>
                      <div className="relative">
                        <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="number"
                          min="1"
                          max="100"
                          placeholder="e.g. 20"
                          value={discountPercent}
                          onChange={(e) => setDiscountPercent(Number(e.target.value) || "")}
                          className="w-full pl-9 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#163A32]/20 text-xs"
                        />
                      </div>
                    </div>

                    {discountPercent && Number(discountPercent) > 0 && (
                      <div className="flex justify-between items-center text-xs bg-white p-3 rounded-lg border border-slate-200">
                        <span className="text-[#4B5563]">New Offer Price:</span>
                        <span className="font-extrabold text-[#163A32] text-base">
                          ৳{(selectedProduct.price - (selectedProduct.price * (Number(discountPercent)/100))).toFixed(2)}
                        </span>
                      </div>
                    )}

                    <Button className="w-full rounded-xl bg-[#163A32] hover:bg-[#0E2620] text-white font-bold text-xs" onClick={handleApplyOffer} disabled={applying || !discountPercent}>
                      {applying ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <PlusCircle className="w-4 h-4 mr-2 text-[#D6A84F]" />}
                      Apply Offer
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2 Content: Hero Side Poster Upload Form */}
          {activeTab === "side_poster" && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] bg-gradient-to-b from-amber-50/40 to-white animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-extrabold text-[#163A32] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D6A84F]" /> Hero Side Poster
                </h2>
                {hasSavedPoster ? (
                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active on Website
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-300">
                    No Poster Saved
                  </span>
                )}
              </div>

              {/* VIEW MODE: If poster is currently saved and user is NOT editing */}
              {hasSavedPoster && !isEditingPoster ? (
                <div className="space-y-4">
                  <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>A custom poster is currently active on the storefront Hero section.</span>
                  </div>

                  {/* Active Poster Preview */}
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden border border-slate-200 shadow-xs">
                    <img src={sidePosterImage} alt="Active Hero Side Poster" className="w-full h-full object-cover" />
                  </div>

                  <div className="text-xs space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <p className="text-slate-500 font-bold">Click Destination:</p>
                    <p className="text-slate-800 font-mono text-[11px] truncate">{sidePosterLink || "/shop?offers=true"}</p>
                  </div>

                  {/* Action Buttons: Edit or Delete */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      onClick={() => setIsEditingPoster(true)} 
                      variant="outline" 
                      className="flex-1 rounded-xl text-xs font-bold border-[#163A32] text-[#163A32] hover:bg-[#163A32]/5"
                    >
                      <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Replace Poster
                    </Button>
                    <Button 
                      onClick={handleRemoveSidePoster} 
                      disabled={deletingPoster}
                      variant="destructive" 
                      className="rounded-xl text-xs font-bold px-3"
                    >
                      {deletingPoster ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5 mr-1" />}
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                /* EDIT / ADD MODE: Upload Form */
                <div className="space-y-4">
                  <p className="text-xs text-slate-500 mb-2 leading-relaxed">
                    Upload image for Hero Section right side (Recommended: 600 x 600 px).
                  </p>

                  {/* Image Preview Box */}
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden border-2 border-dashed border-amber-200 bg-slate-50 flex flex-col items-center justify-center group">
                    {sidePosterImage ? (
                      <>
                        <img src={sidePosterImage} alt="Side Offer Poster Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                          <label className="cursor-pointer bg-white text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-md hover:bg-amber-50">
                            Change Image
                            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                          </label>
                        </div>
                      </>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center justify-center p-4 text-center">
                        <Upload className="w-8 h-8 text-amber-500 mb-2 animate-bounce" />
                        <span className="text-xs font-bold text-slate-700">Click to Upload Poster Image</span>
                        <span className="text-[10px] text-slate-400 mt-1">PNG, JPG, WebP up to 5MB</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                      </label>
                    )}
                    {uploadingPoster && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
                      </div>
                    )}
                  </div>

                  {/* Image URL Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Poster Image URL</label>
                    <div className="relative">
                      <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="https://... or upload file" 
                        value={sidePosterImage}
                        onChange={(e) => setSidePosterImage(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-xs"
                      />
                    </div>
                  </div>

                  {/* Link URL Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Click Destination Link URL</label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="/shop?offers=true" 
                        value={sidePosterLink}
                        onChange={(e) => setSidePosterLink(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    {hasSavedPoster && (
                      <Button 
                        onClick={() => setIsEditingPoster(false)} 
                        variant="outline" 
                        className="rounded-xl text-xs font-bold border-slate-300"
                      >
                        Cancel
                      </Button>
                    )}
                    <Button 
                      onClick={handleSaveSidePoster} 
                      disabled={savingPoster || uploadingPoster || !sidePosterImage} 
                      className="flex-1 rounded-xl bg-[#163A32] hover:bg-[#0E2620] text-white font-bold text-xs h-10 shadow-md"
                    >
                      {savingPoster ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2 text-[#D6A84F]" />}
                      Save & Publish Poster
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Column: Active Offers Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="p-6 border-b bg-slate-50/50">
              <h2 className="text-lg font-semibold">Active Product Offers ({offers.length})</h2>
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
                          ৳{offer.price.toFixed(2)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600 whitespace-nowrap">
                            {offer.discountPercent || Math.round(((offer.price - offer.discountPrice) / offer.price) * 100)}% OFF
                          </span>
                        </td>
                        <td className="px-4 py-4 font-bold text-green-600 text-base whitespace-nowrap">
                          ৳{offer.discountPrice.toFixed(2)}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="rounded-xl px-3"
                              onClick={() => {
                                setActiveTab("product_offer");
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
