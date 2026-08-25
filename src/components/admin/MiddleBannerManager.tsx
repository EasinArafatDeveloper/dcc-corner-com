"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  Upload, 
  Link as LinkIcon, 
  Sparkles, 
  Loader2, 
  Eye, 
  Image as ImageIcon,
  Video as VideoIcon,
  Save,
  Power,
  Sliders,
  Type,
  FileVideo,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function MiddleBannerManager() {
  const [loading, setLoading] = useState(true);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("/shop?offers=true");
  const [title, setTitle] = useState("100% Authentic Imported Deals");
  const [subtitle, setSubtitle] = useState("Direct wholesale rates on chocolates, beverages, coffee & gourmet treats from global brands.");
  const [badgeText, setBadgeText] = useState("⚡ Wholesale Exclusive");
  const [buttonText, setButtonText] = useState("Explore Wholesale Deals");
  const [overlayOpacity, setOverlayOpacity] = useState<number>(45);
  const [isActive, setIsActive] = useState(true);
  const [hasSavedBanner, setHasSavedBanner] = useState(false);
  
  const [uploading, setUploading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
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
        if (data.middleBanner) {
          const b = data.middleBanner;
          const currentType = b.mediaType === "video" || (b.videoUrl && !b.imageUrl) ? "video" : "image";
          setMediaType(currentType);
          setImageUrl(b.imageUrl || "");
          setVideoUrl(b.videoUrl || "");
          setLinkUrl(b.linkUrl || "/shop");
          setTitle(b.title || "");
          setSubtitle(b.subtitle || "");
          setBadgeText(b.badgeText || "");
          setButtonText(b.buttonText || "Shop Wholesale Deals");
          setOverlayOpacity(typeof b.overlayOpacity === "number" ? b.overlayOpacity : 45);
          setIsActive(b.isActive !== false);
          setHasSavedBanner(true);
        } else {
          setHasSavedBanner(false);
        }
      }
    } catch (error) {
      toast.error("Failed to load middle section banner");
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchMode = (newMode: "image" | "video") => {
    if (newMode === mediaType) return;
    setMediaType(newMode);
    if (newMode === "video") {
      setImageUrl("");
    } else {
      setVideoUrl("");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      if (type === "video") setUploadingVideo(true);
      else setUploading(true);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && (data.url || data.fileUrl)) {
        const uploadedUrl = data.url || data.fileUrl;
        if (type === "video") {
          setVideoUrl(uploadedUrl);
          setImageUrl("");
          setMediaType("video");
          toast.success("Video uploaded successfully!");
        } else {
          setImageUrl(uploadedUrl);
          setVideoUrl("");
          setMediaType("image");
          toast.success("Image uploaded successfully!");
        }
      } else {
        throw new Error(data.error || `Failed to upload ${type}`);
      }
    } catch (error: any) {
      toast.error(error.message || `Failed to upload ${type}`);
    } finally {
      if (type === "video") setUploadingVideo(false);
      else setUploading(false);
      e.target.value = "";
    }
  };

  const handleSave = async () => {
    if (mediaType === "video" && !videoUrl.trim()) {
      toast.error("Please upload a Video or provide a Video URL");
      return;
    }
    if (mediaType === "image" && !imageUrl.trim()) {
      toast.error("Please upload an Image or provide an Image URL");
      return;
    }

    try {
      setSaving(true);
      const res = await fetch("/api/admin/middle-banner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediaType,
          imageUrl: mediaType === "image" ? imageUrl.trim() : "",
          videoUrl: mediaType === "video" ? videoUrl.trim() : "",
          linkUrl: linkUrl.trim() || "/shop",
          title: title.trim(),
          subtitle: subtitle.trim(),
          badgeText: badgeText.trim(),
          buttonText: buttonText.trim() || "Shop Wholesale Deals",
          overlayOpacity: Number(overlayOpacity),
          isActive,
        }),
      });

      if (res.ok) {
        setHasSavedBanner(true);
        toast.success(
          mediaType === "video" 
            ? "Background Video Banner published live to Storefront!" 
            : "Image Poster Banner published live to Storefront!"
        );
      } else {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to save banner");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update middle section banner");
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async () => {
    if (!confirm("Are you sure you want to deactivate the Middle Section Banner?")) return;

    try {
      setDeactivating(true);
      const res = await fetch("/api/admin/middle-banner", {
        method: "DELETE",
      });

      if (res.ok) {
        setIsActive(false);
        toast.success("Middle section banner deactivated.");
      } else {
        throw new Error("Failed to deactivate banner");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to deactivate banner");
    } finally {
      setDeactivating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 bg-white rounded-2xl border shadow-sm">
        <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
        <span className="text-sm font-medium text-slate-600">Loading banner settings...</span>
      </div>
    );
  }

  const opacityVal = overlayOpacity / 100;
  const isCurrentVideo = mediaType === "video" && Boolean(videoUrl);
  const isCurrentImage = mediaType === "image" && Boolean(imageUrl);

  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">Middle Promo Banner (Video & Image Support)</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#163A32]/10 text-[#163A32] border border-[#163A32]/20">
              Between Trending & New Arrivals
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            ভিডিও অথবা ইমেজ যে কোনো একটি সিলেক্ট করে ব্যাকগ্রাউন্ডে টেক্সট ও বোতাম সহ হোমপেজে প্রদর্শন করুন।
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

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Left Column: Media & Text Settings (7 cols) */}
        <div className="xl:col-span-7 space-y-5">
          
          {/* Media Type Switcher */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              ১. সিলেক্ট করুন: ভিডিও নাকি ইমেজ?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSwitchMode("video")}
                className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border-2 transition-all cursor-pointer font-bold text-xs ${
                  mediaType === "video"
                    ? "border-[#163A32] bg-[#163A32]/10 text-[#163A32] shadow-xs"
                    : "border-slate-200 hover:border-slate-300 text-slate-600 bg-white"
                }`}
              >
                <VideoIcon className={`w-4 h-4 ${mediaType === "video" ? "text-[#163A32]" : "text-slate-400"}`} />
                <span>🎬 Background Video</span>
              </button>

              <button
                type="button"
                onClick={() => handleSwitchMode("image")}
                className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border-2 transition-all cursor-pointer font-bold text-xs ${
                  mediaType === "image"
                    ? "border-[#163A32] bg-[#163A32]/10 text-[#163A32] shadow-xs"
                    : "border-slate-200 hover:border-slate-300 text-slate-600 bg-white"
                }`}
              >
                <ImageIcon className={`w-4 h-4 ${mediaType === "image" ? "text-[#163A32]" : "text-slate-400"}`} />
                <span>🖼️ Image Poster</span>
              </button>
            </div>
          </div>

          {/* SECTION A: VIDEO MODE CONTROLS (Only visible if mediaType === 'video') */}
          {mediaType === "video" && (
            <div className="p-4.5 rounded-2xl bg-slate-50/90 border border-slate-200 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <FileVideo className="w-4 h-4 text-[#163A32]" />
                  ভিডিও সোর্স (Video File / URL)
                </label>
                {videoUrl && (
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">
                    ✓ Video Ready
                  </span>
                )}
              </div>

              {/* If Video already exists: Show Active Status + Remove Button */}
              {videoUrl ? (
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-[#163A32]/10 text-[#163A32] flex items-center justify-center shrink-0">
                      <VideoIcon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {videoUrl.startsWith("data:") ? "Uploaded Video File (Local Data)" : videoUrl.split("/").pop() || "Active Video"}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">{videoUrl}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setVideoUrl("");
                      toast.info("Video removed. You can upload a new video or switch to image mode.");
                    }}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Remove Video</span>
                  </button>
                </div>
              ) : (
                /* If no Video yet: Show Video Upload & URL Input */
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input 
                      type="text" 
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="Paste direct MP4/WebM URL (e.g. https://.../promo.mp4)"
                      className="flex-1 px-3 py-2 border rounded-lg text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#163A32]/20"
                    />
                    
                    <label className="shrink-0">
                      <input 
                        type="file" 
                        accept="video/mp4,video/webm,video/ogg,video/quicktime" 
                        onChange={(e) => handleFileUpload(e, "video")} 
                        className="hidden" 
                        disabled={uploadingVideo}
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        className="w-full sm:w-auto h-full flex items-center justify-center gap-1.5 cursor-pointer bg-white text-xs"
                        disabled={uploadingVideo}
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          input?.click();
                        }}
                      >
                        {uploadingVideo ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <Upload className="w-4 h-4 text-[#163A32]" />}
                        <span>Upload Video File</span>
                      </Button>
                    </label>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    💡 সাইজ কমানো হরাইজন্টাল MP4/WebM ভিডিও ব্যবহার করলে ব্রাউজারে ইনস্ট্যান্ট লুপে চলবে।
                  </p>
                </div>
              )}
            </div>
          )}

          {/* SECTION B: IMAGE MODE CONTROLS (Only visible if mediaType === 'image') */}
          {mediaType === "image" && (
            <div className="p-4.5 rounded-2xl bg-slate-50/90 border border-slate-200 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#163A32]" />
                  ইমেজ সোর্স (Poster Image File / URL)
                </label>
                {imageUrl && (
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">
                    ✓ Image Ready
                  </span>
                )}
              </div>

              {/* If Image already exists: Show Active Thumbnail + Remove Button */}
              {imageUrl ? (
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-12 h-10 rounded-lg overflow-hidden border bg-slate-100 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imageUrl} alt="Poster" className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {imageUrl.startsWith("data:") ? "Uploaded Image File (Local Data)" : imageUrl.split("/").pop() || "Active Image"}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">{imageUrl}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setImageUrl("");
                      toast.info("Image removed. You can upload a new image or switch to video mode.");
                    }}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Remove Image</span>
                  </button>
                </div>
              ) : (
                /* If no Image yet: Show Image Upload & URL Input */
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input 
                      type="text" 
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Paste Image URL or upload file..."
                      className="flex-1 px-3 py-2 border rounded-lg text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#163A32]/20"
                    />
                    
                    <label className="shrink-0">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleFileUpload(e, "image")} 
                        className="hidden" 
                        disabled={uploading}
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        className="w-full sm:w-auto h-full flex items-center justify-center gap-1.5 cursor-pointer text-xs bg-white"
                        disabled={uploading}
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          input?.click();
                        }}
                      >
                        {uploading ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <Upload className="w-4 h-4 text-[#163A32]" />}
                        <span>Upload Image File</span>
                      </Button>
                    </label>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    💡 ওয়াইড ব্যানার রেশিও (যেমন 1920x500 বা 1200x320) সবচেয়ে সুন্দর দেখায়।
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Dark Overlay Opacity Slider */}
          <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-[#163A32]" />
                Dark Overlay Opacity (কালো আবরণের ঘনত্ব)
              </label>
              <span className="px-2.5 py-0.5 bg-slate-900 text-white rounded-lg font-black text-xs">
                {overlayOpacity}%
              </span>
            </div>
            <input 
              type="range"
              min="0"
              max="90"
              step="5"
              value={overlayOpacity}
              onChange={(e) => setOverlayOpacity(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#163A32]"
            />
            <p className="text-[11px] text-slate-500">
              ভিডিওর উপর হালকা বা গাঢ় কালো শেড দিয়ে টেক্সটকে আরও স্পষ্ট ও সুন্দর ফুটিয়ে তুলতে সাহায্য করে। (প্রস্তাবিত: ৪০% - ৫০%)
            </p>
          </div>

          {/* Overlay Text Settings */}
          <div className="space-y-4 pt-3 border-t">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-[#163A32]" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Banner Overlay Content (অপশনাল টেক্সট)</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Badge Text</label>
                <input 
                  type="text"
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  placeholder="e.g. ⚡ Wholesale Exclusive"
                  className="w-full px-3 py-2 border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#163A32]/20"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Button CTA Text</label>
                <input 
                  type="text"
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  placeholder="e.g. Explore Wholesale Deals"
                  className="w-full px-3 py-2 border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#163A32]/20"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Main Heading / Title</label>
              <input 
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 100% Authentic Imported Deals"
                className="w-full px-3 py-2 border rounded-lg text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#163A32]/20"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Subtitle / Description</label>
              <textarea 
                rows={2}
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Direct wholesale rates on chocolates, beverages & snacks..."
                className="w-full px-3 py-2 border rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#163A32]/20 resize-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Target Link URL</label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="/shop?offers=true or /product/slug"
                  className="w-full pl-9 pr-3 py-2 border rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#163A32]/20"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center gap-3">
            <Button 
              onClick={handleSave} 
              disabled={saving || uploading || uploadingVideo}
              className="bg-[#163A32] hover:bg-[#112d27] text-white font-bold gap-2 cursor-pointer shadow-md"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {hasSavedBanner ? "Update Banner" : "Publish Banner"}
            </Button>

            {hasSavedBanner && (
              <Button 
                variant="outline" 
                onClick={handleDeactivate}
                disabled={deactivating}
                className="text-red-600 hover:bg-red-50 border-red-200 gap-2 cursor-pointer"
              >
                {deactivating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Power className="w-4 h-4" />}
                Deactivate
              </Button>
            )}
          </div>
        </div>

        {/* Right Column: Live Storefront Preview (5 cols) */}
        <div className="xl:col-span-5 space-y-3">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-[#163A32]" /> Live Storefront Preview
          </label>

          <div className="border rounded-2xl p-3 sm:p-4 bg-slate-900/5 min-h-[300px] flex flex-col justify-center items-center overflow-hidden">
            {(isCurrentVideo || isCurrentImage) ? (
              <div className="w-full rounded-2xl overflow-hidden shadow-2xl border border-black/10 bg-black relative group">
                <div className="relative w-full aspect-[2.3/1] min-h-[220px] max-h-[360px] overflow-hidden flex items-center">
                  
                  {/* Background Video or Image in Preview */}
                  {isCurrentVideo ? (
                    <video
                      key={videoUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      src={videoUrl}
                      className="absolute inset-0 w-full h-full object-cover object-center"
                    />
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img 
                      src={imageUrl} 
                      alt={title || "Poster Preview"} 
                      className="absolute inset-0 w-full h-full object-cover object-center"
                    />
                  )}

                  {/* Dark Overlay Preview */}
                  <div 
                    className="absolute inset-0 pointer-events-none transition-all duration-200"
                    style={{
                      backgroundColor: `rgba(0, 0, 0, ${opacityVal})`,
                      backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.5) 100%)'
                    }}
                  />

                  {/* Live Foreground Typography Overlay */}
                  <div className="relative z-10 w-full p-4 sm:p-6 flex flex-col justify-center items-start text-white">
                    {badgeText && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-white/20 backdrop-blur-md text-[#D6A84F] border border-white/20 mb-1.5 shadow-xs">
                        <Sparkles className="w-2.5 h-2.5 text-[#D6A84F]" />
                        <span>{badgeText}</span>
                      </span>
                    )}

                    {title && (
                      <h3 className="text-sm sm:text-lg md:text-xl font-black text-white font-heading tracking-tight leading-tight drop-shadow-md">
                        {title}
                      </h3>
                    )}

                    {subtitle && (
                      <p className="text-[10px] sm:text-xs text-white/90 max-w-sm mt-1 font-medium leading-snug drop-shadow line-clamp-2">
                        {subtitle}
                      </p>
                    )}

                    {buttonText && (
                      <div className="mt-2.5">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#D6A84F] text-[#163A32] font-extrabold text-[10px] sm:text-xs rounded-lg shadow-md">
                          <span>{buttonText}</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                {mediaType === "video" ? (
                  <>
                    <VideoIcon className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="text-xs font-medium">কোনো ভিডিও এখনো আপলোড করা হয়নি।</p>
                    <p className="text-[11px] text-slate-400 mt-1">বামপাশ থেকে ভিডিও আপলোড করুন বা লিংক দিন।</p>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="text-xs font-medium">কোনো ইমেজ এখনো আপলোড করা হয়নি।</p>
                    <p className="text-[11px] text-slate-400 mt-1">বামপাশ থেকে ইমেজ আপলোড করুন বা লিংক দিন।</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
