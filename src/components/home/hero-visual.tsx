import Image from "next/image"
import { HeroArt } from "@/components/home/hero-art"

export function HeroVisual({ bannerImageUrl }: { bannerImageUrl: string | null }) {
  return (
    // Full-bleed on mobile (behind the centered text), a 56%-wide right-hand
    // column on desktop (beside the left-aligned text) — one <Image> covers
    // both via responsive positioning classes rather than rendering the
    // photo twice, so it's never fetched more than once.
    <div className="pointer-events-none absolute inset-0 lg:left-auto lg:w-[56%]">
      {bannerImageUrl ? (
        <Image
          src={bannerImageUrl}
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 56vw, 100vw"
          className="object-cover lg:object-top"
        />
      ) : (
        <HeroArt />
      )}

      {/* Mobile: the photo sits directly behind centered text, so it needs a
          real scrim to stay legible regardless of what's in the shot.
          Desktop: text lives in its own column to the left of the image, so
          only a soft edge-fade is needed to blend the two together. */}
      <div className="from-matte-black via-matte-black/70 to-matte-black/30 absolute inset-0 bg-gradient-to-t lg:hidden" />
      <div className="from-matte-black absolute inset-0 hidden bg-gradient-to-r via-transparent to-transparent lg:block" />
    </div>
  )
}
