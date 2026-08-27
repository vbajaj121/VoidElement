import type { Metadata } from "next"
import Link from "next/link"
import { auth } from "@/lib/auth/auth"
import { prisma } from "@/lib/db/prisma"
import { GlassPanel } from "@/components/ui/glass-panel"
import { Badge } from "@/components/ui/badge"
import { Heading, Body, Caption } from "@/components/ui/typography"
import { formatPrice } from "@/lib/format"

export const metadata: Metadata = { title: "Orders" }

export default async function OrdersPage() {
  const session = await auth()
  const orders = await prisma.order.findMany({
    where: { userId: session!.user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <Heading>Your Orders</Heading>

      {orders.length === 0 ? (
        <Body className="mt-6">No orders yet.</Body>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <Link key={order.id} href={`/account/orders/${order.id}`} data-cursor="hover">
              <GlassPanel className="flex items-center justify-between gap-4 p-6 transition-colors hover:bg-white/5">
                <div>
                  <Body className="text-soft-white">Order #{order.id.slice(-8)}</Body>
                  <Caption className="mt-1">
                    {order.items.length} item{order.items.length === 1 ? "" : "s"} ·{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </Caption>
                </div>
                <div className="flex items-center gap-4">
                  <Body className="text-soft-white">{formatPrice(order.total, order.currency)}</Body>
                  <Badge variant="secondary">{order.status.replace("_", " ")}</Badge>
                </div>
              </GlassPanel>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
