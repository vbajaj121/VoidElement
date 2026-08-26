"use client"

import { useState } from "react"
import { RotateCw } from "lucide-react"
import { ProductArt } from "@/components/commerce/product-art"
import { Caption } from "@/components/ui/typography"
import type { ProductVariant } from "@/lib/data/products"

interface GalleryProps {
  artRef: React.RefObject<HTMLDivElement | null>
  variant: ProductVariant
  face: "front" | "back"
  onFaceChange: (face: "front" | "back") => void
  isLimited?: boolean
}

export function Gallery({ artRef, variant, face, onFaceChange, isLimited }: GalleryProps) {
  const [zoom, setZoom] = useState(false)
  const [origin, setOrigin] = useState("50% 50%")

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setOrigin(`${x}% ${y}%`)
  }

  // Placeholder "back" view: same swatch, reversed gradient direction —
  // stands in until real front/back photography exists.
  const displayColors: readonly [string, string] =
    face === "back" ? [variant.colors[1], variant.colors[0]] : variant.colors

  return (
    <div>
      <div
        ref={artRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        data-cursor="text"
        data-cursor-label="Zoom"
        className="border-border relative aspect-4/5 overflow-hidden rounded-2xl border"
      >
        <div
          className="h-full w-full transition-transform duration-300 ease-out"
          style={{ transformOrigin: origin, transform: zoom ? "scale(1.5)" : "scale(1)" }}
        >
          <ProductArt colors={displayColors} className="h-full w-full" />
        </div>

        {isLimited && (
          <span className="glass text-soft-white absolute top-4 left-4 rounded-full px-3 py-1 text-[10px] font-semibold tracking-widest uppercase">
            Limited
          </span>
        )}

        <button
          type="button"
          data-cursor="hover"
          onClick={() => onFaceChange(face === "front" ? "back" : "front")}
          className="glass text-soft-white absolute right-4 bottom-4 flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium"
        >
          <RotateCw className="size-3.5" strokeWidth={1.5} />
          {face === "front" ? "View Back" : "View Front"}
        </button>
      </div>

      <Caption className="mt-3 block text-center">
        Hover to zoom · {face === "front" ? "Front" : "Back"} view
      </Caption>
    </div>
  )
}
