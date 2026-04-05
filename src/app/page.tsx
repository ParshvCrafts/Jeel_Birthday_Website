'use client'

import { useState, useCallback } from 'react'
import { LoadingScreen } from '@/components/LoadingScreen'
import { TopBar } from '@/components/TopBar'
import { Hero } from '@/components/Hero'
import { BirthdayTimer } from '@/components/BirthdayTimer'
import { SoloGallery } from '@/components/SoloGallery'
import { QuoteBreak } from '@/components/QuoteBreak'
import { FamilyFilmstrip } from '@/components/FamilyFilmstrip'
import { HashtagWall } from '@/components/HashtagWall'
import { GiftBox } from '@/components/GiftBox'
import { FunnySection } from '@/components/FunnySection'
import { MemeVideos } from '@/components/MemeVideos'
import { Closing } from '@/components/Closing'
import { siteConfig } from '@/config/site.config'

export default function Home() {
  const [loadingDone, setLoadingDone] = useState(false)
  const handleLoadingComplete = useCallback(() => setLoadingDone(true), [])

  return (
    <>
      <LoadingScreen onComplete={handleLoadingComplete} />

      {loadingDone && (
        <main>
          {/* 01 — Top bar (persistent) */}
          <TopBar />

          {/* 02 — Hero */}
          <Hero />

          {/* 03 — Birthday Timer */}
          <BirthdayTimer />

          {/* 04 — Solo Gallery I */}
          <SoloGallery photos={siteConfig.media.soloGallery1} />

          {/* 05 — Quote Break */}
          <QuoteBreak />

          {/* 06 — Family Filmstrip I */}
          <FamilyFilmstrip photos={siteConfig.media.familyFilmstrip1} />

          {/* 07 — Solo Gallery II */}
          <SoloGallery photos={siteConfig.media.soloGallery2} />

          {/* 08 — Hashtag Wall */}
          <HashtagWall />

          {/* 09 — Gift Box */}
          <GiftBox />

          {/* 10 — Solo Gallery III */}
          <SoloGallery photos={siteConfig.media.soloGallery3} />

          {/* 11 — Family Filmstrip II */}
          <FamilyFilmstrip photos={siteConfig.media.familyFilmstrip2} />

          {/* 12 — Funny Section */}
          <FunnySection />

          {/* 13 — Meme Videos */}
          <MemeVideos />

          {/* 14 — Closing */}
          <Closing />
        </main>
      )}
    </>
  )
}
