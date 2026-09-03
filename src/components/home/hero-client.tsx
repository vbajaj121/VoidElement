"use client"

import { useEffect, useState } from "react"
import { m } from "framer-motion"
import Link from "next/link"
import { ArrowRight, ChevronDown } from "lucide-react"
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

  // Mouse-driven parallax can never do anything on a touch device (there's no
  // mousemove to react to — x/y just sit at 0 forever), but the motion.div
  // wrapper still applies a CSS transform for it, and AuroraBackground itself
  // runs a continuous CSS animation through a 120px blur — one of the most
  // GPU-expensive effects a browser renders. Both sit directly under the
  // fixed navbar, the exact area where taps on the menu/cart buttons were
  // reported as unreliable, and on real (especially mid-range Android)
  // mobile hardware that's a plausible source of genuine input jank for a
  // purely decorative desktop nicety. Skip both entirely on coarse-pointer/
  // touch devices — same detection CustomCursor already uses.
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
    // Sized by aspect ratio instead of viewport height — 9:16 (portrait) on
    // mobile, 16:9 (landscape) on desktop, matching the two differently-
    // cropped banner images admins upload for each.
    <section className="relative aspect-[9/16] w-full overflow-hidden lg:aspect-video">
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

      {/* Desktop only — mobile drops the eyebrow/headline/subtext/lookbook
          entirely and just gets the one transparent button below. Text
          links instead of filled pill buttons — a solid gold CTA read as a
          loud sale-banner accent against this quiet, single-light-source
          photograph; a thin underline + arrow sits with it instead of
          fighting it. */}
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

      {/* Mobile only — just the one transparent CTA, sitting above the
          scroll hint near the bottom of the banner. */}
      <div className="absolute inset-x-0 bottom-24 z-10 flex justify-center lg:hidden">
        <Magnetic>
          <Button
            render={<Link href={content.primaryButtonHref} data-cursor="hover" />}
            nativeButton={false}
            variant="luxury"
            size="xl"
          >
            {content.primaryButtonLabel}
          </Button>
        </Magnetic>
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
