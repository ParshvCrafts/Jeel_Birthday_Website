# Jeel Birthday Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished, cinematic, scroll-driven birthday website for Jeel with 14 sections, a music system, gallery systems, and interactive features, deployable as a static site on Vercel.

**Architecture:** Next.js 14 App Router with `output: 'export'` for static deployment. All 40+ media assets served from `/public/artifacts/`. Animation via Framer Motion, audio via Howler.js, all content/config in one `site.config.ts` file so text and volumes can be updated without touching components.

**Tech Stack:** Next.js 14 · TypeScript · Tailwind CSS · Framer Motion · Howler.js · @radix-ui/react-dialog · Vitest + @testing-library/react · next/font (Playfair Display + Inter)

---

## File Map

```
/public/artifacts/              ← all media (copied from /artifacts/)
/scripts/
  compress-videos.sh            ← ffmpeg helper for Vercel size limit
/src/
  app/
    layout.tsx                  ← root layout: fonts, metadata, AudioProvider
    page.tsx                    ← assembles all 14 sections in order
    globals.css                 ← Tailwind base + CSS custom properties + keyframes
  components/
    LoadingScreen.tsx           ← SVG "Chiku" path draw → fade out
    TopBar.tsx                  ← fixed music toggle bar
    Hero.tsx                    ← split hero: text left, main.jpeg right
    BirthdayTimer.tsx           ← birthday mode vs countdown mode
    SoloGallery.tsx             ← masonry grid (used 3×, accepts photo array)
    FamilyFilmstrip.tsx         ← horizontal drag/swipe carousel (used 2×)
    QuoteBreak.tsx              ← full-width cinematic text reveal
    HashtagWall.tsx             ← floating animated nickname tags
    GiftBox.tsx                 ← 3D gift → finger.jpeg + curse.mp3
    FunnySection.tsx            ← funny photos + funny mp4 videos
    MemeVideos.tsx              ← bhola_baba.mp4 + live_life.mp4
    Closing.tsx                 ← final message + CSS confetti
    Lightbox.tsx                ← full-screen photo viewer
  config/
    site.config.ts              ← ALL editable content: text, volumes, media
  contexts/
    AudioContext.tsx            ← React context wrapping Howler instance
  hooks/
    useAudio.ts                 ← consume AudioContext, exposes play/pause/duck
    useBirthday.ts              ← returns { isBirthday, countdown, age }
    useReducedMotion.ts         ← wraps window.matchMedia prefers-reduced-motion
  lib/
    animations.ts               ← shared Framer Motion variant objects
    dateUtils.ts                ← pure date functions (tested)
    mediaUtils.ts               ← artifact path builder
next.config.ts
tailwind.config.ts
vitest.config.ts
vitest.setup.ts
```

---

## Task 1: Scaffold Next.js Project

**Files:**
- Create: `package.json` (via npx)
- Create: `next.config.ts`
- Create: `tailwind.config.ts`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `tsconfig.json` (via npx)

- [ ] **Step 1: Initialize the Next.js project**

Run from inside the `Jeel Birthday Website` directory (it already exists — pass `.` as path):

```bash
cd "C:/Users/p1a2r/OneDrive/Desktop/Git Hub Projects/Jeel Birthday Website"
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-git
```

When prompted: accept all defaults. This scaffolds `src/app/`, `tailwind.config.ts`, `tsconfig.json`, `package.json`.

- [ ] **Step 2: Install additional dependencies**

```bash
npm install framer-motion howler @radix-ui/react-dialog
npm install -D @types/howler vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom @vitejs/plugin-react
```

- [ ] **Step 3: Write `next.config.ts`**

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
}

export default nextConfig
```

- [ ] **Step 4: Write `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

- [ ] **Step 5: Write `vitest.setup.ts`**

```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 6: Add test script to `package.json`**

Open `package.json` and add to the `"scripts"` section:

```json
"test": "vitest run",
"test:watch": "vitest",
"test:ui": "vitest --ui"
```

- [ ] **Step 7: Run the dev server to verify scaffold works**

```bash
npm run dev
```

Expected: Next.js dev server starts on `http://localhost:3000`. Default Next.js home page loads. Stop with Ctrl+C.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js 14 project with Tailwind, Framer Motion, Howler, Vitest"
```

---

## Task 2: Copy Media Assets to Public

**Files:**
- Create: `/public/artifacts/` (copy all files from `/artifacts/`)

- [ ] **Step 1: Create the public artifacts directory and copy all media**

```bash
mkdir -p public/artifacts
cp artifacts/* public/artifacts/
```

- [ ] **Step 2: Verify the copy**

```bash
ls public/artifacts/ | wc -l
```

Expected: `51` (same count as `ls artifacts/ | wc -l`).

- [ ] **Step 3: Add `.superpowers/` to `.gitignore`**

Open `.gitignore` and append:

```
.superpowers/
```

- [ ] **Step 4: Commit**

```bash
git add public/artifacts/ .gitignore
git commit -m "feat: add media assets to public/artifacts"
```

---

## Task 3: Design Tokens + Global Styles

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Write `tailwind.config.ts`**

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#0e0e0e',
        surface: '#161210',
        'surface-2': '#1e1a14',
        border: '#2a2018',
        gold: '#c9a87c',
        'gold-muted': '#8a6a3a',
        cream: '#f5f0e8',
        muted: '#8a7a6a',
        subtle: '#4a3a2a',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'float-drift': {
          '0%, 100%': { transform: 'translateY(0px) rotate(var(--tag-rotate, 0deg))' },
          '50%': { transform: 'translateY(-8px) rotate(var(--tag-rotate, 0deg))' },
        },
        'slot-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0%)', opacity: '1' },
        },
        'confetti-fall': {
          '0%': { transform: 'translateY(-20px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
        'music-wave': {
          '0%, 100%': { transform: 'scaleY(0.4)' },
          '50%': { transform: 'scaleY(1)' },
        },
      },
      animation: {
        'float-drift': 'float-drift 4s ease-in-out infinite',
        'slot-up': 'slot-up 0.3s ease-out forwards',
        'confetti-fall': 'confetti-fall 3s ease-in forwards',
        'music-wave': 'music-wave 0.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 2: Write `src/app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --font-playfair: 'Playfair Display', serif;
  --font-inter: 'Inter', sans-serif;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: #0e0e0e;
  color: #f5f0e8;
  font-family: var(--font-inter), system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: #0e0e0e;
}
::-webkit-scrollbar-thumb {
  background: #2a2018;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #c9a87c44;
}

/* Filmstrip drag cursor */
.filmstrip-drag {
  cursor: grab;
}
.filmstrip-drag:active {
  cursor: grabbing;
}

/* Reduced motion overrides */
@media (prefers-reduced-motion: reduce) {
  .animate-float-drift,
  .animate-music-wave {
    animation: none;
  }
}

