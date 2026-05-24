"use client";

import { useRef, useCallback } from "react";
import { useTheme } from "./ThemeContext";
import gsap from "gsap";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme, isDark } = useTheme();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  const handleToggle = useCallback(() => {
    // Animate the toggle with GSAP before switching
    if (iconRef.current) {
      gsap.to(iconRef.current, {
        rotate: 360,
        scale: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          toggleTheme();
          gsap.fromTo(
            iconRef.current,
            { rotate: -180, scale: 0 },
            { rotate: 0, scale: 1, duration: 0.4, ease: "back.out(2)" }
          );
        },
      });
    } else {
      toggleTheme();
    }
  }, [toggleTheme]);

  return (
    <button
      ref={toggleRef}
      onClick={handleToggle}
      className="relative w-10 h-10 rounded-full flex items-center justify-center
                 bg-white/10 border border-white/10 backdrop-blur-sm
                 hover:bg-white/20 hover:border-secondary/30 hover:shadow-glow
                 transition-all duration-300"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <div ref={iconRef}>
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-300" />
        ) : (
          <Moon className="w-4 h-4 text-indigo-600" />
        )}
      </div>
    </button>
  );
}
