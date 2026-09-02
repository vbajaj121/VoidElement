"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  // next-themes can't know the persisted theme until after hydration (it
  // reads localStorage client-side) — render a neutral placeholder icon
  // until then instead of guessing, so we never flash the wrong one.
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    // Whether we're past hydration is SSR-unknowable, so this can only be
    // set client-side — the one-extra-render-on-mount tradeoff is
    // unavoidable (same pattern as CustomCursor's pointer-type detection).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === "dark"

  return (
    <Button
      size="icon"
      variant="ghost"
      data-cursor="hover"
      aria-label={mounted ? `Switch to ${isDark ? "light" : "dark"} mode` : "Toggle theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={className}
    >
      {!mounted ? (
        <Sun className="size-4 opacity-0" strokeWidth={1.5} />
      ) : isDark ? (
        <Sun className="size-4" strokeWidth={1.5} />
      ) : (
        <Moon className="size-4" strokeWidth={1.5} />
      )}
    </Button>
  )
}
