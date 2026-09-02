import type { Metadata } from "next"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger-group"
import { ProductCard } from "@/components/commerce/product-card"
import { Eyebrow, Heading } from "@/components/ui/typography"
import { getProducts } from "@/lib/data/products.server"

export const metadata: Metadata = { title: "Shop" }

export default async function ShopPage() {
  const products = await getProducts()

  return (
    <main className="bg-background">
      <Section className="pt-32">
        <Container>
          <Eyebrow>Shop</Eyebrow>
          <Heading className="mt-4">All Products</Heading>

          <StaggerGroup className="mt-12 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-3">
            {products.map((product) => (
              <StaggerItem key={product.slug}>
                <ProductCard product={product} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </Section>
    </main>
  )
}
