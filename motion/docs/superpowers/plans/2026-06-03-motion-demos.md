# Motion Demos — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single Vite + React app with six polished Motion v12 animation demos, navigable from a dark gallery index.

**Architecture:** `BrowserRouter` with one route per demo. All demos share a `DemoLayout` header (back button + API tags). Each demo is one self-contained TSX file with its own accent color.

**Tech Stack:** Vite 5, React 18, TypeScript, Motion v12 (`motion/react`), React Router v6, Tailwind CSS v3, Vitest + @testing-library/react

---

## File Map

| File | Purpose |
|---|---|
| `src/index.css` | Tailwind base + CSS vars + Google Fonts |
| `src/main.tsx` | React entry point |
| `src/App.tsx` | BrowserRouter + all routes |
| `src/pages/Index.tsx` | Gallery of 6 demo cards with stagger animation |
| `src/components/DemoLayout.tsx` | Shared header: back link, title, API tags |
| `src/hooks/useNavigationDirection.ts` | Tracks forward/back direction for page transitions |
| `src/demos/ScrollReveal.tsx` | whileInView demo |
| `src/demos/PageTransition.tsx` | AnimatePresence + nested routes |
| `src/demos/StaggerList.tsx` | variants + staggerChildren |
| `src/demos/GestureCard.tsx` | drag, useMotionValue, useTransform, whileTap |
| `src/demos/SharedElement.tsx` | layoutId + AnimatePresence modal |
| `src/demos/ParallaxHero.tsx` | useScroll + useTransform parallax |

---

### Task 1: Bootstrap the project

**Files:** `package.json`, `vite.config.ts`, `index.html`, `src/main.tsx`

- [ ] **Step 1: Scaffold**

```bash
cd ~/github/experiments/motion
npm create vite@latest . -- --template react-ts
```

When prompted about non-empty directory → select **Ignore files and continue**.

- [ ] **Step 2: Install runtime deps**

```bash
npm install motion react-router-dom
```

- [ ] **Step 3: Install dev deps**

```bash
npm install -D tailwindcss postcss autoprefixer vitest @testing-library/react @testing-library/jest-dom jsdom @types/react @types/react-dom
```

- [ ] **Step 4: Init Tailwind**

```bash
npx tailwindcss init -p
```

- [ ] **Step 5: Verify dev server**

```bash
npm run dev
```

Expected: Vite dev server at `http://localhost:5173` with the default React welcome page.

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "chore: scaffold Vite + React + Motion project"
```

---

### Task 2: Design system — Tailwind, fonts, Vitest

**Files:** `tailwind.config.ts`, `src/index.css`, `vite.config.ts`, `src/test-setup.ts`, `package.json`

- [ ] **Step 1: Configure Tailwind**

Replace `tailwind.config.ts`:

```ts
import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
```

- [ ] **Step 2: Set up index.css**

Replace `src/index.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --surface-base: #0F172A;
  --surface-card: #1E293B;
  --surface-border: #334155;
  --text-primary: #F8FAFC;
  --text-muted: #64748B;
}

* { box-sizing: border-box; }

