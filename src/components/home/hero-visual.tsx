import Image from "next/image"
import { HeroArt } from "@/components/home/hero-art"

/** The hero banner itself — a true 16:9 box so an uploaded photo always shows in full, uncropped-by-mismatch instead of being force-fit into a taller/full-bleed frame. */
export function HeroVisual({ bannerImageUrl }: { bannerImageUrl: string | null }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
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
    </div>
  )
}
