import Image from "next/image"
import { HeroArt } from "@/components/home/hero-art"

export function HeroVisual({ bannerImageUrl }: { bannerImageUrl: string | null }) {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[56%] lg:block">
      {bannerImageUrl ? (
        <Image
          src={bannerImageUrl}
          alt=""
          fill
          priority
          sizes="56vw"
          className="object-cover object-top"
        />
      ) : (
        <HeroArt />
      )}
      <div className="from-matte-black absolute inset-0 bg-gradient-to-r via-transparent to-transparent" />
    </div>
  )
}
