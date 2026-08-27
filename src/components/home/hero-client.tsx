"use client"

import { m } from "framer-motion"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { AuroraBackground } from "@/components/ui/aurora-background"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout/container"
import { HeroVisual } from "@/components/home/hero-visual"
import { Magnetic } from "@/components/motion/magnetic"
import { Eyebrow, Display, Lead, Caption } from "@/components/ui/typography"
import { useParallax } from "@/hooks/use-parallax"
import type { HeroContent } from "@/lib/validation/site-content"

export function HeroClient({ content }: { content: HeroContent }) {
  const { x, y } = useParallax(24)

  function scrollToNext() {
    document.querySelector("#explore-collections")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    // `h-dvh` (dynamic viewport height) instead of `h-screen` (100vh, fixed at
    // the value when the address bar happens to be visible) — on mobile,
    // 100vh resizes as the browser chrome collapses/expands during the
    // user's first scroll, which shifts this section's height mid-gesture.
    // dvh tracks the live viewport instead, so there's nothing to correct.
    <section className="relative h-dvh w-full overflow-hidden">
      <m.div style={{ x, y }} className="pointer-events-none absolute inset-0">
        <AuroraBackground className="-top-1/4 left-1/2 -translate-x-1/2 opacity-[0.12]" />
      </m.div>

      <HeroVisual bannerImageUrl={content.bannerImageUrl} />

      {/* Grid runs over the image too, instead of stopping at its edge — one
          continuous surface rather than a photo dropped onto a separate grid.
          Plain alpha, no blend mode: mix-blend-overlay mathematically has ~no
          effect against a near-black base (the formula collapses to zero at
          that extreme), which is why it was invisible here before. */}
      <div className="void-grid pointer-events-none absolute inset-0 z-[4]" />

      {/* Dissolves the hero into the section below instead of cutting off sharply */}
      <div className="from-matte-black to-matte-black/0 pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-56 bg-gradient-to-t" />

      <div className="relative z-10 flex h-full w-full items-center">
        <Container>
          <div className="flex flex-col items-center text-center lg:max-w-xl lg:items-start lg:text-left">
            <Eyebrow as="p" className="mb-6">
              {content.eyebrow}
            </Eyebrow>

            <Display as="h1" className="italic">
              {content.headline}
            </Display>

            <Lead as="p" className="mt-6 max-w-lg">
              {content.subtext}
            </Lead>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Magnetic>
                <Button
                  render={<Link href={content.primaryButtonHref} data-cursor="hover" />}
                  nativeButton={false}
                  variant="luxury-filled"
                  size="xl"
                >
                  {content.primaryButtonLabel}
                </Button>
              </Magnetic>
              <Magnetic>
                <Button
                  render={<Link href={content.secondaryButtonHref} data-cursor="hover" />}
                  nativeButton={false}
                  variant="luxury"
                  size="xl"
                >
                  {content.secondaryButtonLabel}
                </Button>
              </Magnetic>
            </div>
          </div>
        </Container>
      </div>

      <button
        type="button"
        onClick={scrollToNext}
        data-cursor="text"
        data-cursor-label="Scroll"
        // `left-1/2 -translate-x-1/2` instead of `inset-x-0` — inset-x-0
        // stretched the button's actual hit box to the full viewport width
        // (only its centered text was ever visible), an invisible tap strip
        // sitting under whatever's above it. This keeps the same visual
        // centering while shrinking the clickable area to the content itself.
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-warm-grey"
      >
        <Caption className="tracking-[0.3em] uppercase">{content.scrollHint}</Caption>
        <ChevronDown className="animate-bounce" size={20} strokeWidth={1.5} />
      </button>
    </section>
  )
}
