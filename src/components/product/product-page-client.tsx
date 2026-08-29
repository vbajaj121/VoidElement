"use client"

import { useRef, useState } from "react"
import { Container } from "@/components/layout/container"
import { Gallery } from "@/components/product/gallery"
import { PurchasePanel } from "@/components/product/purchase-panel"
import type { MockProduct } from "@/lib/data/products"

export function ProductPageClient({ product }: { product: MockProduct }) {
  const [variant, setVariant] = useState(product.variants[0])
  const [face, setFace] = useState<"front" | "back">("front")
  const artRef = useRef<HTMLDivElement>(null)

  return (
    <Container className="grid gap-12 lg:grid-cols-2 lg:gap-16">
      <Gallery
        artRef={artRef}
        variant={variant}
        face={face}
        onFaceChange={setFace}
        isLimited={product.isLimited}
        images={product.images}
      />
      <PurchasePanel
        product={product}
        variant={variant}
        onVariantChange={setVariant}
        artRef={artRef}
      />
    </Container>
  )
}
