import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { products } from '../src/lib/data/products'
import { ensurePrintArt } from '../src/lib/print-art'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL ?? '' })
const prisma = new PrismaClient({ adapter })

function variantSku(productSlug: string, color: string, size: string) {
  return `${productSlug}-${color}-${size}`.toLowerCase().replace(/[^a-z0-9-]+/g, '-')
}

async function main() {
  for (const product of products) {
    const dbProduct = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        title: product.title,
        category: product.category,
        description: product.description,
        basePrice: product.price,
        currency: product.currency,
        colors: product.colors as unknown as object,
        isLimited: Boolean(product.isLimited),
        isPublished: true,
      },
      create: {
        slug: product.slug,
        title: product.title,
        category: product.category,
        description: product.description,
        basePrice: product.price,
        currency: product.currency,
        colors: product.colors as unknown as object,
        isLimited: Boolean(product.isLimited),
        isPublished: true,
      },
    })

    for (const variant of product.variants) {
      const printFileUrl = await ensurePrintArt(product.title, variant.color, variant.colors)

      for (const size of product.sizes) {
        const sku = variantSku(product.slug, variant.color, size)
        await prisma.productVariant.upsert({
          where: { sku },
          update: { printFileUrl, providerSku: variant.providerSku ?? `mock-${sku}` },
          create: {
            productId: dbProduct.id,
            sku,
            color: variant.color,
            swatch: variant.swatch,
            colors: variant.colors as unknown as object,
            size,
            priceDiff: 0,
            stock: 50,
            providerSku: variant.providerSku ?? `mock-${sku}`,
            printFileUrl,
          },
        })
      }
    }
  }

  await prisma.settings.upsert({
    where: { id: 'global' },
    update: {},
    create: { id: 'global' },
  })

  console.log(`Seeded ${products.length} products with placeholder print art.`)
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
