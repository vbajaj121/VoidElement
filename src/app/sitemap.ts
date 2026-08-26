import type { MetadataRoute } from "next"
import { getProducts } from "@/lib/data/products.server"
import { SITE_URL } from "@/lib/site"

const STATIC_ROUTES: Array<{
  path: string
  priority: number
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>
}> = [
  { path: "", priority: 1, changeFrequency: "daily" },
  { path: "/shop", priority: 0.9, changeFrequency: "daily" },
  { path: "/lookbook", priority: 0.6, changeFrequency: "weekly" },
  { path: "/archive", priority: 0.5, changeFrequency: "weekly" },
  { path: "/about", priority: 0.5, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.3, changeFrequency: "yearly" },
  { path: "/shipping", priority: 0.3, changeFrequency: "yearly" },
  { path: "/returns", priority: 0.3, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Sitemap generation shouldn't 500 the whole route if the DB hiccups —
  // fall back to just the static pages.
  const products = await getProducts().catch(() => [])

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/products/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  return [...staticEntries, ...productEntries]
}
