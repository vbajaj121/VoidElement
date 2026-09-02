import type { Metadata } from "next"
import Link from "next/link"
import { GlassPanel } from "@/components/ui/glass-panel"
import { Heading, Body, Caption } from "@/components/ui/typography"
import { SITE_CONTENT_SECTIONS, type SiteContentSection } from "@/lib/validation/site-content"

export const metadata: Metadata = { title: "Content · Admin" }

const HOMEPAGE_SECTIONS: { key: SiteContentSection; blurb: string }[] = [
  { key: "drop-intro", blurb: "The falling-box, click-to-open reveal above The Drop's product grid." },
  { key: "hero", blurb: "Banner image, headline, and the two hero buttons." },
  { key: "product-showcase", blurb: "Heading above the featured product grid." },
  { key: "limited-edition", blurb: "The single-product spotlight callout." },
  { key: "process", blurb: "The five-step \"how it's made\" section." },
  { key: "newsletter", blurb: "Email signup copy." },
  { key: "trust-bar", blurb: "The four icon+text badges." },
  { key: "marquee", blurb: "The scrolling ticker strip below the hero." },
  { key: "footer", blurb: "Footer columns, links, and social URLs." },
]

const STATIC_PAGES: { key: SiteContentSection; blurb: string }[] = [
  { key: "page-about", blurb: "/about" },
  { key: "page-contact", blurb: "/contact" },
  { key: "page-shipping", blurb: "/shipping" },
  { key: "page-returns", blurb: "/returns" },
  { key: "page-lookbook", blurb: "/lookbook (header copy only — the product grid stays live)" },
  { key: "page-archive", blurb: "/archive" },
  { key: "page-privacy", blurb: "/privacy" },
  { key: "page-terms", blurb: "/terms" },
]

function SectionCard({ section, blurb }: { section: SiteContentSection; blurb: string }) {
  return (
    <Link href={`/admin/content/${section}`} data-cursor="hover">
      <GlassPanel className="h-full p-5 transition-colors hover:bg-foreground/5">
        <Body className="text-soft-white font-medium">{SITE_CONTENT_SECTIONS[section].label}</Body>
        <Caption className="mt-1 block">{blurb}</Caption>
      </GlassPanel>
    </Link>
  )
}

export default function AdminContentPage() {
  return (
    <div className="max-w-3xl">
      <Heading>Content</Heading>
      <Body className="mt-2">
        Edit everything visible on the storefront — copy and images — without touching code. Changes go live
        immediately after saving.
      </Body>

      <Caption className="mt-10 block uppercase tracking-wide">Homepage</Caption>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {HOMEPAGE_SECTIONS.map((s) => (
          <SectionCard key={s.key} section={s.key} blurb={s.blurb} />
        ))}
      </div>

      <Caption className="mt-10 block uppercase tracking-wide">Static pages</Caption>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {STATIC_PAGES.map((s) => (
          <SectionCard key={s.key} section={s.key} blurb={s.blurb} />
        ))}
      </div>
    </div>
  )
}
