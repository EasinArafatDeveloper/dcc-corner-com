"use client";

import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";

export function ProductTableActions({ productId, productName }: { productId: string, productName: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete "${productName}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!'
    });
    
    if (!result.isConfirmed) return;

    setIsDeleting(true);
    const toastId = toast.loading(`Deleting ${productName}...`);

    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to delete product');
      }

      toast.success(`${productName} was deleted successfully`, { id: toastId });
      Swal.fire({
        title: 'Deleted!',
        text: 'The product has been deleted.',
        icon: 'success',
        confirmButtonColor: '#3085d6',
      });
      router.refresh();
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
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
    <div className="flex items-center justify-end gap-2">
      <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-primary">
        <Link href={`/dcc-hq/products/edit/${productId}`}>
          <Edit className="w-4 h-4" />
        </Link>
      </Button>
      <Button 
        onClick={handleDelete}
        disabled={isDeleting}
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 text-slate-500 hover:text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
