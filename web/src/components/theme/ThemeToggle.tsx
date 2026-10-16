"use client";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeContext";

export default function ThemeToggle() {
  const { toggleTheme, isDark } = useTheme();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brand-teal/20 text-text-primary hover:bg-brand-teal/10 dark:border-brand-frost/20 dark:text-text-dark-primary"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? (
        <Sun className="h-5 w-5" aria-hidden="true" />
      ) : (
        <Moon className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );
}
