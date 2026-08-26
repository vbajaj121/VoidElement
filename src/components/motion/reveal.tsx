'use client'

import { m, type HTMLMotionProps } from 'framer-motion'

type Direction = 'up' | 'down' | 'left' | 'right' | 'fade'

const offset: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 32 },
  down: { y: -32 },
  left: { x: 32 },
  right: { x: -32 },
  fade: {},
}

interface RevealProps extends HTMLMotionProps<'div'> {
  direction?: Direction
  delay?: number
  duration?: number
}

/** Fades/slides an element in once it scrolls into view. One-shot — never replays. */
export function Reveal({
  direction = 'up',
  delay = 0,
  duration = 0.8,
  children,
  ...props
}: RevealProps) {
  return (
    <m.div
      initial={{ opacity: 0, ...offset[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      {...props}
    >
      {children}
    </m.div>
  )
}
