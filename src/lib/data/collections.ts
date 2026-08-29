import { getProducts } from "./products.server"

const CATEGORY_SWATCHES: Record<string, readonly [string, string]> = {
  Tees: ["#101010", "#5cf6c9"],
  Hoodies: ["#151515", "#d4af7a"],
  Outerwear: ["#0c0c0c", "#f65c8a"],
  Bottoms: ["#111111", "#6b6f76"],
}

const CATEGORY_ORDER = ["Tees", "Hoodies", "Outerwear", "Bottoms"]

/**
 * Category tiles for the homepage's Explore Collections section. Counts
 * come from real published products (previously computed against the
 * static seed fixture in products.ts, so an imported/created product never
 * moved the number — see the ExploreCollections component this feeds).
 * Falls back to a neutral grey swatch for any category that isn't one of
 * the four curated ones above, so a new category typed on the New Product
 * form doesn't crash this tile grid.
 */
export async function getCollections() {
  const products = await getProducts()
  const counts = new Map<string, number>()
  for (const p of products) counts.set(p.category, (counts.get(p.category) ?? 0) + 1)

  const categories = [...new Set([...CATEGORY_ORDER, ...counts.keys()])]

  return categories.map((category) => ({
    category,
    colors: CATEGORY_SWATCHES[category] ?? (["#101010", "#3a3a3a"] as const),
    count: counts.get(category) ?? 0,
  }))
}
