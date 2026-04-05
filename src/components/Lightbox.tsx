'use client'

import * as Dialog from '@radix-ui/react-dialog'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useCallback } from 'react'
import { artifactPath } from '@/lib/mediaUtils'

interface LightboxProps {
  photos: string[]
  initialIndex: number
  open: boolean
  onClose: () => void
}

export function Lightbox({ photos, initialIndex, open, onClose }: LightboxProps) {
  const [index, setIndex] = useState(initialIndex)

  const prev = useCallback(() => setIndex((i) => (i - 1 + photos.length) % photos.length), [photos.length])
  const next = useCallback(() => setIndex((i) => (i + 1) % photos.length), [photos.length])

  const handleOpenChange = (o: boolean) => {
    if (o) setIndex(initialIndex)
    if (!o) onClose()
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <motion.div
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        </Dialog.Overlay>
        <Dialog.Content
          className="fixed inset-0 z-[101] flex items-center justify-center p-4 outline-none"
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') prev()
            if (e.key === 'ArrowRight') next()
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              className="relative w-full max-w-4xl aspect-[4/3]"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
            >
              <Image
                src={artifactPath(photos[index])}
                alt={`Photo ${index + 1} of ${photos.length}`}
                fill
                className="object-contain"
                sizes="(max-width: 1280px) 100vw, 80vw"
              />
            </motion.div>
          </AnimatePresence>

          {photos.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-cream/70 hover:text-gold transition-colors bg-canvas/50 rounded-full"
                aria-label="Previous photo"
              >
                ←
              </button>
              <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-cream/70 hover:text-gold transition-colors bg-canvas/50 rounded-full"
                aria-label="Next photo"
              >
                →
              </button>
            </>
          )}

          <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-subtle text-xs tracking-widest font-sans">
            {index + 1} / {photos.length}
          </span>

          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-cream/50 hover:text-gold transition-colors"
              aria-label="Close lightbox"
            >
              ✕
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
