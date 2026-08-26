import type { Metadata } from "next"
import { Heading, Body } from "@/components/ui/typography"
import { ImportForm } from "./import-form"

export const metadata: Metadata = { title: "Import products · Admin" }

export default function ImportProductsPage() {
  return (
    <div>
      <Heading>Import from vendor</Heading>
      <Body className="mt-2 max-w-2xl">
        Paste a copy-pasted product table from your fulfillment provider&apos;s dashboard (e.g. Qikink&apos;s My
        Products list) below. Every row becomes a color/size variant with its real SKU — nothing here is
        fulfillable until the SKU actually exists at the provider.
      </Body>
      <div className="mt-8">
        <ImportForm />
      </div>
    </div>
  )
}
