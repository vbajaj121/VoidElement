import { Hero } from "@/components/home/hero"
import { ExploreCollections } from "@/components/home/explore-collections"
import { CinematicProcess } from "@/components/home/cinematic-process"
import { ProductShowcase } from "@/components/home/product-showcase"
import { LimitedEdition } from "@/components/home/limited-edition"
import { Testimonials } from "@/components/home/testimonials"
import { Newsletter } from "@/components/home/newsletter"
import { TrustBar } from "@/components/home/trust-bar"

export default function Home() {
  return (
    <main className="bg-background">
      <Hero />
      <ExploreCollections />
      <CinematicProcess />
      <ProductShowcase />
      <LimitedEdition />
      <Testimonials />
      <Newsletter />
      <TrustBar />
    </main>
  )
}
