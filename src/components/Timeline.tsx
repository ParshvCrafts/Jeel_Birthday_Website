'use client'

import { motion } from 'framer-motion'
import { siteConfig } from '@/config/site.config'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export function Timeline() {
  const reduced = useReducedMotion()

  return (
    <section id="timeline" className="py-20 md:py-28 px-6">
      <motion.p
        className="text-center text-gold text-sm tracking-[0.3em] uppercase font-sans mb-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        A life in moments
      </motion.p>

      <div className="max-w-3xl mx-auto relative">
        {/* Center vertical line — desktop only */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/30 to-transparent hidden md:block" />

        <div className="flex flex-col gap-12">
          {siteConfig.timeline.map((item, i) => (
            <motion.div
              key={i}
              className={`relative flex flex-col md:gap-8 ${
                i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
              whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            >
              {/* Text content */}
              <div
                className={`flex-1 ${
                  i % 2 === 0 ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'
                }`}
              >
                <span className="text-gold/60 text-xs tracking-[0.3em] uppercase font-sans">
                  {item.year}
                </span>
                <h3 className="font-serif text-xl text-cream mt-1 mb-1">{item.title}</h3>
                <p className="text-muted text-sm leading-relaxed font-sans">{item.description}</p>
              </div>

              {/* Center dot */}
              <div className="hidden md:flex items-start justify-center flex-shrink-0 pt-1">
                <div className="w-3 h-3 rounded-full bg-gold border-2 border-canvas" />
              </div>

              {/* Spacer for opposite side */}
              <div className="flex-1 hidden md:block" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
