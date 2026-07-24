"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Swal from "sweetalert2";
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export function ProductForm({ categories, initialData }: { categories: any[], initialData?: any }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    brand: initialData?.brand || "",
    price: initialData?.price || "",
    discountPrice: initialData?.discountPrice || "",
    countInStock: initialData?.countInStock || "",
    description: initialData?.description || "",
    images: initialData?.images || [],
    category: initialData?.category || categories[0]?._id || "",
    isFeatured: initialData?.isFeatured || false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingImage(true);
    const newImageUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formDataObj = new FormData();
        formDataObj.append("file", file);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formDataObj,
        });

        if (!res.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        const data = await res.json();
        newImageUrls.push(data.url);
      }

      setFormData((prev) => ({ ...prev, images: [...prev.images, ...newImageUrls] }));
      
      Swal.fire({
        title: 'Uploaded!',
        text: `${newImageUrls.length} image(s) uploaded successfully.`,
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
      // Reset input value so the same file can be selected again
      e.target.value = '';
    }
  };

  const removeImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_: string, index: number) => index !== indexToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const actionName = initialData ? 'update' : 'add';
    const result = await Swal.fire({
      title: 'Confirm Save',
      text: `Are you sure you want to ${actionName} this product?`,
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
      price: Number(formData.price),
      discountPrice: Number(formData.discountPrice) || 0,
      countInStock: Number(formData.countInStock) || 0,
    };

    const url = initialData ? `/api/admin/products/${initialData._id}` : '/api/admin/products';
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
        throw new Error(error.message || `Failed to save product`);
      }

      await Swal.fire({
        title: 'Success!',
        text: `Product has been ${actionLabel} successfully.`,
        icon: 'success',
        confirmButtonColor: '#3085d6',
      });
      router.push('/dcc-hq/products');
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
          <label className="text-sm font-medium">Product Name *</label>
          <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. Premium Swiss Chocolate" />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Brand *</label>
          <input required type="text" name="brand" value={formData.brand} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. Lindt" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Price ($) *</label>
          <input required type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="0.00" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Discount Price ($) (Optional)</label>
          <input type="number" step="0.01" name="discountPrice" value={formData.discountPrice} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="0.00" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Stock Quantity *</label>
          <input required type="number" name="countInStock" value={formData.countInStock} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="100" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Category *</label>
          <select required name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white">
            <option value="" disabled>Select a category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">Product Images *</label>
          
          <div className="flex flex-col md:flex-row gap-4 items-start">
            <div className="flex-1 w-full space-y-2">
              <label className="text-xs text-muted-foreground">Upload Images</label>
              <input 
                type="file" 
                accept="image/*" 
                multiple
                onChange={handleImageUpload} 
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                disabled={isUploadingImage}
              />
              {isUploadingImage && <p className="text-sm text-primary animate-pulse mt-2">Uploading images...</p>}
            </div>
            
            <div className="flex-1 w-full space-y-2">
              <label className="text-xs text-muted-foreground">Or add Image URL (Press Enter)</label>
              <input 
                type="text" 
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" 
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const val = e.currentTarget.value;
                    if (val) {
                      setFormData(prev => ({ ...prev, images: [...prev.images, val] }));
                      e.currentTarget.value = '';
                    }
                  }
                }}
              />
            </div>
          </div>
          
          {formData.images.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-3 text-slate-500">Previews:</p>
              <div className="flex flex-wrap gap-4">
                {formData.images.map((imgUrl, idx) => (
                  <div key={idx} className="relative group w-24 h-24">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imgUrl} alt={`Preview ${idx}`} className="w-full h-full object-cover rounded-lg border shadow-sm" />
                    <button 
                      type="button" 
                      onClick={() => removeImage(idx)}
                      className="absolute -top-2 -right-2 bg-destructive text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-md"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">Description</label>
          <div className="bg-white">
            <ReactQuill 
              theme="snow" 
              value={formData.description} 
              onChange={(value) => setFormData(prev => ({ ...prev, description: value }))} 
              className="h-64 mb-12"
            />
          </div>
        </div>

        <div className="space-y-2 md:col-span-2 flex items-center gap-2">
          <input type="checkbox" id="isFeatured" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-4 h-4 text-primary focus:ring-primary" />
          <label htmlFor="isFeatured" className="text-sm font-medium cursor-pointer">Feature this product on the home page</label>
        </div>
      </div>

      <div className="pt-4 border-t flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
        <Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : "Save Product"}</Button>
      </div>
    </form>
  );
}
