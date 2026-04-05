'use client'

import Image from 'next/image'
import { motion, useMotionValue, animate } from 'framer-motion'
import { useRef, useState } from 'react'
import { artifactPath } from '@/lib/mediaUtils'
import { fadeUpVariants, fadeUpReducedVariants } from '@/lib/animations'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { Lightbox } from './Lightbox'

interface FamilyFilmstripProps {
  photos: readonly string[]
  title?: string
}

export function FamilyFilmstrip({ photos, title }: FamilyFilmstripProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [activeDot, setActiveDot] = useState(0)
  const reduced = useReducedMotion()
  const constraintsRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)

  const CARD_WIDTH = 280
  const GAP = 16

  const handleDragEnd = () => {
    const currentX = x.get()
    const cardStep = CARD_WIDTH + GAP
    const index = Math.max(0, Math.min(photos.length - 1, Math.round(-currentX / cardStep)))
    setActiveDot(index)
  }

  return (
    <section className="py-16 md:py-24 overflow-hidden">
      {title && (
        <motion.p
          className="text-center text-gold text-xs tracking-[0.4em] uppercase font-sans mb-10 px-4"
          variants={reduced ? fadeUpReducedVariants : fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {title}
        </motion.p>
      )}

      <div ref={constraintsRef} className="overflow-hidden px-4 md:px-8">
        <motion.div
          className="flex gap-4 filmstrip-drag"
          drag="x"
          dragConstraints={constraintsRef}
          dragElastic={0.08}
          dragTransition={{ bounceStiffness: 300, bounceDamping: 35 }}
          style={{ x }}
          onDragEnd={handleDragEnd}
        >
          {photos.map((photo, i) => (
            <motion.button
              key={photo}
              className="relative flex-shrink-0 rounded-sm overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-gold group"
              style={{ width: CARD_WIDTH, height: 380 }}
              onClick={() => setLightboxIndex(i)}
              aria-label={`Family photo ${i + 1}`}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <Image
                src={artifactPath(photo)}
                alt={`Family photo ${i + 1}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="280px"
                draggable={false}
              />
              <div className="absolute inset-0 border border-gold/0 group-hover:border-gold/30 transition-all duration-300 pointer-events-none" />
            </motion.button>
          ))}
          {/* Peek spacer */}
          <div style={{ minWidth: 60, flexShrink: 0 }} />
        </motion.div>
      </div>

      {/* Dot indicator */}
      <div className="flex justify-center gap-2 mt-6 px-4">
        {photos.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              const CARD_WIDTH = 280
              const GAP = 16
              const target = -(i * (CARD_WIDTH + GAP))
              setActiveDot(i)
              animate(x, target, { type: 'spring', stiffness: 300, damping: 35 })
            }}
            aria-label={`Go to photo ${i + 1}`}
            className={`transition-all duration-300 rounded-full ${
              i === activeDot ? 'w-5 h-2 bg-gold' : 'w-2 h-2 bg-border hover:bg-gold/40'
            }`}
          />
        ))}
      </div>

      <Lightbox
        photos={[...photos]}
        initialIndex={lightboxIndex ?? 0}
        open={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
      />
    </section>
  )
}
