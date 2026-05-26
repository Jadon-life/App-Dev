"use client";

/**
 * LockedSection — Wraps any dashboard section with a hover-activated lock overlay.
 * Blends: frosted blur + dim content + glowing lock icon + gradient border + "Sign up" text.
 * Each section has its own independent lock — not one global overlay.
 */

import { Lock } from "lucide-react";
import Link from "next/link";

interface LockedSectionProps {
  children: React.ReactNode;
  title?: string;
}

export default function LockedSection({ children, title }: LockedSectionProps) {
  return (
    <div className="locked-section relative group">
      {/* Glowing border on hover */}
      <div className="locked-glow-border" />

      {/* Actual content (dims on hover) */}
      <div className="locked-content transition-all duration-500">
        {children}
      </div>

      {/* Lock overlay — appears per-section on hover */}
      <div className="locked-overlay">
        <div className="lock-icon">
          <Lock className="w-10 h-10 text-brand-aqua" strokeWidth={1.5} />
        </div>
        <p className="text-white font-heading font-bold text-lg tracking-wide">
          {title || "Premium Content"}
        </p>
        <p className="text-brand-frost/70 text-sm max-w-[200px] text-center">
          Sign up to unlock this section
        </p>
        <Link
          href="/login"
          className="mt-2 px-5 py-2 rounded-pill text-sm font-bold text-white
                     bg-gradient-to-r from-brand-teal to-brand-surf
                     hover:shadow-glow transition-all duration-300"
        >
          Get Access
        </Link>
      </div>
    </div>
  );
}
