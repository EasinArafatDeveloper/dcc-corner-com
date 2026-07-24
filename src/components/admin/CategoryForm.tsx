"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";

export function CategoryForm({ categories, initialData }: { categories: any[], initialData?: any }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    image: initialData?.image || "",
    parentCategory: initialData?.parentCategory || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      
      // Auto-generate slug from name if not provided manually
      if (name === "name" && !initialData) {
        updated.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }
      return updated;
    });
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
      setFormData((prev) => ({ ...prev, image: data.url }));
      
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
      text: `Are you sure you want to ${actionName} this category?`,
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
      parentCategory: formData.parentCategory || null, // null if empty
    };

    const url = initialData ? `/api/admin/categories/${initialData._id}` : '/api/admin/categories';
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
        throw new Error(error.message || `Failed to save category`);
      }

      await Swal.fire({
        title: 'Success!',
        text: `Category has been ${actionLabel} successfully.`,
        icon: 'success',
        confirmButtonColor: '#3085d6',
      });
      router.push('/dcc-hq/categories');
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
          <label className="text-sm font-medium">Category Name *</label>
          <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. Imported Chocolates" />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Slug *</label>
          <input required type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-slate-50" placeholder="e.g. imported-chocolates" />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">Parent Category (Optional)</label>
          <select name="parentCategory" value={formData.parentCategory} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white">
            <option value="">None (Top-level Category)</option>
            {categories.filter(c => c._id !== initialData?._id).map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">Category Image (Optional)</label>
          
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
                name="image" 
                value={formData.image} 
                onChange={handleChange} 
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" 
                placeholder="https://example.com/image.jpg" 
              />
            </div>
          </div>
          
          {isUploadingImage && <p className="text-sm text-primary animate-pulse">Uploading image...</p>}
          {formData.image && !isUploadingImage && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2 text-slate-500">Preview:</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={formData.image} alt="Preview" className="w-32 h-32 object-cover rounded-lg border shadow-sm" />
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 border-t flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
        <Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : "Save Category"}</Button>
      </div>
    </form>
  );
}
