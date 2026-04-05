'use client'

import { motion } from 'framer-motion'
import { useAudio } from '@/hooks/useAudio'
import { siteConfig } from '@/config/site.config'

export function TopBar() {
  const { isPlaying, toggle } = useAudio()

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3"
      style={{ backdropFilter: 'blur(12px)', backgroundColor: 'rgba(14,14,14,0.7)' }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      {/* Left: name label */}
      <span className="font-serif text-sm text-gold tracking-widest uppercase select-none">
        {siteConfig.birthday.nickname} ♥ {siteConfig.birthday.age}
      </span>

      {/* Right: music toggle */}
      <button
        onClick={toggle}
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
        className="flex items-center gap-2 text-muted hover:text-gold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
      >
        {/* Music wave bars */}
        <span className="flex items-end gap-[3px] h-4" aria-hidden="true">
          {[1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={`w-[3px] rounded-sm bg-current origin-bottom ${
                isPlaying ? 'animate-music-wave' : 'h-[6px]'
              }`}
              style={
                isPlaying
                  ? { height: '16px', animationDelay: `${i * 0.12}s` }
                  : {}
              }
            />
          ))}
        </span>
        <span className="text-xs tracking-widest uppercase font-sans">
          {isPlaying ? 'Music on' : 'Music off'}
        </span>
      </button>
    </motion.header>
  )
}
