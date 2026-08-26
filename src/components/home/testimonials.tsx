import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger-group"
import { GlassPanel } from "@/components/ui/glass-panel"
import { Eyebrow, Heading, Body, Caption } from "@/components/ui/typography"
import { getSiteContent } from "@/lib/data/site-content.server"

export async function Testimonials() {
  const content = await getSiteContent("testimonials")

  return (
    <Section>
      <Container>
        <Eyebrow>{content.eyebrow}</Eyebrow>
        <Heading className="mt-4">{content.heading}</Heading>

        <StaggerGroup className="mt-14 grid gap-6 lg:grid-cols-3">
          {content.items.map((t, i) => (
            <StaggerItem key={i}>
              <GlassPanel className="flex h-full flex-col justify-between p-6">
                <Body className="text-soft-white">&ldquo;{t.quote}&rdquo;</Body>
                <Caption className="mt-6">
                  {t.name} — {t.role}
                </Caption>
              </GlassPanel>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>
    </Section>
  )
}
