'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { siteConfig } from '@/config/site.config'
import { artifactPath } from '@/lib/mediaUtils'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import {
  fadeUpVariants,
  slideFromRightVariants,
  staggerContainerVariants,
  fadeUpReducedVariants,
  slideFromRightReducedVariants,
} from '@/lib/animations'

const words = siteConfig.text.heroGreeting.split(' ')

export function Hero() {
  const reduced = useReducedMotion()

  return (
    <section
      className="relative min-h-screen flex flex-col lg:flex-row pt-14"
      aria-label="Hero — Happy Birthday Chiku"
    >
      {/* LEFT: Text panel */}
      <div className="flex flex-col justify-center px-8 md:px-16 lg:px-24 py-16 lg:py-0 lg:w-[55%] z-10">
        {/* Date label */}
        <motion.p
          className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-6"
          variants={reduced ? fadeUpReducedVariants : fadeUpVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          April 5 · Turning {siteConfig.birthday.age}
        </motion.p>

        {/* "Happy Birthday," — word stagger */}
        <motion.div
          className="overflow-hidden mb-2"
          variants={staggerContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-wrap gap-x-4">
            {words.map((word, i) => (
              <motion.span
                key={i}
                className="font-serif text-4xl md:text-5xl xl:text-6xl font-light text-cream leading-tight"
                variants={reduced ? fadeUpReducedVariants : fadeUpVariants}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                {word}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* "Chiku" */}
        <motion.h1
          className="font-serif text-6xl md:text-7xl xl:text-8xl font-bold text-gold leading-none mb-8"
          variants={reduced ? fadeUpReducedVariants : fadeUpVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.7 }}
        >
          {siteConfig.birthday.nickname}
        </motion.h1>

        {/* Blessing text */}
        <motion.p
          className="text-muted font-sans text-base md:text-lg leading-relaxed max-w-md"
          variants={reduced ? fadeUpReducedVariants : fadeUpVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.9 }}
        >
          {siteConfig.text.blessing}
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          className="mt-12 flex items-center gap-3 text-subtle text-xs tracking-[0.2em] uppercase font-sans"
          variants={reduced ? fadeUpReducedVariants : fadeUpVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1.1 }}
        >
          <motion.span
            animate={reduced ? {} : { y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          >
            ↓
          </motion.span>
          Scroll to begin
        </motion.div>
      </div>

      {/* RIGHT: Photo panel */}
      <motion.div
        className="relative lg:w-[45%] min-h-[50vh] lg:min-h-screen"
        variants={reduced ? slideFromRightReducedVariants : slideFromRightVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3 }}
      >
        {/* Gradient blending left edge into canvas on large screens */}
        <div
          className="absolute inset-y-0 left-0 w-24 z-10 hidden lg:block"
          style={{ background: 'linear-gradient(to right, #0e0e0e, transparent)' }}
        />
        {/* Gold frame accent */}
        <div className="absolute inset-4 border border-gold/20 z-10 pointer-events-none rounded-sm" />

        <Image
          src={artifactPath('main.jpeg')}
          alt={`${siteConfig.birthday.name} — birthday portrait`}
          fill
          className="object-cover object-center"
          priority
          sizes="(max-width: 1024px) 100vw, 45vw"
        />
      </motion.div>
    </section>
  )
}
