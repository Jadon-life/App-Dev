import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // CrysLearn Design System — Blue-Purple Luxury Blend
        primary: {
          DEFAULT: "#1E1B4B", // Deep indigo-navy (luxurious dark)
          light: "#312E81",   // Indigo mid-tone
        },
        secondary: {
          DEFAULT: "#7C3AED", // Vibrant purple (main accent / CTAs)
          light: "#8B5CF6",   // Lighter purple for hover states
        },
        accent: {
          blue: "#3B82F6",    // Electric blue for highlights
          purple: "#A855F7",  // Soft purple for gradients
          indigo: "#6366F1",  // Indigo bridge between blue and purple
        },
        background: {
          light: "#F8F7FF",   // Very subtle lavender-white
          dark: "#0F0A1E",    // Deep dark purple-black (luxury dark mode)
        },
        text: {
          light: "#1E1B4B",   // Deep indigo for readability
          dark: "#F1F0FF",    // Soft lavender-white
        },
        surface: {
          light: "#FFFFFF",
          dark: "#1A1533",    // Elevated dark surface
        },
        success: "#10B981",   // Emerald green
        warning: "#F59E0B",   // Warm amber
        danger: "#EF4444",    // Clear red
        correct: "#06B6D4",   // Cyan for correct answers
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        card: "16px",   // Slightly more rounded for luxury feel
        btn: "10px",    // Softer button radius
        pill: "9999px",
      },
      boxShadow: {
        subtle: "0 1px 4px rgba(0,0,0,0.06)",
        glow: "0 0 20px rgba(124, 58, 237, 0.15)",        // Purple glow
        "glow-lg": "0 0 40px rgba(124, 58, 237, 0.2)",    // Stronger purple glow
        card: "0 4px 24px rgba(30, 27, 75, 0.08)",        // Elegant card shadow
        elevated: "0 8px 32px rgba(30, 27, 75, 0.12)",    // Premium elevation
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)",
        "gradient-accent": "linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%)",
        "gradient-hero": "linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4C1D95 100%)",
        "gradient-card": "linear-gradient(135deg, rgba(124,58,237,0.05) 0%, rgba(59,130,246,0.05) 100%)",
        "gradient-subtle": "linear-gradient(135deg, #F8F7FF 0%, #EDE9FE 100%)",
      },
      minHeight: {
        touch: "44px",
      },
      animation: {
        "shimmer": "shimmer 2s infinite linear",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
