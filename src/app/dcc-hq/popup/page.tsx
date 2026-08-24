"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  Save, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Loader2, 
  Sparkles, 
  UploadCloud, 
  CheckCircle2, 
  X,
  Eye
} from "lucide-react";
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
      // Convert to Base64 data url directly on client for instant universal support
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          setImageUrl(base64);
          toast.success("Image selected successfully");
        }
      };
      reader.readAsDataURL(file);

      // Also send to backend
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          setImageUrl(data.url);
        }
      }
    } catch (error) {
      toast.error("Image upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!imageUrl) {
      toast.error("Please upload or enter a popup image URL");
      return;
    }

    try {
      setSaving(true);
      const res = await fetch("/api/admin/popup", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          imageUrl, 
          linkUrl: linkUrl || "/shop", 
          isActive 
        }),
      });

      if (res.ok) {
        toast.success("Popup offer settings saved successfully!");
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
        <Loader2 className="w-8 h-8 animate-spin text-[#163A32]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-6 rounded-3xl shadow-xs border border-[#E5E7EB] gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#163A32]/10 text-[#163A32]">
              <Sparkles className="w-5 h-5 text-[#163A32]" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-[#111827] font-heading">
              Popup Offer Settings
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#4B5563] mt-1">
            Configure the global promotional banner popup for visitors on the storefront homepage.
          </p>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Active Switch */}
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#163A32]"></div>
            <span className="ml-2.5 text-xs font-bold text-[#111827]">
              {isActive ? "Active (Live)" : "Inactive"}
            </span>
          </label>

          <Button 
            onClick={handleSave} 
            disabled={saving} 
            className="h-10 px-5 rounded-xl bg-[#163A32] hover:bg-[#0E2620] text-white font-bold text-xs shadow-md shadow-[#163A32]/20 cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-1.5" />
                <span>Save Changes</span>
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Configuration */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl shadow-xs border border-[#E5E7EB] space-y-5">
          <h2 className="text-base font-extrabold text-[#111827] font-heading">
            Popup Banner Configuration
          </h2>
          
          <div className="space-y-4">
            {/* Redirect URL */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#111827]">
                Redirect Link Destination *
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="e.g. /shop or /category/imported-chocolates"
                  className="w-full pl-10 pr-4 h-10.5 bg-[#F7F8F5] border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#163A32]/20"
                />
              </div>
              <p className="text-[11px] text-[#6B7280]">
                When visitors click the popup banner, they will be navigated to this link.
              </p>
            </div>

            {/* Direct Image URL input */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-xs font-bold text-[#111827]">
                Image URL (Direct link or upload below)
              </label>
              <div className="relative">
                <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://... or upload image"
                  className="w-full pl-10 pr-4 h-10.5 bg-[#F7F8F5] border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#163A32]/20"
                />
              </div>
            </div>

            {/* File Upload Box */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-xs font-bold text-[#111827]">
                Upload Banner File
              </label>
              <div className="border-2 border-dashed border-[#E5E7EB] hover:border-[#163A32] rounded-2xl p-6 text-center bg-[#F7F8F5] hover:bg-slate-50 transition-colors">
                <input
                  type="file"
                  id="imageUpload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <label htmlFor="imageUpload" className="cursor-pointer flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-[#E5E7EB] flex items-center justify-center mb-2 shadow-2xs text-[#163A32]">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-extrabold text-[#163A32]">
                    Click to browse & upload banner
                  </span>
                  <span className="text-[11px] text-[#6B7280] mt-1">
                    Supports PNG, JPG, WebP. Recommended: 600×600 or 800×800 Square
                  </span>
                </label>
              </div>
            </div>

          </div>
        </div>

        {/* Right Preview */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl shadow-xs border border-[#E5E7EB] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-extrabold text-[#111827] font-heading flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-[#163A32]" />
                <span>Live Preview</span>
              </h2>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
              }`}>
                {isActive ? "ACTIVE ON STORE" : "DISABLED"}
              </span>
            </div>

            {imageUrl ? (
              <div className="rounded-2xl overflow-hidden bg-slate-950/80 p-4 sm:p-6 relative flex flex-col items-center justify-center min-h-[280px] shadow-inner">
                {/* Banner Wrapper */}
                <div className="relative group rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/20 max-w-full">
                  <img 
                    src={imageUrl} 
                    alt="Popup Preview" 
                    className="w-auto h-auto max-h-[300px] max-w-full object-contain block rounded-xl select-none" 
                  />
                  <div className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black/90 text-white rounded-full flex items-center justify-center shadow-md border border-white/40 backdrop-blur-xs">
                    <X className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                </div>
                <div className="mt-3 text-[11px] font-medium text-slate-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Shows seamlessly on all devices</span>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-[#E5E7EB] bg-[#F7F8F5] min-h-[260px] flex flex-col items-center justify-center text-[#6B7280] text-xs p-6 text-center">
                <ImageIcon className="w-10 h-10 text-slate-300 mb-2" />
                <p className="font-bold text-[#111827]">No banner uploaded yet</p>
                <p className="text-[11px] text-[#6B7280] mt-1">Upload an image or paste a URL on the left to see live preview.</p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-[#6B7280]">
            <p>💡 <strong>Note:</strong> Once saved as active, visitors on DCC Corner homepage will see this popup automatically on first visit.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
