import { getSiteContent } from "@/lib/data/site-content.server"
import { HeroClient } from "@/components/home/hero-client"

export async function Hero() {
  const content = await getSiteContent("hero")
  return <HeroClient content={content} />
}
