"use client";

import { useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function OrderTableActions({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this! The order will be permanently deleted.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      setIsDeleting(true);
      try {
        const res = await fetch(`/api/admin/orders/${orderId}`, {
          method: 'DELETE',
        });

        if (!res.ok) {
          throw new Error('Failed to delete order');
        }

        await Swal.fire({
          title: 'Deleted!',
          text: 'The order has been deleted.',
          icon: 'success',
          confirmButtonColor: '#3085d6',
          timer: 2000,
          showConfirmButton: false
        });
        
        router.refresh();
      } catch (error: any) {
        Swal.fire({
          title: 'Error!',
          text: error.message || 'Could not delete order.',
          icon: 'error',
        });
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="flex justify-end gap-2">
      <Button asChild variant="outline" size="sm" className="h-8 px-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
        <Link href={`/dcc-hq/orders/${orderId}`}>
          <Eye className="w-4 h-4 mr-1.5" /> View
        </Link>
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleDelete}
        disabled={isDeleting}
        className="h-8 px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <Trash2 className="w-4 h-4 mr-1.5" /> {isDeleting ? 'Deleting...' : 'Delete'}
      </Button>
    </div>
  );
}
