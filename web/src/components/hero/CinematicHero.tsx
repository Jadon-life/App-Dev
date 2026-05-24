"use client";

/**
 * CinematicHero — Full-screen hero with 3D carousel, split-text animations,
 * and GSAP-driven slide transitions. Supports keyboard, drag, and dot navigation.
 * 
 * Architecture:
 * - GSAP Timeline controls text animation sequencing
 * - Three.js renders the 3D floating crystal
 * - React state manages current slide index
 * - useEffect coordinates GSAP + React state changes
 */

import { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Slide {
  exam: string;
  headline: string;
  description: string;
  color: string;
}

const slides: Slide[] = [
  {
    exam: "JAMB",
    headline: "Master JAMB UTME",
    description: "60 questions. 90 minutes. Timed mocks that feel like the real CBT experience.",
    color: "#7C3AED",
  },
  {
    exam: "WAEC",
    headline: "Conquer WAEC SSCE",
    description: "10+ years of past questions with AI explanations for every single answer.",
    color: "#3B82F6",
  },
  {
    exam: "NECO",
    headline: "Ace NECO Exams",
    description: "Subject-by-subject tracking. See exactly where you're strong and where to improve.",
    color: "#6366F1",
  },
  {
    exam: "Post-UTME",
    headline: "Crush Post-UTME",
    description: "University-specific screening prep. One payment, lifetime access, offline study.",
    color: "#A855F7",
  },
];

export default function CinematicHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const examBadgeRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const dragStartRef = useRef<number | null>(null);

  // Split text into individual characters for reveal animation
  const animateTextIn = useCallback((element: HTMLElement, delay = 0) => {
    const text = element.textContent || "";
    element.innerHTML = text
      .split("")
      .map((char) => `<span class="inline-block opacity-0">${char === " " ? "&nbsp;" : char}</span>`)
      .join("");

    gsap.fromTo(
      element.querySelectorAll("span"),
      { opacity: 0, y: 40, rotateX: -90 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.5,
        stagger: 0.02,
        ease: "back.out(2)",
        delay,
      }
    );
  }, []);

  const animateTextOut = useCallback((element: HTMLElement) => {
    return gsap.to(element.querySelectorAll("span"), {
      opacity: 0,
      y: -30,
      rotateX: 90,
      duration: 0.3,
      stagger: 0.01,
      ease: "power2.in",
    });
  }, []);

  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating || index === currentSlide) return;
      setIsAnimating(true);

      const tl = gsap.timeline({
        onComplete: () => {
          setCurrentSlide(index);
          setIsAnimating(false);
        },
      });

      // Animate out current content
      if (headlineRef.current) {
        tl.add(animateTextOut(headlineRef.current), 0);
      }
      tl.to(descRef.current, { opacity: 0, y: -20, duration: 0.3 }, 0);
      tl.to(examBadgeRef.current, { opacity: 0, scale: 0.8, duration: 0.2 }, 0);

      // Update slide and animate in (handled by useEffect below)
    },
    [isAnimating, currentSlide, animateTextOut]
  );

  // Animate content when slide changes
  useEffect(() => {
    if (!headlineRef.current || !descRef.current || !examBadgeRef.current) return;

    // Set new content
    headlineRef.current.textContent = slides[currentSlide].headline;
    descRef.current.textContent = slides[currentSlide].description;

    // Animate in
    animateTextIn(headlineRef.current, 0.1);
    gsap.fromTo(descRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.4, ease: "power3.out" });
    gsap.fromTo(examBadgeRef.current, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.4, delay: 0.05, ease: "back.out(2)" });

    // Progress bar animation
    if (progressRef.current) {
      gsap.fromTo(progressRef.current, { scaleX: 0 }, { scaleX: 1, duration: 6, ease: "none" });
    }
  }, [currentSlide, animateTextIn]);

  // Auto-advance slides
  useEffect(() => {
    autoPlayRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goToSlide((currentSlide + 1) % slides.length);
      if (e.key === "ArrowLeft") goToSlide((currentSlide - 1 + slides.length) % slides.length);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide, goToSlide]);

  // Drag/swipe support
  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartRef.current = e.clientX;
  };
  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragStartRef.current === null) return;
    const diff = e.clientX - dragStartRef.current;
    if (Math.abs(diff) > 80) {
      if (diff < 0) goToSlide((currentSlide + 1) % slides.length);
      else goToSlide((currentSlide - 1 + slides.length) % slides.length);
    }
    dragStartRef.current = null;
  };

  const slide = slides[currentSlide];

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden select-none"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      {/* Animated gradient backdrop — shifts color per slide */}
      <div
        className="absolute inset-0 opacity-30 transition-all duration-1000"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${slide.color}22 0%, transparent 70%)`,
        }}
      />

      {/* Floating accent orbs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full blur-[120px] animate-float opacity-20" style={{ backgroundColor: slide.color }} />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full blur-[100px] opacity-15 bg-accent-blue" style={{ animationDelay: "2s" }} />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        {/* Exam badge */}
        <div ref={examBadgeRef} className="inline-flex items-center gap-2 mb-8">
          <div
            className="flex items-center gap-2 px-4 py-1.5 rounded-pill border backdrop-blur-sm"
            style={{
              borderColor: `${slide.color}40`,
              backgroundColor: `${slide.color}15`,
            }}
          >
            <Sparkles className="w-4 h-4" style={{ color: slide.color }} />
            <span className="text-sm font-semibold" style={{ color: slide.color }}>
              {slide.exam} Preparation
            </span>
          </div>
        </div>

        {/* Headline — split text reveal */}
        <h1
          ref={headlineRef}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-text-light dark:text-text-dark leading-[1.05] tracking-tight"
          style={{ perspective: "600px" }}
        >
          {slide.headline}
        </h1>

        {/* Description */}
        <p
          ref={descRef}
          className="mt-6 text-lg sm:text-xl text-text-light/50 dark:text-text-dark/50 max-w-xl mx-auto leading-relaxed"
        >
          {slide.description}
        </p>

        {/* CTA */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="btn-primary text-lg px-10 py-4 shadow-glow-lg group"
          >
            Start Preparing
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a href="#features" className="btn-secondary text-lg px-10 py-4">
            Explore Features
          </a>
        </div>

        {/* Navigation arrows */}
        <div className="flex items-center justify-center gap-6 mt-14">
          <button
            onClick={() => goToSlide((currentSlide - 1 + slides.length) % slides.length)}
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center
                       hover:border-secondary/40 hover:bg-secondary/10 transition-all duration-300"
          >
            <ChevronLeft className="w-4 h-4 text-text-light/50 dark:text-text-dark/50" />
          </button>

          {/* Dot indicators with progress */}
          <div className="flex items-center gap-3">
            {slides.map((s, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`relative h-1.5 rounded-full overflow-hidden transition-all duration-500 ${
                  i === currentSlide ? "w-12" : "w-3 hover:w-5"
                }`}
                style={{
                  backgroundColor: i === currentSlide ? `${s.color}30` : "rgba(255,255,255,0.1)",
                }}
              >
                {i === currentSlide && (
                  <div
                    ref={progressRef}
                    className="absolute inset-0 rounded-full origin-left"
                    style={{ backgroundColor: s.color }}
                  />
                )}
              </button>
            ))}
          </div>

          <button
            onClick={() => goToSlide((currentSlide + 1) % slides.length)}
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center
                       hover:border-secondary/40 hover:bg-secondary/10 transition-all duration-300"
          >
            <ChevronRight className="w-4 h-4 text-text-light/50 dark:text-text-dark/50" />
          </button>
        </div>
      </div>
    </section>
  );
}
