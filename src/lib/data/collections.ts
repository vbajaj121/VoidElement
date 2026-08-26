import { products } from "./products"

const base = [
  { category: "Tees", colors: ["#101010", "#5cf6c9"] as const },
  { category: "Hoodies", colors: ["#151515", "#d4af7a"] as const },
  { category: "Outerwear", colors: ["#0c0c0c", "#f65c8a"] as const },
  { category: "Bottoms", colors: ["#111111", "#6b6f76"] as const },
]

export const collections = base.map((c) => ({
  ...c,
  count: products.filter((p) => p.category === c.category).length,
}))
