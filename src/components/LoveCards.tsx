'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { siteConfig } from '@/config/site.config'
import { staggerContainerVariants, fadeUpVariants, fadeUpReducedVariants } from '@/lib/animations'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface FlipCardProps {
  message: string
  index: number
  reduced: boolean
}

function FlipCard({ message, index, reduced }: FlipCardProps) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div
      className="relative cursor-pointer"
      style={{ perspective: 800, height: 180 }}
      onClick={() => setFlipped((f) => !f)}
      onMouseEnter={() => { if (!reduced) setFlipped(true) }}
      onMouseLeave={() => { if (!reduced) setFlipped(false) }}
      role="button"
      aria-label={`Card ${index + 1}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') setFlipped((f) => !f)
      }}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center border border-gold/30 rounded-sm bg-surface"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="font-serif text-4xl font-bold text-gold/30">{index + 1}</span>
          <span className="text-subtle text-xs tracking-widest uppercase font-sans mt-2">
            tap to reveal
          </span>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 flex items-center justify-center p-5 border border-gold/50 rounded-sm bg-surface"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <p className="font-serif text-base text-cream text-center leading-relaxed italic">
            {message}
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export function LoveCards() {
  const reduced = useReducedMotion()

  return (
    <section id="love-cards" className="py-20 md:py-28 px-6 bg-surface/20">
      <motion.div
        className="max-w-4xl mx-auto"
        variants={staggerContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        <motion.p
          className="text-center text-gold text-sm tracking-[0.3em] uppercase font-sans mb-10"
          variants={reduced ? fadeUpReducedVariants : fadeUpVariants}
        >
          9 things I love about you
        </motion.p>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 gap-4"
          variants={staggerContainerVariants}
        >
          {siteConfig.loveCards.map((message, i) => (
            <motion.div
              key={i}
              variants={reduced ? fadeUpReducedVariants : fadeUpVariants}
            >
              <FlipCard message={message} index={i} reduced={reduced} />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
