'use client'

import { useEffect, useRef } from 'react'
import { ReactLenis, type LenisRef } from 'lenis/react'
import { ScrollTrigger } from '@/lib/motion/gsap'

/**
 * Global smooth-scroll instance. Lenis runs its own internal rAF loop
 * (default autoRaf, not disabled) so it starts responding to touch/wheel
 * input the instant it constructs — this used to be driven by GSAP's ticker
 * instead (autoRaf: false + a useEffect wiring `lenis.raf` into
 * `gsap.ticker`), which left a real dead zone: Lenis takes over scroll on
 * mount, but produced zero visible movement until that effect fired after
 * hydration. On a slow connection/device that's a multi-second window where
 * the page looks loaded but doesn't scroll — reported live on mobile.
 *
 * The GSAP-ticker wiring only existed to keep ScrollTrigger frame-perfect
 * with Lenis for the Process section's old scroll-pin; that's since been
 * replaced with a plain CSS scroll-snap carousel, so nothing left actually
 * needs that level of sync. Still forwarding scroll events to
 * ScrollTrigger.update() below in case any ScrollTrigger usage returns.
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null)

  useEffect(() => {
    const lenis = lenisRef.current?.lenis
    lenis?.on('scroll', ScrollTrigger.update)
    return () => {
      lenis?.off('scroll', ScrollTrigger.update)
    }
  }, [])

  return (
    <ReactLenis root ref={lenisRef} options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
      {children}
    </ReactLenis>
  )
}
