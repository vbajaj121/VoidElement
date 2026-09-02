"use client"

import { ChevronDown } from "lucide-react"
import { HeroVisual } from "@/components/home/hero-visual"
import type { HeroContent } from "@/lib/validation/site-content"

export function HeroClient({ content }: { content: HeroContent }) {
  function scrollToShop() {
    document.querySelector("#the-drop")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    // `h-dvh` (dynamic viewport height) instead of `h-screen` (100vh, fixed at
    // the value when the address bar happens to be visible) — on mobile,
    // 100vh resizes as the browser chrome collapses/expands during the
    // user's first scroll, which shifts this section's height mid-gesture.
    // dvh tracks the live viewport instead, so there's nothing to correct.
    <section className="relative h-dvh w-full overflow-hidden">
      <HeroVisual bannerImageUrl={content.bannerImageUrl} />

      <button
        type="button"
        onClick={scrollToShop}
        data-cursor="text"
        data-cursor-label="Shop"
        aria-label="Scroll to shop the drop"
        className="glass absolute bottom-8 left-1/2 z-10 flex size-12 -translate-x-1/2 items-center justify-center rounded-full text-soft-white"
      >
        <ChevronDown className="animate-bounce" size={20} strokeWidth={1.5} />
      </button>
    </section>
  )
}
