"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AuroraBackground } from "@/components/ui/aurora-background"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout/container"
import { HeroVisual } from "@/components/home/hero-visual"
import { Magnetic } from "@/components/motion/magnetic"
import { Eyebrow, Display, Lead } from "@/components/ui/typography"
import type { HeroContent } from "@/lib/validation/site-content"

export function HeroClient({ content }: { content: HeroContent }) {
  // AuroraBackground runs a continuous CSS animation through a 120px blur —
  // one of the most GPU-expensive effects a browser renders. Skipped on
  // touch devices, where it's a purely decorative desktop nicety not worth
  // the input-jank risk (same detection CustomCursor already uses).
  const [finePointer, setFinePointer] = useState(false)
  useEffect(() => {
    // matchMedia is unavailable during SSR, so this can only be known
    // client-side — the one-extra-render-on-mount tradeoff is unavoidable.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFinePointer(window.matchMedia("(pointer: fine)").matches)
  }, [])

  return (
    <section className="relative w-full overflow-hidden pt-24 pb-0 lg:pb-16">
      {finePointer && <AuroraBackground className="top-0 left-1/2 -translate-x-1/2 opacity-[0.12]" />}

      <Container className="relative">
        <HeroVisual bannerImageUrl={content.bannerImageUrl} />

        {/* Mobile: just the banner image above — no headline/copy/buttons below it. */}
        <div className="mt-10 hidden flex-col items-center text-center lg:flex lg:mx-auto lg:max-w-2xl">
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
    </section>
  )
}
