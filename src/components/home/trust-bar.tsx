import { Award, Heart, Lock, RotateCcw, ShieldCheck, Sparkles, Star, Truck } from "lucide-react"
import { Container } from "@/components/layout/container"
import { Caption } from "@/components/ui/typography"
import { getSiteContent } from "@/lib/data/site-content.server"
import type { TRUST_BAR_ICONS } from "@/lib/validation/site-content"

const ICONS: Record<(typeof TRUST_BAR_ICONS)[number], typeof ShieldCheck> = {
  "shield-check": ShieldCheck,
  sparkles: Sparkles,
  "rotate-ccw": RotateCcw,
  lock: Lock,
  truck: Truck,
  award: Award,
  star: Star,
  heart: Heart,
}

export async function TrustBar() {
  const content = await getSiteContent("trust-bar")

  return (
    <div className="border-border border-t">
      <Container className="grid grid-cols-2 gap-x-6 gap-y-8 py-10 sm:grid-cols-4">
        {content.items.map(({ icon, title, subtitle }, i) => {
          const Icon = ICONS[icon]
          return (
            <div key={i} className="flex items-center gap-3">
              <Icon className="text-accent-champagne size-5 shrink-0" strokeWidth={1.5} />
              <div>
                <p className="text-soft-white text-sm font-medium">{title}</p>
                <Caption>{subtitle}</Caption>
              </div>
            </div>
          )
        })}
      </Container>
    </div>
  )
}
