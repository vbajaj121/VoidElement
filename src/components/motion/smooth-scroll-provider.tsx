'use client'

import { ReactLenis } from 'lenis/react'

/**
 * Global smooth-scroll instance. Runs Lenis's own default internal rAF loop
 * (no autoRaf override, no GSAP-ticker wiring) so it starts responding to
 * touch/wheel input the instant it constructs, with zero hydration-dependent
 * setup — a prior version disabled autoRaf and wired Lenis into GSAP's
 * ticker via a useEffect instead, which left a real dead zone (worse on
 * slow connections/devices) between "page visible" and "Lenis actually
 * responding."
 *
 * That GSAP wiring — and the ~150KB of gsap+ScrollTrigger it pulled into
 * every single page's critical-path JS via this always-loaded provider —
 * only existed to keep ScrollTrigger frame-perfect with Lenis for the
 * Process section's old scroll-pin. That's since been replaced with a plain
 * CSS scroll-snap carousel, so nothing live uses ScrollTrigger anymore; the
 * only remaining usage is in hero-image-sequence.tsx, which isn't wired
 * into any page and does its own gsap/ScrollTrigger import when it is.
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
      {children}
    </ReactLenis>
  )
}
