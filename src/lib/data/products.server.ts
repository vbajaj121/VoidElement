import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/db/prisma'
import { variantKey, type MockProduct, type ProductVariant } from './products'

type DbProductWithVariants = Awaited<ReturnType<typeof fetchProductBySlug>>

function toMockProduct(product: NonNullable<DbProductWithVariants>): MockProduct {
  const colorVariants: ProductVariant[] = []
  const seenColors = new Set<string>()
  const sizes: string[] = []
  const seenSizes = new Set<string>()
  const variantIds: Record<string, string> = {}

  for (const variant of product.variants) {
    if (!seenColors.has(variant.color)) {
      seenColors.add(variant.color)
      colorVariants.push({
        color: variant.color,
        swatch: variant.swatch,
        colors: variant.colors as unknown as [string, string],
      })
    }
    if (!seenSizes.has(variant.size)) {
      seenSizes.add(variant.size)
      sizes.push(variant.size)
    }
    variantIds[variantKey(variant.color, variant.size)] = variant.id
  }

  return {
    slug: product.slug,
    title: product.title,
    category: product.category,
    price: product.basePrice,
    currency: product.currency,
    colors: product.colors as unknown as [string, string],
    description: product.description,
    sizes,
    variants: colorVariants,
    isLimited: product.isLimited,
    variantIds,
    images: product.images.map((img) => ({ url: img.url, alt: img.alt ?? product.title })),
  }
}

async function fetchProducts() {
  return prisma.product.findMany({
    where: { isPublished: true },
    include: { variants: true, images: { orderBy: { position: 'asc' } } },
    orderBy: { createdAt: 'asc' },
  })
}

async function fetchProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug, isPublished: true },
    include: { variants: true, images: { orderBy: { position: 'asc' } } },
  })
}

/**
 * Deprecated but still functional in Next 16 (superseded by `use cache`,
 * which requires the `cacheComponents` experimental flag this project
 * doesn't enable). Tagged so admin product mutations can call
 * `revalidateTag('products')` to bust it.
 */
const getCachedProducts = unstable_cache(fetchProducts, ['products'], { tags: ['products'] })
const getCachedProductBySlug = unstable_cache(
  (slug: string) => fetchProductBySlug(slug),
  ['product-by-slug'],
  { tags: ['products'] }
)

export async function getProducts(): Promise<MockProduct[]> {
  const products = await getCachedProducts()
  return products.map(toMockProduct)
}

export async function getProductBySlug(slug: string): Promise<MockProduct | undefined> {
  const product = await getCachedProductBySlug(slug)
  return product ? toMockProduct(product) : undefined
}

export async function getProductSlugs(): Promise<string[]> {
  const products = await getCachedProducts()
  return products.map((p) => p.slug)
}
