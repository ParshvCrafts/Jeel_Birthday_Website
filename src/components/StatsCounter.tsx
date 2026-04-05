'use client'

import { useEffect, useRef, useState } from 'react'
import { animate, motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { siteConfig } from '@/config/site.config'
import { staggerContainerVariants, fadeUpVariants, fadeUpReducedVariants } from '@/lib/animations'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export function calcBirthdayStats(age: number) {
  const days = Math.floor(age * 365.25)
  const hours = days * 24
  const minutes = hours * 60
  return { years: age, days, hours, minutes }
}

function AnimatedStat({ value, label, delay }: { value: number; label: string; delay: number }) {
  const [display, setDisplay] = useState('0')
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, value, {
      duration: 1.5,
      ease: 'easeOut',
      delay,
      onUpdate: (v) => setDisplay(Math.round(v).toLocaleString()),
    })
    return controls.stop
  }, [inView, value, delay])

  return (
    <div ref={ref} className="flex flex-col items-center gap-2">
      <span className="font-serif text-4xl md:text-5xl font-bold text-gold tabular-nums">
        {display}
      </span>
      <span className="text-subtle text-sm tracking-[0.2em] uppercase font-sans">{label}</span>
    </div>
  )
}

export function StatsCounter() {
  const reduced = useReducedMotion()
  const { years, days, hours, minutes } = calcBirthdayStats(siteConfig.birthday.age)

  const items = [
    { value: years, label: 'Years' },
    { value: days, label: 'Days' },
    { value: hours, label: 'Hours' },
    { value: minutes, label: 'Minutes' },
  ]

  return (
    <section id="stats" className="py-20 md:py-28 px-6 bg-surface/30">
      <motion.div
        className="max-w-4xl mx-auto"
        variants={staggerContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        <motion.p
          className="text-center text-gold text-sm tracking-[0.3em] uppercase font-sans mb-12"
          variants={reduced ? fadeUpReducedVariants : fadeUpVariants}
        >
          {siteConfig.birthday.age} years in numbers
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {items.map((item, i) =>
            reduced ? (
              <motion.div
                key={item.label}
                className="flex flex-col items-center gap-2"
                variants={fadeUpReducedVariants}
              >
                <span className="font-serif text-4xl md:text-5xl font-bold text-gold tabular-nums">
                  {item.value.toLocaleString()}
                </span>
                <span className="text-subtle text-sm tracking-[0.2em] uppercase font-sans">
                  {item.label}
                </span>
              </motion.div>
            ) : (
              <motion.div key={item.label} variants={fadeUpVariants}>
                <AnimatedStat value={item.value} label={item.label} delay={i * 0.15} />
              </motion.div>
            )
          )}
        </div>
      </motion.div>
    </section>
  )
}
