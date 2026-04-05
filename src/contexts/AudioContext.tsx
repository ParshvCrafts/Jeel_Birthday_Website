'use client'

import React, { createContext, useContext, useRef, useState, useEffect, useCallback } from 'react'
import type { Howl } from 'howler'
import { siteConfig } from '@/config/site.config'

interface AudioContextValue {
  isPlaying: boolean
  toggle: () => void
  duck: () => void
  unduck: () => void
  playGiftSound: () => void
  pauseForVideo: () => void
  resumeFromVideo: () => void
}

const AudioCtx = createContext<AudioContextValue | null>(null)

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const bgRef = useRef<Howl | null>(null)
  const giftRef = useRef<Howl | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const wasPausedForVideo = useRef(false)

  // Lazy-initialize Howler only in browser (SSR-safe)
  const initHowler = useCallback(async () => {
    if (initialized || typeof window === 'undefined') return
    const { Howl } = await import('howler')
    bgRef.current = new Howl({
      src: ['/artifacts/birthday_song.mp3'],
      loop: true,
      volume: siteConfig.music.defaultVolume,
      onplay: () => setIsPlaying(true),
      onpause: () => setIsPlaying(false),
      onstop: () => setIsPlaying(false),
    })
    giftRef.current = new Howl({
      src: ['/artifacts/curse.mp3'],
      volume: siteConfig.music.giftSoundVolume,
    })
    setInitialized(true)
    bgRef.current.play()
  }, [initialized])

  // Start on first user interaction
  useEffect(() => {
    const unlock = () => {
      initHowler()
      document.removeEventListener('click', unlock)
      document.removeEventListener('scroll', unlock, true)
    }
    document.addEventListener('click', unlock, { once: true })
    document.addEventListener('scroll', unlock, { once: true, capture: true })
    return () => {
      document.removeEventListener('click', unlock)
      document.removeEventListener('scroll', unlock, true)
    }
  }, [initHowler])

  const toggle = useCallback(() => {
    if (!bgRef.current) { initHowler(); return }
    if (bgRef.current.playing()) {
      bgRef.current.pause()
    } else {
      bgRef.current.play()
    }
  }, [initHowler])

  const duck = useCallback(() => {
    if (bgRef.current?.playing()) {
      bgRef.current.fade(
        bgRef.current.volume(),
        siteConfig.music.duckedVolume,
        400
      )
    }
  }, [])

  const unduck = useCallback(() => {
    if (bgRef.current?.playing()) {
      bgRef.current.fade(
        bgRef.current.volume(),
        siteConfig.music.defaultVolume,
        600
      )
    }
  }, [])

  const playGiftSound = useCallback(() => {
    const wasPlaying = bgRef.current?.playing() ?? false
    if (wasPlaying) duck()
    giftRef.current?.play()
    giftRef.current?.once('end', () => {
      if (wasPlaying) unduck()
    })
  }, [duck, unduck])

  const pauseForVideo = useCallback(() => {
    if (bgRef.current?.playing()) {
      wasPausedForVideo.current = true
      bgRef.current.pause()
    }
  }, [])

  const resumeFromVideo = useCallback(() => {
    if (wasPausedForVideo.current && bgRef.current && !bgRef.current.playing()) {
      wasPausedForVideo.current = false
      bgRef.current.play()
    } else if (wasPausedForVideo.current) {
      wasPausedForVideo.current = false
    }
  }, [])

  return (
    <AudioCtx.Provider value={{ isPlaying, toggle, duck, unduck, playGiftSound, pauseForVideo, resumeFromVideo }}>
      {children}
    </AudioCtx.Provider>
  )
}

export function useAudioContext(): AudioContextValue {
  const ctx = useContext(AudioCtx)
  if (!ctx) throw new Error('useAudioContext must be used inside AudioProvider')
  return ctx
}
