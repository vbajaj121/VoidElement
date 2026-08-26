import { ProductArt } from "@/components/commerce/product-art"
import { GlassPanel } from "@/components/ui/glass-panel"
import { Body, Caption, Subheading } from "@/components/ui/typography"
import { formatPrice } from "@/lib/format"
import { cartSubtotal, type CartLine } from "@/lib/store/cart"

export function OrderSummary({ lines }: { lines: CartLine[] }) {
  const subtotal = cartSubtotal(lines)

  return (
    <GlassPanel className="p-6 lg:sticky lg:top-28">
      <Subheading className="text-lg">Order Summary</Subheading>

      <div className="mt-6 space-y-5">
        {lines.map((line) => (
          <div key={line.variantId} className="flex gap-4">
            <ProductArt colors={line.colors} className="h-16 w-13 shrink-0 rounded-lg" />
            <div className="flex flex-1 flex-col">
              <Body className="text-soft-white text-sm">{line.title}</Body>
              <Caption className="mt-1">
                {line.color} · {line.size} · Qty {line.quantity} · {formatPrice(line.price)}
              </Caption>
            </div>
            <Body className="text-soft-white text-sm">
              {formatPrice(line.price * line.quantity)}
            </Body>
          </div>
        ))}
      </div>

      <div className="border-border mt-6 space-y-2 border-t pt-4">
        <div className="flex items-center justify-between">
          <Caption>Subtotal</Caption>
          <Caption>{formatPrice(subtotal)}</Caption>
        </div>
        <div className="flex items-center justify-between">
          <Caption>Shipping</Caption>
          <Caption>Calculated at production</Caption>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <Body className="text-soft-white font-medium">Total</Body>
          <Body className="text-soft-white font-medium">{formatPrice(subtotal)}</Body>
        </div>
      </div>
    </GlassPanel>
  )
}
