"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";

interface PopupData {
  imageUrl: string;
  linkUrl: string;
}

const FALLBACK_POPUP_IMAGE = "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=800&auto=format&fit=crop";

export function PopupOffer() {
  const [show, setShow] = useState(false);
  const [popup, setPopup] = useState<PopupData | null>(null);
  const [imgSrc, setImgSrc] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    // Only trigger popup on homepage
    if (pathname === "/") {
      checkPopup();
    }
  }, [pathname]);

  const checkPopup = async () => {
    try {
      const res = await fetch("/api/popup");
      if (res.ok) {
        const data = await res.json();
        if (data.popup && data.popup.imageUrl) {
          const currentImg = data.popup.imageUrl;
          
          // Check if dismissed recently for this specific banner
          const lastDismissed = localStorage.getItem("dcc_popup_dismissed");
          const lastDismissedImg = localStorage.getItem("dcc_popup_dismissed_img");
          
          if (lastDismissed && lastDismissedImg === currentImg) {
            const dismissedTime = new Date(lastDismissed).getTime();
            const currentTime = new Date().getTime();
            const hoursSinceDismissed = (currentTime - dismissedTime) / (1000 * 60 * 60);
            
            // Don't show if dismissed within the last 12 hours
            if (hoursSinceDismissed < 12) return;
          }

          setPopup(data.popup);
          setImgSrc(currentImg);
          
          // Smooth entrance delay
          setTimeout(() => {
            setShow(true);
          }, 800);
        }
      }
    } catch (error) {
      console.error("Failed to fetch popup offer", error);
    }
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem("dcc_popup_dismissed", new Date().toISOString());
    if (imgSrc) {
      localStorage.setItem("dcc_popup_dismissed_img", imgSrc);
    }
  };

  if (!mounted || !show || !popup || !imgSrc) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 overflow-hidden">
      {/* Dim Backdrop Blur */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in cursor-pointer" 
        onClick={handleDismiss}
      />
      
      {/* Modal Box - Snugly wrapping image with zero extra white background */}
      <div className="relative z-10 w-fit max-w-[92vw] sm:max-w-[480px] md:max-w-[540px] max-h-[85vh] flex items-center justify-center animate-in fade-in zoom-in-95 duration-300">
        
        {/* Banner Card Container */}
        <div className="relative group rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/20">
          
          {/* Clickable Image Banner */}
          <Link 
            href={popup.linkUrl || "/shop"} 
            onClick={handleDismiss}
            className="block cursor-pointer focus:outline-none"
          >
            <img 
              src={imgSrc} 
              alt="Special Promotional Offer" 
              className="w-auto h-auto max-w-[92vw] sm:max-w-[480px] md:max-w-[540px] max-h-[80vh] sm:max-h-[82vh] object-contain block select-none transition-transform duration-300 group-hover:scale-[1.01]"
              onError={() => {
                // If the uploaded image fails, fallback gracefully
                setImgSrc(FALLBACK_POPUP_IMAGE);
              }}
            />
          </Link>

          {/* Floating High-Contrast Close Button */}
          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDismiss();
            }}
            aria-label="Close offer"
            className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-black/60 hover:bg-black/90 text-white rounded-full transition-all z-30 shadow-lg cursor-pointer hover:scale-110 active:scale-90 border border-white/40 backdrop-blur-xs focus:outline-none"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
