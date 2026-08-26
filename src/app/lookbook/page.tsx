import type { Metadata } from "next"
import Link from "next/link"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger-group"
import { ProductArt } from "@/components/commerce/product-art"
import { Eyebrow, Display, Body, Subheading } from "@/components/ui/typography"
import { getProducts } from "@/lib/data/products.server"
import { getSiteContent } from "@/lib/data/site-content.server"

export const metadata: Metadata = { title: "Lookbook" }

export default async function LookbookPage() {
  const [products, content] = await Promise.all([getProducts(), getSiteContent("page-lookbook")])

  return (
    <main className="bg-background">
      <Section className="pt-40">
        <Container>
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <Display as="h1" className="mt-4 text-5xl italic sm:text-6xl">
            {content.heading}
          </Display>
          <Body className="mt-4 max-w-md">{content.intro}</Body>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <StaggerGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <StaggerItem key={product.slug}>
                <Link href={`/products/${product.slug}`} data-cursor="hover" className="group block">
                  <div className="relative aspect-4/5 overflow-hidden rounded-2xl">
                    <ProductArt
                      colors={product.colors}
                      className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                  <Subheading className="mt-4 text-base">{product.title}</Subheading>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </Section>
    </main>
  )
}
