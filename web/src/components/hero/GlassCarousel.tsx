"use client";

/**
 * GlassCarousel — Glassmorphism cards with glowing borders that rotate in 3D.
 * Each card represents an exam feature/benefit.
 * Auto-rotates with GSAP, supports drag/keyboard navigation.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { BookOpen, Target, Zap, TrendingUp } from "lucide-react";

interface CarouselCard {
  title: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  glowColor: string;
}

const cards: CarouselCard[] = [
  {
    title: "JAMB Mock Exams",
    description: "60 questions, 90 minutes. Experience the real CBT format with instant scoring.",
    icon: Target,
    gradient: "from-purple-500/20 to-indigo-500/20",
    glowColor: "rgba(139, 92, 246, 0.4)",
  },
  {
    title: "WAEC Past Questions",
    description: "10+ years of WASSCE questions with detailed explanations for every answer.",
    icon: BookOpen,
    gradient: "from-blue-500/20 to-cyan-500/20",
    glowColor: "rgba(59, 130, 246, 0.4)",
  },
  {
    title: "AI Explanations",
    description: "Don't just know the answer — understand why. Crystal-clear step-by-step breakdowns.",
    icon: Zap,
    gradient: "from-violet-500/20 to-purple-500/20",
    glowColor: "rgba(167, 139, 250, 0.4)",
  },
  {
    title: "Track Progress",
    description: "See your weak subjects, improvement over time, and exam readiness score.",
    icon: TrendingUp,
    gradient: "from-indigo-500/20 to-blue-500/20",
    glowColor: "rgba(99, 102, 241, 0.4)",
  },
];

export default function GlassCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const dragStartRef = useRef<number | null>(null);

  const animateCards = useCallback((index: number) => {
    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      const offset = i - index;
      const absOffset = Math.abs(offset);

      gsap.to(card, {
        x: offset * 280,
        z: -absOffset * 100,
        rotateY: offset * -12,
        scale: absOffset === 0 ? 1 : 0.85 - absOffset * 0.05,
        opacity: absOffset > 2 ? 0 : 1 - absOffset * 0.25,
        duration: 0.7,
        ease: "power3.out",
      });

      // Glow effect on active card
      if (absOffset === 0) {
        gsap.to(card, {
          boxShadow: `0 0 40px ${cards[i].glowColor}, 0 20px 60px rgba(0,0,0,0.1)`,
          duration: 0.7,
        });
      } else {
        gsap.to(card, {
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          duration: 0.7,
        });
      }
    });
  }, []);

  const goTo = useCallback((index: number) => {
    const wrapped = ((index % cards.length) + cards.length) % cards.length;
    setActiveIndex(wrapped);
    animateCards(wrapped);
  }, [animateCards]);

  // Auto-advance
  useEffect(() => {
    autoPlayRef.current = setInterval(() => {
      goTo(activeIndex + 1);
    }, 4000);
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [activeIndex, goTo]);

  // Initial animation
  useEffect(() => {
    animateCards(0);
  }, [animateCards]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goTo(activeIndex + 1);
      if (e.key === "ArrowLeft") goTo(activeIndex - 1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex, goTo]);

  // Drag/swipe
  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartRef.current = e.clientX;
  };
  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragStartRef.current === null) return;
    const diff = e.clientX - dragStartRef.current;
    if (Math.abs(diff) > 60) {
      goTo(diff < 0 ? activeIndex + 1 : activeIndex - 1);
    }
    dragStartRef.current = null;
  };

  return (
    <div
      ref={containerRef}
      className="relative h-[320px] sm:h-[280px] flex items-center justify-center select-none overflow-hidden"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      style={{ perspective: "1200px" }}
    >
      {/* Cards */}
      <div className="relative flex items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
        {cards.map((card, i) => (
          <div
            key={card.title}
            ref={(el) => { cardsRef.current[i] = el; }}
            className={`absolute w-[260px] sm:w-[300px] p-6 rounded-2xl cursor-pointer
                       border border-indigo-200/30 dark:border-white/[0.1]
                       bg-white/60 dark:bg-white/[0.05] backdrop-blur-2xl
                       transition-[border-color] duration-500
                       hover:border-purple-400/60 dark:hover:border-purple-400/40`}
            style={{ transformStyle: "preserve-3d" }}
            onClick={() => goTo(i)}
          >
            {/* Gradient background */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${card.gradient} opacity-50`} />
            
            {/* Content */}
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 dark:from-purple-400/20 dark:to-blue-400/20 flex items-center justify-center mb-4">
                <card.icon className="w-5 h-5 text-purple-600 dark:text-purple-300" />
              </div>
              <h3 className="font-bold text-lg text-indigo-950 dark:text-white">{card.title}</h3>
              <p className="text-sm text-indigo-800/60 dark:text-indigo-200/60 mt-2 leading-relaxed">
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {cards.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === activeIndex
                ? "w-8 bg-gradient-to-r from-purple-500 to-blue-500"
                : "w-2 bg-indigo-300/30 dark:bg-indigo-500/30 hover:bg-indigo-400/50"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
