import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { Eyebrow, Heading, Body } from "@/components/ui/typography"
import { DropReveal } from "@/components/home/drop-reveal"
import { getProducts } from "@/lib/data/products.server"
import { getSiteContent } from "@/lib/data/site-content.server"

export async function ProductShowcase() {
  const [products, content, dropIntro] = await Promise.all([
    getProducts(),
    getSiteContent("product-showcase"),
    getSiteContent("drop-intro"),
  ])

  return (
    <Section id="the-drop">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>{content.eyebrow}</Eyebrow>
            <Heading className="mt-4">{content.heading}</Heading>
          </div>
          <Body className="max-w-xs">{content.hint}</Body>
        </div>

        <DropReveal
          dropId={dropIntro.dropId}
          enabled={dropIntro.enabled}
          products={products}
          gridClassName="mt-14 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-3"
        />
      </Container>
    </Section>
  )
}
