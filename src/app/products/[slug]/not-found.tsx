import Link from "next/link"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { Button } from "@/components/ui/button"
import { Eyebrow, Heading, Body } from "@/components/ui/typography"

export default function ProductNotFound() {
  return (
    <Section className="pt-40">
      <Container className="text-center">
        <Eyebrow>404</Eyebrow>
        <Heading className="mt-4">This piece doesn&apos;t exist.</Heading>
        <Body className="mx-auto mt-4 max-w-md">
          It may have sold out and been retired from the catalog for good — that&apos;s the
          nature of a limited run.
        </Body>
        <Button
          render={<Link href="/" data-cursor="hover" />}
          nativeButton={false}
          variant="luxury-filled"
          size="xl"
          className="mt-8"
        >
          Back To Shop
        </Button>
      </Container>
    </Section>
  )
}
