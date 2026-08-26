import type { Metadata } from "next"
import Link from "next/link"
import { Heading, Caption } from "@/components/ui/typography"
import { getSiteContent } from "@/lib/data/site-content.server"
import { FooterForm } from "./form"

export const metadata: Metadata = { title: "Footer · Admin" }

export default async function AdminFooterPage() {
  const content = await getSiteContent("footer")

  return (
    <div className="max-w-2xl">
      <Link href="/admin/content" data-cursor="hover">
        <Caption>← Content</Caption>
      </Link>
      <Heading className="mt-2">Footer</Heading>
      <div className="mt-8">
        <FooterForm defaultValues={content} />
      </div>
    </div>
  )
}
