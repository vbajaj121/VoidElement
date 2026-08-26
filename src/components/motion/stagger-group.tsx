'use client'

import { m, type HTMLMotionProps, type Variants } from 'framer-motion'

interface StaggerGroupProps extends HTMLMotionProps<'div'> {
  stagger?: number
}

/** Wrap a list; give each child `variants={staggerItem}` and they'll cascade in on scroll. */
export function StaggerGroup({ stagger = 0.08, children, ...props }: StaggerGroupProps) {
  return (
    <m.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ staggerChildren: stagger }}
      {...props}
    >
      {children}
    </m.div>
  )
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

/** Convenience child for StaggerGroup — same as `<m.div variants={staggerItem} />`. */
export function StaggerItem({ ...props }: HTMLMotionProps<'div'>) {
  return <m.div variants={staggerItem} {...props} />
}
