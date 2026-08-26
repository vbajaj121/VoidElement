import type { Metadata } from "next"
import Link from "next/link"
import { Heading, Caption } from "@/components/ui/typography"
import { getSiteContent } from "@/lib/data/site-content.server"
import { NewsletterForm } from "./form"

export const metadata: Metadata = { title: "Newsletter · Admin" }

export default async function AdminNewsletterPage() {
  const content = await getSiteContent("newsletter")

  return (
    <div className="max-w-xl">
      <Link href="/admin/content" data-cursor="hover">
        <Caption>← Content</Caption>
      </Link>
      <Heading className="mt-2">Newsletter</Heading>
      <div className="mt-8">
        <NewsletterForm defaultValues={content} />
      </div>
    </div>
  )
}
