# Motion Demos — Design Spec

## Goal

A single Vite + React app showcasing six Motion v12 animation patterns in realistic website contexts. The point is exploration and reference — each demo is polished enough to feel like a real product, not a toy.

## Stack

- Vite + React + TypeScript
- `motion` v12 — import from `motion/react`
- React Router v6
- Tailwind CSS
- Fonts: Space Grotesk (headings), DM Sans (body) via Google Fonts

## Design System

| Token | Value |
|---|---|
| Background | `#0F172A` |
| Card | `#1E293B` |
| Border | `#334155` |
| Text | `#F8FAFC` |
| Muted | `#64748B` |
| Accent (global) | `#22C55E` |

Each demo has its own accent color (left border strip + monospace API tag):

| Demo | Accent |
|---|---|
| Scroll Reveal | `#6366F1` indigo |
| Page Transition | `#22C55E` green |
| Stagger List | `#F87171` red |
| Gesture Card | `#FBBF24` amber |
| Shared Element | `#22D3EE` cyan |
| Parallax Hero | `#A78BFA` violet |

Animation guidelines: ease-out for entering, ease-in for exiting; 150–300ms for micro-interactions; respect `prefers-reduced-motion`.

## File Structure

```
motion/
  src/
    demos/
      ScrollReveal.tsx
      PageTransition.tsx
      StaggerList.tsx
      GestureCard.tsx
      SharedElement.tsx
      ParallaxHero.tsx
    components/
      DemoLayout.tsx
    App.tsx
    index.css
  index.html
  package.json
  vite.config.ts
  tailwind.config.ts
```

## Routing

```
/                → Index (gallery — 6 cards, stagger on load)
/scroll-reveal   → ScrollReveal
/page-transition → PageTransition
/stagger-list    → StaggerList
/gesture-card    → GestureCard
/shared-element  → SharedElement
/parallax-hero   → ParallaxHero
```

## Shared Components

**`DemoLayout`** — wrapper for every demo route:
- Fixed top bar: back button (← Back → `/`), demo title, Motion API tags
- Remaining viewport height for demo content
- `prefers-reduced-motion` check passed as a prop so demos can disable animations

## Index Page

Dark gallery grid (3 cols). Each card:
- Colored left border strip (demo accent)
- Title + one-line description
- Monospace API tag in accent color
- Hover: border brightens, subtle lift (`scale: 1.01`, `200ms`)
- All cards stagger in on mount with `variants` + `staggerChildren`

Header shows `import { motion } from 'motion/react'` as a code badge.

## Demo Designs

### A. Scroll Reveal — `/scroll-reveal`
**Context:** SaaS features section  
**Content:** Six feature cards in a 3-col grid  
**Animation:** Each card fades up (`opacity: 0→1`, `y: 40→0`) as it enters the viewport  
**APIs:** `whileInView`, `viewport: { once: true }`, `variants`, `staggerChildren`

### B. Page Transition — `/page-transition`
**Context:** 3-page mini-site (Home / Work / About) with a top nav  
**Content:** Each page has a headline + short body copy  
**Animation:** Forward nav slides in from right; back slides from left. Direction tracked via a `useNavigationDirection` hook that stores a numeric index in `location.state` on each `navigate()` call.  
**APIs:** `AnimatePresence`, `useLocation` as key, `motion.div` wrapping each page

### C. Stagger List — `/stagger-list`
**Context:** Blog post listing  
**Content:** 8 post cards (title, date, tag, excerpt)  
**Animation:** Posts cascade in on mount; "Replay" button unmounts + remounts the list  
**APIs:** `variants` with `staggerChildren: 0.08`, parent/child orchestration

### D. Gesture Card — `/gesture-card`
**Context:** Featured product cards  
**Content:** Three cards — one draggable with spring snap-back, one with 3D hover tilt, one with a tap press (`whileTap: { scale: 0.97 }` + brief opacity dip)  
**APIs:** `drag`, `dragConstraints`, `useMotionValue`, `useTransform`, `useSpring`, `whileTap`

### E. Shared Element — `/shared-element`
**Context:** Photography portfolio grid  
**Content:** Six image cards (placeholder gradients as images); click one → full-screen detail overlay  
**Animation:** Card morphs in-place into overlay; title and image share the transition  
**APIs:** `layoutId` on image + title, `AnimatePresence` for overlay, `motion.div` for backdrop

### F. Parallax Hero — `/parallax-hero`
**Context:** Product landing page hero  
**Content:** Full-height section — background gradient, two floating geometric shapes, headline + CTA  
**Animation:** Three layers scroll at different speeds (0%, 20%, 50% depth)  
**APIs:** `useScroll`, `useTransform` — one `useScroll` instance, three separate `useTransform` outputs

## Constraints

- No Motion+ required — all demos use the free `motion` package
- Each demo is self-contained in one `.tsx` file (no cross-demo imports except `DemoLayout`)
- `npm install motion react react-dom react-router-dom` — no other runtime deps beyond Tailwind/Vite tooling
