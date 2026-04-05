'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const SECTIONS = [
  { id: 'hero', label: 'Hero' },
  { id: 'timer', label: 'Birthday' },
  { id: 'stats', label: 'Stats' },
  { id: 'gallery-1', label: 'Gallery I' },
  { id: 'quote', label: 'Quote' },
  { id: 'filmstrip-1', label: 'Family I' },
  { id: 'gallery-2', label: 'Gallery II' },
  { id: 'hashtags', label: 'Hashtags' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'gift', label: 'Gift' },
  { id: 'gallery-3', label: 'Gallery III' },
  { id: 'filmstrip-2', label: 'Family II' },
  { id: 'love-cards', label: 'Love' },
  { id: 'funny', label: 'Funny' },
  { id: 'memes', label: 'Memes' },
  { id: 'closing', label: 'Closing' },
]

export function SectionNav() {
  const [active, setActive] = useState('hero')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const observers: IntersectionObserver[] = []

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id)
        },
        { threshold: 0.3 }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return (
    <nav
      className="fixed right-5 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-3"
      aria-label="Section navigation"
    >
      {SECTIONS.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
          aria-label={`Jump to ${label}`}
          className="group relative flex items-center justify-end gap-2"
        >
          <span className="text-[10px] text-gold font-sans tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            {label}
          </span>
          <motion.span
            className="block rounded-full bg-gold flex-shrink-0"
            animate={
              active === id
                ? { width: 12, height: 12, opacity: 1 }
                : { width: 8, height: 8, opacity: 0.3 }
            }
            transition={{ duration: 0.2 }}
          />
        </button>
      ))}
    </nav>
  )
}
