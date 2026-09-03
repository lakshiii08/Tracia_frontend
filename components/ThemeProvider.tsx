"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type ThemeMode = "default" | "pure-black" | "pure-white";

interface ThemeContextValue {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "tracia_theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("default");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
      if (saved && (saved === "default" || saved === "pure-black" || saved === "pure-white")) {
        setThemeState(saved);
        applyTheme(saved);
      } else {
        applyTheme("default");
      }
    } catch {
      applyTheme("default");
    }
  }, []);

  const applyTheme = (mode: ThemeMode) => {
    const root = document.documentElement;
    root.setAttribute("data-theme", mode);
    if (mode === "pure-white") {
      root.classList.remove("dark");
      root.classList.add("light");
    } else {
      root.classList.add("dark");
      root.classList.remove("light");
    }
  };

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    try {
      window.localStorage.setItem(STORAGE_KEY, newTheme);
    } catch {}
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
