import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/auth"
import { Eyebrow } from "@/components/ui/typography"
import { SignOutButton } from "@/components/auth/sign-out-button"

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

const links = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/content", label: "Content" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/fulfillment", label: "Fulfillment" },
  { href: "/admin/settings", label: "Settings" },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect("/login?callbackUrl=/admin/dashboard")
  if (session.user.role !== "ADMIN") redirect("/account")

  return (
    <div className="bg-background flex min-h-screen">
      <aside className="border-border hidden w-56 shrink-0 border-r px-6 py-10 sm:block">
        <Eyebrow>Admin</Eyebrow>
        <nav className="mt-8 flex flex-col gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-cursor="hover"
              className="text-warm-grey hover:text-soft-white rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-white/5"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-10">
          <SignOutButton />
        </div>
      </aside>

      <main className="flex-1 px-6 py-10 sm:px-10">{children}</main>
    </div>
  )
}
