'use client'

import { m, type HTMLMotionProps } from 'framer-motion'
import { useMagnetic } from '@/hooks/use-magnetic'
import { cn } from '@/lib/utils'

interface MagneticProps extends HTMLMotionProps<'div'> {
  strength?: number
}

/** Wrap a button/link to make it drift toward the cursor within its own bounds. */
export function Magnetic({ strength = 0.35, className, children, ...props }: MagneticProps) {
  const { ref, x, y, onMouseMove, onMouseLeave } = useMagnetic<HTMLDivElement>(strength)

  return (
    <m.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ x, y }}
      data-cursor="hover"
      className={cn('inline-flex', className)}
      {...props}
    >
      {children}
    </m.div>
  )
}
