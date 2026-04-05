# Website Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add navigation UX, visual effects, three new content sections, and polished gallery/media components to the Jeel birthday website.

**Architecture:** Seven new component files drop into the existing `src/components/` tree; `site.config.ts` gains two new typed arrays (`timeline`, `loveCards`); `page.tsx` wires everything together with section IDs. All modifications follow the existing pattern of `'use client'` components using Framer Motion, Tailwind tokens, and `useReducedMotion`.

**Tech Stack:** Next.js 14 static export, TypeScript, Tailwind CSS, Framer Motion (already installed), Vitest + @testing-library/react, `@radix-ui/react-dialog` (already installed).

---

## File Map

### New files
| Path | Responsibility |
|------|---------------|
| `src/components/ScrollProgressBar.tsx` | Gold 3px progress line fixed to top of viewport |
| `src/components/SectionNav.tsx` | Right-side dot navigator with IntersectionObserver |
| `src/components/ParticleField.tsx` | 25 CSS-animated gold particles for hero background |
| `src/components/SectionDivider.tsx` | Animated shimmer `h-px` line between sections |
| `src/components/StatsCounter.tsx` | Animated birthday stats (years/days/hours/minutes) |
| `src/components/Timeline.tsx` | Vertical life timeline driven by `siteConfig.timeline` |
| `src/components/LoveCards.tsx` | 3×3 CSS 3D flip card wall driven by `siteConfig.loveCards` |
| `src/components/__tests__/StatsCounter.test.ts` | Tests for `calcBirthdayStats` pure function |
| `src/components/__tests__/Timeline.test.tsx` | Render test — all timeline items appear |
| `src/components/__tests__/LoveCards.test.tsx` | Render test — all cards render, click flips |

### Modified files
| Path | Changes |
|------|---------|
| `src/config/site.config.ts` | Add `timeline` array, `loveCards` array, export `TimelineItem` type |
| `src/app/page.tsx` | Section IDs on every wrapper, import + render all new components |
| `src/app/globals.css` | `body::after` grain texture |
| `src/components/Hero.tsx` | Add `ParticleField`, hero parallax via `useScroll`/`useTransform` |
| `src/components/SoloGallery.tsx` | Polaroid style: white frame, rotation, box-shadow |
| `src/components/Lightbox.tsx` | Pointer-event swipe, improved caption |
| `src/components/FunnySection.tsx` | `FunnyVideo` thumbnail-first overlay |
| `src/components/MemeVideos.tsx` | `MemeVideo` thumbnail-first overlay |
| `src/components/FamilyFilmstrip.tsx` | Box-shadow on cards |

---

## Task 1: Extend site.config.ts

**Files:**
- Modify: `src/config/site.config.ts`

- [ ] **Add `TimelineItem` type and `timeline` + `loveCards` arrays to the config**

Open `src/config/site.config.ts`. After the closing `} as const` and before the existing type exports at the bottom, add the new type. Then add the two arrays inside the `siteConfig` object before the closing `} as const`:

```ts
// Inside siteConfig object, after the `media` block:
    timeline: [
      { year: '2002', title: 'The Beginning', description: 'A legend was born on April 5th.' },
      { year: '2008', title: 'School Days', description: 'Started the journey of pretending to study.' },
      { year: '2014', title: 'Teenage Era', description: 'Peak drama, maximum personality unlocked.' },
      { year: '2019', title: 'College Begins', description: 'New city, new Chiku, same chaos.' },
      { year: '2023', title: 'Adulting Begins', description: 'Still figuring it out, but make it fashion.' },
      { year: '2026', title: 'Turning 24', description: 'Best birthday yet — your brother made a website.' },
    ],
    loveCards: [
      'You make home feel like home',
      'Your laugh is actually contagious',
      'You care more than you show',
      "You're annoyingly good at everything",
      'You always have my back',
      'You turn boring days into memories',
      'Your heart is genuinely huge',
      'You make the whole family better',
      "I'm lucky you're my sister",
    ],
```

After the existing `export type PhotoSize = ...` and `export type PhotoEntry = ...` lines, add:

```ts
export type TimelineItem = { year: string; title: string; description: string }
```

- [ ] **Verify TypeScript compiles**

