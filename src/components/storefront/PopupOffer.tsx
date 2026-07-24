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

export function PopupOffer() {
  const [show, setShow] = useState(false);
  const [popup, setPopup] = useState<PopupData | null>(null);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    checkPopup();
  }, [pathname]);

  const checkPopup = async () => {
    // Only check if we haven't already dismissed it recently
    const lastDismissed = localStorage.getItem("dcc_popup_dismissed");
    if (lastDismissed) {
      const dismissedTime = new Date(lastDismissed).getTime();
      const currentTime = new Date().getTime();
      const hoursSinceDismissed = (currentTime - dismissedTime) / (1000 * 60 * 60);
      
      // Don't show if dismissed within the last 24 hours
      if (hoursSinceDismissed < 24) return;
    }

    try {
      const res = await fetch("/api/popup");
      if (res.ok) {
        const data = await res.json();
        if (data.popup) {
          setPopup(data.popup);
          
          // Slight delay for better UX
          setTimeout(() => {
            setShow(true);
          }, 1500);
        }
      }
    } catch (error) {
      console.error("Failed to fetch popup offer");
    }
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem("dcc_popup_dismissed", new Date().toISOString());
  };

  if (!mounted || !show || !popup) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={handleDismiss}
      />
      
      {/* Popup Modal */}
      <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <button 
          onClick={handleDismiss}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>
        
        <Link href={popup.linkUrl} onClick={handleDismiss}>
          <img 
            src={popup.imageUrl} 
            alt="Special Offer" 
            className="w-full h-auto max-h-[70vh] object-contain" 
          />
        </Link>
      </div>
    </div>,
    document.body
  );
}
