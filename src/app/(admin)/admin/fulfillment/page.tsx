import type { Metadata } from "next"
import { prisma } from "@/lib/db/prisma"
import { Heading, Body } from "@/components/ui/typography"
import { FulfillmentProviderForm } from "./fulfillment-provider-form"

export const metadata: Metadata = { title: "Fulfillment · Admin" }

export default async function AdminFulfillmentPage() {
  const settings = await prisma.settings.upsert({
    where: { id: "global" },
    update: {},
    create: { id: "global" },
  })

  return (
    <div className="max-w-md">
      <Heading>Fulfillment</Heading>
      <Body className="mt-2">
        The active provider fulfills every paid order. Switching takes effect immediately —
        no deploy required.
      </Body>

      <div className="mt-8">
        <FulfillmentProviderForm currentProvider={settings.activeFulfillmentProvider} />
      </div>
    </div>
  )
}
