"use client";

import { Sparkles, Truck, ShieldCheck, Zap } from "lucide-react";
import { useEffect, useState } from "react";

const announcements = [
  {
    icon: Truck,
    text: "⚡ Fast Delivery in Bashundhara R/A | 100% Original Imported Goods",
  },
  {
    icon: ShieldCheck,
    text: "🛡️ Wholesale Rates on Premium Coffee, Chocolates & Pantry Items",
  },
  {
    icon: Zap,
    text: "📦 Same-Day Express Delivery available for Block A - N, Bashundhara R/A",
  },
];

export function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const CurrentIcon = announcements[currentIndex].icon;

  return (
    <div className="bg-[#3D2314] text-[#FAF7F2] text-xs font-medium py-2 px-4 transition-colors duration-500">
      <div className="container mx-auto flex items-center justify-center sm:justify-between">
        <div className="flex items-center gap-2 text-center sm:text-left mx-auto sm:mx-0">
          <CurrentIcon className="w-3.5 h-3.5 text-[#C5A059] shrink-0 animate-pulse" />
          <span className="tracking-wide">
            {announcements[currentIndex].text}
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[11px] text-[#C5A059]">
          <span className="flex items-center gap-1 font-semibold">
            <Sparkles className="w-3 h-3" /> Supershop Price Challenge
          </span>
        </div>
      </div>
    </div>
  );
}
