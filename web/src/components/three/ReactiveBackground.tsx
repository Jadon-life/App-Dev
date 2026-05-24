"use client";

/**
 * ReactiveBackground — CSS-based animated gradient background
 * that reacts to mouse movement using CSS custom properties.
 * 
 * Replaces the Three.js WebGL version to avoid React reconciler
 * conflicts between @react-three/fiber and Next.js 14's React version.
 * 
 * Performance: Uses CSS transforms + will-change for GPU-accelerated animation.
 */

import { useEffect, useRef } from "react";

export default function ReactiveBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 50, y: 50 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 100;
      mouseRef.current.y = (e.clientY / window.innerHeight) * 100;
    };

    const animate = () => {
      if (containerRef.current) {
        const { x, y } = mouseRef.current;
        containerRef.current.style.setProperty("--mouse-x", `${x}%`);
        containerRef.current.style.setProperty("--mouse-y", `${y}%`);
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
      style={{
        ["--mouse-x" as string]: "50%",
        ["--mouse-y" as string]: "50%",
      }}
    >
      {/* Base gradient */}
      <div className="absolute inset-0 bg-background-light dark:bg-background-dark transition-colors duration-700" />
      
      {/* Reactive gradient orb — follows mouse */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-20 dark:opacity-30 blur-[120px] transition-opacity duration-700"
        style={{
          background: "radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%)",
          left: "var(--mouse-x)",
          top: "var(--mouse-y)",
          transform: "translate(-50%, -50%)",
          willChange: "left, top",
        }}
      />

      {/* Secondary orb — moves inversely */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-15 dark:opacity-20 blur-[100px]"
        style={{
          background: "radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)",
          right: "var(--mouse-x)",
          bottom: "var(--mouse-y)",
          transform: "translate(50%, 50%)",
          willChange: "right, bottom",
        }}
      />

      {/* Ambient gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/[0.02] to-transparent dark:via-secondary/[0.05]" />
    </div>
  );
}
