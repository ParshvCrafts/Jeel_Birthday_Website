'use client'

import { motion } from 'framer-motion'
import { siteConfig } from '@/config/site.config'
import { fadeUpVariants, staggerContainerVariants, fadeUpReducedVariants } from '@/lib/animations'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const CONFETTI_COLORS = ['#c9a87c', '#f5f0e8', '#8a6a3a', '#e8d5b0', '#2a2018']
const CONFETTI_COUNT = 24

export function Closing() {
  const reduced = useReducedMotion()
  const hasClosingMessage = siteConfig.text.closing.trim().length > 0

  return (
    <section className="relative py-28 md:py-40 px-6 overflow-hidden bg-surface/30">
      {/* CSS confetti particles */}
      {!reduced && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {Array.from({ length: CONFETTI_COUNT }).map((_, i) => (
            <span
              key={i}
              className="absolute w-2 h-2 rounded-full animate-confetti-fall opacity-0"
              style={{
                backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                left: `${(i / CONFETTI_COUNT) * 100}%`,
                animationDelay: `${i * 0.12}s`,
                animationDuration: `${2.5 + (i % 4) * 0.4}s`,
                animationFillMode: 'both',
              }}
            />
          ))}
        </div>
      )}

      <motion.div
        className="max-w-3xl mx-auto text-center relative z-10"
        variants={staggerContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        <motion.p
          className="text-gold text-xs tracking-[0.4em] uppercase font-sans mb-6"
          variants={reduced ? fadeUpReducedVariants : fadeUpVariants}
        >
          With love
        </motion.p>

        <motion.h2
          className="font-serif text-4xl md:text-6xl font-bold text-gold mb-8 leading-tight"
          variants={reduced ? fadeUpReducedVariants : fadeUpVariants}
        >
          Happy Birthday,<br />Jeel
        </motion.h2>

        {hasClosingMessage && (
          <motion.p
            className="text-muted font-sans text-base md:text-xl leading-relaxed mb-10 max-w-xl mx-auto"
            variants={reduced ? fadeUpReducedVariants : fadeUpVariants}
          >
            {siteConfig.text.closing}
          </motion.p>
        )}

        <motion.p
          className="text-subtle text-sm font-sans tracking-widest uppercase"
          variants={reduced ? fadeUpReducedVariants : fadeUpVariants}
        >
          April 5, {siteConfig.birthday.birthYear + siteConfig.birthday.age} ♥
        </motion.p>

        <motion.button
          type="button"
          className="mt-12 text-subtle hover:text-gold text-xs tracking-widest uppercase font-sans transition-colors flex items-center gap-2 mx-auto"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          variants={reduced ? fadeUpReducedVariants : fadeUpVariants}
        >
          ↑ Back to top
        </motion.button>
      </motion.div>
    </section>
  )
}
