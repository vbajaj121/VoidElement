"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"

/**
 * Wraps next-themes: toggles the `.dark` class on <html> (see globals.css's
 * `@custom-variant dark (&:is(.dark *))`), persists the choice to
 * localStorage, and injects a blocking inline script so the right theme
 * applies before first paint — no flash of the wrong theme. Defaults to
 * dark (the brand's default look) rather than the visitor's OS preference,
 * since this is a deliberate design choice, not a system-preference echo.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
      {children}
    </NextThemesProvider>
  )
}
