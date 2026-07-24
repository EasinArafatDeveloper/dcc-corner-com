"use client";

import { useEffect } from "react";

export function PrintTrigger() {
  useEffect(() => {
    // Wait a brief moment to ensure all styles and images are loaded before printing
    const timer = setTimeout(() => {
      window.print();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
