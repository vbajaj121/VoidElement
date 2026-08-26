import { cn } from "@/lib/utils"

function GlassPanel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="glass-panel"
      className={cn("glass rounded-2xl", className)}
      {...props}
    />
  )
}

export { GlassPanel }
