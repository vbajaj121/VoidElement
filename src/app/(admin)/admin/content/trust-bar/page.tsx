import type { Metadata } from "next"
import Link from "next/link"
import { Heading, Caption } from "@/components/ui/typography"
import { getSiteContent } from "@/lib/data/site-content.server"
import { TrustBarForm } from "./form"

export const metadata: Metadata = { title: "Trust Bar · Admin" }

export default async function AdminTrustBarPage() {
  const content = await getSiteContent("trust-bar")

  return (
    <div className="max-w-2xl">
      <Link href="/admin/content" data-cursor="hover">
        <Caption>← Content</Caption>
      </Link>
      <Heading className="mt-2">Trust Bar</Heading>
      <div className="mt-8">
        <TrustBarForm defaultValues={content} />
      </div>
    </div>
  )
}
