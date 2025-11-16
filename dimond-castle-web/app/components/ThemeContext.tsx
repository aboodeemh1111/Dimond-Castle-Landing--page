"use client";

import { createContext, useContext } from "react";
import type { Theme } from "../lib/theme-api";

const ThemeContext = createContext<Theme | null>(null);

export function ThemeClientProvider({
  theme,
  children,
}: {
  theme: Theme;
  children: React.ReactNode;
}) {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useThemeSettings() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useThemeSettings must be used within ThemeProvider");
  }
  return ctx;
}


