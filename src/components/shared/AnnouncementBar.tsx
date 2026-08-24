"use client";

import Link from "next/link";
import { Truck, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const announcements = [
  { text: "Free Delivery on Orders Over ৳1500", link: "/shop", cta: "Shop Now" },
  { text: "⚡ Express Same-Day Delivery in Bashundhara R/A", link: "/checkout", cta: "Order Now" },
  { text: "100% Authentic European Treats at Wholesale Rates", link: "/shop?offers=true", cta: "View Deals" },
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
    <div className="bg-[#0E2620] text-white text-[11px] sm:text-xs md:text-[13px] py-1.5 sm:py-2 px-2.5 sm:px-4 border-b-0 select-none overflow-hidden h-8 sm:h-9 md:h-10 flex items-center justify-center">
      <div className="container mx-auto flex items-center justify-center w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
            transition={{ 
              duration: 0.4, 
              ease: [0.22, 1, 0.36, 1] 
            }}
            className="flex items-center justify-center gap-1.5 sm:gap-2.5 text-center max-w-full px-1"
          >
            {/* Delivery Icon */}
            <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D6A84F] shrink-0 drop-shadow-[0_0_6px_rgba(214,168,79,0.35)]" />

            {/* Text with Responsive Max Width */}
            <span className="font-semibold text-white tracking-wide truncate max-w-[200px] xs:max-w-[280px] sm:max-w-none text-left sm:text-center">
              {current.text}
            </span>

            {/* Separator Dot */}
            <span className="text-[#D6A84F] font-black text-xs leading-none shrink-0">•</span>

            {/* Action Link with Arrow */}
            <Link 
              href={current.link}
              className="inline-flex items-center gap-0.5 sm:gap-1 font-bold text-[#D6A84F] hover:text-[#E8C274] hover:underline transition-colors shrink-0 group cursor-pointer"
            >
              <span>{current.cta}</span>
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5] group-hover:translate-x-0.5 transition-transform duration-200" />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

