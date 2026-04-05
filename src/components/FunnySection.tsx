'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { siteConfig } from '@/config/site.config'
import { artifactPath } from '@/lib/mediaUtils'
import { useAudio } from '@/hooks/useAudio'
import { fadeUpVariants, staggerContainerVariants, fadeUpReducedVariants } from '@/lib/animations'
import { useReducedMotion } from '@/hooks/useReducedMotion'

function FunnyVideo({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const { pauseForVideo, resumeFromVideo } = useAudio()
  const label = src.replace('.mp4', '').replace(/_/g, ' ')

  if (!playing) {
    return (
      <div
        className="relative rounded-sm overflow-hidden border border-border bg-surface cursor-pointer group"
        style={{ height: '208px' }}
        onClick={() => setPlaying(true)}
        role="button"
        aria-label={`Play ${label}`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-surface via-canvas to-surface" />
        <div className="absolute bottom-3 left-3 text-muted text-xs tracking-widest uppercase font-sans capitalize">
          {label}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-16 h-16 rounded-full border-2 border-gold flex items-center justify-center"
            whileHover={{ scale: 1.1, borderColor: '#c9a87ccc' }}
            whileTap={{ scale: 0.95 }}
          >
            <div
              className="ml-1"
              style={{
                width: 0,
                height: 0,
                borderTop: '10px solid transparent',
                borderBottom: '10px solid transparent',
                borderLeft: '18px solid #c9a87c',
              }}
            />
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative rounded-sm overflow-hidden bg-surface border border-border">
      <video
        ref={videoRef}
        src={artifactPath(src)}
        controls
        autoPlay
        playsInline
        preload="metadata"
        className="w-full h-52 object-cover"
        onPlay={() => pauseForVideo()}
        onPause={() => resumeFromVideo()}
        onEnded={() => resumeFromVideo()}
      />
    </div>
  )
}

export function FunnySection() {
  const reduced = useReducedMotion()

  return (
    <section className="py-20 md:py-28 px-4 md:px-8" style={{ background: '#111008' }}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-gold text-sm tracking-[0.3em] uppercase font-sans mb-3">
            Now for the real content
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-cream">
            The Funny Side 😂
          </h2>
        </motion.div>

        {/* Funny photos */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10"
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
        >
          {siteConfig.media.funnyPhotos.map((photo, i) => (
            <motion.div
              key={photo}
              className="relative aspect-square rounded-sm overflow-hidden"
              variants={reduced ? fadeUpReducedVariants : fadeUpVariants}
            >
              <Image
                src={artifactPath(photo)}
                alt={`Funny photo ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Funny videos */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
        >
          {siteConfig.media.funnyVideos.map((video, i) => (
            <motion.div
              key={video}
              variants={reduced ? fadeUpReducedVariants : fadeUpVariants}
            >
              <FunnyVideo src={video} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
