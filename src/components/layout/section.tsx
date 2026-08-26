import { cn } from "@/lib/utils"

function Section({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      className={cn("relative py-24 sm:py-32", className)}
      {...props}
    />
  )
}

export { Section }