```bash
cd "c:\Users\p1a2r\OneDrive\Desktop\Git Hub Projects\Jeel Birthday Website"
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Commit**

```bash
git add src/config/site.config.ts
git commit -m "feat: add timeline and loveCards placeholder content to site.config"
```

---

## Task 2: ScrollProgressBar component

**Files:**
- Create: `src/components/ScrollProgressBar.tsx`

- [ ] **Create the component**

```tsx
'use client'

import { motion, useScroll, useSpring } from 'framer-motion'

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 })

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[60] origin-left bg-gold"
      style={{ height: '3px', scaleX }}
      aria-hidden="true"
    />
  )
}
```

- [ ] **Verify build**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Commit**

```bash
git add src/components/ScrollProgressBar.tsx
git commit -m "feat: add ScrollProgressBar — gold progress line fixed to viewport top"
```

---

## Task 3: SectionNav component

**Files:**
- Create: `src/components/SectionNav.tsx`

- [ ] **Create the component**

```tsx
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
```

- [ ] **Verify build**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Commit**

```bash
git add src/components/SectionNav.tsx
git commit -m "feat: add SectionNav — right-side dot navigator with IntersectionObserver"
```

---

## Task 4: ParticleField component

**Files:**
- Create: `src/components/ParticleField.tsx`

- [ ] **Create the component**

```tsx
'use client'

import { useReducedMotion } from '@/hooks/useReducedMotion'

const PARTICLE_COUNT = 25

function particleStyle(i: number): React.CSSProperties {
  const left = (i * 37 + 11) % 97
  const top = (i * 53 + 7) % 91
  const size = 2 + (i % 3)
  const opacity = 0.15 + (i % 5) * 0.06
  const duration = 4 + (i % 5)
  const delay = (i % 8) * 0.5
  const color = i % 3 === 0 ? '#f5f0e8' : '#c9a87c'
  return {
    left: `${left}%`,
    top: `${top}%`,
    width: `${size}px`,
    height: `${size}px`,
    opacity,
    backgroundColor: color,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
  }
}

export function ParticleField() {
  const reduced = useReducedMotion()
  if (reduced) return null

  return (
    <div
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
        <span
          key={i}
          className="absolute rounded-full animate-float-drift"
          style={particleStyle(i)}
        />
      ))}
    </div>
  )
}
```

- [ ] **Verify build**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Commit**

```bash
git add src/components/ParticleField.tsx
git commit -m "feat: add ParticleField — 25 CSS-animated gold particles for hero"
```

---

## Task 5: SectionDivider component

**Files:**
- Create: `src/components/SectionDivider.tsx`

- [ ] **Create the component**

```tsx
'use client'

import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export function SectionDivider() {
  const reduced = useReducedMotion()

  return (
    <div className="px-8 md:px-24 py-2">
      <motion.div
        className="h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={
          reduced
            ? { duration: 0 }
            : { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
        }
        style={{ originX: 0.5 }}
      />
    </div>
  )
}
```

- [ ] **Commit**

```bash
git add src/components/SectionDivider.tsx
git commit -m "feat: add SectionDivider — animated shimmer line between sections"
```

---

## Task 6: StatsCounter component + tests

**Files:**
- Create: `src/components/StatsCounter.tsx`
- Create: `src/components/__tests__/StatsCounter.test.ts`

- [ ] **Write the failing test first**

Create `src/components/__tests__/StatsCounter.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { calcBirthdayStats } from '../StatsCounter'

describe('calcBirthdayStats', () => {
  it('returns the age as years', () => {
    expect(calcBirthdayStats(24).years).toBe(24)
  })

  it('computes days from age using 365.25', () => {
    expect(calcBirthdayStats(24).days).toBe(Math.floor(24 * 365.25))
  })

  it('computes hours as days × 24', () => {
    const { days, hours } = calcBirthdayStats(24)
    expect(hours).toBe(days * 24)
  })

  it('computes minutes as hours × 60', () => {
    const { hours, minutes } = calcBirthdayStats(24)
    expect(minutes).toBe(hours * 60)
  })

  it('works for age 1', () => {
    const stats = calcBirthdayStats(1)
    expect(stats.days).toBe(365)
    expect(stats.hours).toBe(365 * 24)
    expect(stats.minutes).toBe(365 * 24 * 60)
  })
})
```

- [ ] **Run the test — expect failure (function doesn't exist yet)**

```bash
npx vitest run src/components/__tests__/StatsCounter.test.ts
```

Expected: FAIL — "calcBirthdayStats is not a function" or import error.

- [ ] **Create `src/components/StatsCounter.tsx`**

```tsx
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
```

- [ ] **Run tests — expect pass**

```bash
npx vitest run src/components/__tests__/StatsCounter.test.ts
```

Expected: 5 tests PASS.

- [ ] **Commit**

```bash
git add src/components/StatsCounter.tsx src/components/__tests__/StatsCounter.test.ts
git commit -m "feat: add StatsCounter with calcBirthdayStats — animated 24-year stats"
```

---

## Task 7: Timeline component + test

**Files:**
- Create: `src/components/Timeline.tsx`
- Create: `src/components/__tests__/Timeline.test.tsx`

- [ ] **Write the failing render test**

Create `src/components/__tests__/Timeline.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Timeline } from '../Timeline'

