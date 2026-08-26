import type { Metadata } from "next"
import Link from "next/link"
import { Heading, Caption } from "@/components/ui/typography"
import { getSiteContent } from "@/lib/data/site-content.server"
import { ExploreCollectionsForm } from "./form"

export const metadata: Metadata = { title: "Explore Collections · Admin" }

export default async function AdminExploreCollectionsPage() {
  const content = await getSiteContent("explore-collections")

  return (
    <div className="max-w-xl">
      <Link href="/admin/content" data-cursor="hover">
        <Caption>← Content</Caption>
      </Link>
      <Heading className="mt-2">Explore Collections</Heading>
      <div className="mt-8">
        <ExploreCollectionsForm defaultValues={content} />
      </div>
    </div>
  )
}
