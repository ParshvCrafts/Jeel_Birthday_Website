# Website Improvements Design
**Date:** 2026-04-05  
**Project:** Jeel Birthday Website  
**Approach:** All improvements in a single implementation pass (Approach A)

---

## Overview

Four improvement areas applied to the existing 14-section cinematic birthday website for Jeel (Chiku), turning 24 on April 5, 2026. Tech stack unchanged: Next.js 14 static export, TypeScript, Tailwind CSS, Framer Motion, Howler.js. Color scheme unchanged: canvas `#0e0e0e`, gold `#c9a87c`, cream `#f5f0e8`.

---

## 1. Navigation & UX

### ScrollProgressBar
- **File:** `src/components/ScrollProgressBar.tsx`
- **Placement:** Rendered in `page.tsx` above `<main>`, outside the loading gate so it's always present once content is visible
- **Implementation:** `useScroll()` from Framer Motion → `scaleX` motion value on a `fixed` 3px gold bar, `z-60`, `top-0`, `origin-left`
- **Behavior:** Scales from 0→1 as the user scrolls from top to bottom of the page

### SectionNav
- **File:** `src/components/SectionNav.tsx`
- **Placement:** Fixed right edge, vertically centered, `z-50`, hidden below `lg` breakpoint
- **Sections tracked (in order):** `hero`, `timer`, `stats`, `gallery-1`, `quote`, `filmstrip-1`, `gallery-2`, `hashtags`, `timeline`, `gift`, `gallery-3`, `filmstrip-2`, `love-cards`, `funny`, `memes`, `closing`
- **Implementation:** Single `IntersectionObserver` with `threshold: 0.3` watching all section IDs. Active dot: gold, `w-3 h-3`. Inactive: `w-2 h-2`, muted. Hover shows label tooltip (section name) to the left of the dot. Click calls `document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })`
- **Reduced motion:** Observer still runs but no hover tooltip animation

### Section IDs
- Every section wrapper in `page.tsx` gets an `id` prop matching the list above
- New sections (stats, timeline, love-cards) also receive IDs at insertion point

---

## 2. Visual Effects

### ParticleField
- **File:** `src/components/ParticleField.tsx`
- **Placement:** Inside `Hero.tsx`, absolutely positioned, `inset-0`, `pointer-events-none`, `z-0`, behind text panel
- **Implementation:** 25 `<span>` elements, each with stable position seeded by index (e.g. `left: (index * 37 + 11) % 100 + '%'`). Sizes 2–5px, colors alternate `#c9a87c` and `#f5f0e8` at low opacity (0.2–0.5). Each uses `animation: float-drift` (already in `globals.css`) with varying duration (4–8s) and delay (0–4s). Rendered only when `!reduced`.

### Hero Parallax
- **File:** `src/components/Hero.tsx` (modified)
- **Implementation:** Wrap the right photo panel's parent in a `ref`. Use `useScroll({ target: ref, offset: ['start start', 'end start'] })` + `useTransform(scrollYProgress, [0, 1], ['0%', '20%'])` on the photo's `y` motion value. The text panel does not move (natural scroll). Entrance animation (`slideFromRightVariants`) is preserved — parallax only activates post-mount.

### Grain Texture
- **File:** `src/app/globals.css` (modified)
- **Implementation:** `body::after` pseudo-element with `position: fixed`, `inset: 0`, `pointer-events: none`, `z-index: 9999`, `opacity: 0.035`, `background-image: url("data:image/svg+xml,...")` using an inline SVG with `feTurbulence` filter. No external assets.

### SectionDivider
- **File:** `src/components/SectionDivider.tsx`
- **Placement:** Between QuoteBreak→FamilyFilmstrip1, HashtagWall→Timeline, FamilyFilmstrip2→LoveCards in `page.tsx`
- **Implementation:** Single `<motion.div>` with `h-px`, gradient `from-transparent via-gold/40 to-transparent`. On viewport enter: `scaleX` from 0→1 over 1.2s with `ease: [0.22, 1, 0.36, 1]`. Reuses pattern from `QuoteBreak`'s existing divider line.

---

## 3. New Content Sections

### StatsCounter
- **File:** `src/components/StatsCounter.tsx`
- **Placement:** `page.tsx` after `<BirthdayTimer />`, before `<SoloGallery photos={soloGallery1} />`
- **Section ID:** `stats`
- **Stats (calculated from config):**
  - Years: `siteConfig.birthday.age` → `24`
  - Days: `Math.floor(siteConfig.birthday.age * 365.25)` → `8,766`
  - Hours: days × 24 → `210,384`
  - Minutes: hours × 60 → `12,623,040`
- **Animation:** Each counter uses `useMotionValue(0)` + `useTransform(mv, v => Math.round(v).toLocaleString())`. On viewport enter (`whileInView` via a wrapper, or `useInView` hook), `animate(mv, finalValue, { duration: 1.5, ease: 'easeOut' })` is called in a `useEffect`. Staggered start: 0, 0.15, 0.3, 0.45s delays per stat.
- **Layout:** 2×2 grid mobile, 4-column row desktop. Each cell: large serif number in gold, small sans label below.

