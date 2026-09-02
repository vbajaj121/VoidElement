"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, m } from "framer-motion"
import { Container } from "@/components/layout/container"
import { ProcessStepArt } from "@/components/home/process-step-art"
import { PROCESS_FALLBACK_GRADIENTS } from "@/components/home/process-fallback-gradients"
import { Subheading, Body, Caption } from "@/components/ui/typography"
import { cn } from "@/lib/utils"
import type { ProcessContent } from "@/lib/validation/site-content"

/** The swipe filmstrip used below `lg` — see ProcessSplitScroll for the desktop treatment. */
export function ProcessCarousel({ steps }: { steps: ProcessContent["steps"] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  const ratiosRef = useRef<number[]>(steps.map(() => 0))
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const root = trackRef.current
    if (!root) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const index = slideRefs.current.indexOf(entry.target as HTMLDivElement)
          if (index !== -1) ratiosRef.current[index] = entry.intersectionRatio
        }
        let bestIndex = 0
        let bestRatio = -1
        ratiosRef.current.forEach((ratio, i) => {
          if (ratio > bestRatio) {
            bestRatio = ratio
            bestIndex = i
          }
        })
        setActiveIndex(bestIndex)
      },
      { root, threshold: [0, 0.25, 0.5, 0.75, 1] }
    )

    slideRefs.current.forEach((slide) => slide && observer.observe(slide))
    return () => observer.disconnect()
  }, [steps.length])

  function scrollToIndex(index: number) {
    slideRefs.current[index]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
  }

  const active = steps[activeIndex]

  return (
    <>
      {/* Full-bleed filmstrip — deliberately breaks out of Container's max-width
          so the next card always peeks in at the edge, hinting it's swipeable
          without needing arrow icons or a "swipe" label. */}
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] sm:gap-6 sm:px-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] [&::-webkit-scrollbar]:hidden"
      >
        {steps.map((step, i) => (
          <div
            key={step.number}
            ref={(node) => {
              slideRefs.current[i] = node
            }}
            className="w-[78vw] shrink-0 snap-center sm:w-[56vw] lg:w-[30vw] xl:w-[26vw]"
          >
            <m.div
              className="border-border relative aspect-3/4 overflow-hidden rounded-xl border"
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ root: trackRef, amount: 0.5, once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProcessStepArt colors={PROCESS_FALLBACK_GRADIENTS[i % PROCESS_FALLBACK_GRADIENTS.length]} image={step.imageUrl} />
            </m.div>
          </div>
        ))}
        {/* Trailing spacer so the last card can snap fully into view past the peek gap */}
        <div className="w-[calc(22vw-1rem)] shrink-0 sm:w-0" aria-hidden />
      </div>

      <Container>
        <div className="mt-8 grid gap-8 sm:grid-cols-[1fr_auto] sm:items-end">
          <AnimatePresence mode="wait">
            <m.div
              key={active.number}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <Caption className="text-accent-champagne block font-serif text-base italic">
                {active.number}
              </Caption>
              <Subheading className="mt-1 text-lg">{active.title}</Subheading>
              <Body className="mt-2 max-w-lg">{active.description}</Body>
            </m.div>
          </AnimatePresence>

          <div className="flex gap-2">
            {steps.map((step, i) => (
              <button
                key={step.number}
                type="button"
                onClick={() => scrollToIndex(i)}
                aria-label={`Go to step ${step.number}: ${step.title}`}
                aria-current={i === activeIndex}
                data-cursor="hover"
                className="group cursor-pointer py-2"
              >
                <span
                  className={cn(
                    "block h-px w-8 rounded-full transition-all duration-300",
                    i === activeIndex ? "bg-accent-champagne w-10" : "bg-foreground/15 group-hover:bg-foreground/30"
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      </Container>
    </>
  )
}
