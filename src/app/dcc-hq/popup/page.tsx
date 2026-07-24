"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, Image as ImageIcon, Link as LinkIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PopupAdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("/shop");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    fetchPopup();
  }, []);

  const fetchPopup = async () => {
    try {
      const res = await fetch("/api/admin/popup");
      if (res.ok) {
        const data = await res.json();
        setImageUrl(data.imageUrl || "");
        setLinkUrl(data.linkUrl || "/shop");
        setIsActive(data.isActive || false);
      }
    } catch (error) {
      toast.error("Failed to load popup settings");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        setImageUrl(data.url);
        toast.success("Image uploaded successfully");
      } else {
        toast.error("Failed to upload image");
      }
    } catch (error) {
      toast.error("Image upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!imageUrl) {
      toast.error("Image is required");
      return;
    }

    try {
      setSaving(true);
      const res = await fetch("/api/admin/popup", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl, linkUrl, isActive }),
      });

      if (res.ok) {
        toast.success("Popup settings saved successfully");
        router.refresh();
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      toast.error("Failed to save popup settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading && !imageUrl) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Popup Offer Settings</h1>
          <p className="text-muted-foreground mt-1">Configure the global popup banner for visitors.</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            <span className="ml-3 text-sm font-medium text-slate-700">
              {isActive ? 'Active' : 'Inactive'}
            </span>
          </label>
          <Button onClick={handleSave} disabled={saving} className="min-w-[100px]">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-6">
          <h2 className="text-lg font-semibold">Configuration</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Redirect Link</label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="e.g. /shop or /category/offers"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">The page users will go to when they click the popup image.</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Upload Image</label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center bg-slate-50 hover:bg-slate-100 transition-colors">
                <input
                  type="file"
                  id="imageUpload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <label htmlFor="imageUpload" className="cursor-pointer flex flex-col items-center">
                  <ImageIcon className="w-8 h-8 text-slate-400 mb-2" />
                  <span className="text-sm font-medium text-primary">Click to upload</span>
                  <span className="text-xs text-muted-foreground mt-1">Recommended: 600x600 or 800x600 (Square or Landscape)</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Preview</h2>
          {imageUrl ? (
            <div className="rounded-xl overflow-hidden border border-slate-100 bg-slate-50 relative aspect-square md:aspect-[4/3] flex flex-col items-center justify-center">
              <img src={imageUrl} alt="Popup Preview" className="max-w-full max-h-full object-contain" />
              <div className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center cursor-not-allowed">
                <span className="text-white text-lg leading-none">&times;</span>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 aspect-square md:aspect-[4/3] flex items-center justify-center text-muted-foreground">
              No image uploaded yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
