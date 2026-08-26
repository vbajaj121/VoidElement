import type { Metadata } from "next"
import Link from "next/link"
import { Heading, Caption } from "@/components/ui/typography"
import { getSiteContent } from "@/lib/data/site-content.server"
import { PageContentForm } from "../page-content-form"

export const metadata: Metadata = { title: "Terms of Service Page · Admin" }

export default async function AdminPageTermsPage() {
  const content = await getSiteContent("page-terms")

  return (
    <div className="max-w-2xl">
      <Link href="/admin/content" data-cursor="hover">
        <Caption>← Content</Caption>
      </Link>
      <Heading className="mt-2">Terms of Service Page</Heading>
      <div className="mt-8">
        <PageContentForm section="page-terms" defaultValues={content} />
      </div>
    </div>
  )
}
