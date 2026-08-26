import type { Metadata } from "next"
import Link from "next/link"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { Eyebrow, Display, Subheading, Body } from "@/components/ui/typography"
import { getSiteContent } from "@/lib/data/site-content.server"

export const metadata: Metadata = { title: "Returns" }

export default async function ReturnsPage() {
  const content = await getSiteContent("page-returns")

  return (
    <main className="bg-background">
      <Section className="pt-40">
        <Container className="max-w-2xl">
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <Display as="h1" className="mt-4 text-5xl italic sm:text-6xl">
            {content.heading}
          </Display>

          <div className="mt-14 space-y-10">
            {content.blocks.map((item) => (
              <div key={item.title}>
                <Subheading className="text-lg">{item.title}</Subheading>
                <Body className="mt-3 max-w-lg">{item.body}</Body>
              </div>
            ))}
          </div>

          <Link
            href="/contact"
            data-cursor="hover"
            className="text-soft-white border-border mt-14 inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-medium transition-colors hover:border-soft-white/50"
          >
            Contact Support
          </Link>
        </Container>
      </Section>
    </main>
  )
}
