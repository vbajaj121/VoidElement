import type { Metadata } from "next"
import Link from "next/link"
import { GlassPanel } from "@/components/ui/glass-panel"
import { Heading, Body, Caption } from "@/components/ui/typography"

export const metadata: Metadata = { title: "Settings · Admin" }

export default function AdminSettingsPage() {
  return (
    <div className="max-w-md">
      <Heading>Settings</Heading>
      <Body className="mt-2">
        Store-wide configuration lives in a few dedicated screens rather than one long form.
      </Body>

      <GlassPanel className="mt-8 p-6">
        <Caption>Fulfillment provider</Caption>
        <Body className="mt-2">
          Switch which print-on-demand provider fulfills paid orders from{" "}
          <Link href="/admin/fulfillment" data-cursor="hover" className="text-accent-champagne underline">
            Fulfillment
          </Link>
          .
        </Body>
      </GlassPanel>
    </div>
  )
}
