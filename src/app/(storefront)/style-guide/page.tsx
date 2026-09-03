import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { AuroraBackground } from "@/components/ui/aurora-background"
import { GlassPanel } from "@/components/ui/glass-panel"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Eyebrow,
  Display,
  Heading,
  Subheading,
  Lead,
  Body,
  Caption,
} from "@/components/ui/typography"
import { Reveal } from "@/components/motion/reveal"
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger-group"
import { Magnetic } from "@/components/motion/magnetic"

const swatches = [
  { name: "Matte Black", cls: "bg-matte-black" },
  { name: "Carbon", cls: "bg-carbon" },
  { name: "Titanium", cls: "bg-titanium" },
  { name: "Soft White", cls: "bg-soft-white" },
  { name: "Warm Grey", cls: "bg-warm-grey" },
  { name: "Champagne", cls: "bg-accent-champagne" },
  { name: "Aurora A", cls: "bg-aurora-a" },
  { name: "Aurora B", cls: "bg-aurora-b" },
  { name: "Aurora C", cls: "bg-aurora-c" },
]

export default function StyleGuidePage() {
  return (
    <main className="bg-background">
      <Section className="overflow-hidden pt-40">
        <AuroraBackground className="-top-1/3 left-1/2 -translate-x-1/2 opacity-[0.12]" />
        <Container className="relative">
          <Eyebrow>Internal — Phase 2</Eyebrow>
          <Display className="mt-4">Design System</Display>
          <Lead className="mt-6 max-w-xl">
            Every token, type style, and surface the storefront is built from — one page,
            so drift is visible before it ships.
          </Lead>
        </Container>
      </Section>

      <Section>
        <Container>
          <Heading>Color</Heading>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {swatches.map((s) => (
              <div key={s.name}>
                <div className={`h-24 rounded-xl border border-border ${s.cls}`} />
                <Caption className="mt-2 block">{s.name}</Caption>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Heading>Typography</Heading>
          <div className="mt-10 flex flex-col gap-8">
            <div>
              <Caption>Eyebrow</Caption>
              <Eyebrow className="mt-2">FW25 Collection — Drop 002</Eyebrow>
            </div>
            <div>
              <Caption>Display</Caption>
              <Display className="mt-2">Some things aren&apos;t meant to stay hidden.</Display>
            </div>
            <div>
              <Caption>Heading</Caption>
              <Heading className="mt-2">Our Craft</Heading>
            </div>
            <div>
              <Caption>Subheading</Caption>
              <Subheading className="mt-2">Cut in small batches, never restocked.</Subheading>
            </div>
            <div>
              <Caption>Lead</Caption>
              <Lead className="mt-2 max-w-lg">
                Move your cursor across the void. Premium streetwear, revealed one layer at a
                time.
              </Lead>
            </div>
            <div>
              <Caption>Body</Caption>
              <Body className="mt-2 max-w-lg">
                Heavyweight cotton, reinforced seams, and prints built to outlast the
                season.
              </Body>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Heading>Buttons</Heading>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button variant="luxury-filled" size="xl">
              Shop The Drop
            </Button>
            <Button variant="luxury" size="xl">
              View Lookbook
            </Button>
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Heading>Surfaces</Heading>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <GlassPanel className="p-6">
              <Subheading>Glass panel</Subheading>
              <Body className="mt-2">
                Frosted carbon, hairline border — used for floating UI over imagery and video.
              </Body>
            </GlassPanel>

            <Card>
              <CardHeader>
                <Subheading>shadcn Card</Subheading>
              </CardHeader>
              <CardContent>
                <Body>Standard content surface for product grids and dashboards.</Body>
              </CardContent>
            </Card>

            <div className="relative overflow-hidden rounded-2xl border border-border p-6">
              <AuroraBackground size="140%" className="-top-1/2 left-1/2 -translate-x-1/2 opacity-20" />
              <Subheading className="relative">Aurora accent</Subheading>
              <Body className="relative mt-2">
                Very subtle premium gradient, reserved for hero and section transitions.
              </Body>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Heading>Badges</Heading>
          <div className="mt-10 flex flex-wrap gap-3">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Limited Edition</Badge>
            <Badge variant="destructive">Sold Out</Badge>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Heading>Motion</Heading>
          <Body className="mt-2 max-w-lg">
            Scroll to trigger the reveals below. Hover the tiles to feel the custom cursor
            expand, read a label, and preview an image — and hover the pill buttons to feel
            the magnetic pull.
          </Body>

          <Reveal className="mt-10">
            <Subheading>Reveal (Framer Motion, one-shot on scroll)</Subheading>
          </Reveal>

          <StaggerGroup className="mt-6 grid gap-4 sm:grid-cols-3">
            <StaggerItem>
              <div
                data-cursor="hover"
                className="border-border flex h-32 items-center justify-center rounded-xl border"
              >
                <Caption>data-cursor=&quot;hover&quot;</Caption>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div
                data-cursor="text"
                data-cursor-label="View"
                className="border-border flex h-32 items-center justify-center rounded-xl border"
              >
                <Caption>data-cursor=&quot;text&quot;</Caption>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div
                data-cursor="preview"
                data-cursor-preview="/next.svg"
                className="border-border flex h-32 items-center justify-center rounded-xl border"
              >
                <Caption>data-cursor=&quot;preview&quot;</Caption>
              </div>
            </StaggerItem>
          </StaggerGroup>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Magnetic>
              <Button variant="luxury-filled" size="xl">
                Magnetic Button
              </Button>
            </Magnetic>
            <Magnetic strength={0.5}>
              <Button variant="luxury" size="xl">
                Stronger Pull
              </Button>
            </Magnetic>
          </div>
        </Container>
      </Section>
    </main>
  )
}
