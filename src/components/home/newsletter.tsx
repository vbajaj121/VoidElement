import { getSiteContent } from "@/lib/data/site-content.server"
import { NewsletterClient } from "@/components/home/newsletter-client"

export async function Newsletter() {
  const content = await getSiteContent("newsletter")
  return <NewsletterClient content={content} />
}
