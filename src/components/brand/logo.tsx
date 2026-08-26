import { cn } from "@/lib/utils"

/**
 * Three orbital rings at 60°, no nucleus — an atomic symbol with an empty
 * core. "Element" is the atom; "Void" is what's missing at its center.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <g stroke="currentColor" strokeWidth="1.15">
        <ellipse cx="16" cy="16" rx="14" ry="5.6" />
        <ellipse cx="16" cy="16" rx="14" ry="5.6" transform="rotate(60 16 16)" />
        <ellipse cx="16" cy="16" rx="14" ry="5.6" transform="rotate(120 16 16)" />
      </g>
    </svg>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="text-accent-champagne size-5" />
      <span className="text-soft-white text-xs font-semibold tracking-[0.35em] uppercase">
        Void Element
      </span>
    </span>
  )
}