/* Gift box 3D */
.gift-scene {
  perspective: 600px;
}
.gift-lid {
  transform-origin: top center;
  transform-style: preserve-3d;
}
```

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.ts src/app/globals.css
git commit -m "feat: add design tokens, tailwind config, and global CSS"
```

---

## Task 4: Site Config

**Files:**
- Create: `src/config/site.config.ts`

- [ ] **Step 1: Create the config directory**

```bash
mkdir -p src/config
```

- [ ] **Step 2: Write `src/config/site.config.ts`**

```ts
export const siteConfig = {
  birthday: {
    name: 'Jeel',
    nickname: 'Chiku',
    day: 5,
    month: 4, // April (1-indexed for display, but Date uses 0-indexed — see dateUtils)
    birthYear: 2002,
    age: 24,
    hinglishMessage:
      "Ohh my god! It is your birthday Jeel. You have turned 24 years dodhi this year",
    countingMessage:
      "I am counting so that you don't have get jealous seeing other's birthday or cry when your birthday will come again",
  },

  text: {
    heroGreeting: 'Happy Birthday,',
    heroName: 'Chiku',
    blessing:
      'May god bless you and life gives you all the happiness. May this birthday be your best birthday ever',
    quoteBreak:
      'Eat healthy not my brain, sleep nicely, fart less, and live life like muchu, muchu',
    closing: '', // ← FILL THIS IN: your personal closing message to Jeel
    memeVideoLabels: {
      bholaBaba: 'Bhola Baba',
      liveLife: 'Live Life',
    },
  },

  music: {
    defaultVolume: 0.25,     // background music volume (0–1)
    duckedVolume: 0.05,      // background volume while gift sound plays
    giftSoundVolume: 0.8,    // curse.mp3 volume
    autoplayOnFirstInteraction: true,
  },

  hashtags: [
    '#Chiku',
    '#Noob',
    '#Shruti',
    '#Hopari',
    '#AithiGoid',
    '#Choita',
    '#Padodi',
    '#Hagrid',
    '#MarkHenry',
  ],

  media: {
    // Change order here to reorder photos — components read from this config
    soloGallery1: [
      { src: 'solo_1.jpeg', size: 'tall' as const },
      { src: 'solo_2.jpeg', size: 'normal' as const },
      { src: 'solo_3.jpeg', size: 'normal' as const },
      { src: 'solo_4.jpeg', size: 'wide' as const },
      { src: 'solo_5.jpeg', size: 'normal' as const },
      { src: 'solo_6.jpeg', size: 'tall' as const },
    ],
    soloGallery2: [
      { src: 'solo_7.jpeg', size: 'normal' as const },
      { src: 'solo_8.jpeg', size: 'tall' as const },
      { src: 'solo_9.jpeg', size: 'normal' as const },
      { src: 'solo_10.jpeg', size: 'wide' as const },
      { src: 'solo_11.jpeg', size: 'normal' as const },
      { src: 'solo_12.jpeg', size: 'normal' as const },
    ],
    soloGallery3: [
      { src: 'solo_13.jpeg', size: 'normal' as const },
      { src: 'solo_14.jpeg', size: 'tall' as const },
      { src: 'solo_15.jpeg', size: 'normal' as const },
      { src: 'solo_16.jpeg', size: 'normal' as const },
      { src: 'solo_17.jpeg', size: 'wide' as const },
    ],
    familyFilmstrip1: [
      'family_1.jpeg', 'family_2.jpeg', 'family_3.jpeg', 'family_4.jpeg', 'family_5.jpeg',
      'family_6.jpeg', 'family_7.jpeg', 'family_8.jpeg', 'family_9.jpeg', 'family_10.jpeg',
    ],
    familyFilmstrip2: [
      'family_11.jpeg', 'family_12.jpeg', 'family_13.jpeg', 'family_14.jpeg', 'family_15.jpeg',
      'family_16.jpeg', 'family_17.jpeg', 'family_18.jpeg', 'family_19.jpeg', 'family_20.jpeg',
    ],
    // Note: funny_2.jpeg and funny_2.mp4 share base name — extensions are explicit
    funnyPhotos: ['funny_1.jpeg', 'funny_2.jpeg', 'funny_3.jpeg', 'funny_4.jpeg'],
    funnyVideos: ['funny_2.mp4', 'funny_5.mp4', 'funny_6.mp4', 'funny_7.mp4'],
    memeVideos: ['bhola_baba.mp4', 'live_life.mp4'],
  },
} as const

export type PhotoSize = 'normal' | 'tall' | 'wide'
export type PhotoEntry = { src: string; size: PhotoSize }
```

- [ ] **Step 3: Commit**

```bash
git add src/config/site.config.ts
git commit -m "feat: add site.config.ts with all content, media, and music settings"
```

---

## Task 5: Date Utilities + Tests

**Files:**
- Create: `src/lib/dateUtils.ts`
- Create: `src/lib/__tests__/dateUtils.test.ts`

- [ ] **Step 1: Create directories**

```bash
mkdir -p src/lib/__tests__
```

- [ ] **Step 2: Write the failing tests first**

Create `src/lib/__tests__/dateUtils.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  isBirthday,
  getNextBirthday,
  getCountdown,
  type Countdown,
} from '../dateUtils'

describe('isBirthday', () => {
  it('returns true on April 5', () => {
    const april5 = new Date(2026, 3, 5, 12, 0, 0) // month is 0-indexed
    expect(isBirthday(april5, 5, 4)).toBe(true)
  })

  it('returns false on April 4', () => {
    const april4 = new Date(2026, 3, 4, 12, 0, 0)
    expect(isBirthday(april4, 5, 4)).toBe(false)
  })

  it('returns false on April 6', () => {
    const april6 = new Date(2026, 3, 6, 12, 0, 0)
    expect(isBirthday(april6, 5, 4)).toBe(false)
  })
})

describe('getNextBirthday', () => {
  it('returns April 5 of the same year when called before April 5', () => {
    const jan1 = new Date(2026, 0, 1)
    const next = getNextBirthday(jan1, 5, 4)
    expect(next.getFullYear()).toBe(2026)
    expect(next.getMonth()).toBe(3) // 0-indexed April
    expect(next.getDate()).toBe(5)
  })

  it('returns April 5 of the next year when called after April 5', () => {
    const april6 = new Date(2026, 3, 6)
    const next = getNextBirthday(april6, 5, 4)
    expect(next.getFullYear()).toBe(2027)
    expect(next.getMonth()).toBe(3)
    expect(next.getDate()).toBe(5)
  })

  it('returns April 5 of the next year when called on April 5 itself', () => {
    const april5 = new Date(2026, 3, 5, 10, 0, 0)
    const next = getNextBirthday(april5, 5, 4)
    // On the birthday, we're not counting down — caller should check isBirthday first
    // But if asked for next birthday from April 5, it returns next year
    expect(next.getFullYear()).toBe(2027)
  })
})

describe('getCountdown', () => {
  it('returns correct days/hours/minutes/seconds', () => {
    const now = new Date(2026, 3, 4, 12, 0, 0) // April 4, noon
    const target = new Date(2026, 3, 5, 12, 0, 0) // April 5, noon
    const result = getCountdown(now, target)
    expect(result.days).toBe(1)
    expect(result.hours).toBe(0)
    expect(result.minutes).toBe(0)
    expect(result.seconds).toBe(0)
  })

  it('returns all zeros when target is in the past', () => {
    const now = new Date(2026, 3, 6)
    const target = new Date(2026, 3, 5)
    const result = getCountdown(now, target)
    expect(result).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  })
})
```

