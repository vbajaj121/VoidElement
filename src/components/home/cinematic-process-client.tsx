"use client"

import { Container } from "@/components/layout/container"
import { ProcessCarousel } from "@/components/home/process-carousel"
import { ProcessSplitScroll } from "@/components/home/process-split-scroll"
import { Eyebrow, Heading } from "@/components/ui/typography"
import type { ProcessContent } from "@/lib/validation/site-content"

/**
 * Two entirely different treatments below vs. at `lg` — a swipe carousel on
 * mobile/tablet (space-efficient, touch-native), a sticky split-screen
 * scroll on desktop (more screen to spend, precise scroll/hover instead of
 * touch). Both are rendered and switched via CSS (`lg:hidden`/`hidden
 * lg:block`) rather than a JS breakpoint check, so there's no flash of the
 * wrong layout on first paint while a media-query effect settles.
 */
export function CinematicProcessClient({ content }: { content: ProcessContent }) {
  return (
    <div className="bg-background relative w-full py-24">
      <Container>
        <Eyebrow>{content.eyebrow}</Eyebrow>
        <Heading className="mt-4 max-w-lg">{content.heading}</Heading>
      </Container>

      {/* overflow-hidden scoped to just the carousel (clips the filmstrip's
          full-bleed peek) rather than the whole section — at the top level
          it silently breaks `position: sticky` for any descendant, which is
          exactly what ProcessSplitScroll relies on below. */}
      <div className="mt-12 overflow-hidden lg:hidden">
        <ProcessCarousel steps={content.steps} />
      </div>

      <div className="mt-16 hidden lg:block">
        <Container>
          <ProcessSplitScroll steps={content.steps} />
        </Container>
      </div>
    </div>
  )
}
