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
        <div className="flex flex-col items-center justify-center text-center py-32 mb-8">
          <p className="text-xs font-mono mb-4" style={{ color: '#6366F1' }}>Built for teams that move fast</p>
          <h2 className="text-5xl font-bold mb-6 font-heading leading-tight" style={{ color: 'var(--text-primary)' }}>
            Everything you need<br />to ship faster
          </h2>
          <p className="text-lg max-w-md mb-2" style={{ color: 'var(--text-muted)' }}>
            A unified platform for building, deploying, and scaling your applications.
          </p>
          <p className="text-sm animate-bounce mt-8" style={{ color: 'var(--text-muted)' }}>↓ Scroll to reveal</p>
        </div>
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
