"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, m } from "framer-motion"
import { ProcessStepArt } from "@/components/home/process-step-art"
import { PROCESS_FALLBACK_GRADIENTS } from "@/components/home/process-fallback-gradients"
import { Subheading, Body, Caption } from "@/components/ui/typography"
import { cn } from "@/lib/utils"
import type { ProcessContent } from "@/lib/validation/site-content"

/**
 * Desktop-only treatment (`lg:` and up) — the "split-screen sticky scroll"
 * pattern (Apple product pages are the usual reference point): the image
 * stays pinned in the left column via plain CSS `position: sticky` — no
 * scroll-jacking, no pin library, the browser does this natively — while
 * the steps scroll past in the right column. An IntersectionObserver with a
 * thin band at the vertical center picks whichever step is currently
 * crossing that line and crossfades the pinned image to match.
 */
export function ProcessSplitScroll({ steps }: { steps: ProcessContent["steps"] }) {
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const index = stepRefs.current.indexOf(entry.target as HTMLDivElement)
          if (index !== -1) setActiveIndex(index)
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    )
    stepRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [steps.length])

  const active = steps[activeIndex]

  return (
    <div className="grid grid-cols-[1fr_1fr] gap-16 xl:gap-24">
      <div className="sticky top-32 self-start">
        <div className="border-border relative aspect-4/5 overflow-hidden rounded-2xl border">
          <AnimatePresence mode="wait">
            <m.div
              key={active.number}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <ProcessStepArt
                colors={PROCESS_FALLBACK_GRADIENTS[activeIndex % PROCESS_FALLBACK_GRADIENTS.length]}
                image={active.imageUrl}
              />
            </m.div>
          </AnimatePresence>
          <span
            aria-hidden
            className="text-soft-white/10 pointer-events-none absolute right-6 bottom-6 font-serif text-8xl italic select-none"
          >
            {active.number}
          </span>
        </div>
      </div>

      <div className="flex flex-col">
        {steps.map((step, i) => (
          <div
            key={step.number}
            ref={(node) => {
              stepRefs.current[i] = node
            }}
            className="border-border flex min-h-[65vh] flex-col justify-center border-t py-12 first:border-t-0"
          >
            <Caption
              className={cn(
                "font-serif text-base italic transition-colors duration-500",
                i === activeIndex ? "text-accent-champagne" : "text-warm-grey"
              )}
            >
              {step.number}
            </Caption>
            <Subheading
              className={cn("mt-2 text-2xl transition-opacity duration-500", i === activeIndex ? "opacity-100" : "opacity-40")}
            >
              {step.title}
            </Subheading>
            <Body
              className={cn(
                "mt-3 max-w-md transition-opacity duration-500",
                i === activeIndex ? "opacity-100" : "opacity-40"
              )}
            >
              {step.description}
            </Body>
          </div>
        ))}
      </div>
    </div>
  )
}
