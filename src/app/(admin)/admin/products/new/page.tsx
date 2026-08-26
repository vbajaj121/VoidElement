import type { Metadata } from "next"
import { Heading } from "@/components/ui/typography"
import { ProductForm } from "../product-form"

export const metadata: Metadata = { title: "New product · Admin" }

export default function NewProductPage() {
  return (
    <div>
      <Heading>New Product</Heading>
      <div className="mt-8">
        <ProductForm
          productId={null}
          defaultValues={{
            slug: "",
            title: "",
            category: "",
            description: "",
            basePrice: 0,
            currency: "INR",
            colorFrom: "#0a0a0a",
            colorTo: "#3a3a3a",
            isLimited: false,
            isPublished: false,
            variants: [{ color: "", swatch: "#000000", size: "", priceDiff: 0, stock: 0 }],
          }}
        />
      </div>
    </div>
  )
}