body {
  background: var(--surface-base);
  color: var(--text-primary);
  font-family: 'DM Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 3: Add Vitest to vite.config.ts**

Replace `vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
  },
})
```

- [ ] **Step 4: Create test setup**

Create `src/test-setup.ts`:

```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 5: Add test script**

In `package.json`, add to `scripts`:

```json
"test": "vitest"
```

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "chore: configure Tailwind, fonts, and Vitest"
```

---

### Task 3: DemoLayout component

**Files:** `src/components/DemoLayout.tsx`, `src/components/DemoLayout.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/DemoLayout.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { DemoLayout } from './DemoLayout'

test('renders back link, title, and API tags', () => {
  render(
    <MemoryRouter>
      <DemoLayout title="Scroll Reveal" apis={['whileInView', 'viewport']} accent="#6366F1">
        <div>demo content</div>
      </DemoLayout>
    </MemoryRouter>
  )
  expect(screen.getByText('← Back')).toBeInTheDocument()
  expect(screen.getByText('Scroll Reveal')).toBeInTheDocument()
  expect(screen.getByText('whileInView')).toBeInTheDocument()
  expect(screen.getByText('viewport')).toBeInTheDocument()
  expect(screen.getByText('demo content')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npm test -- DemoLayout
```

Expected: FAIL — `Cannot find module './DemoLayout'`

- [ ] **Step 3: Implement DemoLayout**

Create `src/components/DemoLayout.tsx`:

```tsx
import { Link } from 'react-router-dom'

interface DemoLayoutProps {
  title: string
  apis: string[]
  accent: string
  children: React.ReactNode
}

export function DemoLayout({ title, apis, accent, children }: DemoLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--surface-base)' }}>
      <header
        className="flex items-center gap-4 px-6 py-3 border-b shrink-0"
        style={{ borderColor: 'var(--surface-border)' }}
      >
        <Link
          to="/"
          className="text-sm transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onMouseOver={e => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseOut={e => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          ← Back
        </Link>
        <span className="font-semibold font-heading" style={{ color: 'var(--text-primary)' }}>
          {title}
        </span>
        <div className="ml-auto flex gap-2">
          {apis.map(api => (
            <span
              key={api}
              className="text-xs font-mono px-2 py-0.5 rounded border"
              style={{
                color: accent,
                borderColor: `${accent}66`,
                background: `${accent}1a`,
              }}
            >
              {api}
            </span>
          ))}
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}
```

- [ ] **Step 4: Run test — verify it passes**

```bash
npm test -- DemoLayout
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/
git commit -m "feat: add DemoLayout shared header component"
```

---

### Task 4: Index gallery page + router

**Files:** `src/pages/Index.tsx`, `src/pages/Index.test.tsx`, `src/App.tsx`, `src/main.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/pages/Index.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Index } from './Index'

test('renders all 6 demo cards', () => {
  render(<MemoryRouter><Index /></MemoryRouter>)
  expect(screen.getByText('Scroll Reveal')).toBeInTheDocument()
  expect(screen.getByText('Page Transition')).toBeInTheDocument()
  expect(screen.getByText('Stagger List')).toBeInTheDocument()
  expect(screen.getByText('Gesture Card')).toBeInTheDocument()
  expect(screen.getByText('Shared Element')).toBeInTheDocument()
  expect(screen.getByText('Parallax Hero')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npm test -- Index
```

Expected: FAIL

- [ ] **Step 3: Implement Index**

Create `src/pages/Index.tsx`:

```tsx
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'

const DEMOS = [
  { slug: 'scroll-reveal',    title: 'Scroll Reveal',    desc: 'Cards fade in as they enter the viewport',    api: 'whileInView',      accent: '#6366F1' },
  { slug: 'page-transition',  title: 'Page Transition',  desc: 'Routes slide in and out on navigation',       api: 'AnimatePresence',  accent: '#22C55E' },
  { slug: 'stagger-list',     title: 'Stagger List',     desc: 'Items cascade in one after another',          api: 'variants',         accent: '#F87171' },
  { slug: 'gesture-card',     title: 'Gesture Card',     desc: 'Drag and hover with spring physics',          api: 'drag',             accent: '#FBBF24' },
  { slug: 'shared-element',   title: 'Shared Element',   desc: 'Card expands into detail view seamlessly',    api: 'layoutId',         accent: '#22D3EE' },
  { slug: 'parallax-hero',    title: 'Parallax Hero',    desc: 'Background and text move at different speeds', api: 'useScroll',       accent: '#A78BFA' },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export function Index() {
  return (
    <div className="min-h-screen px-8 py-16" style={{ background: 'var(--surface-base)' }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1
            className="text-4xl font-bold mb-3 tracking-tight font-heading"
            style={{ color: 'var(--text-primary)' }}
          >
            Motion Demos
          </h1>
          <p className="mb-4 text-sm" style={{ color: 'var(--text-muted)' }}>
            Six website animation patterns — Motion v12 + React + Vite
          </p>
          <code
            className="text-xs px-3 py-1 rounded border font-mono"
            style={{ background: 'var(--surface-card)', borderColor: 'var(--surface-border)', color: '#22C55E' }}
          >
            {"import { motion } from 'motion/react'"}
          </code>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {DEMOS.map(demo => (
            <motion.div key={demo.slug} variants={item}>
              <Link to={`/${demo.slug}`} className="block h-full">
                <div
                  className="h-full rounded-xl p-5 border cursor-pointer transition-colors"
                  style={{
                    background: 'var(--surface-card)',
                    borderColor: 'var(--surface-border)',
                    borderLeftColor: demo.accent,
                    borderLeftWidth: 3,
                  }}
                >
                  <h2 className="font-semibold mb-1 font-heading" style={{ color: 'var(--text-primary)' }}>
                    {demo.title}
                  </h2>
                  <p className="text-sm mb-3 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {demo.desc}
                  </p>
                  <span
                    className="text-xs font-mono px-2 py-0.5 rounded border"
                    style={{ color: demo.accent, borderColor: `${demo.accent}66`, background: `${demo.accent}1a` }}
                  >
                    {demo.api}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Update App.tsx**

Replace `src/App.tsx`:

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Index } from './pages/Index'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
      </Routes>
    </BrowserRouter>
  )
}
```

- [ ] **Step 5: Update main.tsx**

Replace `src/main.tsx`:

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

- [ ] **Step 6: Run tests**

```bash
npm test -- Index
```

Expected: PASS

- [ ] **Step 7: Verify in browser**

Open `http://localhost:5173`. Expected: dark gallery with 6 cards staggering in on load. Each has a colored left border strip and monospace API tag.

- [ ] **Step 8: Commit**

```bash
git add src/
git commit -m "feat: add Index gallery with stagger animation"
```

---

### Task 5: Scroll Reveal demo

**Files:** `src/demos/ScrollReveal.tsx`, `src/demos/ScrollReveal.test.tsx`, `src/App.tsx`

- [ ] **Step 1: Write smoke test**

Create `src/demos/ScrollReveal.test.tsx`:

```tsx
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ScrollReveal } from './ScrollReveal'

test('renders without crashing', () => {
  render(<MemoryRouter><ScrollReveal /></MemoryRouter>)
})
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npm test -- ScrollReveal
```

Expected: FAIL

- [ ] **Step 3: Implement ScrollReveal**

Create `src/demos/ScrollReveal.tsx`:

```tsx
import { motion } from 'motion/react'
import { DemoLayout } from '../components/DemoLayout'

const FEATURES = [
  { icon: '⚡', title: 'Lightning Fast',    desc: 'Optimized for speed at every layer of the stack.' },
  { icon: '🔒', title: 'Secure by Default', desc: 'End-to-end encryption and zero-trust architecture.' },
  { icon: '📈', title: 'Built to Scale',    desc: 'Handles millions of requests without breaking a sweat.' },
  { icon: '🔌', title: 'Easy Integration',  desc: 'Connect to any tool via our REST API or SDKs.' },
  { icon: '🎯', title: 'Precise Analytics', desc: 'Real-time insights into every user interaction.' },
  { icon: '🤝', title: 'Team-Ready',        desc: 'Roles, permissions, and audit logs built in.' },
]

const cardVariants = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export function ScrollReveal() {
  return (
    <DemoLayout title="Scroll Reveal" apis={['whileInView', 'viewport']} accent="#6366F1">
      <div className="max-w-5xl mx-auto px-8 py-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3 font-heading" style={{ color: 'var(--text-primary)' }}>
            Everything you need
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>Scroll down to see the cards animate in</p>
        </div>
        <div className="h-48" aria-hidden="true" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(f => (
            <motion.div
              key={f.title}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              className="rounded-xl p-6 border"
              style={{ background: 'var(--surface-card)', borderColor: 'var(--surface-border)' }}
            >
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-semibold mb-2 font-heading" style={{ color: 'var(--text-primary)' }}>
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </DemoLayout>
  )
}
```

- [ ] **Step 4: Add route to App.tsx**

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Index } from './pages/Index'
import { ScrollReveal } from './demos/ScrollReveal'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/scroll-reveal" element={<ScrollReveal />} />
      </Routes>
    </BrowserRouter>
  )
}
```

- [ ] **Step 5: Run tests**

```bash
npm test -- ScrollReveal
```

Expected: PASS

- [ ] **Step 6: Verify in browser**

Open `http://localhost:5173/scroll-reveal`. Scroll down — each card fades up as it enters the viewport. Already-visible cards do not re-animate on scroll back (once: true).

