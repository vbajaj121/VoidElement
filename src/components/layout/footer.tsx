import Link from "next/link"
import { Camera, MessageCircle, Play } from "lucide-react"
import { Container } from "@/components/layout/container"
import { Logo } from "@/components/brand/logo"
import { Caption } from "@/components/ui/typography"
import { getSiteContent } from "@/lib/data/site-content.server"

export async function Footer() {
  const content = await getSiteContent("footer")

  return (
    <footer className="border-border border-t">
      <Container className="py-12 sm:py-16">
        {/* grid-cols-2 on mobile instead of every block fully stacked (which
            ran to nearly two screens of scrolling) — the logo spans both
            columns as its own full-width row, and the 3 link columns wrap
            2-per-row beneath it. At lg the logo drops back to sitting beside
            the columns in one row, same as before. */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:gap-12 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" data-cursor="hover">
              <Logo />
            </Link>
            <Caption className="mt-4 block max-w-xs">{content.tagline}</Caption>
            <div className="mt-6 flex gap-4 text-warm-grey">
              <Link href={content.instagramUrl} aria-label="Instagram" data-cursor="hover" className="hover:text-soft-white">
                <Camera className="size-4" strokeWidth={1.5} />
              </Link>
              <Link href={content.twitterUrl} aria-label="Twitter" data-cursor="hover" className="hover:text-soft-white">
                <MessageCircle className="size-4" strokeWidth={1.5} />
              </Link>
              <Link href={content.youtubeUrl} aria-label="YouTube" data-cursor="hover" className="hover:text-soft-white">
                <Play className="size-4" strokeWidth={1.5} />
              </Link>
            </div>
          </div>

          {content.columns.map((col) => (
            <div key={col.heading}>
              <Caption className="text-soft-white font-medium tracking-widest uppercase">
                {col.heading}
              </Caption>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      data-cursor="hover"
                      className="text-warm-grey hover:text-soft-white text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-border mt-12 flex flex-col gap-2 border-t pt-6 sm:mt-16 sm:flex-row sm:justify-between">
          <Caption>© {new Date().getFullYear()} Void Element. All rights reserved.</Caption>
          <Caption>{content.bottomTagline}</Caption>
        </div>
      </Container>
    </footer>
  )
}
