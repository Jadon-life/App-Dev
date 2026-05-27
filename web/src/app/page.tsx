"use client";

/**
 * Landing Page — 3D Book Entry Point
 * 
 * Flow:
 * 1. User sees a dark cinematic background with floating 3D book
 * 2. CrysLearn logo + tagline displayed above/below the book
 * 3. "Click to Open" hint pulses beneath the book
 * 4. User clicks → book pages flip one by one (8 pages, slow motion)
 * 5. After flipping completes → fade transition → navigate to /home
 */

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const Book3D = dynamic(() => import("@/components/book/Book3D"), { ssr: false });

export default function BookLandingPage() {
  const [isFlipping, setIsFlipping] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const router = useRouter();

  const handleBookClick = useCallback(() => {
    if (isFlipping) return; // Prevent double-click
    setIsFlipping(true);
  }, [isFlipping]);

  const handleFlipComplete = useCallback(() => {
    // Fade out the entire landing page, then navigate
    setIsFadingOut(true);
    setTimeout(() => {
      router.push("/home");
    }, 800); // Wait for fade-out animation
  }, [router]);

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center overflow-hidden transition-opacity duration-800 ${
        isFadingOut ? "opacity-0" : "opacity-100"
      }`}
      style={{ background: "radial-gradient(ellipse at 50% 50%, #03045e 0%, #020420 60%, #000000 100%)" }}
    >
      {/* Ambient background effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating orbs */}
        <div className="absolute top-[15%] left-[20%] w-64 h-64 bg-brand-surf/[0.04] rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-[20%] right-[15%] w-48 h-48 bg-brand-purple/[0.06] rounded-full blur-[80px] animate-float" style={{ animationDelay: "3s" }} />
        <div className="absolute top-[50%] right-[30%] w-32 h-32 bg-brand-teal/[0.05] rounded-full blur-[60px] animate-float" style={{ animationDelay: "1.5s" }} />

        {/* Subtle particle dots */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-[2px] h-[2px] rounded-full bg-brand-frost/20 animate-float"
            style={{
              left: `${5 + Math.random() * 90}%`,
              top: `${5 + Math.random() * 90}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Tagline — Above the book (logo is ON the book cover) */}
      <div className={`text-center mb-6 z-10 transition-all duration-1000 ${isFlipping ? "opacity-0 -translate-y-10" : "opacity-100"}`}>
        <p className="text-brand-frost/40 text-xs sm:text-sm font-body tracking-widest uppercase">
          Open the book to begin your journey
        </p>
      </div>

      {/* 3D Book */}
      <div
        className={`relative w-[320px] h-[400px] sm:w-[400px] sm:h-[480px] lg:w-[500px] lg:h-[560px] z-10 transition-transform duration-500 ${
          !isFlipping ? "hover:scale-[1.03]" : ""
        }`}
        onClick={handleBookClick}
      >
        <Book3D onComplete={handleFlipComplete} isFlipping={isFlipping} />
      </div>

      {/* Click hint — Below the book */}
      <div className={`mt-6 z-10 transition-all duration-700 ${isFlipping ? "opacity-0 translate-y-5" : "opacity-100"}`}>
        <button
          onClick={handleBookClick}
          className="group flex flex-col items-center gap-2"
        >
          <span className="text-brand-frost/40 text-sm font-body tracking-wide group-hover:text-brand-aqua transition-colors">
            Click the book to begin
          </span>
          {/* Pulsing indicator */}
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-surf/50 animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-brand-surf/50 animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-brand-surf/50 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </button>
      </div>

      {/* "Flipping" status text — shown during flip */}
      <div className={`absolute bottom-12 left-0 right-0 text-center z-10 transition-all duration-500 ${isFlipping && !isFadingOut ? "opacity-100" : "opacity-0"}`}>
        <p className="text-brand-frost/30 text-xs font-mono tracking-widest uppercase">
          Opening your journey...
        </p>
      </div>
    </div>
  );
}
