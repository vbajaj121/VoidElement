"use client"

import { Plus } from "lucide-react"
import { ProductArt } from "@/components/commerce/product-art"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { Button } from "@/components/ui/button"
import { Eyebrow, Heading, Body, Caption } from "@/components/ui/typography"
import { formatPrice } from "@/lib/format"
import { useCart } from "@/lib/store/cart"
import { defaultVariantSelection, type MockProduct } from "@/lib/data/products"
import { toast } from "sonner"

export function FrequentlyBoughtTogether({
  current,
  products,
}: {
  current: MockProduct
  products: MockProduct[]
}) {
  const addItem = useCart((s) => s.addItem)
  const companions = products.filter((p) => p.slug !== current.slug).slice(0, 2)
  const bundle = [current, ...companions]
  const total = bundle.reduce((sum, p) => sum + p.price, 0)

  function handleAddAll() {
    for (const p of bundle) {
      const { color, size, variantId } = defaultVariantSelection(p)
      if (!variantId) {
        toast.error(`${p.title} isn't available.`)
        continue
      }
      addItem({ variantId, slug: p.slug, title: p.title, price: p.price, color, size, colors: p.colors })
    }
  }

  return (
    <Section className="pt-0">
      <Container>
        <Eyebrow>Frequently Bought Together</Eyebrow>
        <Heading className="mt-4">Complete the fit.</Heading>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          {bundle.map((p, i) => (
            <div key={p.slug} className="flex items-center gap-4">
              <div className="w-28">
                <ProductArt colors={p.colors} className="aspect-square rounded-xl" />
                <Caption className="mt-2 block truncate">{p.title}</Caption>
              </div>
              {i < bundle.length - 1 && <Plus className="text-warm-grey size-4 shrink-0" />}
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center gap-6">
          <Body className="text-soft-white text-lg font-medium">{formatPrice(total)}</Body>
          <Button
            variant="luxury-filled"
            size="xl"
            data-cursor="hover"
            onClick={handleAddAll}
          >
            Add All Three
          </Button>
        </div>
      </Container>
    </Section>
  )
}
