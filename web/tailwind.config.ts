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
        // PrepHQ Design System — Document 04
        primary: {
          DEFAULT: "#1A3C6E",
          light: "#2E6DB4",
        },
        secondary: "#2E6DB4",
        background: {
          light: "#F5F7FA",
          dark: "#0D1B2A",
        },
        text: {
          light: "#1C1C1E",
          dark: "#F1F1F1",
        },
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
        correct: "#0EA5E9",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        card: "12px",
        btn: "8px",
        pill: "9999px",
      },
      boxShadow: {
        subtle: "0 1px 4px rgba(0,0,0,0.08)",
      },
      minHeight: {
        touch: "44px",
      },
    },
  },
  plugins: [],
};
export default config;
