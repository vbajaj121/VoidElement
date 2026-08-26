'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { prisma } from '@/lib/db/prisma'
import { ensurePrintArt } from '@/lib/print-art'
import { guessColorHex } from '@/lib/color-names'
import { importProductSchema, type ImportProductInput } from '@/lib/validation/product-import'
import { requireAdmin, type ActionResult } from '../../actions'

export async function createProductFromImport(input: ImportProductInput): Promise<ActionResult> {
  await requireAdmin()

  const parsed = importProductSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid input.' }
  const data = parsed.data

  const existing = await prisma.product.findUnique({ where: { slug: data.slug } })
  if (existing) return { ok: false, error: `A product with slug "${data.slug}" already exists.` }

  const colorGroups = new Map<string, typeof data.variants>()
  for (const variant of data.variants) {
    if (!colorGroups.has(variant.color)) colorGroups.set(variant.color, [])
    colorGroups.get(variant.color)!.push(variant)
  }

  const heroColor = [...colorGroups.keys()][0] ?? ''
  const productColors = guessColorHex(heroColor).colors

  const product = await prisma.product.create({
    data: {
      slug: data.slug,
      title: data.title,
      category: data.category,
      description: data.description || `${data.title}. Imported from vendor catalog — edit this description before publishing.`,
      basePrice: data.basePrice,
      currency: data.currency,
      colors: productColors,
      isLimited: data.isLimited,
      // Imported products start unpublished so they can be reviewed (real
      // description, category, pricing) before going live on the storefront.
      isPublished: false,
    },
  })

  for (const [color, rows] of colorGroups) {
    const { swatch, colors } = guessColorHex(color)
    const printFileUrl = await ensurePrintArt(data.title, color, colors)

    for (const row of rows) {
      const sku = `${data.slug}-${row.color}-${row.size}`.toLowerCase().replace(/[^a-z0-9-]+/g, '-')
      await prisma.productVariant.create({
        data: {
          productId: product.id,
          sku,
          color: row.color,
          swatch,
          colors,
          size: row.size,
          priceDiff: row.priceDiff,
          stock: 50,
          providerSku: row.providerSku,
          printFileUrl,
        },
      })
    }
  }

  updateTag('products')
  revalidatePath('/admin/products')
  return { ok: true }
}
