"use client";

import { useRef, useCallback, useEffect } from "react";
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
  const buttonRef = useRef<HTMLElement | null>(null);
  const glowRef = useRef<HTMLSpanElement | null>(null);
  const motionEnabled = useRef(false);

  useEffect(() => {
    const element = buttonRef.current;
    const glow = glowRef.current;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => {
      motionEnabled.current = !motion.matches && pointer.matches;
      if (!motionEnabled.current) {
        gsap.killTweensOf([element, glow]);
        gsap.set(element, { clearProps: "transform" });
        gsap.set(glow, { opacity: 0, clearProps: "transform" });
      }
    };
    update();
    motion.addEventListener("change", update);
    pointer.addEventListener("change", update);
    return () => {
      motion.removeEventListener("change", update);
      pointer.removeEventListener("change", update);
      gsap.killTweensOf([element, glow]);
    };
  }, [href]);

  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLElement>) => {
    if (!buttonRef.current || !motionEnabled.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    gsap.to(buttonRef.current, {
      x: x * 0.15,
      y: y * 0.15,
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto",
    });
    if (glowRef.current)
      gsap.to(glowRef.current, {
        x: x * 0.08,
        y: y * 0.08,
        opacity: 1,
        duration: 0.3,
        overwrite: "auto",
      });
  }, []);

  const reset = useCallback(() => {
    if (!buttonRef.current || !motionEnabled.current) return;
    gsap.to(buttonRef.current, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.5,
      ease: "elastic.out(1, 0.5)",
      overwrite: "auto",
    });
    if (glowRef.current)
      gsap.to(glowRef.current, { x: 0, y: 0, opacity: 0, duration: 0.5, overwrite: "auto" });
  }, []);

  const handlePointerDown = useCallback(() => {
    if (buttonRef.current && motionEnabled.current)
      gsap.to(buttonRef.current, { scale: 0.95, duration: 0.1, overwrite: "auto" });
  }, []);

  const handlePointerUp = useCallback(() => {
    if (buttonRef.current && motionEnabled.current)
      gsap.to(buttonRef.current, {
        scale: 1,
        duration: 0.3,
        ease: "elastic.out(1, 0.5)",
        overwrite: "auto",
      });
  }, []);

  const shared = {
    ref: (element: HTMLElement | null) => {
      buttonRef.current = element;
    },
    onClick,
    onPointerMove: handlePointerMove,
    onPointerLeave: reset,
    onPointerCancel: reset,
    onPointerDown: handlePointerDown,
    onPointerUp: handlePointerUp,
    onBlur: reset,
    className: `relative inline-block ${className}`,
  };
  const content = (
    <>
      <span
        ref={glowRef}
        aria-hidden="true"
        className="absolute inset-0 rounded-btn bg-secondary/20 blur-xl opacity-0 -z-10 scale-150"
      />
      {children}
    </>
  );
  return href ? (
    <a {...shared} href={href}>
      {content}
    </a>
  ) : (
    <button {...shared} type="button">
      {content}
    </button>
  );
}
