import { Shirt } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProductArtProps {
  colors: readonly [string, string]
  className?: string
}

/** Abstract gradient swatch standing in for real product photography. */
export function ProductArt({ colors, className }: ProductArtProps) {
  return (
    <div
      className={cn("relative flex items-center justify-center overflow-hidden", className)}
      style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }}
    >
      <div className="void-grid absolute inset-0 opacity-20 mix-blend-overlay" />
      <Shirt className="relative h-1/2 w-1/2 text-white/15" strokeWidth={0.75} />
    </div>
  )
}