- [ ] **Step 7: Commit**

```bash
git add src/demos/ScrollReveal.tsx src/demos/ScrollReveal.test.tsx src/App.tsx
git commit -m "feat: add Scroll Reveal demo"
```

---

### Task 6: Page Transition demo

**Files:** `src/hooks/useNavigationDirection.ts`, `src/demos/PageTransition.tsx`, `src/demos/PageTransition.test.tsx`, `src/App.tsx`

- [ ] **Step 1: Write smoke test**

Create `src/demos/PageTransition.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { PageTransition } from './PageTransition'

test('renders all nav items', () => {
  render(<MemoryRouter initialEntries={['/page-transition']}><PageTransition /></MemoryRouter>)
  expect(screen.getByText('Home')).toBeInTheDocument()
  expect(screen.getByText('Work')).toBeInTheDocument()
  expect(screen.getByText('About')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npm test -- PageTransition
```

Expected: FAIL

- [ ] **Step 3: Create useNavigationDirection hook**

Create `src/hooks/useNavigationDirection.ts`:

```ts
import { useLocation, useNavigate } from 'react-router-dom'

export function useNavigationDirection() {
  const navigate = useNavigate()
  const location = useLocation()
  const direction: 1 | -1 =
    (location.state as { direction?: 1 | -1 } | null)?.direction ?? 1

  function go(path: string, dir: 1 | -1) {
    navigate(path, { state: { direction: dir } })
  }

  return { go, direction }
}
```

