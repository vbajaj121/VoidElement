"use client"

import { useRef, useState } from "react"
import { Container } from "@/components/layout/container"
import { ProcessStepArt } from "@/components/home/process-step-art"
import { Eyebrow, Heading, Subheading, Body, Caption } from "@/components/ui/typography"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { cn } from "@/lib/utils"
import type { ProcessContent } from "@/lib/validation/site-content"

/** Gradient stand-ins shown behind a step until an admin uploads a real photo — see ProcessStepArt. */
const FALLBACK_GRADIENTS: readonly (readonly [string, string])[] = [
  ["#141414", "#6b6f76"],
  ["#151515", "#c9a668"],
  ["#101010", "#d98fc4"],
  ["#101010", "#7fdcb0"],
  ["#101010", "#7fa3e0"],
]

export function CinematicProcessClient({ content }: { content: ProcessContent }) {
  const { steps } = content
  const [activeIndex, setActiveIndex] = useState(0)
  const activeIndexRef = useRef(0)
  const progressFillRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  const pinRef = useScrollReveal<HTMLDivElement>((el, gsap, ScrollTrigger) => {
    // The pinned, scroll-scrubbed cinematic experience only applies at desktop
    // widths — on small screens this renders as a normal static list instead
    // of scroll-jacking a narrow viewport. Using gsap.matchMedia() (not the
    // deprecated ScrollTrigger.matchMedia) because its condition callback can
    // return a cleanup function — required here since the scrub's onUpdate
    // mutates styles asynchronously, outside gsap.context's normal automatic
    // revert-tracking window, so leaving the breakpoint must reset them by hand.
    const mm = gsap.matchMedia()

    mm.add("(min-width: 1024px)", () => {
      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "+=200%",
        pin: true,
        scrub: 0.6,
        onUpdate: (self) => {
          if (progressFillRef.current) {
            gsap.set(progressFillRef.current, { width: `${self.progress * 100}%` })
          }

          const next = Math.min(steps.length - 1, Math.floor(self.progress * steps.length))

          cardRefs.current.forEach((card, i) => {
            if (!card) return
            gsap.set(card, {
              opacity: i === next ? 1 : 0.32,
              scale: i === next ? 1.04 : 1,
            })
          })

          if (next !== activeIndexRef.current) {
            activeIndexRef.current = next
            setActiveIndex(next)
          }
        },
      })

      return () => {
        cardRefs.current.forEach((card) => {
          if (card) gsap.set(card, { opacity: 1, scale: 1 })
        })
        if (progressFillRef.current) gsap.set(progressFillRef.current, { width: "0%" })
        activeIndexRef.current = 0
        setActiveIndex(0)
      }
    })
  }, [])

  return (
    <div ref={pinRef} className="bg-background relative w-full overflow-hidden lg:h-screen">
      <Container className="py-24 lg:flex lg:h-full lg:flex-col lg:justify-center lg:py-0">
        <Eyebrow>{content.eyebrow}</Eyebrow>
        <Heading className="mt-4 max-w-lg">{content.heading}</Heading>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
          {steps.map((step, i) => (
            <div
              key={step.number}
              ref={(node) => {
                cardRefs.current[i] = node
              }}
              className="transition-[opacity,transform] duration-300 ease-out"
            >
              <div className="border-border relative aspect-3/4 overflow-hidden rounded-xl border">
                <ProcessStepArt
                  colors={FALLBACK_GRADIENTS[i % FALLBACK_GRADIENTS.length]}
                  image={step.imageUrl}
                />
              </div>
              <Caption className="text-accent-champagne mt-3 block font-serif text-base italic">
                {step.number}
              </Caption>
              <Subheading className="mt-1 text-sm sm:text-base">{step.title}</Subheading>
              <Body className={cn("mt-1", "lg:hidden")}>{step.description}</Body>
            </div>
          ))}
        </div>

        <Body className="mt-10 hidden max-w-lg lg:block">{steps[activeIndex].description}</Body>

        <div className="border-border mt-6 hidden h-px w-full max-w-lg overflow-hidden rounded-full bg-white/10 lg:block">
          <div ref={progressFillRef} className="bg-accent-champagne h-full w-0" />
        </div>
      </Container>
    </div>
  )
}
