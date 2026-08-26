import type { Metadata } from "next"
import Link from "next/link"
import { Heading, Caption } from "@/components/ui/typography"
import { getSiteContent } from "@/lib/data/site-content.server"
import { TestimonialsForm } from "./form"

export const metadata: Metadata = { title: "Testimonials · Admin" }

export default async function AdminTestimonialsPage() {
  const content = await getSiteContent("testimonials")

  return (
    <div className="max-w-2xl">
      <Link href="/admin/content" data-cursor="hover">
        <Caption>← Content</Caption>
      </Link>
      <Heading className="mt-2">Testimonials</Heading>
      <div className="mt-8">
        <TestimonialsForm defaultValues={content} />
      </div>
    </div>
  )
}
