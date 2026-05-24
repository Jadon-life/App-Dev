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
        // CrysLearn — Blue/Purple Luxury (adaptive contrast)
        primary: {
          DEFAULT: "#1a1145", // Deep indigo for headings (light mode)
          light: "#312E81",
        },
        secondary: {
          DEFAULT: "#7C3AED", // Vibrant purple accent
          light: "#8B5CF6",
        },
        accent: {
          blue: "#3B82F6",
          purple: "#A855F7",
          indigo: "#6366F1",
        },
        background: {
          light: "#F6F5FF",  // Crisp lavender-white
          dark: "#09061A",   // Deep midnight
        },
        text: {
          light: "#1a1145",  // High-contrast dark indigo
          dark: "#EDE9FF",   // High-contrast light lavender
        },
        surface: {
          light: "#FFFFFF",
          dark: "#110D24",
        },
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
        correct: "#06B6D4",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        card: "16px",
        btn: "12px",
        pill: "9999px",
      },
      boxShadow: {
        subtle: "0 1px 4px rgba(0,0,0,0.06)",
        glow: "0 0 20px rgba(124, 58, 237, 0.2)",
        "glow-lg": "0 0 40px rgba(124, 58, 237, 0.3)",
        card: "0 4px 24px rgba(30, 27, 75, 0.06)",
        elevated: "0 8px 32px rgba(30, 27, 75, 0.1)",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #1a1145 0%, #312E81 100%)",
        "gradient-accent": "linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%)",
        "gradient-hero": "linear-gradient(135deg, #1a1145 0%, #312E81 50%, #4C1D95 100%)",
        "gradient-subtle": "linear-gradient(135deg, #F6F5FF 0%, #EDE9FE 100%)",
      },
      minHeight: {
        touch: "44px",
      },
      animation: {
        shimmer: "shimmer 2s infinite linear",
        float: "float 6s ease-in-out infinite",
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