- [ ] **Step 4: Implement PageTransition**

Create `src/demos/PageTransition.tsx`:

```tsx
import { Routes, Route, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { DemoLayout } from '../components/DemoLayout'
import { useNavigationDirection } from '../hooks/useNavigationDirection'

const PAGES = [
  { path: '',      label: 'Home',  title: 'Welcome',        body: 'This is the home page. Click a nav link to see the transition.' },
  { path: 'work',  label: 'Work',  title: 'Selected Work',  body: 'Projects and experiments from the last few years.' },
  { path: 'about', label: 'About', title: 'About Me',       body: 'Designer and developer. I build interfaces that feel good to use.' },
]

function Nav() {
  const { go } = useNavigationDirection()
  const location = useLocation()
  const currentIdx = PAGES.findIndex(p =>
    p.path === ''
      ? location.pathname === '/page-transition' || location.pathname === '/page-transition/'
      : location.pathname.endsWith(`/${p.path}`)
  )

  return (
    <nav className="flex gap-6 mb-12">
      {PAGES.map((page, idx) => {
        const path = page.path === '' ? '/page-transition' : `/page-transition/${page.path}`
        const isActive = currentIdx === idx
        return (
          <button
            key={page.path}
            onClick={() => go(path, idx >= currentIdx ? 1 : -1)}
            className="text-sm font-medium cursor-pointer transition-colors"
            style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-muted)' }}
          >
            {page.label}
          </button>
        )
      })}
    </nav>
  )
}

function PageContent({ title, body }: { title: string; body: string }) {
  const { direction } = useNavigationDirection()
  const location = useLocation()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: direction * 60 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: direction * -60 }}
        transition={{ duration: 0.28, ease: 'easeInOut' }}
      >
        <h2 className="text-3xl font-bold mb-4 font-heading" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h2>
        <p className="text-lg leading-relaxed max-w-md" style={{ color: 'var(--text-muted)' }}>
          {body}
        </p>
      </motion.div>
    </AnimatePresence>
  )
}

export function PageTransition() {
  return (
    <DemoLayout title="Page Transition" apis={['AnimatePresence', 'useLocation']} accent="#22C55E">
      <div className="max-w-2xl mx-auto px-8 py-16">
        <Nav />
        <Routes>
          <Route index element={<PageContent title="Welcome" body="This is the home page. Click a nav link to see the transition." />} />
          <Route path="work"  element={<PageContent title="Selected Work" body="Projects and experiments from the last few years." />} />
          <Route path="about" element={<PageContent title="About Me" body="Designer and developer. I build interfaces that feel good to use." />} />
        </Routes>
      </div>
    </DemoLayout>
  )
}
```

- [ ] **Step 5: Add route to App.tsx**

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Index } from './pages/Index'
import { ScrollReveal } from './demos/ScrollReveal'
import { PageTransition } from './demos/PageTransition'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/scroll-reveal" element={<ScrollReveal />} />
        <Route path="/page-transition/*" element={<PageTransition />} />
      </Routes>
    </BrowserRouter>
  )
}
```

- [ ] **Step 6: Run tests**

```bash
npm test -- PageTransition
```

Expected: PASS

- [ ] **Step 7: Verify in browser**

Open `http://localhost:5173/page-transition`. Click Home / Work / About. Content should slide out to the left and new content slide in from the right. Clicking a previous tab reverses the direction.

- [ ] **Step 8: Commit**

```bash
git add src/hooks/ src/demos/PageTransition.tsx src/demos/PageTransition.test.tsx src/App.tsx
git commit -m "feat: add Page Transition demo"
```

---

### Task 7: Stagger List demo