- [ ] **Step 3: Run tests to confirm they fail**

```bash
npm test
```

Expected: FAIL — "Cannot find module '../dateUtils'"

- [ ] **Step 4: Write `src/lib/dateUtils.ts`**

```ts
export interface Countdown {
  days: number
  hours: number
  minutes: number
  seconds: number
}

/**
 * Returns true if `date` matches the birthday day and month.
 * @param date - date to check
 * @param day - birthday day (1-31)
 * @param month - birthday month (1-12, human-readable)
 */
export function isBirthday(date: Date, day: number, month: number): boolean {
  return date.getDate() === day && date.getMonth() === month - 1
}

/**
 * Returns the next occurrence of the birthday after `from`.
 * If `from` is on or after the birthday this year, returns next year.
 */
export function getNextBirthday(from: Date, day: number, month: number): Date {
  const thisYear = new Date(from.getFullYear(), month - 1, day, 0, 0, 0, 0)
  if (from < thisYear) return thisYear
  return new Date(from.getFullYear() + 1, month - 1, day, 0, 0, 0, 0)
}

/**
 * Returns the remaining time from `now` to `target` as days/hours/minutes/seconds.
 * Returns all zeros if target is in the past.
 */
export function getCountdown(now: Date, target: Date): Countdown {
  const diff = target.getTime() - now.getTime()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  return { days, hours, minutes, seconds }
}
```

- [ ] **Step 5: Run tests to confirm they pass**

```bash
npm test
```

Expected: PASS — all 6 tests green.

- [ ] **Step 6: Commit**

```bash
git add src/lib/dateUtils.ts src/lib/__tests__/dateUtils.test.ts
git commit -m "feat: add dateUtils with isBirthday, getNextBirthday, getCountdown — all tests pass"
```

---

## Task 6: useBirthday Hook + Test

**Files:**
- Create: `src/hooks/useBirthday.ts`
- Create: `src/hooks/__tests__/useBirthday.test.ts`

- [ ] **Step 1: Create directories**

```bash
mkdir -p src/hooks/__tests__
```

- [ ] **Step 2: Write failing test**

Create `src/hooks/__tests__/useBirthday.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useBirthday } from '../useBirthday'

describe('useBirthday', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns isBirthday=true on April 5', () => {
    vi.setSystemTime(new Date(2026, 3, 5, 10, 0, 0))
    const { result } = renderHook(() => useBirthday())
    expect(result.current.isBirthday).toBe(true)
  })

  it('returns isBirthday=false on April 6', () => {
    vi.setSystemTime(new Date(2026, 3, 6, 10, 0, 0))
    const { result } = renderHook(() => useBirthday())
    expect(result.current.isBirthday).toBe(false)
  })

  it('returns a countdown object when not birthday', () => {
    vi.setSystemTime(new Date(2026, 3, 4, 0, 0, 0)) // April 4
    const { result } = renderHook(() => useBirthday())
    expect(result.current.countdown.days).toBe(1)
    expect(result.current.countdown.hours).toBe(0)
  })

  it('ticks the countdown every second', () => {
    vi.setSystemTime(new Date(2026, 3, 4, 23, 59, 58)) // 2 seconds before midnight
    const { result } = renderHook(() => useBirthday())
    const initialSeconds = result.current.countdown.seconds

    act(() => { vi.advanceTimersByTime(1000) })
    // After 1 second, seconds should change
    expect(result.current.countdown.seconds).not.toBe(initialSeconds)
  })
})
```

- [ ] **Step 3: Run tests — confirm FAIL**

```bash
npm test
```

Expected: FAIL — "Cannot find module '../useBirthday'"

- [ ] **Step 4: Write `src/hooks/useBirthday.ts`**

```ts
'use client'

import { useState, useEffect } from 'react'
import { siteConfig } from '@/config/site.config'
import { isBirthday, getNextBirthday, getCountdown, type Countdown } from '@/lib/dateUtils'

const { day, month } = siteConfig.birthday

export interface BirthdayState {
  isBirthday: boolean
  countdown: Countdown
  age: number
}

export function useBirthday(): BirthdayState {
  const [state, setState] = useState<BirthdayState>(() => {
    const now = new Date()
    const birthday = isBirthday(now, day, month)
    const next = getNextBirthday(now, day, month)
    return {
      isBirthday: birthday,
      countdown: birthday ? { days: 0, hours: 0, minutes: 0, seconds: 0 } : getCountdown(now, next),
      age: siteConfig.birthday.age,
    }
  })

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const birthday = isBirthday(now, day, month)
      const next = getNextBirthday(now, day, month)
      setState({
        isBirthday: birthday,
        countdown: birthday ? { days: 0, hours: 0, minutes: 0, seconds: 0 } : getCountdown(now, next),
        age: siteConfig.birthday.age,
      })
    }
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return state
}
```

- [ ] **Step 5: Run tests — confirm PASS**

```bash
npm test
```

Expected: all tests green.

- [ ] **Step 6: Commit**

```bash
git add src/hooks/useBirthday.ts src/hooks/__tests__/useBirthday.test.ts
git commit -m "feat: add useBirthday hook with countdown logic — all tests pass"
```

---

## Task 7: Shared Utilities + Hooks

**Files:**
- Create: `src/lib/animations.ts`
- Create: `src/lib/mediaUtils.ts`
- Create: `src/hooks/useReducedMotion.ts`

- [ ] **Step 1: Write `src/lib/animations.ts`**

```ts
import type { Variants } from 'framer-motion'

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

export const fadeUpReducedVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
}

export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

export const slideFromRightVariants: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
}

export const slideFromRightReducedVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
}

export const clipRevealVariants: Variants = {
  hidden: { clipPath: 'inset(0 100% 0 0)' },
  visible: {
    clipPath: 'inset(0 0% 0 0)',
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
}
```

- [ ] **Step 2: Write `src/lib/mediaUtils.ts`**

```ts
/**
 * Returns the public URL for an artifact file.
 * Usage: artifactPath('solo_1.jpeg') → '/artifacts/solo_1.jpeg'
 */
export function artifactPath(filename: string): string {
  return `/artifacts/${filename}`
}
```

- [ ] **Step 3: Write `src/hooks/useReducedMotion.ts`**

