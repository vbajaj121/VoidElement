'use client'

import { useEffect } from 'react'
import { useMotionValue, useSpring, useTransform } from 'framer-motion'

/** Maps whole-viewport mouse position to a subtle spring-damped x/y offset, for ambient parallax. */
export function useParallax(strength = 20) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  useEffect(() => {
    function handleMove(e: MouseEvent) {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 2)
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 2)
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [mouseX, mouseY])

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 })

  const x = useTransform(springX, (v) => v * strength)
  const y = useTransform(springY, (v) => v * strength)

  return { x, y }
}
