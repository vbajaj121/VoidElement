import Link from "next/link"
import { cn } from "@/lib/utils"

const categories = ["Tees", "Hoodies", "Outerwear", "Bottoms"]

const tabClass = (active: boolean) =>
  cn(
    "rounded-full border px-4 py-2 text-xs font-medium tracking-wide uppercase transition-colors",
    active
      ? "border-accent-champagne bg-accent-champagne/10 text-soft-white"
      : "border-border text-warm-grey hover:border-soft-white/40"
  )

export function ShopFilters({ activeCategory }: { activeCategory?: string }) {
  return (
    <div className="mt-8 flex flex-wrap gap-2">
      <Link href="/shop" data-cursor="hover" className={tabClass(!activeCategory)}>
        All
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat}
          href={`/shop?category=${encodeURIComponent(cat)}`}
          data-cursor="hover"
          className={tabClass(activeCategory === cat)}
        >
          {cat}
        </Link>
      ))}
    </div>
  )
}
