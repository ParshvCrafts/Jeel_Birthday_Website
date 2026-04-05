# Jeel Birthday Website — Design Spec

**Date:** 2026-04-04  
**Project:** Interactive Birthday Website for Jeel (turning 24 on April 5, 2026)  
**Stack:** Next.js 14 (static export) · TypeScript · Tailwind CSS · Framer Motion · Howler.js

---

## 1. Project Overview

A highly polished, emotionally meaningful, interactive birthday website for Jeel (nickname: Chiku). The experience is designed as a cinematic, scroll-driven story — not a generic birthday page. It should feel premium, surprising, and handcrafted.

**Visual direction:** Dark Cinematic — near-black canvas (#0e0e0e), warm gold accents (#c9a87c), cream text (#f5f0e8), Playfair Display serif headings, Inter body text. No purple. No overused gradients.

---

## 2. Tech Stack

| Concern | Choice | Reason |
|---|---|---|
| Framework | Next.js 14 App Router | `next/image` lazy loading for 40+ photos, font optimization, static export |
| Language | TypeScript | Type safety for config and component props |
| Styling | Tailwind CSS + CSS variables | Design tokens for palette, fast utility styling |
| Animation | Framer Motion | Scroll-triggered reveals, drag carousel, spring physics |
| Audio | Howler.js | Cross-browser audio with ducking, loop, volume control |
| Dialog | Radix UI (Dialog) | Accessible gift reveal overlay |
| Fonts | Playfair Display (serif) + Inter (body) via `next/font` | Premium feel, performance optimized |
| Deploy | Vercel free tier (static export) | Zero cost, simple CI/CD |

**Not used (deliberately excluded):** GSAP (Framer Motion covers all needs), heavy UI libraries (custom components only), unnecessary dependencies.

---

## 3. Project Structure

```
/public/artifacts/          ← all media (images, videos, audio) — copied from /artifacts/
/src/
  app/
    layout.tsx              ← root layout (fonts, metadata, AudioProvider)
    page.tsx                ← main page — imports all sections in order
    globals.css             ← Tailwind base + CSS custom properties
  components/
    LoadingScreen.tsx       ← SVG name draw animation, fades into hero
    TopBar.tsx              ← persistent music toggle bar
    Hero.tsx                ← split hero: text left, main.jpeg right
    BirthdayTimer.tsx       ← date-aware: birthday mode vs countdown mode
    SoloGallery.tsx         ← masonry grid component (used 3×)
    FamilyFilmstrip.tsx     ← horizontal drag carousel (used 2×)
    QuoteBreak.tsx          ← full-width cinematic text reveal
    HashtagWall.tsx         ← floating animated nickname tags
    GiftBox.tsx             ← interactive gift → finger.jpeg + curse.mp3
    FunnySection.tsx        ← funny photos + funny videos grid
    MemeVideos.tsx          ← bhola_baba.mp4 + live_life.mp4
    Closing.tsx             ← final message + confetti burst
    Lightbox.tsx            ← full-screen photo viewer (used by galleries)
  config/
    site.config.ts          ← ALL editable content: text, volumes, media order, hashtags
  hooks/
    useAudio.ts             ← Howler.js wrapper: play, pause, duck, resume
    useBirthday.ts          ← returns { isBirthday, countdown, age }
    useReducedMotion.ts     ← respects prefers-reduced-motion
  lib/
    dateUtils.ts            ← birthday date logic
    mediaUtils.ts           ← artifact path helpers
next.config.ts              ← output: 'export', images: unoptimized
tailwind.config.ts          ← custom colors, fonts
```

---

## 4. Content Configuration (`site.config.ts`)

Single file to edit all content without touching components:

```ts
export const siteConfig = {
  birthday: {
    name: "Jeel",
    nickname: "Chiku",
    day: 5,
    month: 4,         // April
    birthYear: 2002,
    age: 24,
    hinglishMessage: "Ohh my god! It is your birthday Jeel. You have turned 24 years dodhi this year",
    countingMessage: "I am counting so that you don't have get jealous seeing other's birthday or cry when your birthday will come again",
  },
  text: {
    heroGreeting: "Happy Birthday,",
    heroName: "Chiku",
    blessing: "May god bless you and life gives you all the happiness. May this birthday be your best birthday ever",
    quoteBreak: "Eat healthy not my brain, sleep nicely, fart less, and live life like muchu, muchu",
    closing: "", // ← FILL THIS IN: your personal closing message to Jeel
    memeVideoLabels: { bholaBaba: "Bhola Baba", liveLife: "Live Life" }, // labels above meme videos
  },
  music: {
    defaultVolume: 0.25,      // background music (0–1)
    duckedVolume: 0.05,       // while gift reveal plays
    giftSoundVolume: 0.8,     // curse.mp3 volume
    autoplayOnFirstInteraction: true,
  },
  hashtags: [
    "#Chiku", "#Noob", "#Shruti", "#Hopari",
    "#AithiGoid", "#Choita", "#Padodi", "#Hagrid", "#MarkHenry",
  ],
  media: {
    // Order can be changed here — component reads from config
    soloGallery1: ["solo_1", "solo_2", "solo_3", "solo_4", "solo_5", "solo_6"],
    soloGallery2: ["solo_7", "solo_8", "solo_9", "solo_10", "solo_11", "solo_12"],
    soloGallery3: ["solo_13", "solo_14", "solo_15", "solo_16", "solo_17"],
    familyFilmstrip1: ["family_1","family_2","family_3","family_4","family_5","family_6","family_7","family_8","family_9","family_10"],
    familyFilmstrip2: ["family_11","family_12","family_13","family_14","family_15","family_16","family_17","family_18","family_19","family_20"],
    // Note: funny_2.jpeg and funny_2.mp4 share the same base name — extensions are explicit here
    funnyPhotos: ["funny_1.jpeg", "funny_2.jpeg", "funny_3.jpeg", "funny_4.jpeg"],
    funnyVideos: ["funny_2.mp4", "funny_5.mp4", "funny_6.mp4", "funny_7.mp4"],
    memeVideos: ["bhola_baba", "live_life"],
  },
}
```

---

## 5. Page Section Flow (top → bottom)

| # | Section | Type | Details |
|---|---|---|---|
| 00 | Loading Screen | Interactive | SVG path draw of "Chiku" → fade out when ready |
| 01 | Top Bar | Persistent | Music ♪ toggle, floats above all content |
| 02 | Hero | Media + Text | Text left: greeting + blessing. Photo right: main.jpeg with parallax |
| 03 | Birthday Timer | Interactive | Apr 5 → birthday mode (Hinglish message). Other days → live countdown |
| 04 | Solo Gallery I | Gallery (masonry) | 6 solo photos, stagger scroll reveal |
| 05 | Quote Break | Text | "Eat healthy not my brain…" — cinematic full-width text |
| 06 | Family Filmstrip I | Gallery (filmstrip) | 10 family photos, drag/swipe horizontal carousel |
| 07 | Solo Gallery II | Gallery (masonry) | 6 solo photos, alternating reveal direction |
| 08 | Hashtag Wall | Interactive | 9 hashtags as floating animated tags |
| 09 | Gift Box | Interactive | CSS 3D gift → click → finger.jpeg + curse.mp3 |
| 10 | Solo Gallery III | Gallery (masonry) | Remaining 5 solo photos |
| 11 | Family Filmstrip II | Gallery (filmstrip) | Remaining 10 family photos |
| 12 | Funny Section | Media (funny) | 4 funny photos + funny_2/5/6/7.mp4 in playful grid |
| 13 | Meme Videos | Video | bhola_baba.mp4 + live_life.mp4, bg music pauses on play |
| 14 | Closing | Text | Final personal message + confetti burst |

---

## 6. Hero Section

- **Left panel (55% width):** Small uppercase label "April 5 · Turning 24", then serif "Happy Birthday," on one line, large gold "Chiku" below it, blessing text, animated scroll indicator at bottom. Text words stagger up with 0.08s delay each on load.
- **Right panel (45% width):** `main.jpeg` fills the panel. Subtle parallax scroll effect. Warm gold border frame. Gradient fade on left edge blending into black. Entrance: slides in from right on load with spring easing.
- **Mobile:** Stacks vertically — photo on top, text below.

---

## 7. Birthday Timer

```
Logic (client-side only, no server):

const today = new Date();
const isApril5 = today.getMonth() === 3 && today.getDate() === 5;

if (isApril5) {
  // Show: birthday banner with Hinglish message
  // Show: confetti, celebratory animation
} else {
  // Calculate: ms until next April 5
  // Show: DD : HH : MM : SS countdown
  // Digits animate with slot-machine roll on each tick
}
```

- The `age` value (24) is read from `siteConfig.birthday.age` — update it each year in config.
- Timer runs in a `useEffect` interval, cleans up on unmount.
- No timezone weirdness — uses local browser time.

---

## 8. Gallery Systems

### 8a. Masonry Grid (SoloGallery)
- CSS Grid with `grid-auto-rows` and `grid-row: span 2` for featured cells
- Each photo has a `size` attribute from config: `normal | tall | wide`
- Framer Motion `staggerChildren` activates when section enters viewport (`whileInView`)
- Each photo: `initial={{ opacity: 0, y: 24 }}` → `animate={{ opacity: 1, y: 0 }}`
- Hover: gold border frame + subtle scale(1.02)
- Click: opens Lightbox component (full-screen, ESC to close, arrow nav)

### 8b. Filmstrip Carousel (FamilyFilmstrip)
- Horizontal scroll container with `overflow: hidden`
- Framer Motion `drag="x"` with `dragConstraints` calculated from content width
- `dragElastic: 0.1`, `dragTransition: { bounceStiffness: 300, bounceDamping: 30 }`
- Mobile: native touch scrolling via CSS `overflow-x: scroll; scroll-snap-type: x mandatory`
- Dot indicator below, updates on drag position
- Peek: right edge shows ~20% of next photo to signal swipeability

---

## 9. Music System

### Architecture
- **Library:** Howler.js (handles autoplay restrictions, cross-browser, loop)
- **State:** React Context (`AudioProvider`) wraps the whole app
- **bg track:** `birthday_song.mp3` — loops, starts on first user interaction
- **Gift sound:** `curse.mp3` — plays on gift reveal, bg music ducks to `duckedVolume`
- **Video interaction:** bg music pauses when any video element fires `play` event, resumes on `pause`/`ended`

### Autoplay Strategy
1. On first scroll or first click anywhere → start bg music (silent until user interacts)
2. If music hasn't started after 3 seconds → show subtle animated "♪ tap to unmute" nudge in top bar
3. Top bar icon is always visible and clickable to toggle

### Top Bar
- Fixed at top, `z-index: 50`
- Left: "Chiku ♥ 24" label
- Right: ♪ icon button — animated speaker waves when playing, static when paused
- Transparent background with subtle blur backdrop

---

## 10. Gift Box Interaction

1. **Idle state:** 3D CSS gift box (div-based, no canvas) with floating bob animation. "Click to open" hint text below.
2. **Click:** Box lid springs open with Framer Motion rotateX animation
3. **Reveal:** `finger.jpeg` scales in from center inside a Radix Dialog overlay
4. **Audio:** `curse.mp3` plays, bg music ducks
5. **Close:** User clicks overlay or presses ESC — box resets, music resumes
6. **Replay:** Box can be re-opened; state resets on close

---

## 11. Funny Section

- Tone shifts deliberately: slightly lighter dark background, warmer accent colors, playful font weight
- 4 funny photos displayed in a simple 2×2 card grid
- 4 funny videos (funny_2, funny_5, funny_6, funny_7) displayed as video players below
- No autoplay on funny videos — manual play only
- Each video pauses bg music when played
- No lightbox on funny photos (keep it casual)

---

## 12. Meme Videos Section

- `bhola_baba.mp4` and `live_life.mp4` displayed side by side (stack on mobile)
- Large play button overlay on each
- Background music pauses on play, resumes on pause/end
- Native HTML5 `<video>` element with `controls`, `preload="metadata"`, `playsInline`
- Short intro labels above each video — configurable in `siteConfig.text.memeVideoLabels`:
  ```ts
  memeVideoLabels: { bholaBaba: "Bhola Baba", liveLife: "Live Life" }
  ```
  Update these in `site.config.ts` to whatever caption you want shown.

---

## 13. Hashtag Wall

- 9 tags: `#Chiku #Noob #Shruti #Hopari #AithiGoid #Choita #Padodi #Hagrid #MarkHenry`
- Displayed as scattered floating tags in a contained box
- Each tag has a subtle random starting rotation (±8°) and slow drift animation (keyframe)
- On hover: spring lift, gold glow, scale(1.05)
- Tags are non-interactive links (just visual — no navigation)
- `useReducedMotion` hook: if reduced motion preferred, drift disabled, still shown statically

---

## 14. Loading Screen

- Full-screen black overlay
- SVG path of "Chiku" drawn with `stroke-dasharray` + `stroke-dashoffset` animation
- After draw completes (~1.5s): fade out
- Simultaneously: preloads hero image (main.jpeg) — hero is ready when overlay fades
- **Audio context is NOT initialized here** — Howler is initialized on first user interaction (scroll/click) per autoplay strategy in Section 9
- After fade: hero section is visible and ready

---

## 15. Animations Summary

| Element | Animation | Library |
|---|---|---|
| Loading screen | SVG path draw | CSS keyframes |
| Hero text | Stagger words up | Framer Motion |
| Hero photo | Slide from right | Framer Motion |
| Scroll sections | `whileInView` fade+up | Framer Motion |
| Masonry photos | staggerChildren | Framer Motion |
| Filmstrip drag | drag + inertia | Framer Motion |
| Quote break | clip-path word reveal | Framer Motion |
| Gift box open | rotateX spring | Framer Motion |
| Gift reveal | scale spring | Framer Motion |
| Hashtag drift | float keyframe | CSS keyframes |
| Hashtag hover | spring lift | Framer Motion |
| Timer digits | slot-machine roll | CSS transform |
| Closing confetti | particle burst | CSS keyframes |

**Reduced motion:** All Framer Motion animations check `useReducedMotion()` — fall back to simple `opacity` fade only. CSS keyframes use `@media (prefers-reduced-motion: reduce)` to disable.

---

## 16. Responsive Design

- **Breakpoints:** Tailwind defaults — `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`
- **Hero:** `flex-row` on `lg+`, `flex-col` (photo top, text bottom) on `< lg`
- **Masonry grid:** 3 cols on `lg+`, 2 cols on `md`, 1 col on `sm`
- **Filmstrip:** drag on desktop, native scroll-snap on mobile
- **Meme videos:** side by side on `md+`, stacked on mobile
- **Funny section:** 2×2 on `md+`, 1-col on mobile
- **Top bar:** always visible, compact on mobile
- **Loading screen:** same on all sizes

---

## 17. Deployment

```bash
# Build
npm run build   # outputs to /out directory

# Deploy to Vercel
vercel deploy   # or connect GitHub repo in Vercel dashboard

# Config
next.config.ts:  output: 'export'
                 images: { unoptimized: true }  # required for static export
```

**⚠️ Vercel free tier limit:** 100MB per deployment. Current media estimate:
- ~43 images (JPEG) × ~1–3MB avg = ~60–120MB
- ~6 videos = potentially large

**Mitigation:** Compress videos before deployment using ffmpeg. Script provided in `scripts/compress-videos.sh`. If still over limit, host videos on a free CDN (Cloudflare R2, Supabase Storage) and update paths in `site.config.ts`.

---

## 18. Risk Register

| Risk | Likelihood | Mitigation |
|---|---|---|
| Browser autoplay block | High | First-interaction trigger + "tap to unmute" nudge |
| Videos too large for Vercel | Medium | ffmpeg compression script provided |
| Filmstrip drag janky on iOS | Medium | Fallback to native scroll-snap on mobile |
| Timer timezone mismatch | Low | Use local browser time — no server clock |
| Lightbox performance | Low | Lazy load images, only render active lightbox frame |
| `next/image` with static export | Known | Set `unoptimized: true` in next.config |

---

## 19. What Is NOT Built

- No database, no backend, no API routes
- No user accounts or sessions
- No CMS
- No analytics (can be added trivially via Vercel Analytics if desired)
- No PWA / service worker

---

*Spec approved by user on 2026-04-04. Ready for implementation planning.*
