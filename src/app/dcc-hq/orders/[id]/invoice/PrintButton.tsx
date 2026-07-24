"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export function PrintButton() {
  useEffect(() => {
    // Wait a brief moment to ensure all styles and images are loaded before printing
    const timer = setTimeout(() => {
      window.print();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Button size="sm" onClick={() => window.print()} className="print:hidden">
      <Printer className="w-4 h-4 mr-2" /> Print / Save as PDF
    </Button>
  );
}
