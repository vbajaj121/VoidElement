import type { Metadata } from "next"
import Link from "next/link"
import { Heading, Caption } from "@/components/ui/typography"
import { getSiteContent } from "@/lib/data/site-content.server"
import { MarqueeForm } from "./form"

export const metadata: Metadata = { title: "Scrolling Banner · Admin" }

export default async function AdminMarqueePage() {
  const content = await getSiteContent("marquee")

  return (
    <div className="max-w-2xl">
      <Link href="/admin/content" data-cursor="hover">
        <Caption>← Content</Caption>
      </Link>
      <Heading className="mt-2">Scrolling Banner</Heading>
      <div className="mt-8">
        <MarqueeForm defaultValues={content} />
      </div>
    </div>
  )
}
