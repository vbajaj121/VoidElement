import { cn } from "@/lib/utils"

interface AuroraBackgroundProps extends React.ComponentProps<"div"> {
  size?: string
}

/** Decorative ambient glow. Place inside a `relative` container; positions itself with className. */
function AuroraBackground({ className, size = "60vh", style, ...props }: AuroraBackgroundProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "bg-aurora animate-aurora pointer-events-none absolute rounded-full opacity-[0.15] blur-[120px]",
        className
      )}
      style={{ width: size, height: size, ...style }}
      {...props}
    />
  )
}

export { AuroraBackground }
