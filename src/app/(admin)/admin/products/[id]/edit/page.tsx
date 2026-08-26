import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/db/prisma"
import { Heading } from "@/components/ui/typography"
import { ProductForm } from "../../product-form"

export const metadata: Metadata = { title: "Edit product · Admin" }

interface EditProductPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params
  const product = await prisma.product.findUnique({ where: { id }, include: { variants: true } })
  if (!product) notFound()

  const colors = product.colors as unknown as [string, string]

  return (
    <div>
      <Heading>Edit Product</Heading>
      <div className="mt-8">
        <ProductForm
          productId={product.id}
          defaultValues={{
            slug: product.slug,
            title: product.title,
            category: product.category,
            description: product.description,
            basePrice: product.basePrice,
            currency: product.currency,
            colorFrom: colors[0],
            colorTo: colors[1],
            isLimited: product.isLimited,
            isPublished: product.isPublished,
            variants: product.variants.map((v) => ({
              id: v.id,
              color: v.color,
              swatch: v.swatch,
              size: v.size,
              priceDiff: v.priceDiff,
              stock: v.stock,
            })),
          }}
        />
      </div>
    </div>
  )
}
