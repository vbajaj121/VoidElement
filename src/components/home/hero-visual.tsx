import Image from "next/image"
import { HeroArt } from "@/components/home/hero-art"

export function HeroVisual({
  bannerImageUrl,
  mobileBannerImageUrl,
}: {
  bannerImageUrl: string | null
  mobileBannerImageUrl: string | null
}) {
  // Mobile falls back to the desktop image rather than the gradient art
  // when only one has been uploaded — a re-cropped desktop shot still beats
  // no photo at all.
  const mobileSrc = mobileBannerImageUrl ?? bannerImageUrl

  return (
    <div className="pointer-events-none absolute inset-0">
      {bannerImageUrl ? (
        <Image
          src={bannerImageUrl}
          alt=""
          fill
          priority
          sizes="100vw"
          className="hidden object-cover lg:block"
        />
      ) : (
        <div className="hidden lg:block lg:h-full lg:w-full">
          <HeroArt />
        </div>
      )}

      {mobileSrc ? (
        <Image src={mobileSrc} alt="" fill priority sizes="100vw" className="object-cover lg:hidden" />
      ) : (
        <div className="h-full w-full lg:hidden">
          <HeroArt />
        </div>
      )}

      {/* Only desktop overlays text on the photo now — mobile is image-only
          — but a bottom scrim on both keeps this section blending into the
          one below instead of cutting off sharply. */}
      <div className="from-matte-black via-matte-black/30 absolute inset-0 bg-gradient-to-t to-transparent" />
    </div>
  )
}
