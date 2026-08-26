import type { Metadata } from "next"
import { prisma } from "@/lib/db/prisma"
import { GlassPanel } from "@/components/ui/glass-panel"
import { Heading, Body, Caption } from "@/components/ui/typography"
import { formatPrice } from "@/lib/format"

export const metadata: Metadata = { title: "Dashboard · Admin" }

export default async function AdminDashboardPage() {
  const [orderCount, revenue, pendingOrders, lowStock, productCount] = await Promise.all([
    prisma.order.count({ where: { status: { not: "PENDING_PAYMENT" } } }),
    prisma.order.aggregate({
      where: { status: { not: "PENDING_PAYMENT" } },
      _sum: { total: true },
    }),
    prisma.order.count({ where: { status: "PENDING_PAYMENT" } }),
    prisma.productVariant.count({ where: { stock: { lte: 5 } } }),
    prisma.product.count(),
  ])

  const stats = [
    { label: "Paid orders", value: orderCount.toLocaleString() },
    { label: "Revenue", value: formatPrice(revenue._sum.total ?? 0) },
    { label: "Pending payment", value: pendingOrders.toLocaleString() },
    { label: "Products", value: productCount.toLocaleString() },
    { label: "Low stock variants", value: lowStock.toLocaleString() },
  ]

  return (
    <div>
      <Heading>Dashboard</Heading>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <GlassPanel key={stat.label} className="p-5">
            <Caption>{stat.label}</Caption>
            <Body className="text-soft-white mt-2 text-2xl font-medium">{stat.value}</Body>
          </GlassPanel>
        ))}
      </div>
    </div>
  )
}
