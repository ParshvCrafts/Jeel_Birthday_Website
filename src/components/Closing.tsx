'use client'

import { motion } from 'framer-motion'
import { siteConfig } from '@/config/site.config'
import { fadeUpVariants, staggerContainerVariants, fadeUpReducedVariants } from '@/lib/animations'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const CONFETTI_COLORS = ['#c9a87c', '#f5f0e8', '#8a6a3a', '#e8d5b0', '#2a2018']
const CONFETTI_COUNT = 24

/**
 * Parses a closing message string into visual paragraphs and an optional signature.
 * Sentences (ending in . ! ?) are grouped into pairs for readability.
 * Any trailing text without sentence-ending punctuation is treated as a signature.
 */
function parseClosingMessage(text: string): { paragraphs: string[]; signature: string | null } {
  const trimmed = text.trim()
  if (!trimmed) return { paragraphs: [], signature: null }

  // Extract sentences that end with . ! or ?
  const sentences = trimmed.match(/[^.!?]+[.!?]+/g) ?? []
  const matched = sentences.join(' ')
  const remainder = trimmed.slice(matched.length).trim()
  const signature = remainder || null

  // Group sentences into visual paragraphs of 2
  const paragraphs: string[] = []
  for (let i = 0; i < sentences.length; i += 2) {
    paragraphs.push(sentences.slice(i, i + 2).join(' '))
  }

  return { paragraphs, signature }
}

export function Closing() {
  const reduced = useReducedMotion()
  const hasClosingMessage = siteConfig.text.closing.trim().length > 0
  const { paragraphs, signature } = parseClosingMessage(siteConfig.text.closing)

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
          className="text-gold text-sm tracking-[0.3em] uppercase font-sans mb-6"
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
          <>
            <div className="mb-10 max-w-xl mx-auto text-left space-y-4">
              {paragraphs.map((para, i) => (
                <motion.p
                  key={i}
                  className="text-cream/75 font-sans text-base md:text-lg leading-8"
                  variants={reduced ? fadeUpReducedVariants : fadeUpVariants}
                >
                  {para}
                </motion.p>
              ))}
            </div>
            {signature && (
              <motion.p
                className="font-serif italic text-gold text-lg md:text-xl mb-10 max-w-xl mx-auto text-right"
                variants={reduced ? fadeUpReducedVariants : fadeUpVariants}
              >
                — {signature}
              </motion.p>
            )}
          </>
        )}

        <motion.p
          className="text-subtle text-sm font-sans tracking-widest uppercase"
          variants={reduced ? fadeUpReducedVariants : fadeUpVariants}
        >
          April 5, {siteConfig.birthday.birthYear + siteConfig.birthday.age} ♥
        </motion.p>

        <motion.button
          type="button"
          className="mt-12 text-subtle hover:text-gold text-sm tracking-widest uppercase font-sans transition-colors flex items-center gap-2 mx-auto"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          variants={reduced ? fadeUpReducedVariants : fadeUpVariants}
        >
          ↑ Back to top
        </motion.button>
      </motion.div>
    </section>
  )
}
