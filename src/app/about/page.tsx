import type { Metadata } from "next"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger-group"
import { Eyebrow, Display, Subheading, Body } from "@/components/ui/typography"
import { getSiteContent } from "@/lib/data/site-content.server"

export const metadata: Metadata = { title: "About" }

export default async function AboutPage() {
  const content = await getSiteContent("page-about")

  return (
    <main className="bg-background">
      <Section className="pt-40">
        <Container className="max-w-2xl">
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <Display as="h1" className="mt-4 text-5xl italic sm:text-6xl">
            {content.heading}
          </Display>
          <Body className="mt-6 max-w-lg text-base">{content.intro}</Body>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <StaggerGroup className="grid gap-10 sm:grid-cols-3">
            {content.blocks.map((v) => (
              <StaggerItem key={v.title}>
                <Subheading className="text-lg">{v.title}</Subheading>
                <Body className="mt-3">{v.body}</Body>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </Section>
    </main>
  )
}
