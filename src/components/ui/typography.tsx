import { cn } from "@/lib/utils"

type AsProp<T extends React.ElementType> = { as?: T }
type TypographyProps<T extends React.ElementType> = AsProp<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof AsProp<T>>

/** Kicker/label text — the small tracked-out uppercase line above a heading. */
function Eyebrow<T extends React.ElementType = "p">({
  as,
  className,
  ...props
}: TypographyProps<T>) {
  const Comp = as || "p"
  return (
    <Comp
      className={cn(
        "text-eyebrow font-medium text-warm-grey uppercase",
        className
      )}
      {...props}
    />
  )
}

/** The huge editorial serif — reserved for hero moments, one or two per page. */
function Display<T extends React.ElementType = "h1">({
  as,
  className,
  ...props
}: TypographyProps<T>) {
  const Comp = as || "h1"
  return (
    <Comp
      className={cn(
        "text-display font-serif text-balance text-soft-white",
        className
      )}
      {...props}
    />
  )
}

/** Section-level heading — serif, smaller and quieter than Display. */
function Heading<T extends React.ElementType = "h2">({
  as,
  className,
  ...props
}: TypographyProps<T>) {
  const Comp = as || "h2"
  return (
    <Comp
      className={cn(
        "text-h1 font-serif text-balance text-soft-white",
        className
      )}
      {...props}
    />
  )
}

/** Sub-heading — sans, used inside cards or nested sections. */
function Subheading<T extends React.ElementType = "h3">({
  as,
  className,
  ...props
}: TypographyProps<T>) {
  const Comp = as || "h3"
  return (
    <Comp
      className={cn("text-h3 font-sans font-medium text-soft-white", className)}
      {...props}
    />
  )
}

/** The sentence under a Display/Heading that explains what's happening. */
function Lead<T extends React.ElementType = "p">({
  as,
  className,
  ...props
}: TypographyProps<T>) {
  const Comp = as || "p"
  return (
    <Comp
      className={cn("text-lead font-sans text-warm-grey text-balance", className)}
      {...props}
    />
  )
}

/** Default interface copy. */
function Body<T extends React.ElementType = "p">({
  as,
  className,
  ...props
}: TypographyProps<T>) {
  const Comp = as || "p"
  return (
    <Comp className={cn("text-sm font-sans text-titanium", className)} {...props} />
  )
}

/** Fine print — captions, meta, timestamps. */
function Caption<T extends React.ElementType = "span">({
  as,
  className,
  ...props
}: TypographyProps<T>) {
  const Comp = as || "span"
  return (
    <Comp
      className={cn("text-xs font-sans text-warm-grey", className)}
      {...props}
    />
  )
}

export { Eyebrow, Display, Heading, Subheading, Lead, Body, Caption }