```ts
'use client'

import { useState, useEffect } from 'react'

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return reduced
}
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/animations.ts src/lib/mediaUtils.ts src/hooks/useReducedMotion.ts
git commit -m "feat: add shared animation variants, mediaUtils, useReducedMotion hook"
```

---

## Task 8: Audio Context + useAudio Hook

**Files:**
- Create: `src/contexts/AudioContext.tsx`
- Create: `src/hooks/useAudio.ts`

- [ ] **Step 1: Create directories**

```bash
mkdir -p src/contexts
```

- [ ] **Step 2: Write `src/contexts/AudioContext.tsx`**

```tsx
'use client'

import React, { createContext, useContext, useRef, useState, useEffect, useCallback } from 'react'
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
  const bgRef = useRef<any>(null)
  const giftRef = useRef<any>(null)
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
    bgRef.current?.fade(
      bgRef.current.volume(),
      siteConfig.music.duckedVolume,
      400
    )
  }, [])

  const unduck = useCallback(() => {
    bgRef.current?.fade(
      bgRef.current.volume(),
      siteConfig.music.defaultVolume,
      600
    )
  }, [])

  const playGiftSound = useCallback(() => {
    duck()
    giftRef.current?.play()
    giftRef.current?.once('end', unduck)
  }, [duck, unduck])

  const pauseForVideo = useCallback(() => {
    if (bgRef.current?.playing()) {
      wasPausedForVideo.current = true
      bgRef.current.pause()
    }
  }, [])

  const resumeFromVideo = useCallback(() => {
    if (wasPausedForVideo.current) {
      wasPausedForVideo.current = false
      bgRef.current?.play()
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
```

- [ ] **Step 3: Write `src/hooks/useAudio.ts`**

```ts
// Re-export from context for a cleaner import path in components
export { useAudioContext as useAudio } from '@/contexts/AudioContext'
```

- [ ] **Step 4: Commit**

```bash
git add src/contexts/AudioContext.tsx src/hooks/useAudio.ts
git commit -m "feat: add AudioProvider with Howler.js — bg music, duck/unduck, gift sound, video pause"
```

---

