"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

interface CarouselSlide {
  title: string;
  subtitle: string;
  accent: string;
  gradient: string;
}

const slides: CarouselSlide[] = [
  {
    title: "Master JAMB",
    subtitle: "60 questions. 90 minutes. Timed mock exams that feel like the real thing.",
    accent: "#7C3AED",
    gradient: "from-purple-900/20 via-indigo-900/10 to-transparent",
  },
  {
    title: "Conquer WAEC",
    subtitle: "10+ years of past questions with AI-powered explanations for every answer.",
    accent: "#3B82F6",
    gradient: "from-blue-900/20 via-purple-900/10 to-transparent",
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const animateSlide = useCallback((index: number) => {
    const tl = gsap.timeline();

    // Animate out
    tl.to(titleRef.current, {
      opacity: 0,
      y: -30,
      duration: 0.3,
      ease: "power2.in",
    });
    tl.to(
      subtitleRef.current,
      {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: "power2.in",
      },
      "-=0.2"
    );

    // Change content
    tl.call(() => {
      setCurrentSlide(index);
    });

    // Animate in
    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: 40, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out" }
    );
    tl.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
      "-=0.3"
    );

    // Progress bar reset
    tl.fromTo(
      progressRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 5, ease: "none" },
      "-=0.5"
    );
  }, []);

  const nextSlide = useCallback(() => {
    const next = (currentSlide + 1) % slides.length;
    animateSlide(next);
  }, [currentSlide, animateSlide]);

  const goToSlide = useCallback(
    (index: number) => {
      if (index === currentSlide) return;
      if (intervalRef.current) clearInterval(intervalRef.current);
      animateSlide(index);
      intervalRef.current = setInterval(nextSlide, 5000);
    },
    [currentSlide, animateSlide, nextSlide]
  );

  useEffect(() => {
    // Initial animation
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.3 }
    );
    gsap.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.5 }
    );
    gsap.fromTo(
      progressRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 5, ease: "none", delay: 0.3 }
    );

    // Auto-advance
    intervalRef.current = setInterval(nextSlide, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const slide = slides[currentSlide];

  return (
    <div className="relative">
      {/* Background gradient shift */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${slide.gradient} transition-all duration-1000 rounded-3xl`}
      />

      {/* Content */}
      <div className="relative z-10 text-center py-8">
        <h2
          ref={titleRef}
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold"
          style={{ color: slide.accent }}
        >
          {slide.title}
        </h2>
        <p
          ref={subtitleRef}
          className="mt-4 text-base sm:text-lg text-text-light/60 max-w-lg mx-auto leading-relaxed"
        >
          {slide.subtitle}
        </p>
      </div>

      {/* Indicators */}
      <div ref={indicatorRef} className="flex items-center justify-center gap-3 mt-6">
        {slides.map((s, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`relative h-2 rounded-full transition-all duration-500 overflow-hidden ${
              i === currentSlide ? "w-10 bg-white/20" : "w-2 bg-white/10 hover:bg-white/20"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          >
            {i === currentSlide && (
              <div
                ref={i === currentSlide ? progressRef : null}
                className="absolute inset-0 rounded-full origin-left"
                style={{ backgroundColor: slide.accent }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
