import type { Metadata } from "next"
import Link from "next/link"
import { Heading, Caption } from "@/components/ui/typography"
import { getSiteContent } from "@/lib/data/site-content.server"
import { ProcessForm } from "./form"

export const metadata: Metadata = { title: "Our Process · Admin" }

export default async function AdminProcessPage() {
  const content = await getSiteContent("process")

  return (
    <div className="max-w-2xl">
      <Link href="/admin/content" data-cursor="hover">
        <Caption>← Content</Caption>
      </Link>
      <Heading className="mt-2">Our Process</Heading>
      <div className="mt-8">
        <ProcessForm defaultValues={content} />
      </div>
    </div>
  )
}
