import type { Metadata } from "next"
import Link from "next/link"
import { Heading, Caption } from "@/components/ui/typography"
import { getSiteContent } from "@/lib/data/site-content.server"
import { DropIntroForm } from "./form"

export const metadata: Metadata = { title: "Drop Intro Animation · Admin" }

export default async function AdminDropIntroPage() {
  const content = await getSiteContent("drop-intro")

  return (
    <div className="max-w-2xl">
      <Link href="/admin/content" data-cursor="hover">
        <Caption>← Content</Caption>
      </Link>
      <Heading className="mt-2">Drop Intro Animation</Heading>
      <div className="mt-8">
        <DropIntroForm defaultValues={content} />
      </div>
    </div>
  )
}
