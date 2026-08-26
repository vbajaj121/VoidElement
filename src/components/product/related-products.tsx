"use client"

import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger-group"
import { ProductCard } from "@/components/commerce/product-card"
import { Eyebrow, Heading } from "@/components/ui/typography"
import { useRecentlyViewed } from "@/hooks/use-recently-viewed"
import type { MockProduct } from "@/lib/data/products"

export function RelatedProducts({
  currentSlug,
  category,
  products,
}: {
  currentSlug: string
  category: string
  products: MockProduct[]
}) {
  const recentSlugs = useRecentlyViewed(currentSlug)
  const recentProducts = recentSlugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is MockProduct => Boolean(p))

  const recommended = [...products]
    .filter((p) => p.slug !== currentSlug)
    .sort((a, b) => Number(b.category === category) - Number(a.category === category))
    .slice(0, 3)

  return (
    <>
      <Section>
        <Container>
          <Eyebrow>Recommended</Eyebrow>
          <Heading className="mt-4">You might also like</Heading>
          <StaggerGroup className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {recommended.map((p) => (
              <StaggerItem key={p.slug}>
                <ProductCard product={p} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </Section>

      {recentProducts.length > 0 && (
        <Section className="pt-0">
          <Container>
            <Eyebrow>Recently Viewed</Eyebrow>
            <StaggerGroup className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-4">
              {recentProducts.map((p) => (
                <StaggerItem key={p.slug}>
                  <ProductCard product={p} />
                </StaggerItem>
              ))}
            </StaggerGroup>
          </Container>
        </Section>
      )}
    </>
  )
}
