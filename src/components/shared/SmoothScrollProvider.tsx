"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Inner helper to instantly reset scroll to top on page navigation
function RouteScrollManager() {
  const lenis = useLenis();
  const pathname = usePathname();

  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
  }, [pathname, lenis]);

  return null;
}

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.085, // Super-smooth, buttery inertia glide (Apple & luxury e-commerce standard)
        duration: 1.1, // Elegant velocity curve
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1.05, // Crisp, natural response without sluggish weight
        touchMultiplier: 1.0,
        syncTouch: false, // 100% native 120Hz smooth momentum on mobile touch screens
        infinite: false,
        autoRaf: true, // Hardware VSync RAF loop managed by engine
      }}
    >
      <RouteScrollManager />
      {children}
    </ReactLenis>
  );
}
