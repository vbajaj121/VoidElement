import type { Metadata } from "next"
import Link from "next/link"
import { Heading, Caption, Body } from "@/components/ui/typography"
import { getSiteContent } from "@/lib/data/site-content.server"
import { PageContentForm } from "../page-content-form"

export const metadata: Metadata = { title: "Lookbook Page · Admin" }

export default async function AdminPageLookbookPage() {
  const content = await getSiteContent("page-lookbook")

  return (
    <div className="max-w-2xl">
      <Link href="/admin/content" data-cursor="hover">
        <Caption>← Content</Caption>
      </Link>
      <Heading className="mt-2">Lookbook Page</Heading>
      <Body className="mt-2">
        Only the header copy below is editable — the product grid underneath is drawn from your live catalog.
      </Body>
      <div className="mt-8">
        <PageContentForm section="page-lookbook" defaultValues={content} />
      </div>
    </div>
  )
}
