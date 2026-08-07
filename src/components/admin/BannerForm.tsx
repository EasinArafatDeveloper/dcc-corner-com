"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";

export function BannerForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    linkUrl: initialData?.linkUrl || "/shop",
    imageUrl: initialData?.imageUrl || "",
    isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
    isSideOffer: initialData?.isSideOffer || false,
    isMiddleBanner: initialData?.isMiddleBanner || false,
    order: initialData?.order || 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    const formDataObj = new FormData();
    formDataObj.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formDataObj,
      });

      if (!res.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await res.json();
      setFormData((prev) => ({ ...prev, imageUrl: data.url }));
      
      Swal.fire({
        title: 'Uploaded!',
        text: 'Image has been uploaded successfully.',
        icon: 'success',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    } catch (error: any) {
      Swal.fire({
        title: 'Upload Failed!',
        text: error.message,
        icon: 'error',
      });
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const actionName = initialData ? 'update' : 'add';
    const result = await Swal.fire({
      title: 'Confirm Save',
      text: `Are you sure you want to ${actionName} this banner?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, save it!'
    });

    if (!result.isConfirmed) return;

    setIsLoading(true);

    const payload = {
      ...formData,
      isMiddleBanner: Boolean(formData.isMiddleBanner),
      isSideOffer: Boolean(formData.isSideOffer),
      order: Number(formData.order) || 0,
    };

    const url = initialData ? `/api/admin/banners/${initialData._id}` : '/api/admin/banners';
    const method = initialData ? 'PUT' : 'POST';
    const actionLabel = initialData ? 'updated' : 'added';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || `Failed to save banner`);
      }

      await Swal.fire({
        title: 'Success!',
        text: `Banner has been ${actionLabel} successfully.`,
        icon: 'success',
        confirmButtonColor: '#3085d6',
      });
      router.push('/dcc-hq/banners');
      router.refresh();
    } catch (error: any) {
      Swal.fire({
        title: 'Error!',
        text: error.message,
        icon: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Any unsaved changes will be lost!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, cancel'
    });

    if (result.isConfirmed) {
      router.back();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border shadow-sm space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Banner Title *</label>
          <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. Summer Sale 2026" />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium font-bold text-slate-800">Banner Placement / Position *</label>
          <select 
            value={
              formData.isMiddleBanner 
                ? "MIDDLE_POSTER" 
                : formData.isSideOffer 
                ? "HERO_SIDE" 
                : "HERO_SLIDER"
            } 
            onChange={(e) => {
              const val = e.target.value;
              setFormData(prev => ({
                ...prev,
                isMiddleBanner: val === "MIDDLE_POSTER",
                isSideOffer: val === "HERO_SIDE"
              }));
            }} 
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white font-medium text-sm text-slate-800"
          >
            <option value="HERO_SLIDER">🎠 Hero Carousel Slider Banner</option>
            <option value="MIDDLE_POSTER">🖼️ Middle Promo Poster (Between Trending & New Arrivals)</option>
            <option value="HERO_SIDE">📌 Hero Side Offer Poster</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Link URL *</label>
          <input required type="text" name="linkUrl" value={formData.linkUrl} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. /shop" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Display Order</label>
          <input type="number" name="order" value={formData.order} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="0" />
        </div>

        <div className="space-y-2 flex items-center gap-2 md:mt-2">
          <input type="checkbox" id="isActive" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-4 h-4 text-primary focus:ring-primary" />
          <label htmlFor="isActive" className="text-sm font-medium cursor-pointer">Set Banner as Active</label>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">Banner Image *</label>
          
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full space-y-2">
              <label className="text-xs text-muted-foreground">Upload Image</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                disabled={isUploadingImage}
              />
            </div>
            <div className="flex-1 w-full space-y-2">
              <label className="text-xs text-muted-foreground">Or provide Image URL</label>
              <input 
                type="text" 
                required
                name="imageUrl" 
                value={formData.imageUrl} 
                onChange={handleChange} 
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" 
                placeholder="https://example.com/banner.jpg" 
              />
            </div>
          </div>
          
          {isUploadingImage && <p className="text-sm text-primary animate-pulse">Uploading image...</p>}
          {formData.imageUrl && !isUploadingImage && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2 text-slate-500">Preview:</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={formData.imageUrl} alt="Preview" className="w-full max-h-64 object-cover rounded-lg border shadow-sm" />
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 border-t flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
        <Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : "Save Banner"}</Button>
      </div>
    </form>
  );
}
