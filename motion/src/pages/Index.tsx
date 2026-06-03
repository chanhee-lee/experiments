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
