import type { Metadata } from "next"
import Link from "next/link"
import { Heading, Caption } from "@/components/ui/typography"
import { getSiteContent } from "@/lib/data/site-content.server"
import { getProducts } from "@/lib/data/products.server"
import { LimitedEditionForm } from "./form"

export const metadata: Metadata = { title: "Limited Edition · Admin" }

export default async function AdminLimitedEditionPage() {
  const [content, products] = await Promise.all([getSiteContent("limited-edition"), getProducts()])

  return (
    <div className="max-w-xl">
      <Link href="/admin/content" data-cursor="hover">
        <Caption>← Content</Caption>
      </Link>
      <Heading className="mt-2">Limited Edition Callout</Heading>
      <div className="mt-8">
        <LimitedEditionForm
          defaultValues={content}
          products={products.map((p) => ({ slug: p.slug, title: p.title }))}
        />
      </div>
    </div>
  )
}
