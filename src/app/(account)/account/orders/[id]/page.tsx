import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { auth } from "@/lib/auth/auth"
import { prisma } from "@/lib/db/prisma"
import { GlassPanel } from "@/components/ui/glass-panel"
import { Badge } from "@/components/ui/badge"
import { ProductArt } from "@/components/commerce/product-art"
import { Heading, Body, Caption, Subheading } from "@/components/ui/typography"
import { formatPrice } from "@/lib/format"

export const metadata: Metadata = { title: "Order details" }

interface OrderDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params
  const session = await auth()

  const order = await prisma.order.findFirst({
    where: { id, userId: session!.user.id },
    include: {
      items: { include: { variant: { include: { product: true } } } },
      address: true,
    },
  })
  if (!order) notFound()

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <Heading>Order #{order.id.slice(-8)}</Heading>
          <Badge variant="secondary">{order.status.replace("_", " ")}</Badge>
        </div>
        <Caption className="mt-2 block">
          Placed {new Date(order.createdAt).toLocaleDateString()}
        </Caption>

        {order.trackingUrl && (
          <a
            href={order.trackingUrl}
            target="_blank"
            rel="noreferrer"
            data-cursor="hover"
            className="text-accent-champagne mt-4 inline-block text-sm underline"
          >
            Track shipment →
          </a>
        )}

        <div className="mt-8 space-y-5">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4">
              <ProductArt
                colors={item.variant.colors as unknown as [string, string]}
                className="h-20 w-16 shrink-0 rounded-lg"
              />
              <div>
                <Body className="text-soft-white">{item.variant.product.title}</Body>
                <Caption className="mt-1">
                  {item.variant.color} · {item.variant.size} · Qty {item.quantity}
                </Caption>
                <Body className="mt-1">{formatPrice(item.unitPrice * item.quantity, order.currency)}</Body>
              </div>
            </div>
          ))}
        </div>
      </div>

      <GlassPanel className="h-fit p-6">
        <Subheading className="text-lg">Summary</Subheading>
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between">
            <Caption>Subtotal</Caption>
            <Caption>{formatPrice(order.subtotal, order.currency)}</Caption>
          </div>
          <div className="flex items-center justify-between">
            <Caption>Shipping</Caption>
            <Caption>{formatPrice(order.shippingCost, order.currency)}</Caption>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <Body className="text-soft-white font-medium">Total</Body>
            <Body className="text-soft-white font-medium">{formatPrice(order.total, order.currency)}</Body>
          </div>
        </div>

        {order.address && (
          <div className="border-border mt-6 border-t pt-4">
            <Caption>Shipping to</Caption>
            <Body className="mt-2 text-sm">
              {order.address.fullName}
              <br />
              {order.address.line1}
              {order.address.line2 && <>, {order.address.line2}</>}
              <br />
              {order.address.city}, {order.address.state} {order.address.postalCode}
              <br />
              {order.address.country}
            </Body>
          </div>
        )}
      </GlassPanel>
    </div>
  )
}
