'use client'

import { useState, useCallback } from 'react'
import { LoadingScreen } from '@/components/LoadingScreen'
import { TopBar } from '@/components/TopBar'
import { Hero } from '@/components/Hero'
import { BirthdayTimer } from '@/components/BirthdayTimer'
import { StatsCounter } from '@/components/StatsCounter'
import { SoloGallery } from '@/components/SoloGallery'
import { QuoteBreak } from '@/components/QuoteBreak'
import { SectionDivider } from '@/components/SectionDivider'
import { FamilyFilmstrip } from '@/components/FamilyFilmstrip'
import { HashtagWall } from '@/components/HashtagWall'
import { Timeline } from '@/components/Timeline'
import { GiftBox } from '@/components/GiftBox'
import { FunnySection } from '@/components/FunnySection'
import { MemeVideos } from '@/components/MemeVideos'
import { LoveCards } from '@/components/LoveCards'
import { Closing } from '@/components/Closing'
import { ScrollProgressBar } from '@/components/ScrollProgressBar'
import { SectionNav } from '@/components/SectionNav'
import { siteConfig } from '@/config/site.config'

export default function Home() {
  const [loadingDone, setLoadingDone] = useState(false)
  const handleLoadingComplete = useCallback(() => setLoadingDone(true), [])

  return (
    <>
      <LoadingScreen onComplete={handleLoadingComplete} />

      {loadingDone && (
        <>
          <ScrollProgressBar />
          <SectionNav />

          <main>
            {/* 01 — Top bar (persistent) */}
            <TopBar />

            {/* 02 — Hero */}
            <div id="hero"><Hero /></div>

            {/* 03 — Birthday Timer */}
            <div id="timer"><BirthdayTimer /></div>

            {/* 04 — Stats Counter (id="stats" baked in) */}
            <StatsCounter />

            {/* 05 — Solo Gallery I */}
            <div id="gallery-1">
              <SoloGallery photos={siteConfig.media.soloGallery1} />
            </div>

            {/* 06 — Quote Break */}
            <div id="quote"><QuoteBreak /></div>

            <SectionDivider />

            {/* 07 — Family Filmstrip I */}
            <div id="filmstrip-1">
              <FamilyFilmstrip photos={siteConfig.media.familyFilmstrip1} />
            </div>

            {/* 08 — Solo Gallery II */}
            <div id="gallery-2">
              <SoloGallery photos={siteConfig.media.soloGallery2} />
            </div>

            {/* 09 — Hashtag Wall */}
            <div id="hashtags"><HashtagWall /></div>

            <SectionDivider />

            {/* 10 — Timeline (id="timeline" baked in) */}
            <Timeline />

            {/* 11 — Gift Box */}
            <div id="gift"><GiftBox /></div>

            {/* 12 — Solo Gallery III */}
            <div id="gallery-3">
              <SoloGallery photos={siteConfig.media.soloGallery3} />
            </div>

            {/* 13 — Family Filmstrip II */}
            <div id="filmstrip-2">
              <FamilyFilmstrip photos={siteConfig.media.familyFilmstrip2} />
            </div>

            <SectionDivider />

            {/* 14 — Love Cards (id="love-cards" baked in) */}
            <LoveCards />

            {/* 15 — Funny Section */}
            <div id="funny"><FunnySection /></div>

            {/* 16 — Meme Videos */}
            <div id="memes"><MemeVideos /></div>

            {/* 17 — Closing */}
            <div id="closing"><Closing /></div>
          </main>
        </>
      )}
    </>
  )
}
