import Link from "next/link"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger-group"
import { ProductArt } from "@/components/commerce/product-art"
import { Button } from "@/components/ui/button"
import { Eyebrow, Heading, Body, Subheading } from "@/components/ui/typography"
import { collections } from "@/lib/data/collections"
import { getSiteContent } from "@/lib/data/site-content.server"

export async function ExploreCollections() {
  const content = await getSiteContent("explore-collections")

  return (
    <Section id="explore-collections">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>{content.eyebrow}</Eyebrow>
            <Heading className="mt-4">{content.heading}</Heading>
          </div>
          <Button
            render={<Link href="/shop" data-cursor="hover" />}
            nativeButton={false}
            variant="luxury"
            size="xl"
          >
            {content.browseAllLabel}
          </Button>
        </div>

        <StaggerGroup className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {collections.map((c) => (
            <StaggerItem key={c.category}>
              <Link
                href={`/shop?category=${encodeURIComponent(c.category)}`}
                data-cursor="hover"
                className="group block"
              >
                <div className="relative aspect-3/4 overflow-hidden rounded-2xl">
                  <ProductArt
                    colors={c.colors}
                    className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="from-matte-black absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <Subheading className="text-base">{c.category}</Subheading>
                    <Body className="mt-0.5">
                      {c.count} {c.count === 1 ? "Product" : "Products"}
                    </Body>
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>
    </Section>
  )
}
