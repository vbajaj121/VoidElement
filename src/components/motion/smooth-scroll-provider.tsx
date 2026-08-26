'use client'

import { useEffect, useRef } from 'react'
import { ReactLenis, type LenisRef } from 'lenis/react'
import { gsap, ScrollTrigger } from '@/lib/motion/gsap'

/**
 * Global smooth-scroll instance. GSAP drives the raf loop (not Lenis's own),
 * so ScrollTrigger and Lenis never fall out of sync — the standard Lenis+GSAP
 * integration pattern.
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null)

  useEffect(() => {
    const lenis = lenisRef.current?.lenis
    lenis?.on('scroll', ScrollTrigger.update)

    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000)
    }
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(update)
      lenis?.off('scroll', ScrollTrigger.update)
    }
  }, [])

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{ autoRaf: false, lerp: 0.1, duration: 1.2, smoothWheel: true }}
    >
      {children}
    </ReactLenis>
  )
}
