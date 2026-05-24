"use client";

import { useRef, useCallback } from "react";
import gsap from "gsap";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function TiltCard({ children, className = "" }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const rotateX = (y - 0.5) * -8;
    const rotateY = (x - 0.5) * 8;

    gsap.to(cardRef.current, {
      rotateX,
      rotateY,
      transformPerspective: 1000,
      duration: 0.3,
      ease: "power2.out",
    });

    // Move the shine/highlight effect
    if (shineRef.current) {
      gsap.to(shineRef.current, {
        background: `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(124,58,237,0.15) 0%, transparent 60%)`,
        opacity: 1,
        duration: 0.3,
      });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: "power3.out",
    });

    if (shineRef.current) {
      gsap.to(shineRef.current, {
        opacity: 0,
        duration: 0.4,
      });
    }
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Shine overlay */}
      <div
        ref={shineRef}
        className="absolute inset-0 pointer-events-none opacity-0 z-10 rounded-card"
      />
      {children}
    </div>
  );
}
