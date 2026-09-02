import { Hero } from "@/components/home/hero"
import { ProductShowcase } from "@/components/home/product-showcase"
import { LimitedEdition } from "@/components/home/limited-edition"
import { CinematicProcess } from "@/components/home/cinematic-process"
import { Newsletter } from "@/components/home/newsletter"
import { TrustBar } from "@/components/home/trust-bar"

export default function Home() {
  return (
    <main className="bg-background">
      <Hero />
      <ProductShowcase />
      <LimitedEdition />
      <CinematicProcess />
      <Newsletter />
      <TrustBar />
    </main>
  )
}
