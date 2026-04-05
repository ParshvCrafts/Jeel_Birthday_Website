'use client'

import { motion } from 'framer-motion'
import { useBirthday } from '@/hooks/useBirthday'
import { siteConfig } from '@/config/site.config'
import { fadeUpVariants, staggerContainerVariants, fadeUpReducedVariants } from '@/lib/animations'
import { useReducedMotion } from '@/hooks/useReducedMotion'

function DigitBlock({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, '0')
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative overflow-hidden bg-surface border border-border rounded px-4 py-3 md:px-8 md:py-5 min-w-[70px] md:min-w-[100px]">
        <motion.span
          key={display}
          className="block font-serif text-3xl md:text-5xl font-bold text-gold tabular-nums text-center"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {display}
        </motion.span>
      </div>
      <span className="text-subtle text-sm tracking-[0.15em] uppercase font-sans">{label}</span>
    </div>
  )
}

export function BirthdayTimer() {
  const { isBirthday, isPast, daysSince, countdown } = useBirthday()
  const reduced = useReducedMotion()

  const reducedVariant = { hidden: { opacity: 0 }, visible: { opacity: 1 } }

  return (
    <section className="py-24 md:py-32 px-6 bg-surface/50">
      <motion.div
        className="max-w-4xl mx-auto text-center"
        variants={staggerContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {isBirthday ? (
          <>
            <motion.div
              className="text-gold text-sm tracking-[0.3em] uppercase font-sans mb-6"
              variants={reduced ? reducedVariant : fadeUpVariants}
            >
              🎂 Today is the day
            </motion.div>
            <motion.h2
              className="font-serif text-4xl md:text-6xl font-bold text-cream mb-6 leading-tight"
              variants={reduced ? reducedVariant : fadeUpVariants}
            >
              {siteConfig.birthday.hinglishMessage}
            </motion.h2>
            <motion.p
              className="text-muted text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-sans"
              variants={reduced ? reducedVariant : fadeUpVariants}
            >
              {siteConfig.birthday.countingMessage}
            </motion.p>
          </>
        ) : isPast ? (
          <>
            <motion.div
              className="text-gold text-sm tracking-[0.3em] uppercase font-sans mb-6"
              variants={reduced ? reducedVariant : fadeUpVariants}
            >
              🎂 Birthday was on April 5
            </motion.div>
            <motion.div
              className="flex flex-col items-center gap-4 mb-8"
              variants={reduced ? reducedVariant : fadeUpVariants}
            >
              <DigitBlock value={daysSince} label="Days Since Birthday" />
            </motion.div>
            <motion.p
              className="text-muted text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-sans"
              variants={reduced ? reducedVariant : fadeUpVariants}
            >
              {siteConfig.birthday.countingMessage}
            </motion.p>
          </>
        ) : (
          <>
            <motion.p
              className="text-gold text-sm tracking-[0.3em] uppercase font-sans mb-4"
              variants={reduced ? reducedVariant : fadeUpVariants}
            >
              Next birthday in
            </motion.p>
            <motion.p
              className="text-muted font-sans text-base mb-10 max-w-xl mx-auto leading-relaxed"
              variants={reduced ? reducedVariant : fadeUpVariants}
            >
              {siteConfig.birthday.countingMessage}
            </motion.p>
            <motion.div
              className="flex flex-wrap items-end justify-center gap-4 md:gap-8"
              variants={reduced ? reducedVariant : fadeUpVariants}
            >
              <DigitBlock value={countdown.days} label="Days" />
              <span className="font-serif text-4xl text-gold/50 mb-8">:</span>
              <DigitBlock value={countdown.hours} label="Hours" />
              <span className="font-serif text-4xl text-gold/50 mb-8">:</span>
              <DigitBlock value={countdown.minutes} label="Minutes" />
              <span className="font-serif text-4xl text-gold/50 mb-8">:</span>
              <DigitBlock value={countdown.seconds} label="Seconds" />
            </motion.div>
          </>
        )}
      </motion.div>
    </section>
  )
}
