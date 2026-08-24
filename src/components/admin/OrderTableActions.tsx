"use client";

import { useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { Eye, Printer, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function OrderTableActions({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Delete this order?',
      text: "This order record will be permanently deleted from the database.",
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
          text: 'The order has been removed.',
          icon: 'success',
          confirmButtonColor: '#163A32',
          timer: 1800,
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
    <div className="flex items-center justify-end gap-1.5">
      {/* 1. View Details */}
      <Button 
        asChild 
        variant="outline" 
        size="sm" 
        className="h-8 px-2.5 text-[#163A32] border-[#163A32]/20 hover:bg-[#163A32]/10 font-bold text-xs shadow-2xs"
        title="View Order Details"
      >
        <Link href={`/dcc-hq/orders/${orderId}`}>
          <Eye className="w-3.5 h-3.5 mr-1" /> View
        </Link>
      </Button>

      {/* 2. PDF Invoice / Print */}
      <Button 
        asChild 
        variant="outline" 
        size="sm" 
        className="h-8 px-2.5 text-[#6B8F71] border-[#6B8F71]/30 hover:bg-[#6B8F71]/10 font-bold text-xs shadow-2xs"
        title="Download / Print Invoice PDF"
      >
        <Link href={`/dcc-hq/orders/${orderId}/invoice`} target="_blank">
          <Printer className="w-3.5 h-3.5 mr-1" /> Invoice
        </Link>
      </Button>

      {/* 3. Delete Button */}
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleDelete}
        disabled={isDeleting}
        className="h-8 px-2 text-rose-600 border-rose-200 hover:bg-rose-50 font-medium text-xs shadow-2xs"
        title="Delete Order"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
}