### Timeline
- **File:** `src/components/Timeline.tsx`
- **Placement:** `page.tsx` after `<HashtagWall />`, before `<GiftBox />`
- **Section ID:** `timeline`
- **Config:** `siteConfig.timeline` — array of `{ year: string; title: string; description: string }`
- **Placeholder content (6 items):**
  ```ts
  { year: '2002', title: 'The Beginning', description: 'A legend was born on April 5th.' },
  { year: '2008', title: 'School Days', description: 'Started the journey of pretending to study.' },
  { year: '2014', title: 'Teenage Era', description: 'Peak drama, maximum personality unlocked.' },
  { year: '2019', title: 'College Begins', description: 'New city, new Chiku, same chaos.' },
  { year: '2023', title: 'Adulting Begins', description: 'Still figuring it out, but make it fashion.' },
  { year: '2026', title: 'Turning 24', description: 'Best birthday yet — your brother made a website.' },
  ```
- **Layout:** Centered vertical gold line. Entries alternate left/right (single column on mobile). Each entry: year badge, title, description. `whileInView` stagger with `fadeUp` variants. 

### LoveCards
- **File:** `src/components/LoveCards.tsx`
- **Placement:** `page.tsx` after `<FamilyFilmstrip photos={familyFilmstrip2} />`, before `<FunnySection />`
- **Section ID:** `love-cards`
- **Config:** `siteConfig.loveCards` — array of 9 strings
- **Placeholder content:**
  ```ts
  'You make home feel like home',
  'Your laugh is actually contagious',
  'You care more than you show',
  'You're annoyingly good at everything',
  'You always have my back',
  'You turn boring days into memories',
  'Your heart is genuinely huge',
  'You make the whole family better',
  'I'm lucky you're my sister',
  ```
- **Section title:** "9 things I love about you"
- **Implementation:** 3×3 grid. Each card: CSS 3D perspective (`perspective: 800px`), inner div with `transform-style: preserve-3d`. Front face: card number (gold serif, large) + decorative border. Back face: message text (cream, centered). `onClick` toggles `flipped` state per card (`useState<Set<number>>`). Desktop: also flips on `onMouseEnter` / resets on `onMouseLeave`. `rotateY: flipped ? 180 : 0` via Framer Motion. Backface visibility hidden on both faces.

---

## 4. Gallery & Media

### Polaroid SoloGallery
- **File:** `src/components/SoloGallery.tsx` (modified)
- **Changes:** Each photo button gets:
  - `style={{ rotate: ROTATIONS[i % ROTATIONS.length] }}` where `ROTATIONS = [1.5, -1, 2, -1.5, 1, -2]` (degrees, stable)
  - Inner white frame div: `absolute inset-2 border-[5px] border-white/90 pointer-events-none z-10`
  - `boxShadow: '0 4px 24px rgba(0,0,0,0.5)'` on the button
  - Hover scale reduced to `1.03` (was `1.05`) to prevent frame clipping
- `gridAutoRows` stays at `300px` (set in previous session)

### Lightbox Swipe
- **File:** `src/components/Lightbox.tsx` (modified)
- **Changes:**
  - Add `onPointerDown` handler storing `startX`
  - Add `onPointerUp` handler: if `Math.abs(delta) > 50`, navigate prev/next
  - Add `Photo {current} of {total}` caption in bottom bar (`text-subtle text-sm`)
  - No new dependencies

### Video Thumbnail Treatment
- **Files:** `src/components/FunnySection.tsx`, `src/components/MemeVideos.tsx` (modified)
- **Implementation:** Each video wrapper gets a `playing` boolean state (per video, `useState<boolean>`). When `!playing`: show a styled overlay with a gold animated play-circle button and the video label. On click: set `playing = true`, show `<video autoPlay controls ...>`. Audio ducking hooks (`pauseForVideo`/`resumeFromVideo`) remain on the `<video>` element's `onPlay`/`onPause`/`onEnded` events.

### FamilyFilmstrip Shadow
- **File:** `src/components/FamilyFilmstrip.tsx` (modified)
- **Change:** Each card button gets `boxShadow: '0 4px 20px rgba(0,0,0,0.4)'` for visual consistency with the polaroid gallery. Auto-scroll from previous session is preserved.

---

## File Inventory

### New files
| File | Purpose |
|------|---------|
| `src/components/ScrollProgressBar.tsx` | Gold scroll progress line |
| `src/components/SectionNav.tsx` | Right-side dot navigator |
| `src/components/ParticleField.tsx` | Hero background particles |
| `src/components/SectionDivider.tsx` | Animated shimmer divider |
| `src/components/StatsCounter.tsx` | Animated birthday stats |
| `src/components/Timeline.tsx` | Vertical life timeline |
| `src/components/LoveCards.tsx` | 3D flip card wall |

### Modified files
| File | Changes |
|------|---------|
| `src/app/page.tsx` | Section IDs, new components wired in |
| `src/app/globals.css` | Grain texture `body::after` |
| `src/config/site.config.ts` | `timeline` and `loveCards` arrays added |
| `src/components/Hero.tsx` | ParticleField + parallax |
| `src/components/SoloGallery.tsx` | Polaroid style |
| `src/components/Lightbox.tsx` | Swipe + caption |
| `src/components/FunnySection.tsx` | Video thumbnail overlay |
| `src/components/MemeVideos.tsx` | Video thumbnail overlay |
| `src/components/FamilyFilmstrip.tsx` | Card shadow |

---

## Constraints & Notes

- Static export (`output: 'export'`) — no server-side APIs, no `useLayoutEffect` without SSR guards
- All new components are `'use client'`
- `useScroll` / `useTransform` are safe in client components with Framer Motion already installed
- Particle positions are index-seeded (no `Math.random()` on render) to avoid hydration mismatches
- `SectionNav` uses `IntersectionObserver` — guarded with `typeof window !== 'undefined'` in `useEffect`
- All placeholder content in `site.config.ts` uses `as const` pattern consistent with existing config
- Build target: `npm run build` must pass with zero errors before push