## Task 9: Root Layout + Loading Screen

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/components/LoadingScreen.tsx`

- [ ] **Step 1: Write `src/app/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { AudioProvider } from '@/contexts/AudioContext'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Happy Birthday, Chiku 🎂',
  description: 'A special birthday for a special person — turning 24.',
  openGraph: {
    title: 'Happy Birthday, Chiku!',
    description: 'Turning 24 on April 5, 2026',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-canvas text-cream font-sans antialiased">
        <AudioProvider>
          {children}
        </AudioProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Write `src/components/LoadingScreen.tsx`**

```tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

interface LoadingScreenProps {
  onComplete: () => void
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    // Path draw takes ~1.4s, then fade ~0.6s
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onComplete, 600)
    }, 1400)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-canvas"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          <svg
            viewBox="0 0 320 80"
            width="320"
            height="80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* "Chiku" rendered as a stroked path — drawn via dashoffset animation */}
            <text
              x="50%"
              y="62"
              textAnchor="middle"
              fontFamily="var(--font-playfair), Georgia, serif"
              fontSize="56"
              fontWeight="700"
              fill="none"
              stroke="#c9a87c"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: 800,
                strokeDashoffset: 800,
                animation: 'draw-path 1.4s ease forwards',
              }}
            >
              Chiku
            </text>
          </svg>
          <style>{`
            @keyframes draw-path {
              to { stroke-dashoffset: 0; }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx src/components/LoadingScreen.tsx
git commit -m "feat: add root layout with AudioProvider, fonts, and LoadingScreen SVG draw animation"
```

---

## Task 10: Top Bar

**Files:**
- Create: `src/components/TopBar.tsx`

- [ ] **Step 1: Write `src/components/TopBar.tsx`**

```tsx
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
                isPlaying
                  ? `animate-music-wave`
                  : 'h-[6px]'
              }`}
              style={
                isPlaying
                  ? {
                      height: '16px',
                      animationDelay: `${i * 0.12}s`,
                    }
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/TopBar.tsx
git commit -m "feat: add TopBar with fixed position, music toggle, animated wave bars"
```

---

## Task 11: Hero Section

**Files:**
- Create: `src/components/Hero.tsx`

- [ ] **Step 1: Write `src/components/Hero.tsx`**

```tsx
'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { siteConfig } from '@/config/site.config'
import { artifactPath } from '@/lib/mediaUtils'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { fadeUpVariants, slideFromRightVariants, staggerContainerVariants, fadeUpReducedVariants, slideFromRightReducedVariants } from '@/lib/animations'

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
        <div className="absolute inset-y-0 left-0 w-24 z-10 hidden lg:block"
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Hero.tsx
git commit -m "feat: add Hero section — split layout, text stagger, photo slide, blessing text"
```

---

## Task 12: Birthday Timer

**Files:**
- Create: `src/components/BirthdayTimer.tsx`

- [ ] **Step 1: Write `src/components/BirthdayTimer.tsx`**

```tsx
'use client'

import { motion } from 'framer-motion'
import { useBirthday } from '@/hooks/useBirthday'
import { siteConfig } from '@/config/site.config'
import { fadeUpVariants, staggerContainerVariants } from '@/lib/animations'
import { useReducedMotion } from '@/hooks/useReducedMotion'

function DigitBlock({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, '0')
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative overflow-hidden bg-surface border border-border rounded px-4 py-3 md:px-8 md:py-5 min-w-[70px] md:min-w-[100px]">
        <motion.span
          key={display} // re-animate on value change
          className="block font-serif text-3xl md:text-5xl font-bold text-gold tabular-nums text-center"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {display}
        </motion.span>
      </div>
      <span className="text-subtle text-xs tracking-[0.2em] uppercase font-sans">{label}</span>
    </div>
  )
}

export function BirthdayTimer() {
  const { isBirthday, countdown } = useBirthday()
  const reduced = useReducedMotion()

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
          /* ── Birthday mode ── */
          <>
            <motion.div
              className="text-gold text-xs tracking-[0.4em] uppercase font-sans mb-6"
              variants={reduced ? { hidden: { opacity: 0 }, visible: { opacity: 1 } } : fadeUpVariants}
            >
              🎂 Today is the day
            </motion.div>
            <motion.h2
              className="font-serif text-4xl md:text-6xl font-bold text-cream mb-6 leading-tight"
              variants={reduced ? { hidden: { opacity: 0 }, visible: { opacity: 1 } } : fadeUpVariants}
            >
              {siteConfig.birthday.hinglishMessage}
            </motion.h2>
            <motion.p
              className="text-muted text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-sans"
              variants={reduced ? { hidden: { opacity: 0 }, visible: { opacity: 1 } } : fadeUpVariants}
            >
              {siteConfig.birthday.countingMessage}
            </motion.p>
          </>
        ) : (
          /* ── Countdown mode ── */
          <>
            <motion.p
              className="text-gold text-xs tracking-[0.4em] uppercase font-sans mb-4"
              variants={reduced ? { hidden: { opacity: 0 }, visible: { opacity: 1 } } : fadeUpVariants}
            >
              Next birthday in
            </motion.p>
            <motion.p
              className="text-muted font-sans text-sm mb-10 max-w-xl mx-auto leading-relaxed"
              variants={reduced ? { hidden: { opacity: 0 }, visible: { opacity: 1 } } : fadeUpVariants}
            >
              {siteConfig.birthday.countingMessage}
            </motion.p>
            <motion.div
              className="flex flex-wrap items-end justify-center gap-4 md:gap-8"
              variants={reduced ? { hidden: { opacity: 0 }, visible: { opacity: 1 } } : fadeUpVariants}
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/BirthdayTimer.tsx
git commit -m "feat: add BirthdayTimer — birthday mode with Hinglish message, countdown with slot-roll digits"
```

---

## Task 13: Lightbox

**Files:**
- Create: `src/components/Lightbox.tsx`

- [ ] **Step 1: Write `src/components/Lightbox.tsx`**

```tsx
'use client'

import * as Dialog from '@radix-ui/react-dialog'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useCallback } from 'react'
import { artifactPath } from '@/lib/mediaUtils'

interface LightboxProps {
  photos: string[] // filenames
  initialIndex: number
  open: boolean
  onClose: () => void
}

export function Lightbox({ photos, initialIndex, open, onClose }: LightboxProps) {
  const [index, setIndex] = useState(initialIndex)

  const prev = useCallback(() => setIndex((i) => (i - 1 + photos.length) % photos.length), [photos.length])
  const next = useCallback(() => setIndex((i) => (i + 1) % photos.length), [photos.length])

  // Reset index when opened
  const handleOpen = (o: boolean) => {
    if (o) setIndex(initialIndex)
    if (!o) onClose()
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpen}>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <motion.div
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        </Dialog.Overlay>
        <Dialog.Content
          className="fixed inset-0 z-[101] flex items-center justify-center p-4 outline-none"
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') prev()
            if (e.key === 'ArrowRight') next()
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              className="relative w-full max-w-4xl aspect-[4/3]"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
            >
              <Image
                src={artifactPath(photos[index])}
                alt={`Photo ${index + 1} of ${photos.length}`}
                fill
                className="object-contain"
                sizes="(max-width: 1280px) 100vw, 80vw"
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {photos.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-cream/70 hover:text-gold transition-colors bg-canvas/50 rounded-full"
                aria-label="Previous photo"
              >
                ←
              </button>
              <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-cream/70 hover:text-gold transition-colors bg-canvas/50 rounded-full"
                aria-label="Next photo"
              >
                →
              </button>
            </>
          )}

          {/* Counter */}
          <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-subtle text-xs tracking-widest font-sans">
            {index + 1} / {photos.length}
          </span>

          {/* Close */}
          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-cream/50 hover:text-gold transition-colors"
              aria-label="Close lightbox"
            >
              ✕
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Lightbox.tsx
git commit -m "feat: add Lightbox component — full-screen photo viewer with keyboard nav and arrow buttons"
```

---

## Task 14: Solo Gallery (Masonry)

**Files:**
- Create: `src/components/SoloGallery.tsx`

- [ ] **Step 1: Write `src/components/SoloGallery.tsx`**

```tsx
'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { type PhotoEntry } from '@/config/site.config'
import { artifactPath } from '@/lib/mediaUtils'
import { fadeUpVariants, staggerContainerVariants, fadeUpReducedVariants } from '@/lib/animations'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { Lightbox } from './Lightbox'

interface SoloGalleryProps {
  photos: readonly PhotoEntry[]
  title?: string
}

export function SoloGallery({ photos, title }: SoloGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const reduced = useReducedMotion()
  const photoFilenames = photos.map((p) => p.src)

  return (
    <section className="py-16 md:py-24 px-4 md:px-8">
      {title && (
        <motion.p
          className="text-center text-gold text-xs tracking-[0.4em] uppercase font-sans mb-10"
          variants={reduced ? fadeUpReducedVariants : fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {title}
        </motion.p>
      )}

      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-6xl mx-auto"
        style={{ gridAutoRows: '200px' }}
        variants={staggerContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        {photos.map((photo, i) => (
          <motion.button
            key={photo.src}
            className={[
              'relative overflow-hidden group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm',
              photo.size === 'tall' ? 'row-span-2' : '',
              photo.size === 'wide' ? 'col-span-2' : '',
            ].join(' ')}
            variants={reduced ? fadeUpReducedVariants : fadeUpVariants}
            onClick={() => setLightboxIndex(i)}
            aria-label={`View photo ${i + 1}`}
          >
            <Image
              src={artifactPath(photo.src)}
              alt={`Photo ${i + 1}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
            {/* Gold frame on hover */}
            <div className="absolute inset-0 border-2 border-gold/0 group-hover:border-gold/40 transition-all duration-300 rounded-sm pointer-events-none" />
            {/* Subtle dark overlay that lifts on hover */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-300" />
          </motion.button>
        ))}
      </motion.div>

      <Lightbox
        photos={photoFilenames}
        initialIndex={lightboxIndex ?? 0}
        open={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
      />
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SoloGallery.tsx
git commit -m "feat: add SoloGallery masonry grid — stagger reveal, gold hover frame, lightbox integration"
```

---

## Task 15: Family Filmstrip

**Files:**
- Create: `src/components/FamilyFilmstrip.tsx`

- [ ] **Step 1: Write `src/components/FamilyFilmstrip.tsx`**

```tsx
'use client'

import Image from 'next/image'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'
import { artifactPath } from '@/lib/mediaUtils'
import { fadeUpVariants, fadeUpReducedVariants } from '@/lib/animations'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { Lightbox } from './Lightbox'

interface FamilyFilmstripProps {
  photos: readonly string[]
  title?: string
}

export function FamilyFilmstrip({ photos, title }: FamilyFilmstripProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [activeDot, setActiveDot] = useState(0)
  const reduced = useReducedMotion()
  const constraintsRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)

  const CARD_WIDTH = 280 // px — adjust if needed
  const GAP = 16

  const handleDragEnd = () => {
    // Update active dot based on x position
    const currentX = x.get()
    const cardStep = CARD_WIDTH + GAP
    const index = Math.max(0, Math.min(photos.length - 1, Math.round(-currentX / cardStep)))
    setActiveDot(index)
  }

  return (
    <section className="py-16 md:py-24 overflow-hidden">
      {title && (
        <motion.p
          className="text-center text-gold text-xs tracking-[0.4em] uppercase font-sans mb-10 px-4"
          variants={reduced ? fadeUpReducedVariants : fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {title}
        </motion.p>
      )}

      {/* Outer track — overflow hidden on desktop, scroll-snap on mobile */}
      <div
        ref={constraintsRef}
        className="overflow-hidden px-4 md:px-8"
      >
        {/* Desktop: Framer Motion drag | Mobile: CSS scroll snap */}
        <motion.div
          className="flex gap-4 filmstrip-drag md:cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={constraintsRef}
          dragElastic={0.08}
          dragTransition={{ bounceStiffness: 300, bounceDamping: 35 }}
          style={{ x }}
          onDragEnd={handleDragEnd}
          // Mobile: native scroll — disable drag on touch devices via CSS
        >
          {photos.map((photo, i) => (
            <motion.button
              key={photo}
              className="relative flex-shrink-0 rounded-sm overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-gold group"
              style={{ width: CARD_WIDTH, height: 380 }}
              onClick={() => setLightboxIndex(i)}
              aria-label={`Family photo ${i + 1}`}
              // Prevent drag from firing click
              onMouseDown={(e) => e.stopPropagation()}
            >
              <Image
                src={artifactPath(photo)}
                alt={`Family photo ${i + 1}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="280px"
                draggable={false}
              />
              <div className="absolute inset-0 border border-gold/0 group-hover:border-gold/30 transition-all duration-300 pointer-events-none" />
            </motion.button>
          ))}

          {/* Peek spacer — shows partial next card */}
          <div style={{ minWidth: 60, flexShrink: 0 }} />
        </motion.div>
      </div>

      {/* Dot indicator */}
      <div className="flex justify-center gap-2 mt-6 px-4">
        {photos.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveDot(i)}
            aria-label={`Go to photo ${i + 1}`}
            className={`transition-all duration-300 rounded-full ${
              i === activeDot
                ? 'w-5 h-2 bg-gold'
                : 'w-2 h-2 bg-border hover:bg-gold/40'
            }`}
          />
        ))}
      </div>

      <Lightbox
        photos={[...photos]}
        initialIndex={lightboxIndex ?? 0}
        open={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
      />
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/FamilyFilmstrip.tsx
git commit -m "feat: add FamilyFilmstrip — horizontal drag carousel with dot indicator and lightbox"
```

---

## Task 16: Quote Break

**Files:**
- Create: `src/components/QuoteBreak.tsx`

- [ ] **Step 1: Write `src/components/QuoteBreak.tsx`**

```tsx
'use client'

import { motion } from 'framer-motion'
import { siteConfig } from '@/config/site.config'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export function QuoteBreak() {
  const reduced = useReducedMotion()
  const words = siteConfig.text.quoteBreak.split(' ')

  return (
    <section className="py-20 md:py-32 px-6 md:px-12 bg-surface/30">
      <div className="max-w-5xl mx-auto">
        {/* Decorative label */}
        <motion.p
          className="text-gold/50 text-xs tracking-[0.4em] uppercase font-sans mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          A note from your brother
        </motion.p>

        {/* Word-by-word reveal */}
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {words.map((word, i) => (
            <div key={i} className="overflow-hidden">
              <motion.span
                className="block font-serif text-2xl md:text-4xl xl:text-5xl font-light text-cream leading-tight"
                initial={reduced ? { opacity: 0 } : { y: '100%', opacity: 0 }}
                whileInView={reduced ? { opacity: 1 } : { y: '0%', opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.04,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {word}
              </motion.span>
            </div>
          ))}
        </div>

        {/* Decorative gold line */}
        <motion.div
          className="mt-10 h-px bg-gradient-to-r from-gold/50 via-gold/20 to-transparent"
          initial={{ scaleX: 0, originX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/QuoteBreak.tsx
git commit -m "feat: add QuoteBreak — cinematic word-by-word text reveal"
```

---

## Task 17: Hashtag Wall

**Files:**
- Create: `src/components/HashtagWall.tsx`

- [ ] **Step 1: Write `src/components/HashtagWall.tsx`**

```tsx
'use client'

import { motion } from 'framer-motion'
import { siteConfig } from '@/config/site.config'
import { useReducedMotion } from '@/hooks/useReducedMotion'

// Stable rotation values — one per tag (avoids random jitter on re-render)
const TAG_ROTATIONS = [-6, 3, -2, 5, -4, 2, -7, 4, -3]
const TAG_DELAYS = [0, 0.3, 0.6, 0.15, 0.45, 0.9, 0.2, 0.7, 0.5]

export function HashtagWall() {
  const reduced = useReducedMotion()

  return (
    <section className="py-20 md:py-28 px-6 overflow-hidden">
      <motion.p
        className="text-center text-gold text-xs tracking-[0.4em] uppercase font-sans mb-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        Also known as
      </motion.p>

      <div className="flex flex-wrap justify-center gap-4 md:gap-6 max-w-4xl mx-auto">
        {siteConfig.hashtags.map((tag, i) => (
          <motion.span
            key={tag}
            className="inline-block font-serif text-xl md:text-2xl font-semibold text-cream/80 select-none px-4 py-2 border border-border/60 rounded-sm"
            style={
              reduced
                ? {}
                : {
                    '--tag-rotate': `${TAG_ROTATIONS[i] ?? 0}deg`,
                    animation: `float-drift ${3.5 + i * 0.3}s ease-in-out infinite`,
                    animationDelay: `${TAG_DELAYS[i] ?? 0}s`,
                  } as React.CSSProperties
            }
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.07 }}
            whileHover={
              reduced
                ? {}
                : {
                    scale: 1.08,
                    color: '#c9a87c',
                    borderColor: '#c9a87c66',
                    y: -4,
                    transition: { type: 'spring', stiffness: 400, damping: 15 },
                  }
            }
          >
            {tag}
          </motion.span>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/HashtagWall.tsx
git commit -m "feat: add HashtagWall — floating animated nickname tags with hover spring lift"
```

---

## Task 18: Gift Box

**Files:**
- Create: `src/components/GiftBox.tsx`

- [ ] **Step 1: Write `src/components/GiftBox.tsx`**

```tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import * as Dialog from '@radix-ui/react-dialog'
import { motion, AnimatePresence } from 'framer-motion'
import { useAudio } from '@/hooks/useAudio'
import { artifactPath } from '@/lib/mediaUtils'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export function GiftBox() {
  const [isOpen, setIsOpen] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const { playGiftSound } = useAudio()
  const reduced = useReducedMotion()

  const handleOpen = () => {
    setIsOpen(true)
    playGiftSound()
    setTimeout(() => setRevealed(true), 600)
  }

  const handleClose = () => {
    setIsOpen(false)
    setTimeout(() => setRevealed(false), 400)
  }

  return (
    <section className="py-24 px-6 flex flex-col items-center gap-6 bg-surface/20">
      <motion.p
        className="text-gold text-xs tracking-[0.4em] uppercase font-sans"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        A special gift
      </motion.p>

      {/* Gift box — click to open */}
      <motion.div
        className="gift-scene cursor-pointer"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        onClick={handleOpen}
        role="button"
        aria-label="Open gift"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleOpen()}
      >
        {/* Box body */}
        <div className="relative w-32 h-28 md:w-48 md:h-40">
          {/* Lid */}
          <motion.div
            className="absolute -top-8 md:-top-12 left-0 right-0 h-10 md:h-14 bg-gold rounded-t-sm z-10 gift-lid flex items-center justify-center"
            animate={isOpen
              ? { rotateX: -110, y: -20, opacity: 0.7 }
              : { rotateX: 0, y: 0, opacity: 1 }
            }
            transition={{ type: 'spring', stiffness: 180, damping: 18 }}
          >
            {/* Bow center */}
            <div className="w-4 h-4 bg-canvas rounded-full border-2 border-canvas/50" />
          </motion.div>

          {/* Box body */}
          <div className="absolute inset-0 bg-gold/80 rounded-sm border border-gold">
            {/* Ribbon vertical */}
            <div className="absolute left-1/2 -translate-x-1/2 inset-y-0 w-1.5 bg-canvas/30" />
          </div>

          {/* Glow on hover */}
          <motion.div
            className="absolute inset-0 rounded-sm pointer-events-none"
            whileHover={{ boxShadow: '0 0 40px 8px rgba(201, 168, 124, 0.25)' }}
          />
        </div>

        <motion.p
          className="text-center text-muted text-xs tracking-widest uppercase font-sans mt-4"
          animate={{ opacity: isOpen ? 0 : 1 }}
        >
          Click to open ↑
        </motion.p>
      </motion.div>

      {/* Reveal dialog */}
      <Dialog.Root open={isOpen} onOpenChange={(o) => !o && handleClose()}>
        <Dialog.Portal>
          <Dialog.Overlay asChild>
            <motion.div
              className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          </Dialog.Overlay>
          <Dialog.Content
            className="fixed inset-0 z-[101] flex flex-col items-center justify-center p-6 outline-none"
          >
            <AnimatePresence>
              {revealed && (
                <motion.div
                  className="relative w-full max-w-sm md:max-w-md aspect-square"
                  initial={{ scale: 0.3, opacity: 0, rotate: -5 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0.3, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                >
                  <Image
                    src={artifactPath('finger.jpeg')}
                    alt="A special gift just for you"
                    fill
                    className="object-contain rounded"
                    sizes="(max-width: 768px) 90vw, 400px"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <Dialog.Close asChild>
              <button
                className="mt-8 text-muted hover:text-gold text-xs tracking-widest uppercase font-sans transition-colors"
                aria-label="Close gift"
              >
                Close
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/GiftBox.tsx
git commit -m "feat: add GiftBox — 3D lid open, finger.jpeg reveal, curse.mp3 via AudioContext"
```

---

## Task 19: Funny Section

**Files:**
- Create: `src/components/FunnySection.tsx`

- [ ] **Step 1: Write `src/components/FunnySection.tsx`**

```tsx
'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useRef } from 'react'
import { siteConfig } from '@/config/site.config'
import { artifactPath } from '@/lib/mediaUtils'
import { useAudio } from '@/hooks/useAudio'
import { fadeUpVariants, staggerContainerVariants, fadeUpReducedVariants } from '@/lib/animations'
import { useReducedMotion } from '@/hooks/useReducedMotion'

function FunnyVideo({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const { pauseForVideo, resumeFromVideo } = useAudio()

  return (
    <div className="relative rounded-sm overflow-hidden bg-surface-2 border border-border">
      <video
        ref={videoRef}
        src={artifactPath(src)}
        controls
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
        {/* Tone-shift header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-gold text-xs tracking-[0.4em] uppercase font-sans mb-3">
            Now for the real content
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-cream">
            The Funny Side 😂
          </h2>
        </motion.div>

        {/* Funny photos — 2×2 grid */}
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

        {/* Funny videos — 2×2 grid */}
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/FunnySection.tsx
git commit -m "feat: add FunnySection — funny photos grid + funny mp4 videos with music pause"
```

---

## Task 20: Meme Videos

**Files:**
- Create: `src/components/MemeVideos.tsx`

- [ ] **Step 1: Write `src/components/MemeVideos.tsx`**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/MemeVideos.tsx
git commit -m "feat: add MemeVideos — bhola_baba + live_life side by side, music pauses on play"
```

---

## Task 21: Closing Section

**Files:**
- Create: `src/components/Closing.tsx`

- [ ] **Step 1: Write `src/components/Closing.tsx`**

```tsx
'use client'

import { motion } from 'framer-motion'
import { siteConfig } from '@/config/site.config'
import { fadeUpVariants, staggerContainerVariants, fadeUpReducedVariants } from '@/lib/animations'
import { useReducedMotion } from '@/hooks/useReducedMotion'

// CSS confetti particles
const CONFETTI_COLORS = ['#c9a87c', '#f5f0e8', '#8a6a3a', '#e8d5b0', '#2a2018']
const CONFETTI_COUNT = 24

export function Closing() {
  const reduced = useReducedMotion()
  const hasClosingMessage = siteConfig.text.closing.trim().length > 0

  return (
    <section className="relative py-28 md:py-40 px-6 overflow-hidden bg-surface/30">
      {/* Confetti */}
      {!reduced && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {Array.from({ length: CONFETTI_COUNT }).map((_, i) => (
            <span
              key={i}
              className="absolute w-2 h-2 rounded-full animate-confetti-fall opacity-0"
              style={{
                backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                left: `${(i / CONFETTI_COUNT) * 100}%`,
                animationDelay: `${i * 0.12}s`,
                animationDuration: `${2.5 + (i % 4) * 0.4}s`,
                animationFillMode: 'both',
              }}
            />
          ))}
        </div>
      )}

      <motion.div
        className="max-w-3xl mx-auto text-center relative z-10"
        variants={staggerContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        <motion.p
          className="text-gold text-xs tracking-[0.4em] uppercase font-sans mb-6"
          variants={reduced ? fadeUpReducedVariants : fadeUpVariants}
        >
          With love
        </motion.p>

        <motion.h2
          className="font-serif text-4xl md:text-6xl font-bold text-gold mb-8 leading-tight"
          variants={reduced ? fadeUpReducedVariants : fadeUpVariants}
        >
          Happy Birthday,<br />Jeel
        </motion.h2>

        {hasClosingMessage && (
          <motion.p
            className="text-muted font-sans text-base md:text-xl leading-relaxed mb-10 max-w-xl mx-auto"
            variants={reduced ? fadeUpReducedVariants : fadeUpVariants}
          >
            {siteConfig.text.closing}
          </motion.p>
        )}

        <motion.p
          className="text-subtle text-sm font-sans tracking-widest uppercase"
          variants={reduced ? fadeUpReducedVariants : fadeUpVariants}
        >
          April 5, {new Date().getFullYear()} ♥
        </motion.p>

        {/* Scroll back to top */}
        <motion.button
          className="mt-12 text-subtle hover:text-gold text-xs tracking-widest uppercase font-sans transition-colors flex items-center gap-2 mx-auto"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          variants={reduced ? fadeUpReducedVariants : fadeUpVariants}
        >
          ↑ Back to top
        </motion.button>
      </motion.div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Closing.tsx
git commit -m "feat: add Closing section — personal message, CSS confetti, back to top"
```

---

## Task 22: Main Page Assembly

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Delete the default Next.js home page content and write `src/app/page.tsx`**

```tsx
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
```

- [ ] **Step 2: Run the dev server and verify the full page loads**

```bash
npm run dev
```

Open `http://localhost:3000`. Verify:
- Loading screen appears (SVG "Chiku" draws) then fades
- All 14 sections render in scroll order
- No console errors

- [ ] **Step 3: Run the test suite**

```bash
npm test
```

Expected: all tests pass (dateUtils + useBirthday).

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: assemble main page — all 14 sections wired up in order"
```

---

## Task 23: Build Verification + Deployment Prep

**Files:**
- Create: `scripts/compress-videos.sh`
- Verify: `.gitignore`

- [ ] **Step 1: Create `scripts/compress-videos.sh`**

```bash
mkdir -p scripts
```

```bash
#!/usr/bin/env bash
# compress-videos.sh
# Compresses all mp4 files in public/artifacts using ffmpeg.
# Run BEFORE deploying if total project size exceeds 95MB.
# Requires: ffmpeg (install via https://ffmpeg.org/download.html)
#
# Usage: bash scripts/compress-videos.sh

set -e

INPUT_DIR="public/artifacts"
OUTPUT_DIR="public/artifacts/compressed"
mkdir -p "$OUTPUT_DIR"

for f in "$INPUT_DIR"/*.mp4; do
  name=$(basename "$f")
  echo "Compressing $name..."
  ffmpeg -i "$f" \
    -vcodec libx264 -crf 28 -preset fast \
    -acodec aac -b:a 128k \
    -movflags +faststart \
    "$OUTPUT_DIR/$name" -y
  echo "Done: $OUTPUT_DIR/$name"
done

echo ""
echo "Compressed files are in $OUTPUT_DIR"
echo "Replace public/artifacts/*.mp4 with those files if needed."
echo "Then update site.config.ts paths if you moved them."
```

Make it executable:

```bash
chmod +x scripts/compress-videos.sh
```

- [ ] **Step 2: Run a production build**

```bash
npm run build
```

Expected: `out/` directory created. No TypeScript errors, no build errors. If there are errors, fix them before proceeding.

Common issues and fixes:
- **"window is not defined"**: Any component using `window`/`document` must have `'use client'` at top — verify all interactive components have it.
- **"Howler is not defined"**: `AudioContext.tsx` already uses dynamic `import('howler')` — should be fine.
- **Image optimization warning**: `unoptimized: true` is set in `next.config.ts` — no action needed.

- [ ] **Step 3: Check the build output size**

```bash
du -sh out/
du -sh public/artifacts/
```

If `public/artifacts/` exceeds 80MB, run the compression script:

```bash
bash scripts/compress-videos.sh
# Then replace originals with compressed versions and rebuild
```

- [ ] **Step 4: Verify `.gitignore` is complete**

Open `.gitignore` and confirm these lines exist (add any missing):

```
node_modules/
.next/
out/
.env
.env.local
.superpowers/
```

- [ ] **Step 5: Final commit**

```bash
git add scripts/compress-videos.sh .gitignore
git commit -m "feat: add video compression script and verify production build for Vercel deployment"
```

---

## Task 24: Vercel Deployment

**Files:** None — configuration already set in `next.config.ts`.

- [ ] **Step 1: Install Vercel CLI (if not installed)**

```bash
npm install -g vercel
```

- [ ] **Step 2: Deploy**

```bash
vercel
```

When prompted:
- **Set up and deploy?** → Yes
- **Which scope?** → your account
- **Link to existing project?** → No
- **Project name?** → `jeel-birthday` (or any name)
- **In which directory is your code located?** → `./`

Vercel auto-detects Next.js. Build command: `npm run build`. Output directory: `out`.

- [ ] **Step 3: Open the deployed URL and verify**

Vercel prints a URL like `https://jeel-birthday-xxx.vercel.app`. Open it and verify:
- Loading screen works
- Music toggle in top bar works (may require a click first due to autoplay policy)
- All photos load
- Videos play
- Birthday timer shows correct mode (countdown since Apr 5 has passed in 2026)
- Gift box opens, plays sound, reveals image

- [ ] **Step 4: (Optional) Add custom domain**

In the Vercel dashboard → Project → Settings → Domains → add your domain.

---

## Self-Review Checklist

### Spec Coverage

| Spec Requirement | Covered By |
|---|---|
| Birthday timer (birthday mode + countdown) | Task 5, 6, 12 |
| Hinglish birthday message | Task 12 (BirthdayTimer) + Task 4 (config) |
| Countdown message | Task 12 |
| Main image in hero | Task 11 (Hero) |
| Solo gallery masonry (×3) | Task 14 (SoloGallery) |
| Family filmstrip carousel (×2) | Task 15 (FamilyFilmstrip) |
| Quote break text | Task 16 (QuoteBreak) |
| Hashtag wall | Task 17 (HashtagWall) |
| Gift interaction → finger.jpeg + curse.mp3 | Task 18 (GiftBox) |
| Funny photos section | Task 19 (FunnySection) |
| Funny videos (funny_2/5/6/7.mp4) | Task 19 (FunnySection) |
| Meme videos (bhola_baba + live_life) | Task 20 (MemeVideos) |
| Background music (birthday_song.mp3) | Task 8 (AudioContext) |
| Music toggle top bar | Task 10 (TopBar) |
| Music volume config | Task 4 (site.config.ts) |
| Music ducks on gift reveal | Task 8 (AudioContext.duck) |
| Music pauses on video play | Task 8 (pauseForVideo/resumeFromVideo) |
| Autoplay restriction handling | Task 8 (first-interaction unlock) |
| Loading screen animation | Task 9 (LoadingScreen) |
| Scroll-triggered animations | All components (Framer Motion whileInView) |
| Reduced motion accessibility | Task 7 (useReducedMotion) + all components |
| All text content verbatim | Task 4 (site.config.ts) |
| All hashtags | Task 4 (site.config.ts) |
| Dark cinematic palette | Task 3 (tailwind.config + globals.css) |
| Playfair Display + Inter fonts | Task 9 (layout.tsx) |
| Lightbox on gallery photos | Task 13 (Lightbox) |
| Mobile responsive | All components (Tailwind responsive classes) |
| Vercel static export | Task 1 (next.config.ts) + Task 23 |
| Video compression script | Task 23 |
| site.config.ts for easy editing | Task 4 |
| Closing section + confetti | Task 21 (Closing) |

All spec requirements covered. ✓

---

*Plan written 2026-04-04. Ready for implementation.*
