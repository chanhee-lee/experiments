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
