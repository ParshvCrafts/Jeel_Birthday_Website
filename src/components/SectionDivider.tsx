'use client'

import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export function SectionDivider() {
  const reduced = useReducedMotion()

  return (
    <div className="px-8 md:px-24 py-2">
      <motion.div
        className="h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={
          reduced
            ? { duration: 0 }
            : { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
        }
        style={{ originX: 0.5 }}
      />
    </div>
  )
}