**Files:** `src/demos/StaggerList.tsx`, `src/demos/StaggerList.test.tsx`, `src/App.tsx`

- [ ] **Step 1: Write smoke test**

Create `src/demos/StaggerList.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { StaggerList } from './StaggerList'

test('renders Replay button and post list', () => {
  render(<MemoryRouter><StaggerList /></MemoryRouter>)
  expect(screen.getByText('Replay')).toBeInTheDocument()
  expect(screen.getByText('Building with Motion v12')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npm test -- StaggerList
```

Expected: FAIL

- [ ] **Step 3: Implement StaggerList**

Create `src/demos/StaggerList.tsx`:

```tsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { DemoLayout } from '../components/DemoLayout'

const POSTS = [
  { id: 1, title: 'Building with Motion v12',           date: 'Jun 1, 2026',  tag: 'Animation',   excerpt: 'A deep dive into the new Motion v12 API and what changed.' },
  { id: 2, title: 'Scroll-driven animations in 2026',   date: 'May 28, 2026', tag: 'CSS',         excerpt: 'Native scroll-driven animations vs. JS alternatives.' },
  { id: 3, title: 'The case for layout animations',     date: 'May 20, 2026', tag: 'UX',          excerpt: 'Why layoutId is the most underused feature in Motion.' },
  { id: 4, title: 'Spring physics for UI designers',    date: 'May 14, 2026', tag: 'Design',      excerpt: 'Stiffness, damping, mass — a visual guide.' },
  { id: 5, title: 'AnimatePresence patterns',           date: 'May 6, 2026',  tag: 'Animation',   excerpt: 'Enter/exit animations that feel natural.' },
  { id: 6, title: 'Gesture-driven interfaces',          date: 'Apr 29, 2026', tag: 'Interaction', excerpt: "Drag, swipe, fling — Motion's gesture API." },
  { id: 7, title: 'Performance tips for animation',     date: 'Apr 21, 2026', tag: 'Performance', excerpt: 'Staying on the GPU compositing path.' },
  { id: 8, title: 'Reduced motion: doing it right',     date: 'Apr 15, 2026', tag: 'A11y',        excerpt: "prefers-reduced-motion and Motion's useReducedMotion." },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, x: -20 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

export function StaggerList() {
  const [key, setKey] = useState(0)

  return (
    <DemoLayout title="Stagger List" apis={['variants', 'staggerChildren']} accent="#F87171">
      <div className="max-w-2xl mx-auto px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold font-heading" style={{ color: 'var(--text-primary)' }}>
            Latest Posts
          </h2>
          <button
            onClick={() => setKey(k => k + 1)}
            className="text-sm px-4 py-1.5 rounded-lg border cursor-pointer"
            style={{ color: '#F87171', borderColor: '#F8717166', background: '#F871711a' }}
          >
            Replay
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.ul key={key} variants={container} initial="hidden" animate="show" className="space-y-3">
            {POSTS.map(post => (
              <motion.li
                key={post.id}
                variants={item}
                className="rounded-xl p-5 border"
                style={{ background: 'var(--surface-card)', borderColor: 'var(--surface-border)' }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1 font-heading" style={{ color: 'var(--text-primary)' }}>
                      {post.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className="text-xs font-mono px-2 py-0.5 rounded border block mb-1"
                      style={{ color: '#F87171', borderColor: '#F8717166', background: '#F871711a' }}
                    >
                      {post.tag}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{post.date}</span>
                  </div>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>
    </DemoLayout>
  )
}
```

- [ ] **Step 4: Add route to App.tsx**

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Index } from './pages/Index'
import { ScrollReveal } from './demos/ScrollReveal'
import { PageTransition } from './demos/PageTransition'
import { StaggerList } from './demos/StaggerList'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/scroll-reveal" element={<ScrollReveal />} />
        <Route path="/page-transition/*" element={<PageTransition />} />
        <Route path="/stagger-list" element={<StaggerList />} />
      </Routes>
    </BrowserRouter>
  )
}
```

- [ ] **Step 5: Run tests**

```bash
npm test -- StaggerList
```

Expected: PASS

- [ ] **Step 6: Verify in browser**

Open `http://localhost:5173/stagger-list`. All 8 posts cascade in on load. Click "Replay" — list unmounts and restarts the stagger from the beginning.

- [ ] **Step 7: Commit**

```bash
git add src/demos/StaggerList.tsx src/demos/StaggerList.test.tsx src/App.tsx
git commit -m "feat: add Stagger List demo"
```

