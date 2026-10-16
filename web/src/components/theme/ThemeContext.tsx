"use client";

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";

type Theme = "dark" | "light";
const key = "cryslearn-theme";
const ThemeContext = createContext({
  theme: "light" as Theme,
  toggleTheme: () => {},
  isDark: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const system = window.matchMedia("(prefers-color-scheme: dark)");
    const read = () => {
      let saved: string | null = null;
      try {
        saved = localStorage.getItem(key);
      } catch {
        /* Private browsing can deny storage. */
      }
      setTheme(saved === "light" || saved === "dark" ? saved : system.matches ? "dark" : "light");
      setReady(true);
    };
    read();
    const onStorage = (event: StorageEvent) => {
      if (event.key === key || event.key === null) read();
    };
    const onSystem = () => read();
    window.addEventListener("storage", onStorage);
    system.addEventListener("change", onSystem);
    return () => {
      window.removeEventListener("storage", onStorage);
      system.removeEventListener("change", onSystem);
    };
  }, []);
  useEffect(() => {
    if (!ready) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.dataset.theme = theme;
  }, [theme, ready]);
  const toggleTheme = useCallback(() => {
    setTheme((previous) => {
      const next = previous === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(key, next);
      } catch {
        /* Theme remains usable without storage. */
      }
      return next;
    });
  }, []);
  const value = useMemo(
    () => ({ theme, toggleTheme, isDark: theme === "dark" }),
    [theme, toggleTheme],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
