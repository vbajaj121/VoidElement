'use client'

import { useRef } from 'react'
import { useMotionValue, useSpring } from 'framer-motion'

/** Pulls an element toward the cursor while the pointer is inside its bounds. */
export function useMagnetic<T extends HTMLElement>(strength = 0.35) {
  const ref = useRef<T>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.5 })
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.5 })

  function onMouseMove(e: React.MouseEvent) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength)
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength)
  }

  function onMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return { ref, x: springX, y: springY, onMouseMove, onMouseLeave }
}
