import Image from "next/image"
import { HeroArt } from "@/components/home/hero-art"

/** Full-bleed hero backdrop — fills the entire hero section behind the scroll-down cue. */
export function HeroVisual({ bannerImageUrl }: { bannerImageUrl: string | null }) {
  return (
    <div className="absolute inset-0">
      {bannerImageUrl ? (
        <Image
          src={bannerImageUrl}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        <HeroArt />
      )}

      {/* Runs over the image edge-to-edge — one continuous surface rather
          than a photo dropped onto a separate grid. Plain alpha, no blend
          mode: mix-blend-overlay mathematically has ~no effect against a
          near-black base (the formula collapses to zero at that extreme),
          so it needs to be visible regardless of what's under it here. */}
      <div className="void-grid pointer-events-none absolute inset-0" />
    </div>
  )
}
