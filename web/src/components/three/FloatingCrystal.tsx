"use client";

/**
 * FloatingCrystal — CSS-only animated crystal shape
 * Replaces Three.js version to avoid React reconciler crash
 * (Cannot read properties of undefined 'S' error)
 * 
 * Uses CSS transforms, gradients, and keyframe animations for
 * a premium 3D-looking floating effect without WebGL.
 */

export default function FloatingCrystal() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
      {/* Main crystal shape */}
      <div className="relative animate-float">
        {/* Crystal body */}
        <div
          className="w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 opacity-20 dark:opacity-30"
          style={{
            background: "linear-gradient(135deg, #7C3AED 0%, #3B82F6 50%, #A855F7 100%)",
            clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
            animation: "spin 20s linear infinite, float 6s ease-in-out infinite",
            filter: "blur(1px)",
          }}
        />

        {/* Inner glow */}
        <div
          className="absolute inset-4 sm:inset-8 opacity-30 dark:opacity-40"
          style={{
            background: "linear-gradient(135deg, #A855F7 0%, #6366F1 100%)",
            clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
            animation: "spin 15s linear infinite reverse, float 6s ease-in-out infinite 1s",
          }}
        />

        {/* Orbit ring */}
        <div
          className="absolute inset-[-20%] border border-secondary/20 dark:border-secondary/30 rounded-full"
          style={{ animation: "spin 25s linear infinite" }}
        />

        {/* Second orbit */}
        <div
          className="absolute inset-[-10%] border border-accent-blue/15 dark:border-accent-blue/25 rounded-full"
          style={{
            animation: "spin 18s linear infinite reverse",
            transform: "rotateX(60deg)",
          }}
        />
      </div>

      {/* Particle dots */}
      <div className="absolute inset-0">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-secondary/30 dark:bg-secondary/50"
            style={{
              left: `${15 + Math.random() * 70}%`,
              top: `${15 + Math.random() * 70}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite ${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