---

### Task 8: Gesture Card demo

**Files:** `src/demos/GestureCard.tsx`, `src/demos/GestureCard.test.tsx`, `src/App.tsx`

- [ ] **Step 1: Write smoke test**

Create `src/demos/GestureCard.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { GestureCard } from './GestureCard'

test('renders all three gesture cards', () => {
  render(<MemoryRouter><GestureCard /></MemoryRouter>)
  expect(screen.getByText('Drag Me')).toBeInTheDocument()
  expect(screen.getByText('Hover Tilt')).toBeInTheDocument()
  expect(screen.getByText('Tap Press')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npm test -- GestureCard
```

Expected: FAIL

- [ ] **Step 3: Implement GestureCard**

Create `src/demos/GestureCard.tsx`:

```tsx
import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { DemoLayout } from '../components/DemoLayout'

function DragCard() {
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>drag · dragConstraints</p>
      <motion.div
        drag
        dragConstraints={{ left: -80, right: 80, top: -40, bottom: 40 }}
        dragElastic={0.2}
        whileDrag={{ scale: 1.05 }}
        className="w-48 h-32 rounded-xl border flex items-center justify-center text-lg font-semibold font-heading select-none"
        style={{
          background: 'var(--surface-card)',
          borderColor: '#FBBF2466',
          color: 'var(--text-primary)',
          cursor: 'grab',
        }}
      >
        Drag Me
      </motion.div>
      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Snaps back on release</p>
    </div>
  )
}

function TiltCard() {
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(useTransform(mouseY, [-60, 60], [15, -15]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(mouseX, [-80, 80], [-15, 15]), { stiffness: 300, damping: 30 })

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set(e.clientX - rect.left - rect.width / 2)
    mouseY.set(e.clientY - rect.top - rect.height / 2)
  }

  function handleMouseLeave() {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <div className="flex flex-col items-center gap-4" style={{ perspective: '600px' }}>
      <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>useMotionValue · useTransform · useSpring</p>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          background: 'var(--surface-card)',
          borderColor: '#22D3EE66',
          color: 'var(--text-primary)',
        }}
        className="w-48 h-32 rounded-xl border flex items-center justify-center text-lg font-semibold font-heading select-none cursor-default"
      >
        Hover Tilt
      </motion.div>
      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Move mouse over card</p>
    </div>
  )
}

function TapCard() {
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>whileHover · whileTap</p>
      <motion.div
        whileHover={{ scale: 1.03, borderColor: '#6366F1' }}
        whileTap={{ scale: 0.97, opacity: 0.85 }}
        transition={{ duration: 0.15 }}
        className="w-48 h-32 rounded-xl border flex items-center justify-center text-lg font-semibold font-heading select-none cursor-pointer"
        style={{ background: 'var(--surface-card)', borderColor: 'var(--surface-border)', color: 'var(--text-primary)' }}
      >
        Tap Press
      </motion.div>
      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Click or tap the card</p>
    </div>
  )
}

export function GestureCard() {
  return (
    <DemoLayout title="Gesture Card" apis={['drag', 'useMotionValue', 'whileTap']} accent="#FBBF24">
      <div className="max-w-4xl mx-auto px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-3 font-heading" style={{ color: 'var(--text-primary)' }}>
            Three gesture patterns
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>Each card demonstrates a different interaction model</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <DragCard />
          <TiltCard />
          <TapCard />
        </div>
      </div>
    </DemoLayout>
  )
}
```

- [ ] **Step 4: Add route to App.tsx**

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Index } from './pages/Index'
import { ScrollReveal } from './demos/ScrollReveal'
import { PageTransition } from './demos/PageTransition'
import { StaggerList } from './demos/StaggerList'
import { GestureCard } from './demos/GestureCard'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/scroll-reveal" element={<ScrollReveal />} />
        <Route path="/page-transition/*" element={<PageTransition />} />
        <Route path="/stagger-list" element={<StaggerList />} />
        <Route path="/gesture-card" element={<GestureCard />} />
      </Routes>
    </BrowserRouter>
  )
}
```

- [ ] **Step 5: Run tests**

```bash
npm test -- GestureCard
```

Expected: PASS

- [ ] **Step 6: Verify in browser**

Open `http://localhost:5173/gesture-card`.
- Drag Me: drag the card around, it should spring back on release.
- Hover Tilt: move mouse over the card, it should tilt in 3D following the cursor.
- Tap Press: click the card, it should scale down slightly on press.

