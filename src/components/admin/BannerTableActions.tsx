"use client";

import { useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BannerTableActions({ bannerId, bannerTitle }: { bannerId: string, bannerTitle: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete the banner "${bannerTitle}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!'
    });
    
    if (!result.isConfirmed) return;

    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/banners/${bannerId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete banner");
      }

      await Swal.fire({
        title: 'Deleted!',
        text: 'Banner has been deleted.',
        icon: 'success',
        confirmButtonColor: '#3085d6',
        timer: 2000,
        showConfirmButton: false
      });
      router.refresh();
    } catch (error: any) {
      Swal.fire({
        title: 'Error!',
        text: error.message,
        icon: 'error',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex justify-end gap-2">
      <Button asChild variant="outline" size="sm" className="h-8 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
        <Link href={`/dcc-hq/banners/edit/${bannerId}`}>
          <Edit className="w-4 h-4 mr-1" /> Edit
        </Link>
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleDelete}
        disabled={isDeleting}
        className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <Trash2 className="w-4 h-4 mr-1" /> {isDeleting ? "..." : "Delete"}
      </Button>
    </div>
  );
}
