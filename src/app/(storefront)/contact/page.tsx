import type { Metadata } from "next"
import { Mail } from "lucide-react"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { Eyebrow, Display, Body } from "@/components/ui/typography"
import { getSiteContent } from "@/lib/data/site-content.server"

export const metadata: Metadata = { title: "Contact" }

export default async function ContactPage() {
  const content = await getSiteContent("page-contact")
  const email = content.contactEmail || "hello@voidelement.com"

  return (
    <main className="bg-background">
      <Section className="pt-40 pb-32 text-center">
        <Container className="mx-auto max-w-md">
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <Display as="h1" className="mt-4 text-5xl italic sm:text-6xl">
            {content.heading}
          </Display>
          <Body className="mt-6">{content.intro}</Body>
          <a
            href={`mailto:${email}`}
            data-cursor="hover"
            className="text-soft-white border-border mt-8 inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-medium transition-colors hover:border-soft-white/50"
          >
            <Mail className="size-4" strokeWidth={1.5} />
            {email}
          </a>
        </Container>
      </Section>
    </main>
  )
}
