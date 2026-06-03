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
