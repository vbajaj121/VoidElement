"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Check, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Magnetic } from "@/components/motion/magnetic"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Eyebrow, Heading, Body, Caption } from "@/components/ui/typography"
import { formatPrice } from "@/lib/format"
import { flyToCart } from "@/lib/motion/fly-to-cart"
import { useCart } from "@/lib/store/cart"
import { variantKey, LOW_STOCK_THRESHOLD, type MockProduct, type ProductVariant } from "@/lib/data/products"
import { cn } from "@/lib/utils"

interface PurchasePanelProps {
  product: MockProduct
  variant: ProductVariant
  onVariantChange: (variant: ProductVariant) => void
  artRef: React.RefObject<HTMLDivElement | null>
}

export function PurchasePanel({ product, variant, onVariantChange, artRef }: PurchasePanelProps) {
  const [size, setSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const addItem = useCart((s) => s.addItem)

  const stock = size ? product.stockByVariantKey?.[variantKey(variant.color, size)] : undefined
  const soldOut = stock !== undefined && stock <= 0

  function handleAddToCart() {
    if (!size) {
      toast.error("Select a size first.")
      return
    }
    const variantId = product.variantIds?.[variantKey(variant.color, size)]
    if (!variantId) {
      toast.error("That combination isn't available.")
      return
    }
    if (soldOut) {
      toast.error("That size just sold out.")
      return
    }
    if (artRef.current) flyToCart(artRef.current, variant.colors)

    addItem(
      {
        variantId,
        slug: product.slug,
        title: product.title,
        price: product.price,
        color: variant.color,
        size,
        colors: variant.colors,
      },
      quantity
    )

    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
  }

  return (
    <div className="lg:sticky lg:top-28">
      <Eyebrow>{product.category}</Eyebrow>
      <Heading as="h1" className="mt-3 text-3xl sm:text-4xl">
        {product.title}
      </Heading>
      <Body className="text-soft-white mt-3 text-lg">
        {formatPrice(product.price, product.currency)}
      </Body>

      {product.variants.length > 1 && (
        <div className="mt-8">
          <Caption className="block">Color — {variant.color}</Caption>
          <div className="mt-3 flex gap-3">
            {product.variants.map((v) => (
              <button
                key={v.color}
                type="button"
                data-cursor="hover"
                data-cursor-label={v.color}
                aria-label={v.color}
                aria-pressed={v.color === variant.color}
                onClick={() => onVariantChange(v)}
                className={cn(
                  "size-8 rounded-full border-2 transition-transform",
                  v.color === variant.color
                    ? "border-accent-champagne scale-110"
                    : "border-transparent hover:scale-105"
                )}
                style={{ backgroundColor: v.swatch }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <Caption className="block">Size</Caption>
        <div className="mt-3 flex flex-wrap gap-2">
          {product.sizes.map((s) => (
            <button
              key={s}
              type="button"
              data-cursor="hover"
              onClick={() => setSize(s)}
              className={cn(
                "border-border hover:border-soft-white/50 flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-xs font-medium transition-colors",
                size === s && "border-accent-champagne bg-accent-champagne/10 text-soft-white"
              )}
            >
              {s}
            </button>
          ))}
        </div>
        {stock !== undefined && stock > 0 && stock <= LOW_STOCK_THRESHOLD && (
          <Caption className="mt-2 block text-destructive">
            Only {stock} left in {variant.color} / {size}
          </Caption>
        )}
        {soldOut && (
          <Caption className="mt-2 block text-destructive">
            {variant.color} / {size} just sold out
          </Caption>
        )}
      </div>

      <div className="mt-8 flex items-center gap-4">
        <Caption>Quantity</Caption>
        <div className="border-border flex items-center gap-4 rounded-full border px-3 py-1.5">
          <button
            type="button"
            data-cursor="hover"
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            <Minus className="size-3.5" />
          </button>
          <Caption className="text-soft-white w-4 text-center">{quantity}</Caption>
          <button
            type="button"
            data-cursor="hover"
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => q + 1)}
          >
            <Plus className="size-3.5" />
          </button>
        </div>
      </div>

      <Magnetic className="mt-8 block w-full">
        <Button
          size="xl"
          variant="luxury-filled"
          className="w-full"
          onClick={handleAddToCart}
          disabled={soldOut}
        >
          {added ? (
            <>
              <Check className="size-4" /> Added
            </>
          ) : soldOut ? (
            "Sold Out"
          ) : (
            "Add To Cart"
          )}
        </Button>
      </Magnetic>

      <Accordion className="mt-10">
        <AccordionItem value="description">
          <AccordionTrigger>Description</AccordionTrigger>
          <AccordionContent>{product.description}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="shipping">
          <AccordionTrigger>Shipping &amp; Returns</AccordionTrigger>
          <AccordionContent>
            Ships in 5–7 business days. Sizing exchanges are accepted within 14 days of
            delivery — since each run is limited, exchanges are subject to availability.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
