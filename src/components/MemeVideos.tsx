'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'
import { siteConfig } from '@/config/site.config'
import { artifactPath } from '@/lib/mediaUtils'
import { useAudio } from '@/hooks/useAudio'
import { fadeUpVariants, fadeUpReducedVariants } from '@/lib/animations'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const VIDEO_LABELS = [
  siteConfig.text.memeVideoLabels.bholaBaba,
  siteConfig.text.memeVideoLabels.liveLife,
]

function MemeVideo({ src, label }: { src: string; label: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const { pauseForVideo, resumeFromVideo } = useAudio()
  const reduced = useReducedMotion()

  return (
    <motion.div
      className="flex flex-col gap-3"
      variants={reduced ? fadeUpReducedVariants : fadeUpVariants}
    >
      <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans text-center">{label}</p>
      <div className="relative rounded-sm overflow-hidden border border-border bg-surface">
        <video
          ref={videoRef}
          src={artifactPath(src)}
          controls
          playsInline
          preload="metadata"
          className="w-full rounded-sm"
          style={{ maxHeight: '420px' }}
          onPlay={() => pauseForVideo()}
          onPause={() => resumeFromVideo()}
          onEnded={() => resumeFromVideo()}
        />
      </div>
    </motion.div>
  )
}

export function MemeVideos() {
  const reduced = useReducedMotion()

  return (
    <section className="py-20 md:py-28 px-4 md:px-8 bg-canvas">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-gold text-xs tracking-[0.4em] uppercase font-sans mb-3">Required viewing</p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-cream">
            Meme Drop 🎬
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {siteConfig.media.memeVideos.map((video, i) => (
            <MemeVideo key={video} src={video} label={VIDEO_LABELS[i] ?? video} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
