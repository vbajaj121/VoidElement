import type { Metadata } from "next"
import Link from "next/link"
import { Heading, Caption } from "@/components/ui/typography"
import { getSiteContent } from "@/lib/data/site-content.server"
import { PageContentForm } from "../page-content-form"

export const metadata: Metadata = { title: "Privacy Policy Page · Admin" }

export default async function AdminPagePrivacyPage() {
  const content = await getSiteContent("page-privacy")

  return (
    <div className="max-w-2xl">
      <Link href="/admin/content" data-cursor="hover">
        <Caption>← Content</Caption>
      </Link>
      <Heading className="mt-2">Privacy Policy Page</Heading>
      <div className="mt-8">
        <PageContentForm section="page-privacy" defaultValues={content} />
      </div>
    </div>
  )
}
