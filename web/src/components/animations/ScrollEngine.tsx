"use client";

/**
 * ScrollEngine — Centralizes GSAP ScrollTrigger setup for the entire page.
 * 
 * How GSAP ScrollTrigger integrates with React:
 * 1. useEffect runs after DOM mount → registers ScrollTrigger animations
 * 2. Each animation targets DOM refs or data-attributes
 * 3. scrub: 1 ensures smooth catching-up rather than snapping
 * 4. Cleanup kills all ScrollTriggers on unmount to prevent memory leaks
 * 
 * Parallax Techniques implemented:
 * - Multi-layered depth (data-parallax-speed="0.3")
 * - Scroll-pinned reveals (data-pin="true")
 * - Staggered element reveals (data-stagger="true")
 * - Smooth scrub on all animations
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollEngine({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      // ═══ MULTI-LAYERED DEPTH PARALLAX ═══
      // Elements with data-parallax-speed move at different rates
      const parallaxElements = containerRef.current!.querySelectorAll("[data-parallax-speed]");
      parallaxElements.forEach((el) => {
        const speed = parseFloat(el.getAttribute("data-parallax-speed") || "0.5");
        gsap.to(el, {
          y: () => -ScrollTrigger.maxScroll(window) * speed * 0.1,
          ease: "none",
          scrollTrigger: {
            trigger: el.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: 1, // Smooth scrub — animation catches up in 1 second
            invalidateOnRefresh: true,
          },
        });
      });

      // ═══ SCROLL-PINNED REVEALS ═══
      // Sections with data-pin="true" are pinned while inner content animates
      const pinnedSections = containerRef.current!.querySelectorAll("[data-pin]");
      pinnedSections.forEach((section) => {
        const innerElements = section.querySelectorAll("[data-pin-animate]");
        
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=150%", // Pin for 150% of viewport height
            pin: true,
            scrub: 1,
            anticipatePin: 1, // Smooth pin start
          },
        });

        innerElements.forEach((el, i) => {
          const animType = el.getAttribute("data-pin-animate");
          if (animType === "fade-scale") {
            tl.fromTo(el, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1 }, i * 0.3);
          } else if (animType === "slide-up") {
            tl.fromTo(el, { opacity: 0, y: 80 }, { opacity: 1, y: 0, duration: 1 }, i * 0.3);
          } else if (animType === "unmask") {
            tl.fromTo(el, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1.5 }, i * 0.2);
          }
        });
      });

      // ═══ FADE-UP ANIMATIONS (Standard scroll reveals) ═══
      const fadeUpElements = containerRef.current!.querySelectorAll("[data-scroll='fade-up']");
      fadeUpElements.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              end: "top 50%",
              scrub: 1,
            },
          }
        );
      });

      // ═══ STAGGER REVEALS ═══
      const staggerGroups = containerRef.current!.querySelectorAll("[data-stagger]");
      staggerGroups.forEach((group) => {
        const items = group.children;
        gsap.fromTo(
          items,
          { opacity: 0, y: 50, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: group,
              start: "top 80%",
              end: "top 40%",
              scrub: 1,
            },
          }
        );
      });

      // ═══ SCALE-IN SECTIONS ═══
      const scaleElements = containerRef.current!.querySelectorAll("[data-scroll='scale-in']");
      scaleElements.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              end: "top 50%",
              scrub: 1,
            },
          }
        );
      });

    }, containerRef); // Scope all GSAP animations to this container

    // ═══ CLEANUP — Prevents memory leaks ═══
    return () => {
      ctx.revert(); // Kills all GSAP animations and ScrollTriggers in this context
    };
  }, []);

  return (
    <div ref={containerRef}>
      {children}
    </div>
  );
}
