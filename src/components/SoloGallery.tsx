'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { type PhotoEntry } from '@/config/site.config'
import { artifactPath } from '@/lib/mediaUtils'
import { fadeUpVariants, staggerContainerVariants, fadeUpReducedVariants } from '@/lib/animations'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { Lightbox } from './Lightbox'

interface SoloGalleryProps {
  photos: readonly PhotoEntry[]
  title?: string
}

export function SoloGallery({ photos, title }: SoloGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const reduced = useReducedMotion()
  const photoFilenames = photos.map((p) => p.src)

  return (
    <section className="py-16 md:py-24 px-4 md:px-8">
      {title && (
        <motion.p
          className="text-center text-gold text-xs tracking-[0.4em] uppercase font-sans mb-10"
          variants={reduced ? fadeUpReducedVariants : fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {title}
        </motion.p>
      )}

      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-6xl mx-auto"
        style={{ gridAutoRows: '200px' }}
        variants={staggerContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        {photos.map((photo, i) => (
          <motion.button
            key={photo.src}
            className={[
              'relative overflow-hidden group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm',
              photo.size === 'tall' ? 'row-span-2' : '',
              photo.size === 'wide' ? 'col-span-2' : '',
            ].join(' ')}
            variants={reduced ? fadeUpReducedVariants : fadeUpVariants}
            onClick={() => setLightboxIndex(i)}
            aria-label={`View photo ${i + 1}`}
          >
            <Image
              src={artifactPath(photo.src)}
              alt={`Photo ${i + 1}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
            <div className="absolute inset-0 border-2 border-gold/0 group-hover:border-gold/40 transition-all duration-300 rounded-sm pointer-events-none" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-300" />
          </motion.button>
        ))}
      </motion.div>

      <Lightbox
        photos={photoFilenames}
        initialIndex={lightboxIndex ?? 0}
        open={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
      />
    </section>
  )
}
