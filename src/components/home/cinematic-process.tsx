import { getSiteContent } from "@/lib/data/site-content.server"
import { CinematicProcessClient } from "@/components/home/cinematic-process-client"

export async function CinematicProcess() {
  const content = await getSiteContent("process")
  return <CinematicProcessClient content={content} />
}
