'use client'

import { motion } from 'framer-motion'
import { siteConfig } from '@/config/site.config'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export function QuoteBreak() {
  const reduced = useReducedMotion()
  const words = siteConfig.text.quoteBreak.split(' ')

  return (
    <section className="py-20 md:py-32 px-6 md:px-12 bg-surface/30">
      <div className="max-w-5xl mx-auto">
        <motion.p
          className="text-gold/50 text-xs tracking-[0.4em] uppercase font-sans mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          A note from your brother
        </motion.p>

        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {words.map((word, i) => (
            <div key={i} className="overflow-hidden">
              <motion.span
                className="block font-serif text-2xl md:text-4xl xl:text-5xl font-light text-cream leading-tight"
                initial={reduced ? { opacity: 0 } : { y: '100%', opacity: 0 }}
                whileInView={reduced ? { opacity: 1 } : { y: '0%', opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.04,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {word}
              </motion.span>
            </div>
          ))}
        </div>

        <motion.div
          className="mt-10 h-px bg-gradient-to-r from-gold/50 via-gold/20 to-transparent"
          initial={{ scaleX: 0, originX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </section>
  )
}
