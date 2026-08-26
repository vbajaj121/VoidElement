"use client"

import Link from "next/link"
import { Minus, Plus, ShoppingBag, X } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ProductArt } from "@/components/commerce/product-art"
import { Body, Caption, Subheading } from "@/components/ui/typography"
import { formatPrice } from "@/lib/format"
import { cartSubtotal, useCart } from "@/lib/store/cart"

export function CartDrawer() {
  const { lines, isOpen, close, incrementQuantity, decrementQuantity, removeItem } = useCart()
  const subtotal = cartSubtotal(lines)

  return (
    <Sheet open={isOpen} onOpenChange={(v) => (v ? undefined : close())}>
      <SheetContent side="right" className="glass w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-serif text-2xl">Your Bag</SheetTitle>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingBag className="text-warm-grey size-8" strokeWidth={1.25} />
            <Body>Your bag is empty.</Body>
          </div>
        ) : (
          <div className="flex-1 space-y-6 overflow-y-auto px-6">
            {lines.map((line) => (
              <div key={line.variantId} className="flex gap-4">
                <ProductArt colors={line.colors} className="h-20 w-16 shrink-0 rounded-lg" />
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <Subheading className="text-sm">{line.title}</Subheading>
                    <button
                      type="button"
                      data-cursor="hover"
                      aria-label={`Remove ${line.title}`}
                      onClick={() => removeItem(line.variantId)}
                      className="text-warm-grey hover:text-soft-white shrink-0"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                  <Caption className="mt-1">
                    {line.color} · {line.size} · {formatPrice(line.price)}
                  </Caption>
                  <div className="mt-auto flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      data-cursor="hover"
                      aria-label="Decrease quantity"
                      onClick={() => decrementQuantity(line.variantId)}
                      className="border-border hover:bg-muted flex size-6 items-center justify-center rounded-full border"
                    >
                      <Minus className="size-3" />
                    </button>
                    <Caption className="text-soft-white w-4 text-center">{line.quantity}</Caption>
                    <button
                      type="button"
                      data-cursor="hover"
                      aria-label="Increase quantity"
                      onClick={() => incrementQuantity(line.variantId)}
                      className="border-border hover:bg-muted flex size-6 items-center justify-center rounded-full border"
                    >
                      <Plus className="size-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {lines.length > 0 && (
          <SheetFooter>
            <div className="mb-3 flex items-center justify-between">
              <Body className="text-soft-white">Subtotal</Body>
              <Body className="text-soft-white font-medium">{formatPrice(subtotal)}</Body>
            </div>
            <Button
              render={<Link href="/checkout" onClick={close} data-cursor="hover" />}
              nativeButton={false}
              variant="luxury-filled"
              size="xl"
              className="w-full"
            >
              Checkout
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
