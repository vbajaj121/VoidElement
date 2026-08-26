import type { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/db/prisma"
import { GlassPanel } from "@/components/ui/glass-panel"
import { Badge } from "@/components/ui/badge"
import { Heading, Body, Caption } from "@/components/ui/typography"
import { formatPrice } from "@/lib/format"

export const metadata: Metadata = { title: "Orders · Admin" }

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { user: true, items: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  })

  return (
    <div>
      <Heading>Orders</Heading>

      <div className="mt-8 space-y-3">
        {orders.map((order) => (
          <Link key={order.id} href={`/admin/orders/${order.id}`} data-cursor="hover">
            <GlassPanel className="flex flex-wrap items-center justify-between gap-3 p-5 transition-colors hover:bg-white/5">
              <div>
                <Body className="text-soft-white">#{order.id.slice(-8)}</Body>
                <Caption className="mt-1">
                  {order.user.email} · {order.items.length} item{order.items.length === 1 ? "" : "s"}
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
    </div>
  )
}
