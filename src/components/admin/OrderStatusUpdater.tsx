"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

export function OrderStatusUpdater({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  const handleUpdate = async () => {
    if (status === currentStatus) return;

    const result = await Swal.fire({
      title: 'Update Order Status',
      text: `Are you sure you want to change the status to "${status}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, update it!'
    });
    
    if (!result.isConfirmed) {
      setStatus(currentStatus); // Reset if cancelled
      return;
    }

    setIsUpdating(true);

    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: status })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update order status");
      }

      await Swal.fire({
        title: 'Updated!',
        text: `Order has been marked as ${status}.`,
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
      setStatus(currentStatus); // Reset on error
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <select 
        value={status} 
        onChange={(e) => setStatus(e.target.value)}
        disabled={isUpdating}
        className="px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium min-w-[140px]"
      >
        {statuses.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <Button 
        size="sm" 
        onClick={handleUpdate} 
        disabled={isUpdating || status === currentStatus}
        className="h-9 px-4"
      >
        <Save className="w-4 h-4 mr-2" /> 
        {isUpdating ? "..." : "Update"}
      </Button>
    </div>
  );
}
