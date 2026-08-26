import Image from "next/image"
import { ProductArt } from "@/components/commerce/product-art"

interface ProcessStepArtProps {
  colors: readonly [string, string]
  image?: string | null
}

export function ProcessStepArt({ colors, image }: ProcessStepArtProps) {
  if (image) {
    return (
      <Image
        src={image}
        alt=""
        fill
        sizes="(min-width: 1024px) 20vw, 50vw"
        className="object-cover"
      />
    )
  }
  return <ProductArt colors={colors} className="h-full w-full" />
}
