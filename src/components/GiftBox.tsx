'use client'

import { useState } from 'react'
import Image from 'next/image'
import * as Dialog from '@radix-ui/react-dialog'
import { motion, AnimatePresence } from 'framer-motion'
import { useAudio } from '@/hooks/useAudio'
import { artifactPath } from '@/lib/mediaUtils'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export function GiftBox() {
  const [isOpen, setIsOpen] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const { playGiftSound } = useAudio()
  const reduced = useReducedMotion()

  const handleOpen = () => {
    setIsOpen(true)
    playGiftSound()
    setTimeout(() => setRevealed(true), 600)
  }

  const handleClose = () => {
    setIsOpen(false)
    setTimeout(() => setRevealed(false), 400)
  }

  return (
    <section className="py-24 px-6 flex flex-col items-center gap-6 bg-surface/20">
      <motion.p
        className="text-gold text-sm tracking-[0.3em] uppercase font-sans"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        A special gift
      </motion.p>

      {/* Gift box — click to open */}
      <motion.div
        className="gift-scene cursor-pointer"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        onClick={handleOpen}
        role="button"
        aria-label="Open gift"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleOpen()}
      >
        <div className="relative w-32 h-28 md:w-48 md:h-40">
          {/* Lid */}
          <motion.div
            className="absolute -top-8 md:-top-12 left-0 right-0 h-10 md:h-14 bg-gold rounded-t-sm z-10 gift-lid flex items-center justify-center"
            animate={
              isOpen
                ? { rotateX: -110, y: -20, opacity: 0.7 }
                : { rotateX: 0, y: 0, opacity: 1 }
            }
            transition={{ type: 'spring', stiffness: 180, damping: 18 }}
          >
            <div className="w-4 h-4 bg-canvas rounded-full border-2 border-canvas/50" />
          </motion.div>

          {/* Box body */}
          <div className="absolute inset-0 bg-gold/80 rounded-sm border border-gold">
            <div className="absolute left-1/2 -translate-x-1/2 inset-y-0 w-1.5 bg-canvas/30" />
          </div>

          {/* Hover glow */}
          <motion.div
            className="absolute inset-0 rounded-sm pointer-events-none"
            whileHover={{ boxShadow: '0 0 40px 8px rgba(201, 168, 124, 0.25)' }}
          />
        </div>

        <motion.p
          className="text-center text-muted text-sm tracking-widest uppercase font-sans mt-4"
          animate={{ opacity: isOpen ? 0 : 1 }}
        >
          Click to open ↑
        </motion.p>
      </motion.div>

      {/* Reveal dialog */}
      <Dialog.Root open={isOpen} onOpenChange={(o) => !o && handleClose()}>
        <Dialog.Portal>
          <Dialog.Overlay asChild>
            <motion.div
              className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          </Dialog.Overlay>
          <Dialog.Content className="fixed inset-0 z-[101] flex flex-col items-center justify-center p-6 outline-none">
            <AnimatePresence>
              {revealed && (
                <motion.div
                  className="relative w-full max-w-sm md:max-w-md aspect-square"
                  initial={{ scale: 0.3, opacity: 0, rotate: -5 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0.3, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                >
                  <Image
                    src={artifactPath('finger.jpeg')}
                    alt="A special gift just for you"
                    fill
                    className="object-contain rounded"
                    sizes="(max-width: 768px) 90vw, 400px"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <Dialog.Close asChild>
              <button
                className="mt-8 text-muted hover:text-gold text-sm tracking-widest uppercase font-sans transition-colors"
                aria-label="Close gift"
              >
                Close
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  )
}
