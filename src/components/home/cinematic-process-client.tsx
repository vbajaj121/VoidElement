import { Container } from "@/components/layout/container"
import { Reveal } from "@/components/motion/reveal"
import { ProcessStepArt } from "@/components/home/process-step-art"
import { PROCESS_FALLBACK_GRADIENTS } from "@/components/home/process-fallback-gradients"
import { Eyebrow, Heading, Subheading, Caption } from "@/components/ui/typography"
import { cn } from "@/lib/utils"
import type { ProcessContent } from "@/lib/validation/site-content"

/**
 * A bento grid — all 5 steps visible at once, no scroll-driven reveal or
 * swipe interaction needed. The first step gets a larger 2x2 tile (a
 * "feature" card), the rest fill in as 1x1 tiles alongside it — same
 * layout on mobile (stacked 2-up) and desktop (4 columns), just reflowing.
 */
export function CinematicProcessClient({ content }: { content: ProcessContent }) {
  return (
    <div className="bg-background w-full py-24">
      <Container>
        <Eyebrow>{content.eyebrow}</Eyebrow>
        <Heading className="mt-4 max-w-lg">{content.heading}</Heading>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 lg:auto-rows-[14rem]">
          {content.steps.map((step, i) => (
            <Reveal
              key={step.number}
              delay={i * 0.05}
              className={cn(
                "group relative overflow-hidden rounded-2xl",
                i === 0 ? "col-span-2 aspect-square lg:aspect-auto lg:row-span-2" : "aspect-square lg:aspect-auto"
              )}
            >
              <ProcessStepArt
                colors={PROCESS_FALLBACK_GRADIENTS[i % PROCESS_FALLBACK_GRADIENTS.length]}
                image={step.imageUrl}
                sizes={i === 0 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
              />
              <div className="from-matte-black/90 pointer-events-none absolute inset-0 bg-gradient-to-t via-transparent to-transparent transition-opacity group-hover:from-matte-black/95" />

              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                <Caption className="text-accent-champagne block">{step.number}</Caption>
                {i === 0 ? (
                  <Subheading className="text-soft-white mt-1 text-lg sm:text-xl">{step.title}</Subheading>
                ) : (
                  <Subheading className="text-soft-white mt-1 text-sm sm:text-base">{step.title}</Subheading>
                )}
                <Caption
                  className={cn(
                    "mt-1.5 block",
                    i === 0 ? "line-clamp-3 sm:line-clamp-2" : "line-clamp-2"
                  )}
                >
                  {step.description}
                </Caption>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </div>
  )
}
