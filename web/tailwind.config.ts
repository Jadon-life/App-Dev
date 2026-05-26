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
          navy: "#03045e",
          french: "#023e8a",
          teal: "#0077b6",
          ocean: "#0096c7",
          surf: "#00b4d8",
          aqua: "#48cae4",
          frost: "#90e0ef",
          ice: "#ade8f4",
          cyan: "#caf0f8",
          purple: "#6C3AE0",
          violet: "#8B5CF6",
          lavender: "#C4B5FD",
        },
        background: {
          light: "#F0FAFF",
          dark: "#020420",
        },
        surface: {
          light: "#FFFFFF",
          dark: "#0A0E2A",
          "dark-elevated": "#111640",
        },
        text: {
          primary: "#03045e",
          secondary: "#023e8a",
          muted: "#4B6A88",
          "dark-primary": "#E8F8FF",
          "dark-secondary": "#90e0ef",
          "dark-muted": "#6B8FA8",
        },
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
      },
      fontFamily: {
        heading: ['"Roboto Condensed"', "system-ui", "sans-serif"],
        body: ["Roboto", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      borderRadius: {
        card: "16px",
        btn: "12px",
        pill: "9999px",
        section: "20px",
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
        "gradient-brand": "linear-gradient(135deg, #03045e 0%, #0077b6 50%, #00b4d8 100%)",
        "gradient-cta": "linear-gradient(135deg, #0077b6 0%, #00b4d8 40%, #48cae4 100%)",
        "gradient-purple": "linear-gradient(135deg, #6C3AE0 0%, #0077b6 100%)",
        "gradient-hero": "linear-gradient(135deg, #020420 0%, #03045e 40%, #023e8a 100%)",
        "gradient-surface": "linear-gradient(180deg, #0A0E2A 0%, #020420 100%)",
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
