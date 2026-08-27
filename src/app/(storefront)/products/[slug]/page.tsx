import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { FrequentlyBoughtTogether } from "@/components/product/frequently-bought-together"
import { ProductPageClient } from "@/components/product/product-page-client"
import { RelatedProducts } from "@/components/product/related-products"
import { getProductBySlug, getProducts, getProductSlugs } from "@/lib/data/products.server"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getProductSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return {}

  return {
    title: product.title,
    description: product.description,
    // Next doesn't deep-merge `openGraph`/`twitter` objects across route
    // segments — a child page setting either key resets unspecified
    // sub-fields to Next's defaults rather than inheriting the root
    // layout's, so `card`/`type` need repeating here explicitly.
    openGraph: { title: product.title, description: product.description, type: "website" },
    twitter: { card: "summary_large_image", title: product.title, description: product.description },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const [product, allProducts] = await Promise.all([getProductBySlug(slug), getProducts()])
  if (!product) notFound()

  return (
    <main className="bg-background pt-32 pb-24">
      <ProductPageClient product={product} />
      <FrequentlyBoughtTogether current={product} products={allProducts} />
      <RelatedProducts currentSlug={product.slug} category={product.category} products={allProducts} />
    </main>
  )
}
