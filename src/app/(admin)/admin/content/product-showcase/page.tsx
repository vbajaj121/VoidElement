import type { Metadata } from "next"
import Link from "next/link"
import { Heading, Caption } from "@/components/ui/typography"
import { getSiteContent } from "@/lib/data/site-content.server"
import { ProductShowcaseForm } from "./form"

export const metadata: Metadata = { title: "The Drop · Admin" }

export default async function AdminProductShowcasePage() {
  const content = await getSiteContent("product-showcase")

  return (
    <div className="max-w-xl">
      <Link href="/admin/content" data-cursor="hover">
        <Caption>← Content</Caption>
      </Link>
      <Heading className="mt-2">The Drop (Product Grid)</Heading>
      <div className="mt-8">
        <ProductShowcaseForm defaultValues={content} />
      </div>
    </div>
  )
}