- [ ] **Step 7: Commit**

```bash
git add src/demos/GestureCard.tsx src/demos/GestureCard.test.tsx src/App.tsx
git commit -m "feat: add Gesture Card demo"
```

---

### Task 9: Shared Element demo

**Files:** `src/demos/SharedElement.tsx`, `src/demos/SharedElement.test.tsx`, `src/App.tsx`

- [ ] **Step 1: Write smoke test**

Create `src/demos/SharedElement.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { SharedElement } from './SharedElement'

test('renders photo grid', () => {
  render(<MemoryRouter><SharedElement /></MemoryRouter>)
  expect(screen.getByText('Mountain Dawn')).toBeInTheDocument()
  expect(screen.getByText('Ocean Depths')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npm test -- SharedElement
```

Expected: FAIL

- [ ] **Step 3: Implement SharedElement**

Create `src/demos/SharedElement.tsx`:

```tsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { DemoLayout } from '../components/DemoLayout'

const PHOTOS = [
  { id: 1, title: 'Mountain Dawn',   category: 'Landscape',    gradient: 'from-indigo-900 to-blue-700' },
  { id: 2, title: 'Urban Geometry',  category: 'Architecture', gradient: 'from-slate-800 to-zinc-600' },
  { id: 3, title: 'Ocean Depths',    category: 'Nature',       gradient: 'from-cyan-900 to-teal-700' },
  { id: 4, title: 'Desert Bloom',    category: 'Nature',       gradient: 'from-amber-900 to-orange-700' },
  { id: 5, title: 'City at Night',   category: 'Urban',        gradient: 'from-purple-900 to-indigo-700' },
  { id: 6, title: 'Fog & Forest',    category: 'Landscape',    gradient: 'from-emerald-900 to-green-700' },
]

export function SharedElement() {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const selected = PHOTOS.find(p => p.id === selectedId)

  return (
    <DemoLayout title="Shared Element" apis={['layoutId', 'AnimatePresence']} accent="#22D3EE">
      <div className="max-w-4xl mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3 font-heading" style={{ color: 'var(--text-primary)' }}>
            Portfolio
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>Click any photo to expand</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {PHOTOS.map(photo => (
            <motion.div
              key={photo.id}
              layoutId={`card-${photo.id}`}
              onClick={() => setSelectedId(photo.id)}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className={`bg-gradient-to-br ${photo.gradient} rounded-xl h-40 cursor-pointer flex flex-col justify-end p-4`}
            >
              <motion.h3
                layoutId={`title-${photo.id}`}
                className="text-white font-semibold text-sm font-heading"
              >
                {photo.title}
              </motion.h3>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40"
              onClick={() => setSelectedId(null)}
            />
            <motion.div
              layoutId={`card-${selected.id}`}
              onClick={() => setSelectedId(null)}
              className={`fixed inset-8 md:inset-16 lg:inset-24 bg-gradient-to-br ${selected.gradient} rounded-2xl z-50 flex flex-col justify-end p-8 cursor-pointer`}
            >
              <motion.h2
                layoutId={`title-${selected.id}`}
                className="text-white text-3xl font-bold mb-2 font-heading"
              >
                {selected.title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.15 }}
                className="text-white/70 text-sm"
              >
                {selected.category} · Click to close
              </motion.p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </DemoLayout>
  )
}
```

- [ ] **Step 4: Add route to App.tsx**

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Index } from './pages/Index'
import { ScrollReveal } from './demos/ScrollReveal'
import { PageTransition } from './demos/PageTransition'
import { StaggerList } from './demos/StaggerList'
import { GestureCard } from './demos/GestureCard'
import { SharedElement } from './demos/SharedElement'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/scroll-reveal" element={<ScrollReveal />} />
        <Route path="/page-transition/*" element={<PageTransition />} />
        <Route path="/stagger-list" element={<StaggerList />} />
        <Route path="/gesture-card" element={<GestureCard />} />
        <Route path="/shared-element" element={<SharedElement />} />
      </Routes>
    </BrowserRouter>
  )
}
```

- [ ] **Step 5: Run tests**

```bash
npm test -- SharedElement
```

Expected: PASS

- [ ] **Step 6: Verify in browser**

Open `http://localhost:5173/shared-element`. Click any photo card — it should morph smoothly into a full-screen overlay. The title should move in place as part of the layout transition. Click anywhere to close.

- [ ] **Step 7: Commit**

