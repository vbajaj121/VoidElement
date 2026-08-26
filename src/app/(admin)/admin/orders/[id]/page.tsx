import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/db/prisma"
import { GlassPanel } from "@/components/ui/glass-panel"
import { Heading, Body, Caption } from "@/components/ui/typography"
import { formatPrice } from "@/lib/format"
import { OrderStatusForm } from "./order-status-form"

export const metadata: Metadata = { title: "Order · Admin" }

interface AdminOrderDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  const { id } = await params
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      address: true,
      items: { include: { variant: { include: { product: true } } } },
    },
  })
  if (!order) notFound()

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
      <div>
        <Heading>Order #{order.id.slice(-8)}</Heading>
        <Caption className="mt-2 block">{order.user.email}</Caption>

        <div className="mt-8 space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4">
              <div>
                <Body className="text-soft-white">{item.variant.product.title}</Body>
                <Caption className="mt-1">
                  {item.variant.color} · {item.variant.size} · Qty {item.quantity}
                </Caption>
              </div>
              <Body>{formatPrice(item.unitPrice * item.quantity, order.currency)}</Body>
            </div>
          ))}
        </div>

        {order.address && (
          <GlassPanel className="mt-8 p-5">
            <Caption>Shipping to</Caption>
            <Body className="mt-2 text-sm">
              {order.address.fullName}, {order.address.line1}
              {order.address.line2 && `, ${order.address.line2}`}, {order.address.city},{" "}
              {order.address.state} {order.address.postalCode}, {order.address.country}
            </Body>
          </GlassPanel>
        )}
      </div>

      <GlassPanel className="h-fit p-6">
        <Caption>Total</Caption>
        <Body className="text-soft-white mt-1 text-xl font-medium">
          {formatPrice(order.total, order.currency)}
        </Body>

        <div className="border-border mt-6 border-t pt-6">
          <OrderStatusForm
            orderId={order.id}
            status={order.status}
            providerName={order.providerName}
            providerOrderId={order.providerOrderId}
            trackingUrl={order.trackingUrl}
          />
        </div>
      </GlassPanel>
    </div>
  )
}
