'use client'

import { motion } from 'framer-motion'
import { siteConfig } from '@/config/site.config'
import { useReducedMotion } from '@/hooks/useReducedMotion'

// Stable rotation values — one per tag (avoids random jitter on re-render)
const TAG_ROTATIONS = [-6, 3, -2, 5, -4, 2, -7, 4, -3]
const TAG_DELAYS = [0, 0.3, 0.6, 0.15, 0.45, 0.9, 0.2, 0.7, 0.5]

export function HashtagWall() {
  const reduced = useReducedMotion()

  return (
    <section className="py-20 md:py-28 px-6 overflow-hidden">
      <motion.p
        className="text-center text-gold text-sm tracking-[0.3em] uppercase font-sans mb-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        Also known as
      </motion.p>

      <div className="flex flex-wrap justify-center gap-4 md:gap-6 max-w-4xl mx-auto">
        {siteConfig.hashtags.map((tag, i) => (
          <motion.span
            key={tag}
            className="inline-block font-serif text-xl md:text-2xl font-semibold text-cream/80 select-none px-4 py-2 border border-border/60 rounded-sm"
            style={
              reduced
                ? {}
                : {
                    '--tag-rotate': `${TAG_ROTATIONS[i] ?? 0}deg`,
                    animation: `float-drift ${3.5 + i * 0.3}s ease-in-out infinite`,
                    animationDelay: `${TAG_DELAYS[i] ?? 0}s`,
                  } as React.CSSProperties
            }
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.07 }}
            whileHover={
              reduced
                ? {}
                : {
                    scale: 1.08,
                    color: '#c9a87c',
                    borderColor: '#c9a87c66',
                    y: -4,
                    transition: { type: 'spring', stiffness: 400, damping: 15 },
                  }
            }
          >
            {tag}
          </motion.span>
        ))}
      </div>
    </section>
  )
}