```bash
git add src/demos/SharedElement.tsx src/demos/SharedElement.test.tsx src/App.tsx
git commit -m "feat: add Shared Element demo"
```

---

### Task 10: Parallax Hero demo

**Files:** `src/demos/ParallaxHero.tsx`, `src/demos/ParallaxHero.test.tsx`, `src/App.tsx`

- [ ] **Step 1: Write smoke test**

Create `src/demos/ParallaxHero.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ParallaxHero } from './ParallaxHero'

test('renders hero headline', () => {
  render(<MemoryRouter><ParallaxHero /></MemoryRouter>)
  expect(screen.getByText(/Build things/i)).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npm test -- ParallaxHero
```

Expected: FAIL

- [ ] **Step 3: Implement ParallaxHero**

Create `src/demos/ParallaxHero.tsx`:

```tsx
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { DemoLayout } from '../components/DemoLayout'

export function ParallaxHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const bgY     = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const shape1Y = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const shape2Y = useTransform(scrollYProgress, [0, 1], ['0%', '-30%'])
  const textY   = useTransform(scrollYProgress, [0, 1], ['0%', '15%'])

  return (
    <DemoLayout title="Parallax Hero" apis={['useScroll', 'useTransform']} accent="#A78BFA">
      <div ref={containerRef} className="relative" style={{ height: '200vh' }}>
        <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
          {/* Background layer — slowest */}
          <motion.div
            style={{ y: bgY }}
            className="absolute inset-0 bg-gradient-to-br from-violet-950 via-[#0F172A] to-indigo-950"
          />

          {/* Floating shape 1 — slow */}
          <motion.div
            style={{ y: shape1Y }}
            className="absolute top-20 right-32 w-64 h-64 rounded-full bg-violet-700/20 blur-3xl pointer-events-none"
          />

          {/* Floating shape 2 — fast, upward */}
          <motion.div
            style={{ y: shape2Y }}
            className="absolute bottom-24 left-20 w-48 h-48 rounded-full bg-indigo-500/20 blur-2xl pointer-events-none"
          />

          {/* Text — medium parallax */}
          <motion.div style={{ y: textY }} className="relative text-center px-8 max-w-3xl">
            <p className="text-sm mb-4 font-mono" style={{ color: '#A78BFA' }}>Now shipping v2.0</p>
            <h1
              className="text-5xl md:text-7xl font-bold mb-6 font-heading leading-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              Build things<br />people love
            </h1>
            <p className="text-lg mb-8 max-w-md mx-auto" style={{ color: 'var(--text-muted)' }}>
              The platform that grows with you. Start small, scale to millions.
            </p>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="px-8 py-3 rounded-xl font-semibold text-sm cursor-pointer"
              style={{ background: '#A78BFA', color: '#0F172A' }}
            >
              Get started free
            </motion.button>
            <p className="mt-6 text-xs" style={{ color: 'var(--text-muted)' }}>
              Scroll down to see the parallax effect ↓
            </p>
          </motion.div>
        </div>
      </div>
    </DemoLayout>
  )
}
```

- [ ] **Step 4: Add route to App.tsx (final)**

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Index } from './pages/Index'
import { ScrollReveal } from './demos/ScrollReveal'
import { PageTransition } from './demos/PageTransition'
import { StaggerList } from './demos/StaggerList'
import { GestureCard } from './demos/GestureCard'
import { SharedElement } from './demos/SharedElement'
import { ParallaxHero } from './demos/ParallaxHero'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/scroll-reveal" element={<ScrollReveal />} />
        <Route path="/page-transition/*" element={<PageTransition />} />
        <Route path="/stagger-list" element={<StaggerList />} />
        <Route path="/gesture-card" element={<GestureCard />} />
        <Route path="/shared-element" element={<SharedElement />} />
        <Route path="/parallax-hero" element={<ParallaxHero />} />
      </Routes>
    </BrowserRouter>
  )
}
```

- [ ] **Step 5: Run all tests**

```bash
npm test
```

Expected: All tests pass (10 test files).

- [ ] **Step 6: Verify in browser**

Open `http://localhost:5173/parallax-hero`. Scroll down slowly — the background gradient, floating blobs, and headline text should all move at different speeds, creating a layered depth effect.

- [ ] **Step 7: Final commit**

```bash
git add src/demos/ParallaxHero.tsx src/demos/ParallaxHero.test.tsx src/App.tsx
git commit -m "feat: add Parallax Hero demo"
```
