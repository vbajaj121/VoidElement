"use client"

import dynamic from "next/dynamic"
import type { MockProduct } from "@/lib/data/products"

// Loaded async, in its own chunk, after first paint — same pattern as
// CustomCursorLoader. The command palette (cmdk) is a real chunk of JS
// (~90KB) that was previously eagerly bundled into every storefront page's
// critical path via a static import in the layout, even though it's a
// hidden dialog nobody sees until they explicitly open search. On a slow
// mobile connection that's extra parse/download time before the rest of
// the page — including the navbar's own menu/cart buttons — finishes
// hydrating and becomes responsive.
const SearchPalette = dynamic(() => import("./search-palette").then((mod) => mod.SearchPalette), {
  ssr: false,
})

export function SearchPaletteLoader({ products }: { products: MockProduct[] }) {
  return <SearchPalette products={products} />
}
