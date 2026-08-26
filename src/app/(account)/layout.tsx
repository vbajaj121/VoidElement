import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/auth"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { Eyebrow } from "@/components/ui/typography"
import { SignOutButton } from "@/components/auth/sign-out-button"

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

const links = [
  { href: "/account", label: "Overview" },
  { href: "/account/orders", label: "Orders" },
]

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect("/login?callbackUrl=/account")

  return (
    <main className="bg-background">
      <Section className="pt-32 pb-0">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <Eyebrow>Account</Eyebrow>
              <nav className="mt-4 flex gap-6 text-xs font-medium tracking-[0.15em] text-warm-grey uppercase">
                {links.map((link) => (
                  <Link key={link.href} href={link.href} data-cursor="hover" className="hover:text-soft-white">
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
            <SignOutButton />
          </div>
        </Container>
      </Section>

      <Section className="pt-10">
        <Container>{children}</Container>
      </Section>
    </main>
  )
}
