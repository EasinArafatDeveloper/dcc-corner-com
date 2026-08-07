"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  Upload, 
  Link as LinkIcon, 
  Sparkles, 
  CheckCircle2, 
  Trash2, 
  Loader2, 
  Eye, 
  Image as ImageIcon,
  Save,
  Power
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function MiddleBannerManager() {
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("/shop");
  const [title, setTitle] = useState("Middle Section Special Offer Poster");
  const [isActive, setIsActive] = useState(true);
  const [hasSavedBanner, setHasSavedBanner] = useState(false);
  
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deactivating, setDeactivating] = useState(false);

  useEffect(() => {
    fetchMiddleBanner();
  }, []);

  const fetchMiddleBanner = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/middle-banner");
      if (res.ok) {
        const data = await res.json();
        if (data.middleBanner && data.middleBanner.imageUrl) {
          setImageUrl(data.middleBanner.imageUrl);
          setLinkUrl(data.middleBanner.linkUrl || "/shop");
          setTitle(data.middleBanner.title || "Middle Section Special Offer Poster");
          setIsActive(data.middleBanner.isActive !== false);
          setHasSavedBanner(true);
        } else {
          setHasSavedBanner(false);
        }
      }
    } catch (error) {
      toast.error("Failed to load middle section poster");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setImageUrl(data.url);
        toast.success("Image uploaded successfully!");
      } else if (data.fileUrl) {
        setImageUrl(data.fileUrl);
        toast.success("Image uploaded successfully!");
      } else {
        throw new Error(data.error || "Failed to upload image");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSave = async () => {
    if (!imageUrl.trim()) {
      toast.error("Please upload or provide an image URL for the poster");
      return;
    }

    try {
      setSaving(true);
      const res = await fetch("/api/admin/middle-banner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl,
          linkUrl: linkUrl || "/shop",
          title: title || "Middle Section Special Offer Poster",
          isActive,
        }),
      });

      if (res.ok) {
        setHasSavedBanner(true);
        toast.success("Middle Section Poster updated & published to Storefront!");
      } else {
        throw new Error("Failed to save middle section poster");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update middle section poster");
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async () => {
    if (!confirm("Are you sure you want to deactivate the Middle Section Poster?")) return;

    try {
      setDeactivating(true);
      const res = await fetch("/api/admin/middle-banner", {
        method: "DELETE",
      });

      if (res.ok) {
        setIsActive(false);
        toast.success("Middle section poster deactivated.");
      } else {
        throw new Error("Failed to deactivate poster");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to deactivate poster");
    } finally {
      setDeactivating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 bg-white rounded-2xl border shadow-sm">
        <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
        <span className="text-sm font-medium text-slate-600">Loading poster settings...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">Middle Promo Banner</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
              Between Trending & New Arrivals
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Display a wide promotional poster (e.g. discount offer, brand highlight, or campaign) on the homepage right between Trending Imported Products and New Arrivals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={isActive} 
              onChange={(e) => setIsActive(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            <span className="ml-2 text-xs font-semibold text-slate-700">
              {isActive ? "Active on Home" : "Inactive"}
            </span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
              Banner Title / Alt Text
            </label>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Special imported spices discount offer"
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
              Poster Image *
            </label>
            <div className="flex flex-col sm:flex-row gap-3 items-stretch">
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste Image URL or upload file..."
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 pr-8"
                />
              </div>

              <label className="shrink-0">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  disabled={uploading}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="w-full sm:w-auto h-full flex items-center justify-center gap-2 cursor-pointer"
                  disabled={uploading}
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    input?.click();
                  }}
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <Upload className="w-4 h-4 text-primary" />}
                  <span>Upload Poster</span>
                </Button>
              </label>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Recommended aspect ratio: Wide horizontal banner (e.g. 1920x500 or 1200x320).
            </p>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
              Target Link URL
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="/shop or /product/slug"
                className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Where users go when clicking this banner (e.g. /shop?category=spices).
            </p>
          </div>

          <div className="pt-3 flex items-center gap-3">
            <Button 
              onClick={handleSave} 
              disabled={saving || uploading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {hasSavedBanner ? "Update Poster" : "Publish Poster"}
            </Button>

            {hasSavedBanner && (
              <Button 
                variant="outline" 
                onClick={handleDeactivate}
                disabled={deactivating}
                className="text-red-600 hover:bg-red-50 border-red-200 gap-2"
              >
                {deactivating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Power className="w-4 h-4" />}
                Deactivate
              </Button>
            )}
          </div>
        </div>

        {/* Live Preview Box */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-primary" /> Live Storefront Preview
          </label>
          <div className="border rounded-2xl p-4 bg-slate-50 min-h-[220px] flex flex-col justify-center items-center overflow-hidden">
            {imageUrl ? (
              <div className="w-full rounded-xl overflow-hidden shadow-md border bg-slate-900 group relative">
                <div className="relative w-full aspect-[3.5/1]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={imageUrl} 
                    alt={title || "Poster Preview"} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white text-[10px] rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" /> Exclusive Offer
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-slate-400">
                <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No image provided yet. Upload or enter a URL above to see live preview.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
