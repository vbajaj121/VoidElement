"use client"

import { useEffect, useState } from "react"

const KEY = "void-element:recently-viewed"
const MAX = 4

/** Client-only, localStorage-backed — no account/backend needed for this yet. */
export function useRecentlyViewed(currentSlug: string) {
  const [slugs, setSlugs] = useState<string[]>([])

  useEffect(() => {
    let stored: string[] = []
    try {
      stored = JSON.parse(localStorage.getItem(KEY) ?? "[]")
    } catch {
      stored = []
    }

    // localStorage isn't available during SSR, so this can only be read client-side —
    // the one-extra-render-on-mount tradeoff is unavoidable here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSlugs(stored.filter((s) => s !== currentSlug))

    const next = [currentSlug, ...stored.filter((s) => s !== currentSlug)].slice(0, MAX)
    localStorage.setItem(KEY, JSON.stringify(next))
  }, [currentSlug])

  return slugs
}
