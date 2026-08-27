import type { Metadata } from "next"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger-group"
import { ProductCard } from "@/components/commerce/product-card"
import { ShopFilters } from "@/components/shop/shop-filters"
import { Eyebrow, Heading } from "@/components/ui/typography"
import { getProducts } from "@/lib/data/products.server"

export const metadata: Metadata = { title: "Shop" }

interface ShopPageProps {
  searchParams: Promise<{ category?: string }>
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { category } = await searchParams
  const products = await getProducts()
  const filtered = category ? products.filter((p) => p.category === category) : products

  return (
    <main className="bg-background">
      <Section className="pt-32">
        <Container>
          <Eyebrow>Shop</Eyebrow>
          <Heading className="mt-4">{category ?? "All Products"}</Heading>

          <ShopFilters activeCategory={category} />

          <StaggerGroup className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product) => (
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
