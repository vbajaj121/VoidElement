"use client"

import Image from "next/image"
import Link from "next/link"
import { m } from "framer-motion"
import { Plus } from "lucide-react"
import { ProductArt } from "@/components/commerce/product-art"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Body, Caption } from "@/components/ui/typography"
import { gradientDataUri } from "@/lib/data/gradient"
import { formatPrice } from "@/lib/format"
import { defaultVariantSelection, getTotalStock, LOW_STOCK_THRESHOLD, type MockProduct } from "@/lib/data/products"
import { useCart } from "@/lib/store/cart"
import { toast } from "sonner"

export function ProductCard({ product }: { product: MockProduct }) {
  const addItem = useCart((s) => s.addItem)
  const totalStock = getTotalStock(product)
  const lowStock = totalStock !== undefined && totalStock > 0 && totalStock <= LOW_STOCK_THRESHOLD
  const soldOut = totalStock !== undefined && totalStock <= 0

  function handleQuickAdd() {
    const { color, size, variantId } = defaultVariantSelection(product)
    if (!variantId) {
      toast.error("That product isn't available.")
      return
    }
    addItem({
      variantId,
      slug: product.slug,
      title: product.title,
      price: product.price,
      color,
      size,
      colors: product.colors,
    })
  }

  return (
    <m.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <Link
        href={`/products/${product.slug}`}
        data-cursor="preview"
        data-cursor-preview={gradientDataUri(product.colors)}
        className="block"
      >
        <div className="relative aspect-4/5 overflow-hidden rounded-2xl">
          {product.images?.[0] ? (
            <Image
              src={product.images[0].url}
              alt={product.images[0].alt}
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <ProductArt
              colors={product.colors}
              className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-105"
            />
          )}
          <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
            {product.isLimited && <Badge variant="secondary">Limited</Badge>}
            {soldOut ? (
              <Badge variant="destructive">Sold Out</Badge>
            ) : (
              lowStock && <Badge variant="destructive">Only {totalStock} Left</Badge>
            )}
          </div>
        </div>
      </Link>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <Caption>{product.category}</Caption>
          <Body className="text-soft-white mt-1 font-medium">{product.title}</Body>
          <Body className="mt-1">{formatPrice(product.price, product.currency)}</Body>
        </div>

        <Button
          size="icon"
          variant="secondary"
          data-cursor="hover"
          aria-label={`Add ${product.title} to cart`}
          onClick={handleQuickAdd}
        >
          <Plus className="size-4" />
        </Button>
      </div>
    </m.div>
  )
}
