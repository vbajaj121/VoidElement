"use client"

import { m } from "framer-motion"
import { Check } from "lucide-react"
import { Caption } from "@/components/ui/typography"
import { cn } from "@/lib/utils"

export type CheckoutStage = "form" | "processing" | "payment" | "confirming" | "success"

interface CheckoutProgressProps {
  contactDone: boolean
  shippingDone: boolean
  stage: CheckoutStage
}

export function CheckoutProgress({ contactDone, shippingDone, stage }: CheckoutProgressProps) {
  const steps = [
    { label: "Contact", done: contactDone },
    { label: "Shipping", done: shippingDone },
    { label: "Payment", done: stage === "success" },
  ]

  return (
    <div className="flex items-center gap-3">
      {steps.map((step, i) => (
        <div key={step.label} className="flex flex-1 items-center gap-3">
          <div className="flex flex-col gap-2">
            <div className="border-border relative h-1 w-16 overflow-hidden rounded-full border-0 bg-foreground/10 sm:w-24">
              <m.div
                className="bg-accent-champagne absolute inset-y-0 left-0"
                initial={false}
                animate={{
                  width: step.done
                    ? "100%"
                    : i === 2 && (stage === "processing" || stage === "payment" || stage === "confirming")
                      ? "60%"
                      : "0%",
                }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <Caption
              className={cn(
                "flex items-center gap-1",
                step.done ? "text-soft-white" : "text-warm-grey"
              )}
            >
              {step.done && <Check className="size-3" />}
              {step.label}
            </Caption>
          </div>
        </div>
      ))}
    </div>
  )
}
