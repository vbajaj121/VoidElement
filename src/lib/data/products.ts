export interface ProductVariant {
  color: string
  swatch: string
  colors: readonly [string, string]
  /**
   * Real fulfillment-provider SKU for this color, applied across every size
   * in the product's `sizes` list. Only correct while a color has a single
   * real size registered at the provider — once a color ships in multiple
   * sizes with distinct provider SKUs, this needs to move to a per-size map.
   */
  providerSku?: string
}

export interface MockProduct {
  slug: string
  title: string
  category: string
  price: number
  currency: string
  colors: readonly [string, string]
  description: string
  sizes: string[]
  variants: ProductVariant[]
  isLimited?: boolean
  /** `${color}__${size}` -> real ProductVariant id. Populated by products.server.ts only. */
  variantIds?: Record<string, string>
}

export function variantKey(color: string, size: string) {
  return `${color}__${size}`
}

/** First color + first size, for quick-add flows that don't ask the shopper to pick. */
export function defaultVariantSelection(product: MockProduct) {
  const color = product.variants[0]?.color ?? ""
  const size = product.sizes[0] ?? ""
  return { color, size, variantId: product.variantIds?.[variantKey(color, size)] }
}

/**
 * Seed fixture for `prisma/seed.ts` — the storefront now reads products via
 * `lib/data/products.server.ts` (real Prisma queries). Also the source of
 * the `MockProduct`/`ProductVariant` types every product-related component
 * is typed against, whether the data ultimately comes from here or the DB.
 */
/**
 * Every product here must correspond to a real, registered Qikink SKU — the
 * old fully-fictional catalog (Eclipse/Bone/Void/Nocturne/Halo/Orbit) was
 * deleted because none of it could actually be fulfilled. Add a new entry
 * only once it exists in dashboard.qikink.com -> Products -> My Products (or
 * SKU Descriptions), with the real SKU recorded per variant below.
 */
export const products: MockProduct[] = [
  {
    slug: "oversized-tee",
    title: "Oversized Tee",
    category: "Tees",
    price: 79900,
    currency: "INR",
    colors: ["#050505", "#2e2e2e"],
    description:
      "An oversized, drop-shoulder fit in soft breathable cotton — the everyday layer built to be lived in. Registered at Qikink as \"Unisex Oversized Standard T-Shirt\".",
    sizes: ["XS"],
    variants: [
      { color: "White", swatch: "#efece2", colors: ["#d9d4c4", "#f7f5ee"], providerSku: "UOSsMRnHs-Wh-XS" },
      { color: "Black", swatch: "#242424", colors: ["#050505", "#2e2e2e"], providerSku: "UOSsMRnHs-Bk-XS" },
      { color: "Navy Blue", swatch: "#22304f", colors: ["#0c1424", "#334874"], providerSku: "UOSsMRnHs-Nb-XS" },
      { color: "Grey Melange", swatch: "#8f8f89", colors: ["#57574f", "#b6b6ae"], providerSku: "UOSsMRnHs-Gm-XS" },
      { color: "Light Baby Pink", swatch: "#eec4cd", colors: ["#dba3ae", "#f6dde2"], providerSku: "UOSsMRnHs-LBp-XS" },
      { color: "Lavender", swatch: "#c4b7db", colors: ["#9c8cc0", "#e2d7f0"], providerSku: "UOSsMRnHs-Lv-XS" },
      { color: "Beige", swatch: "#d7c6a9", colors: ["#b39d78", "#ecdfc8"], providerSku: "UOSsMRnHs-Be-XS" },
    ],
  },
]

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug)
}
