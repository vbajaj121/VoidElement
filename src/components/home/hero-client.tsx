"use client"

import { useEffect, useState } from "react"
import { m } from "framer-motion"
import Link from "next/link"
import { ArrowRight, ChevronDown } from "lucide-react"
import { AuroraBackground } from "@/components/ui/aurora-background"
import { Container } from "@/components/layout/container"
import { HeroVisual } from "@/components/home/hero-visual"
import { Eyebrow, Display, Lead, Caption } from "@/components/ui/typography"
import { useParallax } from "@/hooks/use-parallax"
import type { HeroContent } from "@/lib/validation/site-content"

export function HeroClient({ content }: { content: HeroContent }) {
  const { x, y } = useParallax(24)

  // Mouse-driven parallax can never do anything on a touch device (there's no
  // mousemove to react to — x/y just sit at 0 forever), but the motion.div
  // wrapper still applies a CSS transform for it, and AuroraBackground itself
  // runs a continuous CSS animation through a 120px blur — one of the most
  // GPU-expensive effects a browser renders. Skip both entirely on coarse-
  // pointer/touch devices — same detection CustomCursor already uses.
  const [finePointer, setFinePointer] = useState(false)
  useEffect(() => {
    // matchMedia is unavailable during SSR, so this can only be known
    // client-side — the one-extra-render-on-mount tradeoff is unavoidable
    // here (same pattern as CustomCursor's pointer-type detection).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFinePointer(window.matchMedia("(pointer: fine)").matches)
  }, [])

  function scrollToNext() {
    // The Explore Collections section this used to target was removed —
    // scrolls to The Drop instead, the next real section on the page.
    document.querySelector("#the-drop")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    // Square on mobile (a near-full-screen 9:16 photo, then an inset story
    // card, both didn't land) — image-only, no text/CTA on top of it at
    // all, roughly half the height the original 9:16 treatment took so the
    // marquee and product grid are visible on the same first screen. 16:9
    // on desktop, unchanged.
    <section className="relative aspect-square w-full overflow-hidden lg:aspect-video">
      {finePointer && (
        <m.div style={{ x, y }} className="pointer-events-none absolute inset-0">
          <AuroraBackground className="-top-1/4 left-1/2 -translate-x-1/2 opacity-[0.12]" />
        </m.div>
      )}

      <HeroVisual bannerImageUrl={content.bannerImageUrl} mobileBannerImageUrl={content.mobileBannerImageUrl} />

      {/* Grid runs over the image too, instead of stopping at its edge — one
          continuous surface rather than a photo dropped onto a separate grid.
          Plain alpha, no blend mode: mix-blend-overlay mathematically has ~no
          effect against a near-black base (the formula collapses to zero at
          that extreme), which is why it was invisible here before. */}
      <div className="void-grid pointer-events-none absolute inset-0 z-[4]" />

      {/* Dissolves the hero into the section below instead of cutting off sharply */}
      <div className="from-matte-black to-matte-black/0 pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-56 bg-gradient-to-t" />

      {/* Desktop only — mobile is the photo alone, no text or CTA over it. */}
      <div className="relative z-10 hidden h-full w-full items-center lg:flex">
        <Container>
          <div className="max-w-2xl">
            <Eyebrow as="p" className="mb-6 text-sm">
              {content.eyebrow}
            </Eyebrow>

            {/* Sized up from Display's default clamp — the hero box is
                shorter now (aspect-video instead of full viewport height),
                so the same absolute text size read smaller relative to it. */}
            <Display as="h1" className="text-6xl italic xl:text-8xl">
              {content.headline}
            </Display>

            <Lead as="p" className="mt-6 max-w-lg text-lg xl:text-xl">
              {content.subtext}
            </Lead>

            <div className="mt-10 flex items-center gap-8">
              <Link
                href={content.primaryButtonHref}
                data-cursor="hover"
                className="group border-soft-white text-soft-white hover:text-accent-champagne hover:border-accent-champagne inline-flex items-center gap-2 border-b pb-1 text-sm font-medium tracking-[0.2em] uppercase transition-colors"
              >
                {content.primaryButtonLabel}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
              </Link>
              <Link
                href={content.secondaryButtonHref}
                data-cursor="hover"
                className="text-warm-grey hover:text-soft-white text-sm font-medium tracking-[0.2em] uppercase transition-colors"
              >
                {content.secondaryButtonLabel}
              </Link>
            </div>
          </div>
        </Container>
      </div>

      {/* Scroll hint — desktop only, mobile's short square crop doesn't need it. */}
      <button
        type="button"
        onClick={scrollToNext}
        data-cursor="text"
        data-cursor-label="Scroll"
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-warm-grey lg:flex"
      >
        <Caption className="tracking-[0.3em] uppercase">{content.scrollHint}</Caption>
        <ChevronDown className="animate-bounce" size={20} strokeWidth={1.5} />
      </button>
    </section>
  )
}
