import type { Metadata } from "next"
import Link from "next/link"
import { Heading, Caption } from "@/components/ui/typography"
import { getSiteContent } from "@/lib/data/site-content.server"
import { HeroForm } from "./hero-form"

export const metadata: Metadata = { title: "Hero & Banner · Admin" }

export default async function AdminHeroContentPage() {
  const content = await getSiteContent("hero")

  return (
    <div className="max-w-2xl">
      <Link href="/admin/content" data-cursor="hover">
        <Caption>← Content</Caption>
      </Link>
      <Heading className="mt-2">Hero & Banner</Heading>
      <div className="mt-8">
        <HeroForm defaultValues={content} />
      </div>
    </div>
  )
}
