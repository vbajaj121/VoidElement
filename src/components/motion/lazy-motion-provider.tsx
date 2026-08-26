'use client'

import { LazyMotion } from 'framer-motion'

// Loaded async, in its own chunk, after first paint — not part of the
// critical bundle every route pays for up front. Every component under
// src/components that animates uses `m.div` (framer-motion's lightweight
// primitive) instead of `motion.div` specifically so this actually shrinks
// the bundle; `m` and `motion` render identically once features are loaded.
const loadFeatures = () => import('./lazy-features').then((mod) => mod.default)

export function LazyMotionProvider({ children }: { children: React.ReactNode }) {
  return <LazyMotion features={loadFeatures}>{children}</LazyMotion>
}
