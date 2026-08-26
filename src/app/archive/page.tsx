import type { Metadata } from "next"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { Eyebrow, Display, Body } from "@/components/ui/typography"
import { getSiteContent } from "@/lib/data/site-content.server"

export const metadata: Metadata = { title: "Archive" }

export default async function ArchivePage() {
  const content = await getSiteContent("page-archive")

  return (
    <main className="bg-background">
      <Section className="pt-40 pb-32 text-center">
        <Container className="mx-auto max-w-md">
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <Display as="h1" className="mt-4 text-5xl italic sm:text-6xl">
            {content.heading}
          </Display>
          <Body className="mt-6">{content.intro}</Body>
        </Container>
      </Section>
    </main>
  )
}
