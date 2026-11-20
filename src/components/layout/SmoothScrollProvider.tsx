"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { scrollToTopEventName } from "@/lib/smoothScrollEvents";

type SmoothScrollProviderProps = {
  children: ReactNode;
};

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia(reducedMotionQuery);

    const startLenis = () => {
      if (lenisRef.current || mediaQuery.matches) {
        return;
      }

      lenisRef.current = new Lenis({
        autoRaf: true,
        autoToggle: true,
        lerp: 0.09,
        wheelMultiplier: 0.9,
        smoothWheel: true,
        syncTouch: false,
        allowNestedScroll: true,
        naiveDimensions: true,
        stopInertiaOnNavigate: true,
        anchors: {
          offset: -96,
          duration: 0.9,
        },
      });
    };

    const stopLenis = () => {
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };

    const handleMotionPreferenceChange = () => {
      if (mediaQuery.matches) {
        stopLenis();
        return;
      }

      startLenis();
    };

    const handleScrollToTopRequest = (event: Event) => {
      const lenis = lenisRef.current;

      if (!lenis || mediaQuery.matches) {
        return;
      }

      event.preventDefault();
      lenis.scrollTo(0, {
        duration: 0.9,
        force: true,
        lock: true,
      });
    };

    startLenis();
    mediaQuery.addEventListener("change", handleMotionPreferenceChange);
    window.addEventListener(scrollToTopEventName, handleScrollToTopRequest);

    return () => {
      mediaQuery.removeEventListener("change", handleMotionPreferenceChange);
      window.removeEventListener(
        scrollToTopEventName,
        handleScrollToTopRequest,
      );
      stopLenis();
    };
  }, []);

  useEffect(() => {
    const resizeLenis = () => {
      lenisRef.current?.resize();
    };

    const animationFrame = window.requestAnimationFrame(resizeLenis);
    const timeout = window.setTimeout(resizeLenis, 450);

    window.addEventListener("load", resizeLenis);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(timeout);
      window.removeEventListener("load", resizeLenis);
    };
  }, [pathname]);

  return children;
}
