import type { Metadata } from "next"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { Eyebrow, Display, Subheading, Body } from "@/components/ui/typography"
import { getSiteContent } from "@/lib/data/site-content.server"

export const metadata: Metadata = { title: "Terms of Service" }

export default async function TermsPage() {
  const content = await getSiteContent("page-terms")

  return (
    <main className="bg-background">
      <Section className="pt-40">
        <Container className="max-w-2xl">
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <Display as="h1" className="mt-4 text-5xl italic sm:text-6xl">
            {content.heading}
          </Display>
          <Body className="mt-6 max-w-lg text-base">{content.intro}</Body>

          <div className="mt-14 space-y-10">
            {content.blocks.map((item) => (
              <div key={item.title}>
                <Subheading className="text-lg">{item.title}</Subheading>
                <Body className="mt-3 max-w-lg">{item.body}</Body>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </main>
  )
}
