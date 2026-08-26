import type { Metadata } from "next"
import Link from "next/link"
import { auth } from "@/lib/auth/auth"
import { Button } from "@/components/ui/button"
import { GlassPanel } from "@/components/ui/glass-panel"
import { Heading, Body, Caption } from "@/components/ui/typography"

export const metadata: Metadata = { title: "Account" }

export default async function AccountPage() {
  const session = await auth()

  return (
    <div className="max-w-lg">
      <Heading>Welcome back{session?.user?.name ? `, ${session.user.name}` : ""}.</Heading>
      <GlassPanel className="mt-8 p-6">
        <Caption>Signed in as</Caption>
        <Body className="text-soft-white mt-1">{session?.user?.email}</Body>
      </GlassPanel>

      <Button
        render={<Link href="/account/orders" data-cursor="hover" />}
        nativeButton={false}
        variant="luxury-filled"
        size="xl"
        className="mt-8"
      >
        View Orders
      </Button>
    </div>
  )
}
