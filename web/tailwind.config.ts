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
        // CrysLearn — Navy/Teal/Cyan + Purple creative blend
        brand: {
          navy: "#183d3b",
          french: "#205d54",
          teal: "#086d62",
          ocean: "#247f70",
          surf: "#82cbb4",
          aqua: "#69baa5",
          frost: "#a9d9c9",
          ice: "#c6e7dc",
          cyan: "#e4f3eb",
          purple: "#82663b",
          violet: "#9b7d4e",
          lavender: "#d5c59f",
        },
        background: {
          light: "#f6f7f3",
          dark: "#101e20",
        },
        surface: {
          light: "#FFFFFF",
          dark: "#17282a",
          "dark-elevated": "#203436",
        },
        text: {
          primary: "#183d3b",
          secondary: "#205d54",
          muted: "#526868",
          "dark-primary": "#edf3ed",
          "dark-secondary": "#a9d9c9",
          "dark-muted": "#a9bdb9",
        },
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
      },
      fontFamily: {
        heading: ["var(--font-geist)", "system-ui", "sans-serif"],
        body: ["var(--font-geist)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      borderRadius: {
        card: "16px",
        btn: "8px",
        pill: "9999px",
        section: "14px",
      },
      boxShadow: {
        glow: "0 0 20px rgba(0, 180, 216, 0.2)",
        "glow-lg": "0 0 40px rgba(0, 180, 216, 0.3)",
        "glow-purple": "0 0 25px rgba(108, 58, 224, 0.25)",
        card: "0 4px 24px rgba(3, 4, 94, 0.06)",
        "card-dark": "0 4px 24px rgba(0, 0, 0, 0.4)",
        elevated: "0 8px 40px rgba(3, 4, 94, 0.1)",
        lock: "0 0 30px rgba(0, 180, 216, 0.4), 0 0 60px rgba(108, 58, 224, 0.2)",
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #183d3b 0%, #086d62 50%, #086d62 100%)",
        "gradient-cta": "linear-gradient(135deg, #086d62 0%, #086d62 40%, #69baa5 100%)",
        "gradient-purple": "linear-gradient(135deg, #82663b 0%, #086d62 100%)",
        "gradient-hero": "linear-gradient(135deg, #101e20 0%, #183d3b 40%, #205d54 100%)",
        "gradient-surface": "linear-gradient(180deg, #17282a 0%, #101e20 100%)",
      },
      minHeight: {
        touch: "44px",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "lock-shake": "lockShake 0.5s ease-in-out",
        shimmer: "shimmer 2s infinite linear",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0, 180, 216, 0.2)" },
          "50%": { boxShadow: "0 0 40px rgba(0, 180, 216, 0.5), 0 0 60px rgba(108, 58, 224, 0.3)" },
        },
        lockShake: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-5deg)" },
          "75%": { transform: "rotate(5deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
