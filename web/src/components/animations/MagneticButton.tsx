"use client";

import { useRef, useCallback } from "react";
import gsap from "gsap";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
}

export default function MagneticButton({
  children,
  className = "",
  onClick,
  href,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(buttonRef.current, {
      x: x * 0.15,
      y: y * 0.15,
      duration: 0.3,
      ease: "power2.out",
    });

    if (glowRef.current) {
      gsap.to(glowRef.current, {
        x: x * 0.08,
        y: y * 0.08,
        opacity: 1,
        duration: 0.3,
      });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!buttonRef.current) return;
    gsap.to(buttonRef.current, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.5)",
    });

    if (glowRef.current) {
      gsap.to(glowRef.current, {
        x: 0,
        y: 0,
        opacity: 0,
        duration: 0.5,
      });
    }
  }, []);

  const handleMouseDown = useCallback(() => {
    if (!buttonRef.current) return;
    gsap.to(buttonRef.current, {
      scale: 0.95,
      duration: 0.1,
    });
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!buttonRef.current) return;
    gsap.to(buttonRef.current, {
      scale: 1,
      duration: 0.3,
      ease: "elastic.out(1, 0.5)",
    });
  }, []);

  const Tag = href ? "a" : "button";

  return (
    <Tag
      ref={buttonRef as any}
      href={href}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className={`relative inline-block ${className}`}
    >
      {/* Glow effect */}
      <div
        ref={glowRef}
        className="absolute inset-0 rounded-btn bg-secondary/20 blur-xl opacity-0 -z-10 scale-150"
      />
      {children}
    </Tag>
  );
}
