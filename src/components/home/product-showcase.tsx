import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger-group"
import { Eyebrow, Heading, Body } from "@/components/ui/typography"
import { ProductCard } from "@/components/commerce/product-card"
import { getProducts } from "@/lib/data/products.server"
import { getSiteContent } from "@/lib/data/site-content.server"

export async function ProductShowcase() {
  const [products, content] = await Promise.all([getProducts(), getSiteContent("product-showcase")])

  return (
    <Section>
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>{content.eyebrow}</Eyebrow>
            <Heading className="mt-4">{content.heading}</Heading>
          </div>
          <Body className="max-w-xs">{content.hint}</Body>
        </div>

        <StaggerGroup className="mt-14 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-3">
          {products.map((product) => (
            <StaggerItem key={product.slug}>
              <ProductCard product={product} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>
    </Section>
  )
}
