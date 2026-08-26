'use client'

import { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/motion/gsap'

/**
 * Scopes a GSAP timeline to a ref with automatic cleanup on unmount —
 * the building block for the cinematic, scrubbed/pinned sections in Phase 4
 * (fabric reveal, embroidery stitch-in, product rotation, etc).
 */
export function useScrollReveal<T extends HTMLElement>(
  build: (el: T, gsapInstance: typeof gsap, scrollTrigger: typeof ScrollTrigger) => void,
  deps: unknown[] = []
) {
  const ref = useRef<T>(null)

  useLayoutEffect(() => {
    if (!ref.current) return
    const ctx = gsap.context(() => {
      build(ref.current as T, gsap, ScrollTrigger)
    }, ref)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return ref
}
