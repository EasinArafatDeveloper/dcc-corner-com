"use client";

import Link from "next/link";
import { Truck, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const announcements = [
  { text: "Free Delivery on Orders Over ৳1500", link: "/shop", cta: "Shop Now" },
  { text: "⚡ Express Same-Day Delivery in Bashundhara R/A", link: "/checkout", cta: "Order Now" },
  { text: "100% Authentic Imported Brands at Wholesale Rates", link: "/shop?offers=true", cta: "View Deals" },
  { text: "Special Gift Hampers & Artisan Chocolates Available", link: "/shop?sort=popular", cta: "Explore" },
];

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % announcements.length);
    }, 4200);
    return () => clearInterval(timer);
  }, []);

  const current = announcements[index];

  return (
    <div className="bg-[#0E2620] text-white text-xs sm:text-[13px] py-2 sm:py-2.5 px-4 border-b border-[#163A32]/80 select-none overflow-hidden h-9 sm:h-10 flex items-center justify-center">
      <div className="container mx-auto flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
            transition={{ 
              duration: 0.45, 
              ease: [0.22, 1, 0.36, 1] 
            }}
            className="flex items-center justify-center gap-2 sm:gap-3 text-center"
          >
            {/* Yellow/Gold Truck Delivery Icon */}
            <Truck className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#D6A84F] shrink-0 drop-shadow-[0_0_6px_rgba(214,168,79,0.35)]" />

            {/* Announcement Text */}
            <span className="font-semibold text-white tracking-wide">
              {current.text}
            </span>

            {/* Gold Separator Dot */}
            <span className="text-[#D6A84F] font-black text-xs leading-none">•</span>

            {/* Action Link with Arrow */}
            <Link 
              href={current.link}
              className="inline-flex items-center gap-1 font-bold text-[#D6A84F] hover:text-[#E8C274] hover:underline transition-colors shrink-0 group cursor-pointer"
            >
              <span>{current.cta}</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5] group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