// Framer Motion animate runs in jsdom — stub it
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion')
  return {
    ...actual,
    useInView: () => true,
  }
})

describe('Timeline', () => {
  it('renders all timeline items from siteConfig', () => {
    render(<Timeline />)
    // The config has 6 items — check first and last title appear
    expect(screen.getByText('The Beginning')).toBeTruthy()
    expect(screen.getByText('Turning 24')).toBeTruthy()
  })

  it('renders 6 year labels', () => {
    render(<Timeline />)
    expect(screen.getByText('2002')).toBeTruthy()
    expect(screen.getByText('2026')).toBeTruthy()
  })
})
```

- [ ] **Run test — expect failure**

```bash
npx vitest run src/components/__tests__/Timeline.test.tsx
```

Expected: FAIL — "Timeline is not a function" or module not found.

- [ ] **Create `src/components/Timeline.tsx`**

```tsx
'use client'

import { motion } from 'framer-motion'
import { siteConfig } from '@/config/site.config'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export function Timeline() {
  const reduced = useReducedMotion()

  return (
    <section id="timeline" className="py-20 md:py-28 px-6">
      <motion.p
        className="text-center text-gold text-sm tracking-[0.3em] uppercase font-sans mb-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        A life in moments
      </motion.p>

      <div className="max-w-3xl mx-auto relative">
        {/* Center vertical line — desktop only */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/30 to-transparent hidden md:block" />

        <div className="flex flex-col gap-12">
          {siteConfig.timeline.map((item, i) => (
            <motion.div
              key={i}
              className={`relative flex flex-col md:gap-8 ${
                i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
              whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            >
              {/* Text content */}
              <div
                className={`flex-1 ${
                  i % 2 === 0 ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'
                }`}
              >
                <span className="text-gold/60 text-xs tracking-[0.3em] uppercase font-sans">
                  {item.year}
                </span>
                <h3 className="font-serif text-xl text-cream mt-1 mb-1">{item.title}</h3>
                <p className="text-muted text-sm leading-relaxed font-sans">{item.description}</p>
              </div>

              {/* Center dot */}
              <div className="hidden md:flex items-start justify-center flex-shrink-0 pt-1">
                <div className="w-3 h-3 rounded-full bg-gold border-2 border-canvas" />
              </div>

              {/* Spacer for opposite side */}
              <div className="flex-1 hidden md:block" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Run tests — expect pass**

```bash
npx vitest run src/components/__tests__/Timeline.test.tsx
```

Expected: 2 tests PASS.

- [ ] **Commit**

```bash
git add src/components/Timeline.tsx src/components/__tests__/Timeline.test.tsx
git commit -m "feat: add Timeline section — vertical life moments driven by siteConfig"
```

---

## Task 8: LoveCards component + test

**Files:**
- Create: `src/components/LoveCards.tsx`
- Create: `src/components/__tests__/LoveCards.test.tsx`

- [ ] **Write the failing render test**

Create `src/components/__tests__/LoveCards.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LoveCards } from '../LoveCards'

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion')
  return { ...actual, useInView: () => true }
})

describe('LoveCards', () => {
  it('renders 9 cards', () => {
    render(<LoveCards />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(9)
  })

  it('renders the section title', () => {
    render(<LoveCards />)
    expect(screen.getByText(/9 things i love about you/i)).toBeTruthy()
  })

  it('shows card number on front face', () => {
    render(<LoveCards />)
    expect(screen.getByText('1')).toBeTruthy()
    expect(screen.getByText('9')).toBeTruthy()
  })
})
```

- [ ] **Run test — expect failure**

```bash
npx vitest run src/components/__tests__/LoveCards.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Create `src/components/LoveCards.tsx`**

```tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { siteConfig } from '@/config/site.config'
import { staggerContainerVariants, fadeUpVariants, fadeUpReducedVariants } from '@/lib/animations'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface FlipCardProps {
  message: string
  index: number
  reduced: boolean
}

function FlipCard({ message, index, reduced }: FlipCardProps) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div
      className="relative cursor-pointer"
      style={{ perspective: 800, height: 180 }}
      onClick={() => setFlipped((f) => !f)}
      onMouseEnter={() => { if (!reduced) setFlipped(true) }}
      onMouseLeave={() => { if (!reduced) setFlipped(false) }}
      role="button"
      aria-label={`Card ${index + 1}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') setFlipped((f) => !f)
      }}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center border border-gold/30 rounded-sm bg-surface"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="font-serif text-4xl font-bold text-gold/30">{index + 1}</span>
          <span className="text-subtle text-xs tracking-widest uppercase font-sans mt-2">
            tap to reveal
          </span>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 flex items-center justify-center p-5 border border-gold/50 rounded-sm bg-surface"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <p className="font-serif text-base text-cream text-center leading-relaxed italic">
            {message}
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export function LoveCards() {
  const reduced = useReducedMotion()

  return (
    <section id="love-cards" className="py-20 md:py-28 px-6 bg-surface/20">
      <motion.div
        className="max-w-4xl mx-auto"
        variants={staggerContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        <motion.p
          className="text-center text-gold text-sm tracking-[0.3em] uppercase font-sans mb-10"
          variants={reduced ? fadeUpReducedVariants : fadeUpVariants}
        >
          9 things I love about you
        </motion.p>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 gap-4"
          variants={staggerContainerVariants}
        >
          {siteConfig.loveCards.map((message, i) => (
            <motion.div
              key={i}
              variants={reduced ? fadeUpReducedVariants : fadeUpVariants}
            >
              <FlipCard message={message} index={i} reduced={reduced} />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
```

- [ ] **Run tests — expect pass**

```bash
npx vitest run src/components/__tests__/LoveCards.test.tsx
```

Expected: 3 tests PASS.

- [ ] **Run full test suite — all 17+ tests should pass**

```bash
npx vitest run
```

Expected: all tests PASS.

- [ ] **Commit**

```bash
git add src/components/LoveCards.tsx src/components/__tests__/LoveCards.test.tsx
git commit -m "feat: add LoveCards — 3×3 CSS 3D flip card wall driven by siteConfig"
```

---

## Task 9: Hero parallax + particles

**Files:**
- Modify: `src/components/Hero.tsx`

- [ ] **Add imports and parallax to Hero.tsx**

Open `src/components/Hero.tsx`. Make these changes:

**Add to imports** (top of file, alongside existing framer-motion imports):
```tsx
import { useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { ParticleField } from './ParticleField'
```

**Inside the `Hero` function body**, add after the existing `const reduced = useReducedMotion()` line:
```tsx
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const photoY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
```

**On the `<section>` element**, add the ref:
```tsx
  <section
    ref={heroRef}
    className="relative min-h-screen flex flex-col lg:flex-row pt-14"
    aria-label="Hero — Happy Birthday Chiku"
  >
```

**Inside the section**, immediately after the opening `<section ...>` tag, add the particle field. It must be before the text panel div:
```tsx
    <ParticleField />
```

**On the right photo panel `<motion.div>`**, add the `style` prop for parallax (merge with existing props):
```tsx
      <motion.div
        className="relative lg:w-[45%] min-h-[50vh] lg:min-h-screen"
        variants={reduced ? slideFromRightReducedVariants : slideFromRightVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3 }}
        style={reduced ? {} : { y: photoY }}
      >
```

- [ ] **Verify build**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Commit**

```bash
git add src/components/Hero.tsx
git commit -m "feat: add hero parallax photo effect and floating gold particles"
```

---

## Task 10: SoloGallery polaroid style

**Files:**
- Modify: `src/components/SoloGallery.tsx`

- [ ] **Add polaroid constants and style to SoloGallery.tsx**

Open `src/components/SoloGallery.tsx`. After the imports, add:
```tsx
const ROTATIONS = [1.5, -1, 2, -1.5, 1, -2]
```

**On the `<motion.button>` for each photo**, add `style` and change `scale-105` to `scale-[1.03]`:

```tsx
          <motion.button
            key={photo.src}
            className={[
              'relative overflow-hidden group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm',
              photo.size === 'tall' ? 'row-span-2' : '',
              photo.size === 'wide' ? 'col-span-2' : '',
            ].join(' ')}
            style={{
              rotate: ROTATIONS[i % ROTATIONS.length],
              boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
            }}
            variants={reduced ? fadeUpReducedVariants : fadeUpVariants}
            onClick={() => setLightboxIndex(i)}
            aria-label={`View photo ${i + 1}`}
          >
            <Image
              src={artifactPath(photo.src)}
              alt={`Photo ${i + 1}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
            {/* White polaroid frame */}
            <div className="absolute inset-2 border-[5px] border-white/90 pointer-events-none z-10 rounded-sm" />
            <div className="absolute inset-0 border-2 border-gold/0 group-hover:border-gold/40 transition-all duration-300 rounded-sm pointer-events-none" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-300" />
          </motion.button>
```

- [ ] **Verify build**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Commit**

```bash
git add src/components/SoloGallery.tsx
git commit -m "feat: polaroid style for SoloGallery — white frame, rotation, shadow"
```

---

## Task 11: Lightbox swipe support + caption

**Files:**
- Modify: `src/components/Lightbox.tsx`

- [ ] **Add swipe support and improved caption to Lightbox.tsx**

Open `src/components/Lightbox.tsx`. 

**Add to imports** (alongside existing `useState, useCallback, useEffect`):
```tsx
import { useState, useCallback, useEffect, useRef } from 'react'
```

**Inside the `Lightbox` function body**, add after the existing `const next = ...` line:
```tsx
  const startXRef = useRef<number | null>(null)
```

**On the `<Dialog.Content>` element**, add pointer event handlers:
```tsx
        <Dialog.Content
          className="fixed inset-0 z-[101] flex items-center justify-center p-4 outline-none"
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') prev()
            if (e.key === 'ArrowRight') next()
          }}
          onPointerDown={(e) => { startXRef.current = e.clientX }}
          onPointerUp={(e) => {
            if (startXRef.current === null) return
            const delta = e.clientX - startXRef.current
            startXRef.current = null
            if (delta > 50) prev()
            else if (delta < -50) next()
          }}
        >
```

**Replace the existing bottom caption `<span>`** (currently `{index + 1} / {photos.length}`) with:
```tsx
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
            <span className="text-subtle text-sm font-sans tracking-widest">
              {index + 1} / {photos.length}
            </span>
          </div>
```

- [ ] **Verify build**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Commit**

```bash
git add src/components/Lightbox.tsx
git commit -m "feat: add swipe gesture and improved caption to Lightbox"
```

---

## Task 12: FunnySection video thumbnail overlay

**Files:**
- Modify: `src/components/FunnySection.tsx`

- [ ] **Replace `FunnyVideo` with thumbnail-first version in FunnySection.tsx**

Open `src/components/FunnySection.tsx`. Add `useState` to the React import:
```tsx
import { useRef, useState } from 'react'
```

Also add the `motion` import from framer-motion alongside the existing one:
```tsx
import { motion } from 'framer-motion'
```

**Replace the entire `FunnyVideo` function** with:
```tsx
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
```

- [ ] **Verify build**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Commit**

```bash
git add src/components/FunnySection.tsx
git commit -m "feat: thumbnail-first video overlay for FunnySection"
```

---

## Task 13: MemeVideos thumbnail overlay

**Files:**
- Modify: `src/components/MemeVideos.tsx`

- [ ] **Replace `MemeVideo` with thumbnail-first version in MemeVideos.tsx**

Open `src/components/MemeVideos.tsx`. Add `useState` to the existing `useRef` import:
```tsx
import { useRef, useState } from 'react'
```

**Replace the entire `MemeVideo` function** with:
```tsx
function MemeVideo({ src, label }: { src: string; label: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const { pauseForVideo, resumeFromVideo } = useAudio()
  const reduced = useReducedMotion()

  return (
    <motion.div
      className="flex flex-col gap-3"
      variants={reduced ? fadeUpReducedVariants : fadeUpVariants}
    >
      <p className="text-gold text-sm tracking-[0.3em] uppercase font-sans text-center">{label}</p>

      {!playing ? (
        <div
          className="relative rounded-sm overflow-hidden border border-border bg-surface cursor-pointer group"
          style={{ maxHeight: '420px', minHeight: '240px' }}
          onClick={() => setPlaying(true)}
          role="button"
          aria-label={`Play ${label}`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-surface via-canvas to-surface" />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-20 h-20 rounded-full border-2 border-gold flex items-center justify-center"
              whileHover={{ scale: 1.1, borderColor: '#c9a87ccc' }}
              whileTap={{ scale: 0.95 }}
            >
              <div
                className="ml-1"
                style={{
                  width: 0,
                  height: 0,
                  borderTop: '12px solid transparent',
                  borderBottom: '12px solid transparent',
                  borderLeft: '22px solid #c9a87c',
                }}
              />
            </motion.div>
          </div>
        </div>
      ) : (
        <div className="relative rounded-sm overflow-hidden border border-border bg-surface">
          <video
            ref={videoRef}
            src={artifactPath(src)}
            controls
            autoPlay
            playsInline
            preload="metadata"
            className="w-full rounded-sm"
            style={{ maxHeight: '420px' }}
            onPlay={() => pauseForVideo()}
            onPause={() => resumeFromVideo()}
            onEnded={() => resumeFromVideo()}
          />
        </div>
      )}
    </motion.div>
  )
}
```

- [ ] **Verify build**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Commit**

```bash
git add src/components/MemeVideos.tsx
git commit -m "feat: thumbnail-first video overlay for MemeVideos"
```

---

## Task 14: FamilyFilmstrip card shadow

**Files:**
- Modify: `src/components/FamilyFilmstrip.tsx`

- [ ] **Add box-shadow to filmstrip card buttons**

Open `src/components/FamilyFilmstrip.tsx`. On the `<motion.button>` for each photo card, add `boxShadow` to its existing `style` prop (it currently has `width` and `height`):

```tsx
              style={{ width: CARD_WIDTH, height: 420, boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}
```

- [ ] **Verify build**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Commit**

```bash
git add src/components/FamilyFilmstrip.tsx
git commit -m "style: add card shadow to FamilyFilmstrip for visual consistency"
```

---

## Task 15: Wire everything in page.tsx

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Replace the full content of `src/app/page.tsx` with the wired version**

Note: Components that render their own `<section>` root (`Hero`, `BirthdayTimer`, `SoloGallery`, `QuoteBreak`, `FamilyFilmstrip`, `HashtagWall`, `GiftBox`, `FunnySection`, `MemeVideos`, `Closing`) are wrapped in `<div id="...">` so IntersectionObserver has an anchor without creating nested `<section>` elements. Components that bake their own `id` into their root `<section>` (`StatsCounter` with `id="stats"`, `Timeline` with `id="timeline"`, `LoveCards` with `id="love-cards"`) are rendered unwrapped.

```tsx
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
```

- [ ] **Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Run full test suite**

```bash
npx vitest run
```

Expected: all tests PASS.

- [ ] **Run production build**

```bash
npm run build
```

Expected: `✓ Compiled successfully`, `✓ Generating static pages (5/5)`.

- [ ] **Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: wire all new components into page — section IDs, new sections, nav"
```

---

## Task 16: Grain texture in globals.css

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Add grain texture pseudo-element to globals.css**

Open `src/app/globals.css`. After the `.filmstrip-drag:active { cursor: grabbing; }` block and before the `/* Reduced motion overrides */` block, add:

```css
/* Film grain texture overlay */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.035;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 256px 256px;
}
```

- [ ] **Run production build to confirm no CSS errors**

```bash
npm run build
```

Expected: `✓ Compiled successfully`.

- [ ] **Commit**

```bash
git add src/app/globals.css
git commit -m "style: add subtle film grain texture overlay via CSS body::after"
```

---

## Task 17: Final verification and push to GitHub

- [ ] **Run full test suite**

```bash
npx vitest run
```

Expected: all tests PASS (17+ tests).

- [ ] **Run production build**

```bash
npm run build
```

Expected: `✓ Compiled successfully`, `✓ Generating static pages (5/5)`, zero TypeScript errors.

- [ ] **Push to GitHub**

```bash
git push origin main
```

Expected: pushes cleanly, Vercel auto-deploys.
