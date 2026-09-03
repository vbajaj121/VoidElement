import Image from "next/image"
import { ProductArt } from "@/components/commerce/product-art"

interface ProcessStepArtProps {
  colors: readonly [string, string]
  image?: string | null
  sizes?: string
}

export function ProcessStepArt({ colors, image, sizes = "(min-width: 1024px) 20vw, 50vw" }: ProcessStepArtProps) {
  if (image) {
    return <Image src={image} alt="" fill sizes={sizes} className="object-cover" />
  }
  return <ProductArt colors={colors} className="h-full w-full" />
}
