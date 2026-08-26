import type { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/db/prisma"
import { Button } from "@/components/ui/button"
import { GlassPanel } from "@/components/ui/glass-panel"
import { Badge } from "@/components/ui/badge"
import { Heading, Body, Caption } from "@/components/ui/typography"
import { formatPrice } from "@/lib/format"

export const metadata: Metadata = { title: "Products · Admin" }

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { variants: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <Heading>Products</Heading>
        <div className="flex gap-3">
          <Button render={<Link href="/admin/products/import" data-cursor="hover" />} nativeButton={false} variant="secondary">
            Import From Vendor
          </Button>
          <Button render={<Link href="/admin/products/new" data-cursor="hover" />} nativeButton={false} variant="luxury-filled">
            New Product
          </Button>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        {products.map((product) => (
          <Link key={product.id} href={`/admin/products/${product.id}/edit`} data-cursor="hover">
            <GlassPanel className="flex flex-wrap items-center justify-between gap-3 p-5 transition-colors hover:bg-white/5">
              <div>
                <Body className="text-soft-white">{product.title}</Body>
                <Caption className="mt-1">
                  {product.category} · {product.variants.length} variant
                  {product.variants.length === 1 ? "" : "s"}
                </Caption>
              </div>
              <div className="flex items-center gap-3">
                <Body>{formatPrice(product.basePrice, product.currency)}</Body>
                <Badge variant={product.isPublished ? "secondary" : "outline"}>
                  {product.isPublished ? "Published" : "Draft"}
                </Badge>
              </div>
            </GlassPanel>
          </Link>
        ))}
      </div>
    </div>
  )
}
