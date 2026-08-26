import Link from "next/link"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { Reveal } from "@/components/motion/reveal"
import { Magnetic } from "@/components/motion/magnetic"
import { Button } from "@/components/ui/button"
import { AuroraBackground } from "@/components/ui/aurora-background"
import { Eyebrow, Display, Body } from "@/components/ui/typography"
import { getSiteContent } from "@/lib/data/site-content.server"

export async function LimitedEdition() {
  const content = await getSiteContent("limited-edition")

  return (
    <Section className="bg-carbon overflow-hidden">
      <AuroraBackground className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10" size="120%" />
      <Container className="relative flex flex-col items-center text-center">
        <Reveal>
          <Eyebrow>{content.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <Display className="mt-4 italic">{content.headline}</Display>
        </Reveal>
        <Reveal delay={0.2}>
          <Body className="mt-6 max-w-md">{content.body}</Body>
        </Reveal>
        <Reveal delay={0.3}>
          <Magnetic className="mt-10">
            <Button
              render={<Link href={`/products/${content.productSlug}`} data-cursor="hover" />}
              nativeButton={false}
              variant="luxury-filled"
              size="xl"
            >
              {content.buttonLabel}
            </Button>
          </Magnetic>
        </Reveal>
      </Container>
    </Section>
  )
}
